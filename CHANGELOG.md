# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## FIXED

- Fixed the bug in `init` command where the config cannot be loaded

## 0.6.0 - 2023-08-03

## 0.5.1 - 2023-08-03

### Added

- Exist `init` command when no env credentials are provided

### Changed

- Create config file and import Config before initializing the Google Spreadsheet

### Fixed

- Fixed config file name in `init` command

## 0.5.0 - 2023-08-03

### Fixed

- Fixed failing files import

## 0.4.0 - 2023-08-03

### Added

- Npm publish workflow

### Fixed

- Replaced yarn with npm in workflow
- Added missing build steps in workflow
- Remove publish script from package.json which causes publishing the package twice

## 0.2.0 - 2023-08-03

### Added

- Initial Commit
