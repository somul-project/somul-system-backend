import express from 'express';
import EmailService, { VERIFY_TEMPLATE, RESET_TEMPLATE } from '../../util/emailService';
import getDatabase from '../../database';
import * as constants from '../../common/constants';

const EmailToken = getDatabase().getEmailToken();
const Users = getDatabase().getUsers();
const randomstring = require('randomstring');
const sha256 = require('sha256');


export class PassportUtil {
  static getPassportSession = (req: express.Request) => {
    const result = (req.session && req.session.passport) ? req.session.passport.user : undefined;
    return result;
  };
}

export const verifyRegisterHandler = async (req: express.Request, res: express.Response) => {
  try {
    const { email, token } = req.query;
    const result = await EmailToken.findOne({ where: { email, token } });
    if (result) {
      await EmailToken.destroy({
        where: { email },
      });
      await Users.update({
        verify_email: true,
      }, {
        where: { email: result.email },
      });
    } else {
      throw constants.ERROR.CODE.failedToVerify;
    }
    res.send({ result: 0 });
  } catch (error) {
    const errorCode = (constants.ERROR.MESSAGE[error]) ? error : 500;
    res.send({ result: -1, errorCode, errorMessage: constants.ERROR.MESSAGE[errorCode] });
  }
};

export const registerHandler = async (req: express.Request, res: express.Response) => {
  const {
    email, name, phonenumber, password,
  } = req.body;

  const passportUser = PassportUtil.getPassportSession(req);
  const passportEmail = (passportUser) ? passportUser.email : undefined;
  // validation check
  // @TODO check email, phonenumber, password naming rule.

  try {
    if (
      // OAuth
      !(passportEmail && name && phonenumber)
      // local
      && !(email && name && phonenumber && password)
    ) {
      throw constants.ERROR.CODE.invalidParams;
    }
    const updateDate = {
      email: (!passportEmail) ? email : passportEmail,
      name,
      phonenumber,
      verify_email: !!passportEmail,
      password: (!passportEmail) ? sha256(password) : undefined,
      admin: false,
    };
    const result = await Users.findOne({ where: { email: updateDate.email } });
    if (result) {
      throw constants.ERROR.CODE.alreadyRegistered;
    }
    await Users.create(updateDate);
    // local register
    if (!passportEmail) {
      const token = randomstring.generate();
      await EmailToken.create({
        email,
        token,
      });
      // send email for verifying
      EmailService.send(
        [email],
        constants.ADMIN_EMAIL,
        VERIFY_TEMPLATE.html.replace('{token}', token).replace('{email}', email),
        VERIFY_TEMPLATE.subject,
      );
    }
    res.send({ result: 0 });
  } catch (error) {
    const errorCode = (constants.ERROR.MESSAGE[error]) ? error : 500;
    res.send({ result: -1, errorCode, errorMessage: constants.ERROR.MESSAGE[errorCode] });
  }
};

export const secessionHandler = async (req: express.Request, res: express.Response) => {
  const passportUser = PassportUtil.getPassportSession(req);
  const passportEmail = (passportUser) ? passportUser.email : undefined;
  try {
    if (passportEmail) {
      await Users.destroy({
        where: { email: passportEmail },
      });
    } else {
      throw constants.ERROR.CODE.notPermission;
    }
    req.logout();
    res.send({ result: 0 });
  } catch (error) {
    const errorCode = (constants.ERROR.MESSAGE[error]) ? error : 500;
    res.send({ result: -1, errorCode, errorMessage: constants.ERROR.MESSAGE[errorCode] });
  }
};

export const verifyResetPwdHandler = async (req: express.Request, res: express.Response) => {
  const { password } = req.body;

  try {
    // @TODO add password rule
    if (
      !(password)
    ) {
      throw constants.ERROR.CODE.invalidParams;
    }
    const result = await EmailToken.findOne({ where: { ...req.query } });
    if (result) {
      await EmailToken.destroy({
        where: { email: result.email },
      });
    } else {
      throw constants.ERROR.CODE.failedToVerify;
    }
    await Users.update({
      password: sha256(password),
    }, {
      where: { email: result.email },
    });
    res.send({ result: 0 });
  } catch (error) {
    const errorCode = (constants.ERROR.MESSAGE[error]) ? error : 500;
    res.send({ result: -1, errorCode, errorMessage: constants.ERROR.MESSAGE[errorCode] });
  }
};

export const resetPwdHandler = async (req: express.Request, res: express.Response) => {
  const {
    email,
  } = req.body;
  try {
    const result = await Users.findOne({ where: { email } });
    if (!result || !result.password) {
      throw constants.ERROR.CODE.invalidEmail;
    }
    const token = randomstring.generate();
    await EmailToken.create({
      email,
      token,
    });
    EmailService.send(
      [email],
      constants.ADMIN_EMAIL,
      RESET_TEMPLATE.html.replace('{token}', token).replace('{email}', email),
      RESET_TEMPLATE.subject,
    );
    res.send({ result: 0 });
  } catch (error) {
    res.send({ result: -1, errorCode: 103, errorMessage: constants.ERROR.MESSAGE[103] });
  }
};
