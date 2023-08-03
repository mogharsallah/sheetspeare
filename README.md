# Sheetspeare - Google Spreadsheet Translation Loader CLI

[![npm version](https://badge.fury.io/js/sheetspeare.svg)](https://badge.fury.io/js/sheetspeare)

Sheetspeare is a powerful CLI tool that allows you to manage translations for your application using Google Spreadsheets. It simplifies the process of loading translation files from a Google Spreadsheet and keeping them in sync with your codebase. Say goodbye to manual copy-pasting and tedious translation management!

## Installation

Install the package using npm:

```bash
npm install --save-dev sheetspeare
```

## Setup

To start using Sheetspeare, follow these steps:

### Setup an your Google project:

1. Go to the Google Developers Console
2. Select your project or create a new one (and then select it)
3. Enable the Sheets API for your project
4. In the sidebar on the left, select Enabled APIs & Services
5. Click the blue "Enable APIs and Services" button in the top bar
6. Search for "sheets"
7. Click on "Google Sheets API"
8. click the blue "Enable" button

### Create a Google Service Account:

1. In the sidebar on the left, select APIs & Services > Credentials
2. Click blue "+ CREATE CREDENTIALS" and select "Service account" option
3. Enter name, description, click "CREATE"
4. You can skip permissions, click "CONTINUE"
5. Click "+ CREATE KEY" button
6. Select the "JSON" key type option
7. Click "Create" button
8. your JSON key file is generated and downloaded to your machine (it is the only copy!) Keep it in a safe place. we will use it the following steps.
9. click "DONE"
10. note your service account's email address (also available in the JSON key file)

For more details on how to setup the Google Service Account and Project visit the [authentication section of the google-spreadsheet package documentation](https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication)

### Create a Google Spreadsheet:

Create a new Google Spreadsheet and **share it with your service account using the email noted above**.
Note the Google Spreadsheet id from the URL
`https://docs.google.com/spreadsheets/d/{spreadsheetId}/edit...`. It is needed in the following steps.

### Setup Environment Variables:

From the downloaded JSON key file, set the following environment variables:

`SERVICE_ACCOUNT_EMAIL="client_email"`
`SERVICE_ACCOUNT_PRIVATE_KEY="private_key"`

Or add them to your [dotenv](https://github.com/motdotla/dotenv) file:

```.env
# .env
SERVICE_ACCOUNT_EMAIL="client_email"
SERVICE_ACCOUNT_PRIVATE_KEY="private_key"
```

### Initialize the project:

Run the following command to initialize the project:

```bash
npx sheetspeare init
```

A `.sheetspearerc.json` config file will be added which stores the configuration for the project.

## Usage

The Sheetspeare CLI offers the following commands:

1. `init`: Initialize the Google Spreadsheet connection and create a configuration file.

2. `pull`: Pull translations from the Google Spreadsheet and update the locale files in your project.

3. `push`: Push updated translations from your project's locale files back to the Google Spreadsheet.

4. `help`: Show the help menu and available commands.

## Configuration

After running the `init` command, Sheetspeare will create a configuration file named `.sheetspearerc.json` in your project's root directory. You can manually edit this file if you need to change the default settings.

```json
{
  "locales": ["en", "es", ...],
  "spreadsheetId": "...",
  "path": "src/locales"
}
```

- `spreadsheetId`: The ID of the Google Spreadsheet containing the translations.
- `path`: The path to the directory containing the locale files.
- `locales`: An array of locale codes to pull from the Google Spreadsheet. The locale files under the path directory will be named using these locale codes.

## Contributing

We welcome contributions to Sheetspeare! If you find any bugs, have suggestions for improvements, or want to add new features, feel free to open an issue or submit a pull request on GitHub: [GitHub Repository](https://github.com/mogharsallah/sheetspeare)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
