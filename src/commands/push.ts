import inquirer from 'inquirer'

import Config from '../config.js'
import { getLocalizationDiff, logLocalizationDiff } from '../core/diff.js'
import { loadLocales } from '../core/files.js'
import { loadSpreadsheet, updateSpreadsheetLocales } from '../core/sheets.js'
import { invertLocalizedMap, sheetToLocalization } from '../core/transformers.js'
import { CommandAction } from '../core/types.js'
import { logger } from '../utils/logger.js'

export const pushCommand: CommandAction = async (options) => {
  const { data: spreadsheet } = await loadSpreadsheet({
    spreadsheetId: Config.config.spreadsheetId,
  })
  if (!spreadsheet) {
    logger.error('Error loading data from Google Spreadsheet')
    return
  }

  const localMap = await loadLocales({ path: Config.config.path, locales: Config.config.locales })
  const pulledMap = await sheetToLocalization({
    locales: Config.config.locales,
    worksheet: spreadsheet.sheetsByIndex[0],
  })

  const invertedLocalMap = invertLocalizedMap(localMap)
  const invertedPulledMap = invertLocalizedMap(pulledMap)

  const diff = getLocalizationDiff(invertedPulledMap, invertedLocalMap)
  logLocalizationDiff(diff)

  if (!Object.keys(diff.added).length && !Object.keys(diff.deleted).length && !Object.keys(diff.updated).length) {
    logger.info('No changes to push.')
    return
  }

  if (options.questions) {
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continue',
        message: 'Do you want to continue?',
        default: false,
      },
    ])
    if (!answers.continue) {
      logger.info('Push cancelled')
      return
    }
  }

  logger.info('Pushing to Google Spreadsheet...')
  const { error } = await updateSpreadsheetLocales({ spreadsheet, localizationDiff: diff })
  if (error) {
    logger.error('❌ Error updating Google Spreadsheet:', error.message)
  } else {
    logger.info('✅ Google Spreadsheet updated.')
  }
}
