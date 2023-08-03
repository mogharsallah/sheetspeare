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
    Config._configFile = null
    Config._credentials = null
    lilconfigMock.mockReturnValue({
      search: jest.fn(() => ({
        config: null,
      })),
    })
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
    Config.init('email', 'privatekey')
    expect(Config.config).toEqual({
      ...defaultFileConfig,
      serviceAccountEmail: 'email',
      serviceAccountPrivateKey: 'privatekey',
    })
  })

  it('should exit with an error if config file is missing', () => {
    Config.init('email', 'privatekey')
    Config.config
    expect(processExitMock).toHaveBeenCalledWith(1)
  })

  it('should exit with an error if credentials are missing', () => {
    Config.init()
    lilconfigMock.mockReturnValue({
      search: jest.fn(() => ({
        config: defaultFileConfig,
      })),
    })

    Config.config
    expect(processExitMock).toHaveBeenCalledWith(1)
  })
})
