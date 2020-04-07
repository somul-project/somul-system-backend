import * as dotenv from 'dotenv';
import * as fs from 'fs';

const envDev = dotenv.parse(fs.readFileSync(`./.env${(process.env.NODE_ENV) ? `.${process.env.NODE_ENV}` : ''}`));

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
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} = envDev;

export const enum ADMIN_APPROVED {
  PROCESS = '0',
  ADMIN_DISAPPROVAL = '1',
  AUTO_DISAPPROVAL = '2',
  APPROVAL = '3',
}
