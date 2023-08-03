import { JWT } from 'google-auth-library'
import Config from '../config.js'

export const getJWT = () =>
  new JWT({
    email: Config.config.serviceAccountEmail,
    key: Config.config.serviceAccountPrivateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file'],
  })
