import { TranslationMap } from '../core/types'

export const stringifyMap = (map: TranslationMap) => {
  return JSON.stringify(map, null, 2)
}

export const parseMap = (str: string): TranslationMap => {
  return JSON.parse(str)
}
