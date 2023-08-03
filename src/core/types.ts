import { Command } from 'commander'
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'

export type CredentialsConfig = { serviceAccountEmail: string; serviceAccountPrivateKey: string }

type CommandOptions = { debug: boolean; silent: boolean; questions: boolean }
export type CommandArguments = [CommandOptions, Command]
export type CommandAction = (...args: CommandArguments) => Promise<void>
export type DataWithError<D, E extends Error> = { data: D; error: null } | { data: null; error: E }
export type DataWithErrorAsync<D, E extends Error> = Promise<DataWithError<D, E>>
export type Locale = string
export type TranslationMap = Record<string, string>
export type LocalizationMap = Record<Locale, TranslationMap>
export type InvertedLocalizationMap = Record<string, Record<Locale, string>>
export type DetailedLocalizationDiff = {
  added: InvertedLocalizationMap
  deleted: InvertedLocalizationMap
  updated: InvertedLocalizationMap
}
export type SpreadsheetConfig = {
  snapshotCount?: number
}
export type SpreadsheetConfigKeysType = keyof SpreadsheetConfig

export type CreateSnapshotOptions = {
  spreadsheet: GoogleSpreadsheet
}

export type SaveFilesOptions = {
  path: string
  localizationMap: LocalizationMap
}

export type LoadFilesOptions = {
  path: string
  locales: Locale[]
  ignoreMissingLocaleFiles?: boolean
}

export type WorksheetToLocalizationOptions = {
  locales: Locale[]
  worksheet: GoogleSpreadsheetWorksheet
}

export type LoadSpreadsheetOptions = CredentialsConfig & {
  spreadsheetId: string
}

export type InitializeSpreadsheetOptions = {
  spreadsheet: GoogleSpreadsheet
  locales: Locale[]
}

export type UpdateSpreadsheetLocalesOptions = {
  spreadsheet: GoogleSpreadsheet
  localizationDiff: DetailedLocalizationDiff
}

export type LocalizationConfig = {
  spreadsheetId: string
  path: string
  locales: Locale[]
}

export type ConfigParameters = LoadSpreadsheetOptions & LocalizationConfig
