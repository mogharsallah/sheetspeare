import Config from '../config'
import { getLocalizationDiff, logLocalizationDiff } from '../core/diff'
import { loadLocales, saveLocales } from '../core/files'
import { loadSpreadsheet } from '../core/sheets'
import { invertLocalizedMap, sheetToLocalization } from '../core/transformers'
import { logger } from '../utils/logger'

export const pullCommand = async () => {
  const { data: spreadsheet } = await loadSpreadsheet({
    spreadsheetId: Config.config.spreadsheetId,
  })
  if (!spreadsheet) {
    logger.error('Error loading data from Google Spreadsheet')
    return
  }

  const pulledMap = await sheetToLocalization({
    locales: Config.config.locales,
    worksheet: spreadsheet.sheetsByIndex[0],
  })

  const localMap = await loadLocales({
    locales: Config.config.locales,
    path: Config.config.path,
    ignoreMissingLocaleFiles: true,
  })

  const diff = getLocalizationDiff(invertLocalizedMap(localMap), invertLocalizedMap(pulledMap))
  logLocalizationDiff(diff)

  await saveLocales({ localizationMap: pulledMap, path: Config.config.path })
}
