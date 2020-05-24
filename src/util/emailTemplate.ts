import * as constants from '../common/constants';

export const verifyEmail = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN""http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>소물 가입 인증 메일</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  </head>
  <body style="margin: 0; padding: 0;">
    <table bgcolor="#f8f8f9" style="letter-spacing: -1px" width="100%">
    <tbody style="font-family: NanumGothic,Malgun Gothic,,'Apple SD Gothic Neo',Sans-serif; !important;">
    <tr>
      <td align="center">
          <div style="max-width:595px;margin:0 auto">
              <table cellpadding="0" cellspacing="0"
                    style="width:100%;margin:0 auto;background-color:#fff;text-align:left">
                  <tbody>
                  <tr>
                      <td colspan="3" height="30"></td>
                  </tr>
                  <tr>
                      <td width="21"></td>
                      <td>
                          <table cellpadding="0" cellspacing="0" style="width:100%;margin:0;padding:0">
                              <tbody>
                              <tr>
                                  <td height="11"></td>
                              </tr>
                              </tbody>
                          </table>
                      </td>
                  </tr>
                  <tr>
                      <td width="21"></td>
                      <td>
                          <table cellpadding="0" cellspacing="0" style="width:100%;margin:0;padding:0;">
                              <tbody>
                              <tr>
                                  <td style="font-size:24px;font-weight:500;color:#424240;line-height:34px;vertical-align:top">
                                      <span style="">5월, 소프트웨어에 물들다</span><br/>
                                      <span style="color:#45a4f6">가입 인증 메일</span>입니다.
                                  </td>
                              </tr>
                              <tr>
                                  <td height="22"></td>
                              </tr>
                              </tbody>
                          </table>
                      </td>
                      <td width="21"></td>
                  </tr>
                  <tr>
                      <td colspan="3" height="1" style="background:#e5e5e5"></td>
                  </tr>
                  <tr>
                      <td colspan="3" height="26"></td>
                  </tr>

                  <tr>
                      <td rowspan="1" width="21"></td>
                      <td>
                          <table cellpadding="0" cellspacing="0"
                                style="width:100%;margin:0;padding:0; font-size: 18px; font-weight: 300;line-height: 1.8">
                              <tbody>
                              <tr>
                                  <td style="vertical-align:top">
                                      <p>
                                          안녕하세요. {name}님<br/>
                                          <span style="display: inline-block;line-height: 0;padding-bottom: 0.5em;background-color: rgba(245,80,61, 0.4); font-weight: bold">
                                              이메일 인증하기
                                          </span>
                                          버튼을 눌러 가입을 완료해주세요.<br/><br/>

                                          입력한 이메일 : {email}
                                      </p>
                                  </td>
                              </tr>
                              <tr>
                                  <td height="20"></td>
                              </tr>
                              </tbody>
                          </table>
                      </td>
                      <td rowspan="1" width="21"></td>
                  </tr>

                  <tr>
                      <td colspan="3" align="center">
                          <div style="display:inline-block;width:278px;max-width:100%;vertical-align:top">
                              <table style="table-layout:fixed;width:100%;background:#f5503d" border="0"
                                    cellpadding="0" cellspacing="0">
                                  <tbody>
                                  <tr>
                                      <td height="56" style="text-align:center">
                                          <a href="${constants.SERVER_DOMAIN}/auth/verify/register?email={email}&token={token}"
                                            style="display:block;height:56px;font-size:18px;color:#fff;text-decoration:none;line-height:56px;"
                                            target="_blank">
                                              이메일 인증하기
                                          </a>
                                      </td>
                                  </tr>
                                  </tbody>
                              </table>
                          </div>
                      </td>
                  </tr>
                  <tr>
                      <td colspan="3" height="40"></td>
                  </tr>


                  <tr>
                      <td colspan="3"
                          style="padding-top:26px;padding-left:21px;padding-right:21px;padding-bottom:13px;background:#e5e5e5;font-size:12px;color:#696969;line-height:17px">
                          <strong>5월, 소프트웨어에 물들다.</strong>
                      </td>
                  </tr>
                  <tr>
                      <td colspan="3"
                          style="padding-left:21px;padding-right:21px;padding-bottom:57px;background:#e5e5e5;font-size:12px;color:#696969;line-height:17px">
                          <a href="https://www.somul.kr" style="padding-right:10px;color:#696969;text-decoration:none"
                            target="_blank">
                              공식 사이트
                          </a> l
                          <a href="https://github.com/somul-project"
                            style="padding:0 10px;color:#696969;text-decoration:none" target="_blank">
                              깃허브
                          </a>
                      </td>
                  </tr>
                  </tbody>
              </table>
          </div>
      </td>
    </tr>
    </tbody>
    </table>
    </body>
  </html>
`;

export const pwdReset = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>비밀번호 재설정 메일</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin: 0; padding: 0;">
<table bgcolor="#f8f8f9" style="letter-spacing: -1px" width="100%">
    <tbody style="font-family: NanumGothic,Malgun Gothic, Apple SD Gothic Neo',Sans-serif; !important;">
    <tr>
        <td align="center">
            <div style="max-width:595px;margin:0 auto">
                <table cellpadding="0" cellspacing="0"
                       style="width:100%;margin:0 auto;background-color:#fff;text-align:left">
                    <tbody>
                    <tr>
                        <td colspan="3" height="30"></td>
                    </tr>
                    <tr>
                        <td width="21"></td>
                        <td>
                            <table cellpadding="0" cellspacing="0" style="width:100%;margin:0;padding:0">
                                <tbody>
                                <tr>
                                    <td style="margin:0;padding:0;">
                                        <a href="https://www.somul.kr" target="_blank">
                                            <img
                                                    src="https://www.somul.kr/logo/logo.svg"
                                                    width="102" height="40" alt="somul"
                                                    style="border:0;margin-right:5px"
                                                    class="CToWUd"/>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="11"></td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td width="21"></td>
                        <td>
                            <table cellpadding="0" cellspacing="0" style="width:100%;margin:0;padding:0;">
                                <tbody>
                                <tr>
                                    <td style="font-size:24px;font-weight:500;color:#636362;line-height:34px;vertical-align:top">
                                        <span style="">5월, 소프트웨어에 물들다</span><br/>
                                        <span style="color:#000000">비밀번호 재설정 메일</span>입니다.
                                    </td>
                                </tr>
                                <tr>
                                    <td height="22"></td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                        <td width="21"></td>
                    </tr>
                    <tr>
                        <td colspan="3" height="1" style="background:#e5e5e5"></td>
                    </tr>
                    <tr>
                        <td colspan="3" height="26"></td>
                    </tr>

                    <tr>
                        <td rowspan="1" width="21"></td>
                        <td>
                            <table cellpadding="0" cellspacing="0"
                                   style="width:100%;margin:0;padding:0; font-size: 18px; font-weight: 300;line-height: 1.8">
                                <tbody>
                                <tr>
                                    <td style="vertical-align:top">
                                        <p>
                                            안녕하세요.<br/>
                                            <span style="display: inline-block;line-height: 0;padding-bottom: 0.5em;background-color: rgb(118,190,252,0.4); font-weight: bold">
                                                아래의 버튼
                                            </span>
                                            을 눌러 비밀번호를 재설정하실 수 있습니다.<br/>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="20"></td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                        <td rowspan="1" width="21"></td>
                    </tr>

                    <tr>
                        <td colspan="3" align="center">
                            <div style="display:inline-block;width:278px;max-width:100%;vertical-align:top">
                                <table style="table-layout:fixed;width:100%;background:#50a6f1" border="0"
                                       cellpadding="0" cellspacing="0">
                                    <tbody>
                                    <tr>
                                        <td height="56" style="text-align:center">
                                            <a href="${constants.CLIENT_DOMAIN}"
                                               style="display:block;height:56px;font-size:18px;color:#fff;text-decoration:none;line-height:56px;"
                                               target="_blank">
                                                비밀번호 재설정하기
                                            </a>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" height="40"></td>
                    </tr>


                    <tr>
                        <td colspan="3"
                            style="padding-top:26px;padding-left:21px;padding-right:21px;padding-bottom:13px;background:#e5e5e5;font-size:12px;color:#696969;line-height:17px">
                            <strong>5월, 소프트웨어에 물들다.</strong>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3"
                            style="padding-left:21px;padding-right:21px;padding-bottom:57px;background:#e5e5e5;font-size:12px;color:#696969;line-height:17px">
                            <a href="https://www.somul.kr" style="padding-right:10px;color:#696969;text-decoration:none"
                               target="_blank">
                                공식 사이트
                            </a> l
                            <a href="https://github.com/somul-project"
                               style="padding:0 10px;color:#696969;text-decoration:none" target="_blank">
                                깃허브
                            </a>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </td>
    </tr>
    </tbody>
</table>
</body>
</html>
`;
