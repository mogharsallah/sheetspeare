import { DetailedDiff, detailedDiff } from 'deep-object-diff'
import chalk from 'chalk'

import { DetailedLocalizationDiff, TranslationMap } from './types'
import { logger } from '../utils/logger'
import { parseLocaleKey } from '../utils/json'

export const getLocalizationDiff = (
  oldLocalization: TranslationMap,
  newLocalization: TranslationMap,
): DetailedLocalizationDiff => {
  return detailedDiff(oldLocalization, newLocalization) as DetailedLocalizationDiff
}

export const logLocalizationDiff = (diff: DetailedDiff) => {
  Object.entries(diff).forEach(([diffType, content]) => {
    if (Object.keys(content).length === 0) {
      return
    }
    let coloredChalk = chalk
    switch (diffType) {
      case 'added': {
        logger.info(chalk.bold.dim('Added locales:'))
        coloredChalk = chalk.green
        break
      }
      case 'deleted': {
        logger.info(chalk.bold.dim('Deleted locales:'))
        coloredChalk = chalk.red
        break
      }
      case 'updated': {
        logger.info(chalk.bold.dim('Updated locales:'))
        coloredChalk = chalk.yellow
      }
    }

    Object.entries(content).forEach(([localeWithKey, value]) => {
      const [locale, key] = parseLocaleKey(localeWithKey)
      logger.info(coloredChalk.bold(`${locale}:`, coloredChalk.italic(key)), value ? `"${chalk.dim(value)}"` : '')
    })
  })
}

export const noChanges = (diff: DetailedDiff) =>
  !Object.keys(diff.added).length && !Object.keys(diff.deleted).length && !Object.keys(diff.updated).length
