import { InvertedLocalizationMap, LocalizationMap, WorksheetToLocalizationOptions } from './types.js'

export const invertLocalizedMap = (localizationMap: LocalizationMap): InvertedLocalizationMap => {
  const invertedMap: InvertedLocalizationMap = {}
  Object.entries(localizationMap).forEach(([locale, translationMap]) => {
    Object.entries(translationMap).forEach(([key, value]) => {
      if (!invertedMap[key]) {
        invertedMap[key] = {}
      }
      invertedMap[key][locale] = value
    })
  })
  return invertedMap
}

export const sheetToLocalization = async (options: WorksheetToLocalizationOptions): Promise<LocalizationMap> => {
  const rows = await options.worksheet.getRows()
  const localeMap: LocalizationMap = {}

  options.locales.forEach((locale) => {
    localeMap[locale] = {}
  })

  rows.forEach((row) => {
    options.locales.forEach((locale) => {
      const value = row.get(locale)
      if (value) {
        localeMap[locale][row.get('key')] = row.get(locale)
      }
    })
  })

  return localeMap
}
