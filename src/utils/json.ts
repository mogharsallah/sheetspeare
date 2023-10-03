import { TranslationMap } from '../core/types'

export const stringifyMap = (map: TranslationMap) => {
  return JSON.stringify(map, null, 2)
}

export const parseMap = (str: string): TranslationMap => {
  return JSON.parse(str)
}

export const stringifyLocaleKey = (locale: string, key: string) => `${locale}:${key}`

export const parseLocaleKey = (localeKey: string): [string, string] => {
  const [locale, key] = localeKey.split(':')
  if (!locale || !key) throw new Error(`Invalid locale:key string: ${localeKey}`)
  else return [locale, key]
}
