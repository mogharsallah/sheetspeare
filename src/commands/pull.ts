import Config from '../config'
import { getLocalizationDiff, logLocalizationDiff, noChanges } from '../core/diff'
import { loadLocales, saveLocales } from '../core/files'
import { loadSpreadsheet } from '../core/sheets'
import { sheetToTranslationMap } from '../core/transformers'
import { logger } from '../utils/logger'

export const pullCommand = async () => {
  const { data: spreadsheet } = await loadSpreadsheet({
    serviceAccountEmail: Config.config.serviceAccountEmail,
    serviceAccountPrivateKey: Config.config.serviceAccountPrivateKey,
    spreadsheetId: Config.config.spreadsheetId,
  })
  if (!spreadsheet) {
    logger.error('Error loading data from Google Spreadsheet')
    return
  }

  const pulledMap = await sheetToTranslationMap({
    locales: Config.config.locales,
    worksheet: spreadsheet.sheetsByIndex[0],
  })

  const localMap = await loadLocales({
    locales: Config.config.locales,
    path: Config.config.path,
    ignoreMissingLocaleFiles: true,
  })

  const diff = getLocalizationDiff(localMap, pulledMap)

  if (noChanges(diff)) {
    logger.info('No changes to pull.')
    return
  }

  logLocalizationDiff(diff)

  await saveLocales({ translationMap: pulledMap, path: Config.config.path })
}
