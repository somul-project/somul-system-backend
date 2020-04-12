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
  notExistToken = '110',
  exceedLimitSend = '111',
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
    110: '토큰을 요청한 적이 없습니다.',
    111: '최대 재전송 횟수를 초과했습니다',
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
    return `CustomError [statusCode: ${this.statusCode}, message: ${this.errorMessage}]`;
  }

  getData() {
    return { statusCode: this.statusCode, errorMessage: this.errorMessage };
  }
}
