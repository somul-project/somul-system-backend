import AWS from 'aws-sdk';
import * as constants from '../common/constants';

AWS.config.update({
  region: constants.AWS_REGION,
  accessKeyId: constants.AWS_ACCESS_KEY_ID,
  secretAccessKey: constants.AWS_SECRET_ACCESS_KEY,
});


const ses = new AWS.SES();

export const VERIFY_TEMPLATE = {
  html: `${constants.SERVER_DOMAIN}/auth/verify/register?email={email}&token={token}`,
  subject: '이메일 인증!',
};

export const RESET_TEMPLATE = {
  html: `
  <!doctype html>
  <html lang="en">
   <head>
    <meta charset="UTF-8">
    <title>회원 가입</title>
   </head>
   <body>
   <form action="${constants.SERVER_DOMAIN}/auth/verify/reset_password?email={email}&token={token}" name="temp" method="post">
     <table width="940" style="padding:5px 0 5px 0; ">
        <tr height="2" bgcolor="#FFC8C3"><td colspan="2"></td></tr>
           <th>비밀번호</th>
           <td><input type="password" name="password"> 영문/숫자포함 6자 이상</td>
         </tr>
             <tr height="2" bgcolor="#FFC8C3"><td colspan="2"></td></tr>
             <tr>
               <td colspan="2" align="center">
                 <input type="submit" value="회원가입">
                 <input type="reset" value="취소">
              </td>
             </tr>
             </table>
            </td>
            </tr>
            </form>
   </body>
  </html>
  `,
  subject: 'reset',
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
