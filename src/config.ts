import { lilconfigSync } from 'lilconfig'

import { ConfigParameters } from './core/types'
import { logger } from './utils/logger'
import { PackageName } from './constants'

export default class Config {
  static _config: ConfigParameters | null

  static get config() {
    // If config is not set, try to load it
    if (!Config._config) {
      const fileConfig = lilconfigSync(PackageName).search()?.config
      if (!fileConfig) {
        logger.error('No config file found. Please run init command first.')
        process.exit(1)
      }

      const serviceAccountEmail = process.env.SERVICE_ACCOUNT_EMAIL
      if (!serviceAccountEmail) {
        logger.error(
          '`SERVICE_ACCOUNT_EMAIL` is not present in the environment variables. Make sure Your credentials are properly setup as environment variables.',
        )
        process.exit(1)
      }

      const serviceAccountPrivateKey = process.env.SERVICE_ACCOUNT_PRIVATE_KEY
      if (!serviceAccountPrivateKey) {
        logger.error(
          '`SERVICE_ACCOUNT_PRIVATE_KEY` is not present in the environment variables. Make sure Your credentials are properly setup as environment variables.',
        )
        process.exit(1)
      }

      Config._config = { ...fileConfig, serviceAccountEmail, serviceAccountPrivateKey }
    }

    return Config._config as ConfigParameters
  }
}
