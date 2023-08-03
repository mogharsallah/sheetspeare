import { DetailedDiff, detailedDiff } from 'deep-object-diff'
import chalk from 'chalk'

import { DetailedLocalizationDiff, InvertedLocalizationMap } from './types'
import { logger } from '../utils/logger'

export const getLocalizationDiff = (
  oldLocalization: InvertedLocalizationMap,
  newLocalization: InvertedLocalizationMap,
): DetailedLocalizationDiff => {
  return detailedDiff(oldLocalization, newLocalization) as DetailedLocalizationDiff
}

export const logLocalizationDiff = (diff: DetailedDiff) => {
  Object.entries(diff).forEach(([key, content]) => {
    if (Object.keys(content).length === 0) {
      return
    }
    let coloredChalk = chalk
    switch (key) {
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
        coloredChalk = chalk.red
      }
    }

    Object.entries(content).forEach(([key, localeMap]) => {
      logger.info(
        coloredChalk.bold(
          localeMap ? `[${Object.keys(localeMap).join(', ')}]:  Key:` : '[ALL Locales]    Key:',
          coloredChalk.italic(`${key}`),
        ),
      )
    })
  })
}
