#! /usr/bin/env node

import 'dotenv/config'
import { initCommand } from './commands/init.js'
import { pullCommand } from './commands/pull.js'

import { program, Option } from 'commander'
import { PackageName } from './constants.js'
import Config from './config.js'
import { pushCommand } from './commands/push.js'

// @ts-ignore
import { version } from './version.js'
import { logger } from './utils/logger.js'

Config.init(process.env.SERVICE_ACCOUNT_EMAIL, process.env.SERVICE_ACCOUNT_PRIVATE_KEY)

const debugOption = new Option('-d, --debug', 'output extra debugging')
const silentOption = new Option('-s, --silent', 'output no logs')
const noQuestionsOption = new Option('-n, --no-questions', 'ask no questions, confirm all actions')

program.name(PackageName).description('CLI to manage localization files with Google Sheets').version(version)

program
  .command('pull')
  .description('Pull locale files from Google Sheets')
  .action(pullCommand)
  .addOption(debugOption)
  .addOption(silentOption)
  .addOption(noQuestionsOption)
  .on('option:debug', function () {
    logger.setLevel('debug')
  })
  .on('option:silent', function () {
    logger.setLevel('silent')
  })

program
  .command('push')
  .description('Push locale files to Google Sheets')
  .action(pushCommand)
  .addOption(debugOption)
  .addOption(silentOption)
  .addOption(noQuestionsOption)
  .on('option:debug', function () {
    logger.setLevel('debug')
  })
  .on('option:silent', function () {
    logger.setLevel('silent')
  })

program
  .command('init')
  .description(`initialize ${PackageName} configuration`)
  .action(initCommand)
  .addOption(debugOption)
  .on('option:debug', function () {
    logger.setLevel('debug')
  })

program.parse()
