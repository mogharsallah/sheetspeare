import { lilconfigSync } from 'lilconfig'

import { ConfigFile, CredentialsConfig } from './core/types'
import { logger } from './utils/logger'
import { PackageName } from './constants'

export default class Config {
  static _configFile: ConfigFile | null
  static _credentials: CredentialsConfig | null

  static init = (serviceAccountEmail?: string, serviceAccountPrivateKey?: string) => {
    const explorer = lilconfigSync(PackageName)
    const result = explorer.search()
    Config._configFile = (result?.config as ConfigFile) ?? null
    Config._credentials =
      serviceAccountEmail && serviceAccountPrivateKey ? { serviceAccountEmail, serviceAccountPrivateKey } : null
  }

  static get config() {
    if (!Config._configFile) {
      logger.error('No config file found. Please run init command first.')
      process.exit(1)
    }
    if (!Config._credentials) {
      logger.error('Missing credentials. Make sure Your credentials are properly setup as environment variables.')
      process.exit(1)
    }
    return { ...Config._configFile, ...Config._credentials }
  }
}
