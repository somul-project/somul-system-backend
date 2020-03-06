import * as dotenv from 'dotenv';
import * as fs from 'fs';

const envDev = dotenv.parse(fs.readFileSync(`./.env.${process.env.NODE_ENV}`));

// Email config
export const EMAIL_TEMPLATE = `http://${envDev.DOMAIN}/verify?email={email}&token={token}`;

export const {
  // Server config
  VERSION,
  SERVER_PORT,
  SECRET_CODE,
  // Email config
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
