import { lilconfigSync } from 'lilconfig'

import Config from '../src/config'

jest.mock('lilconfig', () => ({
  lilconfigSync: jest.fn(),
}))

describe('Config', () => {
  const lilconfigMock = lilconfigSync as jest.Mock
  const originalExit = process.exit
  const processExitMock = jest.fn()
  const defaultFileConfig = { locales: ['en'], path: 'src/locales', spreadsheetId: '123' }

  beforeEach(() => {
    // @ts-ignore
    process.exit = processExitMock.mockReset()
    Config._config = null
    lilconfigMock.mockReturnValue({
      search: jest.fn(() => ({
        config: null,
      })),
    })
    delete process.env.SERVICE_ACCOUNT_EMAIL
    delete process.env.SERVICE_ACCOUNT_PRIVATE_KEY
  })

  afterEach(() => {
    process.exit = originalExit
  })

  it('should return config', () => {
    lilconfigMock.mockReturnValue({
      search: jest.fn(() => ({
        config: defaultFileConfig,
      })),
    })

    process.env.SERVICE_ACCOUNT_EMAIL = 'email'
    process.env.SERVICE_ACCOUNT_PRIVATE_KEY = 'privatekey'

    expect(Config.config).toEqual({
      ...defaultFileConfig,
      serviceAccountEmail: 'email',
      serviceAccountPrivateKey: 'privatekey',
    })
  })

  it('should exit with an error if config file is missing', () => {
    process.env.SERVICE_ACCOUNT_EMAIL = 'email'
    process.env.SERVICE_ACCOUNT_PRIVATE_KEY = 'privatekey'

    Config.config
    expect(processExitMock).toHaveBeenCalledWith(1)
  })

  it('should exit with an error if service account private key is missing', () => {
    process.env.SERVICE_ACCOUNT_EMAIL = 'email'
    lilconfigMock.mockReturnValue({
      search: jest.fn(() => ({
        config: defaultFileConfig,
      })),
    })

    Config.config
    expect(processExitMock).toHaveBeenCalledWith(1)
  })

  it('should exit with an error if service account email is missing', () => {
    process.env.SERVICE_ACCOUNT_PRIVATE_KEY = 'privatekey'

    lilconfigMock.mockReturnValue({
      search: jest.fn(() => ({
        config: defaultFileConfig,
      })),
    })

    Config.config
    expect(processExitMock).toHaveBeenCalledWith(1)
  })
})
