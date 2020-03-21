import sgMail from '@sendgrid/mail';
import * as constants from '../common/constants';

sgMail.setApiKey(constants.SENDGRID_API_KEY);
export const VERIFY_TEMPLATE = {
  html: `http://${constants.DOMAIN}/auth/verify?email={email}&token={token}`,
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
   <form action="http://localhost/auth/resetPwd?email={email}&token={token}" name="temp" method="post">
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

export default class EmailServise {
  static send(msg: any) {
    sgMail.send(msg);
  }
}
