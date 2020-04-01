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

export class ERROR {
  static MESSAGE = {
    0: 'success',
    1: 'invalid parameter',
    100: 'failed to login',
    101: 'failed to verify token',
    102: 'already registered',
    103: 'failed to reset password',
    104: 'Insufficient permission',
    105: 'you have to register',
    106: 'Session already filled',
    107: 'invalid email',
    108: 'invalid password',
    109: 'invalid phonenumber',
    500: 'Unexpected error occurred',
  };

  static CODE = {
    success: '0',
    invalidParams: '1',
    failedToLogin: '100',
    failedToVerify: '101',
    alreadyRegistered: '102',
    failedToResetPwd: '103',
    notPermission: '104',
    notRegistered: '105',
    sessionFull: '106',
    invalidEmail: '107',
    invalidPassword: '108',
    invalidPhonenumber: '109',
    unexpected: '500',
  }
}

export enum ADMIN_APPROVED {
  PROCESS = '0',
  ADMIN_DISAPPROVAL = '1',
  AUTO_DISAPPROVAL = '2',
  APPROVAL = '3',
}
