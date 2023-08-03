import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'

import {
  CreateSnapshotOptions,
  DataWithError,
  DataWithErrorAsync,
  InitializeSpreadsheetOptions,
  SpreadsheetConfig,
  SpreadsheetConfigKeysType,
  LoadSpreadsheetOptions,
  UpdateSpreadsheetLocalesOptions,
} from './types'
import { ConfigSheetName, LocaleSheetName } from '../constants'

export const loadSpreadsheet = async (
  options: LoadSpreadsheetOptions,
): DataWithErrorAsync<GoogleSpreadsheet, Error> => {
  try {
    const spreadsheet = new GoogleSpreadsheet(
      options.spreadsheetId,
      new JWT({
        email: options.serviceAccountEmail,
        key: options.serviceAccountPrivateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file'],
      }),
    )
    await spreadsheet.loadInfo()
    return { data: spreadsheet, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export const initializeSpreadsheet = async (options: InitializeSpreadsheetOptions): DataWithErrorAsync<void, Error> => {
  try {
    const sheet = options.spreadsheet.sheetsByIndex[0]
    await sheet.updateProperties({ title: LocaleSheetName })
    await sheet.setHeaderRow(['key', ...options.locales], 0)

    await sheet.resize({ columnCount: options.locales.length + 1, rowCount: 1 })

    const configSheet = await options.spreadsheet.addSheet({ title: ConfigSheetName, index: 1 })
    await configSheet.setHeaderRow(['key', 'value', 'description'])
    await configSheet.resize({ columnCount: 3, rowCount: 1 })
    await configSheet.addRows([
      {
        key: 'snapshotCount',
        value: 3,
        description: '(Number) Number of snapshot sheets. Set to 0 to disable creating a snapshot on each push',
      },
    ])

    return { data: undefined, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export const getLocalesSheet = (spreadsheet: GoogleSpreadsheet): DataWithError<GoogleSpreadsheetWorksheet, Error> => {
  const sheet = spreadsheet.sheetsByTitle[LocaleSheetName]
  if (!sheet) {
    return { data: null, error: new Error(`Sheet ${LocaleSheetName} not found`) }
  }

  return { data: sheet, error: null }
}

export const getConfigSheet = (spreadsheet: GoogleSpreadsheet): DataWithError<GoogleSpreadsheetWorksheet, Error> => {
  const sheet = spreadsheet.sheetsByTitle[ConfigSheetName]
  if (!sheet) {
    return { data: null, error: new Error(`Sheet ${ConfigSheetName} not found`) }
  }

  return { data: sheet, error: null }
}

export const getSpreadsheetConfig = async (
  spreadsheet: GoogleSpreadsheet,
): DataWithErrorAsync<SpreadsheetConfig, Error> => {
  const { data: sheet, error: configSheetError } = getConfigSheet(spreadsheet)
  if (configSheetError) {
    return { data: null, error: configSheetError }
  }

  const rows = await sheet.getRows()
  const config: SpreadsheetConfig = {}
  rows.forEach((row) => {
    const key = row.get('key')
    const value = row.get('value')
    switch (key as SpreadsheetConfigKeysType) {
      case 'snapshotCount':
        config.snapshotCount = Number(value)
        break
      default:
        break
    }
  })

  return { data: config, error: null }
}

export const snapshot = async (options: CreateSnapshotOptions): DataWithErrorAsync<void, Error> => {
  const { data: spreadsheetConfig } = await getSpreadsheetConfig(options.spreadsheet)
  const limit = spreadsheetConfig?.snapshotCount || 0
  if (!limit) {
    return { data: undefined, error: null }
  }

  const { data: sheet, error: localSheetError } = getLocalesSheet(options.spreadsheet)
  if (localSheetError) {
    return { data: null, error: localSheetError }
  }

  try {
    const oldSnapshots = options.spreadsheet.sheetsByIndex
      .filter((sheet) => sheet.title.startsWith('Snapshot'))
      .sort((a, b) => {
        const aDate = new Date(a.title.replace('Snapshot ', ''))
        const bDate = new Date(b.title.replace('Snapshot ', ''))
        return bDate.getTime() - aDate.getTime()
      })

    await sheet.duplicate({ title: `Snapshot ${new Date().toISOString()}`, index: 2 })

    Promise.all(
      oldSnapshots.map(async (snapshot, index) => {
        if (index + 1 >= limit) {
          await snapshot.delete()
        }
      }),
    )

    return { data: undefined, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export const updateSpreadsheetLocales = async (
  options: UpdateSpreadsheetLocalesOptions,
): DataWithErrorAsync<void, Error> => {
  const { data: sheet, error: localesSheetError } = getLocalesSheet(options.spreadsheet)
  if (localesSheetError) {
    return { data: null, error: localesSheetError }
  }

  const rows = await sheet.getRows()

  // Create a new snapshot
  if (rows.length) {
    await snapshot({ spreadsheet: options.spreadsheet })
  }

  // Update existing locales
  await Promise.all(
    Object.entries(options.localizationDiff.updated).map(async ([key, localesMap]) => {
      if (!localesMap) {
        console.error(`Invalid locales for key: ${key}`)
      }
      const row = rows.find((row) => row.get('key') === key)
      if (row) {
        row.assign(localesMap)
        await row.save()
      }
    }),
  )

  // Add new locales
  await Promise.all(
    Object.entries(options.localizationDiff.added).map(async ([key, localesMap]) => {
      if (!localesMap) {
        console.error(`Invalid locales for key: ${key}`)
      }
      const row = rows.find((row) => row.get('key') === key)
      if (!row) {
        await sheet.addRow({ key, ...localesMap })
      } else {
        row.assign(localesMap)
        await row.save()
      }
    }),
  )

  // Remove deleted locales
  await Promise.all(
    Object.entries(options.localizationDiff.deleted).map(async ([key, localesMap]) => {
      const row = rows.find((row) => row.get('key') === key)
      if (row) {
        if (!localesMap) {
          await row.delete()
          return
        }
        Object.entries(localesMap).forEach(([locale]) => {
          row.set(locale, '')
        })
        await row.save()
      }
    }),
  )

  return { data: undefined, error: null }
}
