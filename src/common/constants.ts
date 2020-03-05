import * as dotenv from 'dotenv';
import * as fs from 'fs';


const envDev = dotenv.parse(fs.readFileSync('./.env.development'));
export const { VERSION } = envDev;
export const { SERVER_PORT } = envDev;
export const { ADMIN_EMAIL } = envDev;
export const { SECRET_CODE } = envDev;

export const { GOOGLE_CLIENT_ID } = envDev;
export const { GOOGLE_CLIENT_SECRET } = envDev;

export const { GITHUB_CLIENT_ID } = envDev;
export const { GITHUB_CLIENT_SECRET } = envDev;

export const { SENDGRID_API_KEY } = envDev;
export const { EMAIL_SUBJECT } = envDev;
export const EMAIL_TEMPLATE = `http://${envDev.DOMAIN}/verify?email={email}&token={token}`;

export const { DB_ENDPOINT } = envDev;
export const { DB_NAME } = envDev;
export const { DB_USERNAME } = envDev;
export const { DB_PASSWORD } = envDev;
