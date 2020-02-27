import * as express from "express";
import * as sendgrid from "../common/sendgrid";

const router = express.Router();

router.post('/send', async (req, res) => {
  try {
    if (!req.session!.passport.user!["admin"]) {
      throw "not admin";
    }
    const info = req.body;
    const PromiseList = [];
    for (let from of info.email_list) {
      const msg = {
        to: "admin@example.com",
        from,
        subject: info.subject,
        text: info.text,
        html: info.html
      }
      PromiseList.push(sendgrid.send(msg));
    }
    const result = await Promise.all(PromiseList);
    res.send({result})
  } catch (error) {
    res.send({error})
  }
});

router.post('/request_verify', async (req, res) => {
  try {

    // local + 이메일 인증을 안한 유저만
    // random string, send time db에 기록
    // 전송 
    const result = await sendgrid.send({
      to: "admin@example.com",
      from: "user email",
      subject: "info.subject",
      text: "link",
      html: "info.html"
    })
    res.send({result})
  } catch (error) {
    res.send({error})
  }
});

router.post('/check_verify', async (req, res) => {
  try {
    // db 체크
    // 성공시 db에 반영
    res.send({result: 0})
  } catch (error) {
    res.send({error})
  }
});

module.exports = router;
