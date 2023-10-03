import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'

import { LoadFilesOptions, LocalizationConfig, SaveFilesOptions, TranslationMap } from './types'
import { parseMap, stringifyLocaleKey, stringifyMap } from '../utils/json'
import { logger } from '../utils/logger'
import { translationMapToLocalizedMap } from './transformers'

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
  const map: TranslationMap = {}
  options.locales.forEach((locale) => {
    const localePath = resolveLocalePath(options.path, locale)
    if (fs.existsSync(localePath)) {
      Object.entries(parseMap(fs.readFileSync(localePath, { encoding: 'utf-8' }))).forEach(([key, value]) => {
        map[stringifyLocaleKey(locale, key)] = value
      })
    } else if (!options.ignoreMissingLocaleFiles) {
      logger.warn(chalk.yellow(`⚠️ Locale file for ${locale} not found!`))
    }
  })
  return map
}

export const saveLocales = async (options: SaveFilesOptions) => {
  ensureDirectoryExistence(options.path)

  const localizedMap = translationMapToLocalizedMap(options.translationMap)

  Object.entries(localizedMap).forEach(([locale, content]) => {
    fs.writeFileSync(resolveLocalePath(options.path, locale), stringifyMap(content), {
      encoding: 'utf-8',
    })
  })
  logger.info('✅ Localization files successfully pulled.')
}
