import * as dotenv from 'dotenv';
import * as fs from 'fs';

const envDev = dotenv.parse(fs.readFileSync(`./.env.${process.env.NODE_ENV}`));

export const {
  // Server config
  VERSION,
  SERVER_PORT,
  SECRET_CODE,
  // Email config
  DOMAIN,
  ADMIN_EMAIL,
  SENDGRID_API_KEY,
  // OAuth config
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  // DB config
  DB_ENDPOINT,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
} = envDev;


export const ERROR_MESSAGE = {
  0: 'success',
  1: 'invalid parameter',
  100: 'failed to login',
  101: 'failed to verify token',
  102: 'it is already registered',
  103: 'failed to reset password',
  104: 'you do not have permission',
  105: 'you have to register',
  500: 'it is an unexpected error',
};
