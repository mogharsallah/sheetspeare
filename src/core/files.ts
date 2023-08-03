import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'

import { LoadFilesOptions, LocalizationConfig, LocalizationMap, SaveFilesOptions } from './types'
import { parseMap, stringifyMap } from '../utils/json'
import { logger } from '../utils/logger'

export const resolveLocalePath = (p: string, locale: string) => {
  return path.resolve(`${p}/${locale}.json`)
}

export const ensureDirectoryExistence = (p: string) => {
  const dirname = path.resolve(p)
  if (fs.existsSync(dirname)) {
    return true
  }
  fs.mkdirSync(dirname, { recursive: true })
}

export const createConfigFile = (p: string, config: LocalizationConfig) => {
  fs.writeFileSync(path.resolve(p), JSON.stringify(config, null, 2), {
    encoding: 'utf-8',
  })
  logger.info('✅ Configuration file successfully created.')
}

export const loadLocales = async (options: LoadFilesOptions) => {
  const localizationMap: LocalizationMap = {}
  options.locales.forEach((locale) => {
    const localePath = resolveLocalePath(options.path, locale)
    if (fs.existsSync(localePath)) {
      localizationMap[locale] = parseMap(fs.readFileSync(localePath, { encoding: 'utf-8' }))
    } else if (!options.ignoreMissingLocaleFiles) {
      logger.warn(chalk.yellow(`⚠️ Locale file for ${locale} not found!`))
    }
  })
  return localizationMap
}

export const saveLocales = async (options: SaveFilesOptions) => {
  ensureDirectoryExistence(options.path)
  Object.entries(options.localizationMap).forEach(([locale, content]) => {
    fs.writeFileSync(resolveLocalePath(options.path, locale), stringifyMap(content), {
      encoding: 'utf-8',
    })
  })
  logger.info('✅ Localization files successfully pulled.')
}
