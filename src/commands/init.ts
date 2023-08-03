import inquirer from 'inquirer'
import chalk from 'chalk'

import { PackageName } from '../constants'
import { initializeSpreadsheet, loadSpreadsheet } from '../core/sheets'
import { createConfigFile } from '../core/files'
import { logger } from '../utils/logger'

export const initCommand = async () => {
  // Ensure that the user has set up the required environment variables before running the command
  if (!process.env.SERVICE_ACCOUNT_EMAIL || !process.env.SERVICE_ACCOUNT_PRIVATE_KEY) {
    logger.error(
      'Missing credentials. Make sure Your Google Service Account credentials are properly setup as environment variables. See README for more info: https://github.com/mogharsallah/sheetspeare#setup-environment-variables',
    )
    return
  }

  logger.info(`Hey there! Let's set up your ${PackageName} configuration file 💪.`)
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'path',
      message: 'Where do you want to save your localization files?',
      default: 'src/locales',
    },
    {
      type: 'input',
      name: 'locales',
      message: `Which locales do you need? ${chalk.italic('(comma separated)')}`,
      default: 'en,es',
      filter(val: string) {
        return val.toLowerCase().replace(/ /g, '').split(',')
      },
    },
    {
      type: 'input',
      name: 'spreadsheetId',
      message:
        'What is your Google Spreadsheet ID? If you have not created one yet, create an empty spreadsheet and paste the ID here.',
      validate: (value) => value.length > 0 || 'Please enter your Google Spreadsheet ID: ',
    },
    {
      type: 'confirm',
      name: 'initializeSpreadsheet',
      message: `Would you like to initialize your spreadsheet? ${chalk.yellow(
        'This removes all data in the spreadsheet!',
      )}`,
      default: true,
    },
  ])

  logger.info('Checking access to Google Spreadsheet...')
  const { data: spreadsheet, error } = await loadSpreadsheet({
    serviceAccountEmail: process.env.SERVICE_ACCOUNT_EMAIL,
    serviceAccountPrivateKey: process.env.SERVICE_ACCOUNT_PRIVATE_KEY,
    spreadsheetId: answers.spreadsheetId,
  })
  if (error) {
    logger.error('Could not access to Google Spreadsheet. Please check your credentials and try again.', error.message)
    return
  }
  logger.info('✅ Access to Google Spreadsheet granted!')

  if (answers.initializeSpreadsheet) {
    initializeSpreadsheet({ spreadsheet, locales: answers.locales })
  }

  logger.info('Creating configuration file...')
  createConfigFile(`.${PackageName}rc.json`, {
    locales: answers.locales,
    spreadsheetId: answers.spreadsheetId,
    path: answers.path,
  })

  logger.info(chalk.bold(`Great! We are ready to go 🚀. Run ${chalk.gray(`${PackageName} pull`)}`))
  console.info(`To update the Google Spreadsheet with your local locales: Run ${chalk.gray(`${PackageName} push`)}`)
}
