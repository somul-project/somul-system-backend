import AWS from 'aws-sdk';
import * as constants from '../common/constants';
import * as emailTemplate from './emailTemplate';

AWS.config.update({
  region: constants.AWS_REGION,
  accessKeyId: constants.AWS_ACCESS_KEY_ID,
  secretAccessKey: constants.AWS_SECRET_ACCESS_KEY,
});


const ses = new AWS.SES();

export const VERIFY_TEMPLATE = {
  html: emailTemplate.verifyEmail,
  subject: '[5월 소프트웨어에 물들다] 가입 인증 메일',
};

export const RESET_TEMPLATE = {
  html: emailTemplate.pwdReset,
  subject: '[5월 소프트웨어에 물들다] 비밀번호 재설정 메일',
};

export default class EmailService {
  static send(to: string[], from: string, html: string, subject: string) {
    const params = {
      Destination: {
        ToAddresses: to,
      },
      Message: {
        Body: {
          Html: {
            Data: html,
            Charset: 'utf-8',
          },
        },
        Subject: {
          Data: subject,
          Charset: 'utf-8',
        },
      },
      Source: from,
      ReplyToAddresses: [from],
    };
    return new Promise<boolean>((resolve, reject) => {
      ses.sendEmail(params, (err, data) => {
        if (err) {
          reject(new Error('[-] failed to send'));
          return;
        }
        resolve(true);
      });
    });
  }
}
