import { parseLocaleKey, stringifyLocaleKey } from '../utils/json'
import { LocalizationMap, TranslationMap, WorksheetToLocalizationOptions } from './types'

export const translationMapToLocalizedMap = (translationMap: TranslationMap): LocalizationMap => {
  const localizedMap: LocalizationMap = {}
  Object.entries(translationMap).forEach(([localeWithKey, value]) => {
    const [locale, key] = parseLocaleKey(localeWithKey)

    if (!localizedMap[locale]) {
      localizedMap[locale] = {}
    }
    localizedMap[locale][key] = value
  })

  return localizedMap
}

export const sheetToTranslationMap = async (options: WorksheetToLocalizationOptions): Promise<TranslationMap> => {
  const rows = await options.worksheet.getRows()
  const map: TranslationMap = {}

  rows.forEach((row) => {
    options.locales.forEach((locale) => {
      const value = row.get(locale)
      if (value) {
        map[stringifyLocaleKey(locale, row.get('key'))] = value
      }
    })
  })

  return map
}
