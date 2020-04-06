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

export const enum STATUS_CODE {
  success = '0',
  invalidParams = '1',
  failedToLogin = '100',
  failedToVerify = '101',
  alreadyRegistered = '102',
  failedToResetPwd = '103',
  insufficientPermission = '104',
  notRegistered = '105',
  sessionFull = '106',
  invalidEmail = '107',
  invalidPassword = '108',
  invalidPhonenumber = '109',
  unexpected = '500',
}

export class CustomError extends Error {
  static MESSAGE = {
    0: '성공',
    1: '적절하지 않은 인자입니다.',
    100: '로그인에 실패했습니다.',
    101: '토큰 인증에 실패했습니다.',
    102: '이미 등록된 사용자입니다.',
    103: '비밀번호 초기화에 실패했습니다.',
    104: '권한이 충분하지 않습니다.',
    105: '회원 가입이 필요합니다.',
    106: '세션이 이미 가득 찼습니다.',
    107: '이메일의 형식이 적절하지 않습니다.',
    108: '비밀번호의 형식이 적절하지 않습니다.',
    109: '휴대폰 번호의 형식이 적절하지 않습니다.',
    500: '예상치 못한 오류가 발생했습니다.',
  };

  private errorMessage?: string

  constructor(private statusCode: string) {
    super();
    this.name = 'CustomError';
    if (!CustomError.MESSAGE[statusCode]) {
      this.statusCode = '500';
    }
    this.errorMessage = CustomError.MESSAGE[this.statusCode];
  }

  showAlert() {
    return `CustomError [statusCode: ${this.statusCode}, message: ${this.errorMessage}`;
  }

  getData() {
    return { statusCode: this.statusCode, errorMessage: this.errorMessage };
  }
}


export const enum ADMIN_APPROVED {
  PROCESS = '0',
  ADMIN_DISAPPROVAL = '1',
  AUTO_DISAPPROVAL = '2',
  APPROVAL = '3',
}
