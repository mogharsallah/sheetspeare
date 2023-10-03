import inquirer from 'inquirer'

import Config from '../config'
import { getLocalizationDiff, logLocalizationDiff, noChanges } from '../core/diff'
import { loadLocales } from '../core/files'
import { loadSpreadsheet, updateSpreadsheetLocales } from '../core/sheets'
import { sheetToTranslationMap } from '../core/transformers'
import { CommandAction } from '../core/types'
import { logger } from '../utils/logger'

export const pushCommand: CommandAction = async (options) => {
  const { data: spreadsheet } = await loadSpreadsheet({
    serviceAccountEmail: Config.config.serviceAccountEmail,
    serviceAccountPrivateKey: Config.config.serviceAccountPrivateKey,
    spreadsheetId: Config.config.spreadsheetId,
  })
  if (!spreadsheet) {
    logger.error('Error loading data from Google Spreadsheet')
    return
  }

  const localMap = await loadLocales({ path: Config.config.path, locales: Config.config.locales })
  const pulledMap = await sheetToTranslationMap({
    locales: Config.config.locales,
    worksheet: spreadsheet.sheetsByIndex[0],
  })

  const diff = getLocalizationDiff(pulledMap, localMap)
  logLocalizationDiff(diff)

  if (noChanges(diff)) {
    logger.info('No changes to push.')
    return
  }

  let forceDeleteMissingLocales = options.force

  if (options.questions) {
    const prompts = [
      {
        type: 'confirm',
        name: 'continue',
        message: 'Do you want to continue?',
        default: false,
      },
    ]
    if (!forceDeleteMissingLocales && Object.keys(diff.deleted).length) {
      prompts.unshift({
        type: 'confirm',
        name: 'forceDelete',
        message:
          'Some keys are missing from you local files, Do you want to remove these keys from Google spreadsheet?',
        default: false,
      })
    }

    const answers = await inquirer.prompt(prompts)

    if (!answers.continue) {
      logger.info('Push cancelled')
      return
    }

    if (answers.forceDelete) {
      forceDeleteMissingLocales = true
    }
  }

  logger.info('Pushing to Google Spreadsheet...')
  const { error } = await updateSpreadsheetLocales({
    spreadsheet,
    localizationDiff: diff,
    deleteMissingLocales: forceDeleteMissingLocales,
  })
  if (error) {
    logger.error('❌ Error updating Google Spreadsheet:', error.message)
  } else {
    logger.info('✅ Google Spreadsheet updated.')
  }
}
