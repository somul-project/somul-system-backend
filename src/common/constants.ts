import * as dotenv from "dotenv";
import * as fs from "fs";


const envDev = dotenv.parse(fs.readFileSync(`./.env.development`));
export const VERSION  = envDev.VERSION;
export const SERVER_PORT = envDev.SERVER_PORT;
export const ADMIN_EMAIL = envDev.ADMIN_EMAIL;
export const SECRET_CODE = envDev.SECRET_CODE;

export const GOOGLE_CLIENT_ID = envDev.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = envDev.GOOGLE_CLIENT_SECRET;

export const GITHUB_CLIENT_ID = envDev.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = envDev.GITHUB_CLIENT_SECRET;

export const SENDGRID_API_KEY = envDev.SENDGRID_API_KEY;
export const EMAIL_SUBJECT = envDev.EMAIL_SUBJECT;
export const EMAIL_TEMPLATE  = `http://${envDev.DOMAIN}/verify?email={email}&token={token}`;

export const DB_ENDPOINT = envDev.DB_ENDPOINT;
export const DB_NAME = envDev.DB_NAME;
export const DB_USERNAME = envDev.DB_USERNAME;
export const DB_PASSWORD = envDev.DB_PASSWORD;
