import * as dotenv from 'dotenv';
import * as fs from 'fs';

let envDev = dotenv.parse(fs.readFileSync(`./.env${(process.env.NODE_ENV) ? `.${process.env.NODE_ENV}` : ''}`));

envDev = {
  ...envDev,
  ...JSON.parse(JSON.stringify(process.env)),
};

export const {
  // Server config
  VERSION,
  SERVER_PORT,
  SECRET_CODE,
  // Email config
  SERVER_DOMAIN,
  CLIENT_DOMAIN,
  ADMIN_EMAIL,
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
  // slack
  SLACK_WEBHOOK_URL,
} = envDev;

export const USE_SLACK = (envDev.USE_SLACK === 'true');
export const LIMIT_SEND_COUNT = 5;

export const enum ADMIN_APPROVED {
  PROCESS = '0',
  ADMIN_DISAPPROVAL = '1',
  AUTO_DISAPPROVAL = '2',
  APPROVAL = '3',
}
