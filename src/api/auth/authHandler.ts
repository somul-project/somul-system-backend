import express from 'express';
import { Mutex } from 'async-mutex';
import googlePassport from 'passport-google-oauth20';
import githubPassport from 'passport-github';
import EmailService, { VERIFY_TEMPLATE, RESET_TEMPLATE } from '../../util/emailService';
import Slack from '../../util/slack';
import getDatabase from '../../database';
import * as constants from '../../common/constants';
import * as errorHandler from '../../common/error';
import Logger from '../../common/logger';

const db = getDatabase().getInstance();
const resendMutex = new Mutex();
const passwordMutex = new Mutex();

const log = Logger.createLogger('auth.authHandler');
const EmailToken = getDatabase().getEmailToken();
const Users = getDatabase().getUsers();
const randomstring = require('randomstring');
const sha256 = require('sha256');

const SCHEDULE_TEMPLATE = {
  create: 'CREATE EVENT {eventName} ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL {days} DAY DO {query}',
  delete: 'DROP EVENT {eventName};',
};

export default class AuthHandler {
  static getPassportSession = (req: express.Request) => {
    const result = (req.session && req.session.passport) ? req.session.passport.user : undefined;
    return result;
  };

  static getSession = (req: express.Request) => {
    const result = (req.session) ? req.session : undefined;
    return result;
  };

  static localLogin = async (
    req: express.Request, email: string, password: string, done: any) => {
    try {
      const userInfo = await Users.findOne({
        attributes: ['email', 'admin', 'name', 'phonenumber', 'verify_email'],
        where: { email, password: sha256(password) },
      });
      if (!userInfo) {
        throw new errorHandler.CustomError(errorHandler.STATUS_CODE.notRegistered);
      } else if (!userInfo.verify_email) {
        throw new errorHandler.CustomError(errorHandler.STATUS_CODE.notVerifyEmail);
      }
      const {
        admin, name, phonenumber, verify_email,
      } = userInfo;
      return done(null, {
        email, admin, name, phonenumber, verify_email, local: true, statusCode: '0',
      });
    } catch (error) {
      if (error instanceof errorHandler.CustomError) {
        return done(null, error.getData());
      }
      return done(null, { statusCode: '500', errorMessage: errorHandler.CustomError.MESSAGE['500'] });
    }
  }

  static googleLogin = async (
    accessToken: string, refreshToken: string,
    profile: googlePassport.Profile, cb: any) => {
    const email = profile.emails![0].value;
    try {
      const userInfo = await Users.findOne({
        attributes: ['email', 'admin', 'name', 'phonenumber', 'verify_email'],
        where: { email },
      });
      if (!userInfo) {
        return cb(undefined, { email });
      }
      const {
        admin, name, phonenumber, verify_email,
      } = userInfo;
      return cb(undefined, {
        email, admin, name, phonenumber, verify_email, statusCode: errorHandler.STATUS_CODE.success,
      });
    } catch (error) {
      return cb(undefined, {});
    }
  }

  static githubLogin = async (
    accessToken: string, refreshToken: string,
    profile: githubPassport.Profile, cb: any) => {
    const email = profile.emails![0].value;
    try {
      const userInfo = await Users.findOne({
        attributes: ['email', 'admin', 'name', 'phonenumber', 'verify_email'],
        where: { email },
      });
      if (!userInfo) {
        return cb(undefined, { email });
      }
      const {
        admin, name, phonenumber, verify_email,
      } = userInfo;
      return cb(undefined, {
        email, admin, name, phonenumber, verify_email,
      });
    } catch (error) {
      return cb(undefined, {});
    }
  }

  static register = async (req: express.Request, res: express.Response) => {
    const {
      email, name, phonenumber, password,
    } = req.body;
    const passportUser = AuthHandler.getPassportSession(req);
    const passportEmail = (passportUser) ? passportUser.email : undefined;

    try {
      if (passportEmail) {
        AuthHandler.validateCheck(undefined, String(phonenumber), String(passportEmail));
      } else {
        AuthHandler.validateCheck(String(password), String(phonenumber), String(email));
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
        throw new errorHandler.CustomError(errorHandler.STATUS_CODE.alreadyRegistered);
      }
      await Users.create(updateDate);
      // local register
      if (!passportEmail) {
        const token = randomstring.generate();
        await EmailToken.create({
          email,
          token,
          send_count: 1,
        });
        // send email for verifying
        await EmailService.send(
          [email],
          constants.ADMIN_EMAIL,
          VERIFY_TEMPLATE.html.replace('{token}', token).replace('{email}', email),
          VERIFY_TEMPLATE.subject,
        );
        const query = SCHEDULE_TEMPLATE.create
          .replace('{eventName}', `${email.replace('@', '_').replace('.', '_')}`)
          .replace('{days}', '2')
          .replace('{query}', `DELETE FROM Users WHERE (email = "${email}");`);
        await db.query(query);
      }
      if (req.session) {
        req.session.register = true;
        req.session.email = email;
      }

      res.send({ statusCode: '0' });
      // for resending token request
      if (req.session) {
        req.session.register = true;
        req.session.email = email;
      }
      res.send({ statusCode: errorHandler.STATUS_CODE.success });
    } catch (error) {
      if (error instanceof errorHandler.CustomError) {
        res.send(error.getData());
      } else {
        log.error(error);
        await Slack.send('error', error);
        res.send({ statusCode: '500', errorMessage: errorHandler.CustomError.MESSAGE['500'] });
      }
    }
  };

  static verifyLocalLogin = (req: express.Request, res: express.Response) => {
    const session = AuthHandler.getPassportSession(req);

    if (session.statusCode !== errorHandler.STATUS_CODE.success) {
      res.send({ statusCode: session.statusCode, errorMessage: session.errorMessage });
      return;
    }
    res.send({ statusCode: errorHandler.STATUS_CODE.success });
  }

  static verifyOauthLogin = (req: express.Request, res: express.Response) => {
    const session = AuthHandler.getPassportSession(req);
    if (session && session.statusCode !== errorHandler.STATUS_CODE.success) {
      // notVerifyEmail
      res.redirect(`${constants.CLIENT_DOMAIN}/signUp?email=${req.session!.passport.user.email}`);
    } else if (session) {
      res.redirect(`${constants.CLIENT_DOMAIN}?statusCode=${session.statusCode}`);
    }
  }

  static logout = (req: express.Request, res: express.Response) => {
    const passportUser = AuthHandler.getPassportSession(req);
    if (passportUser) {
      req.logout();
      res.send({ statusCode: errorHandler.STATUS_CODE.success });
      return;
    }
    res.send({ statusCode: errorHandler.STATUS_CODE.insufficientPermission });
  }

  static verifyRegister = async (req: express.Request, res: express.Response) => {
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
        const query = SCHEDULE_TEMPLATE.delete
          .replace('{eventName}', `${email.replace('@', '_').replace('.', '_')}`);
        await db.query(query);
      } else {
        throw new errorHandler.CustomError(errorHandler.STATUS_CODE.failedToVerify);
      }
      res.redirect(`${constants.CLIENT_DOMAIN}?statusCode=0`);
    } catch (error) {
      if (error instanceof errorHandler.CustomError) {
        const errorInfo = error.getData();
        res.redirect(`${constants.CLIENT_DOMAIN}?statusCode=${errorInfo.statusCode}`);
      } else {
        log.error(error);
        await Slack.send('error', error);
        res.redirect(`${constants.CLIENT_DOMAIN}?statusCode=500`);
      }
    }
  };

  static validateCheck(password?: string, phonenumber?: string, email?: string) {
    if (password && !(password
      && (/^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*[A-Za-z!@#$%^&+=_]).{8,15}$/.test(password)))) {
      throw new errorHandler.CustomError(errorHandler.STATUS_CODE.invalidPassword);
    }

    if (phonenumber && !(phonenumber && /^[0-9]*$/.test(phonenumber))) {
      throw new errorHandler.CustomError(errorHandler.STATUS_CODE.invalidPhonenumber);
    }
    if (email && !(email
      && /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i.test(email))) {
      throw new errorHandler.CustomError(errorHandler.STATUS_CODE.invalidEmail);
    }
  }

  static sendToken = async (req: express.Request, res: express.Response) => {
    const session = AuthHandler.getSession(req);
    if (session && session.register) {
      try {
        const { email } = session;
        const result = await EmailToken.findOne({ where: { email } });
        if (!result) {
          throw new errorHandler.CustomError(errorHandler.STATUS_CODE.tokenNotExist);
        }
        const release = await resendMutex.acquire();
        if (result.send_count + 1 > constants.LIMIT_SEND_COUNT) {
          throw new errorHandler.CustomError(errorHandler.STATUS_CODE.sendLimitExceeded);
        }
        await EmailToken.update({
          count: result.send_count + 1,
        }, {
          where: { email: result.email },
        });
        release();

        await EmailService.send(
          [email],
          constants.ADMIN_EMAIL,
          VERIFY_TEMPLATE.html.replace('{token}', result.token).replace('{email}', email),
          VERIFY_TEMPLATE.subject,
        );
        res.send({ statusCode: errorHandler.STATUS_CODE.success });
      } catch (error) {
        if (error instanceof errorHandler.CustomError) {
          res.send(error.getData());
        } else {
          log.error(error);
          await Slack.send('error', error);
          res.send({ statusCode: '500', errorMessage: errorHandler.CustomError.MESSAGE['500'] });
        }
      }
    } else {
      const statusCode = errorHandler.STATUS_CODE.insufficientPermission;
      res.send({ statusCode, errorMessage: errorHandler.CustomError.MESSAGE[statusCode] });
    }
  }

  static withdraw = async (req: express.Request, res: express.Response) => {
    const passportUser = AuthHandler.getPassportSession(req);
    const passportEmail = (passportUser) ? passportUser.email : undefined;
    try {
      if (passportEmail) {
        await Users.destroy({
          where: { email: passportEmail },
        });
      } else {
        throw new errorHandler.CustomError(errorHandler.STATUS_CODE.insufficientPermission);
      }
      req.logout();
      res.send({ statusCode: errorHandler.STATUS_CODE.success });
    } catch (error) {
      if (error instanceof errorHandler.CustomError) {
        res.send(error.getData());
      } else {
        log.error(error);
        await Slack.send('error', error);
        res.send({ statusCode: '500', errorMessage: errorHandler.CustomError.MESSAGE['500'] });
      }
    }
  };

  static verifyResetPwd = async (req: express.Request, res: express.Response) => {
    const { password } = req.body;

    try {
      AuthHandler.validateCheck(String(password));

      const result = await EmailToken.findOne({ where: { ...req.query } });
      if (result) {
        await EmailToken.destroy({
          where: { email: result.email },
        });
      } else {
        throw new errorHandler.CustomError(errorHandler.STATUS_CODE.failedToVerify);
      }
      await Users.update({
        password: sha256(password),
      }, {
        where: { email: result.email },
      });
      const query = SCHEDULE_TEMPLATE.delete
        .replace('{eventName}', `${result.email.replace('@', '_').replace('.', '_')}_token`);
      await db.query(query);
      res.redirect(`${constants.CLIENT_DOMAIN}?statusCode=0`);
    } catch (error) {
      if (error instanceof errorHandler.CustomError) {
        res.redirect(`${constants.CLIENT_DOMAIN}?statusCode=${error.getData().statusCode}`);
      } else {
        log.error(error);
        await Slack.send('error', error);
        res.redirect(`${constants.CLIENT_DOMAIN}?statusCode=500`);
      }
    }
  };

  static resetPwd = async (req: express.Request, res: express.Response) => {
    const {
      email,
      newPassword,
    } = req.body;
    try {
      if (newPassword) {
        const passportUser = AuthHandler.getPassportSession(req);
        const passportEmail = (passportUser) ? passportUser.email : undefined;
        AuthHandler.validateCheck(String(newPassword));
        if (!passportUser || !passportUser.local) {
          throw new errorHandler.CustomError(errorHandler.STATUS_CODE.insufficientPermission);
        }
        await Users.update({
          password: sha256(newPassword),
        }, {
          where: { email: passportEmail },
        });
        req.logout();
        res.send({ statusCode: errorHandler.STATUS_CODE.success });
        return;
      }

      const result = await Users.findOne({ where: { email } });
      if (!result || !result.password) {
        throw new errorHandler.CustomError(errorHandler.STATUS_CODE.invalidParams);
      }
      const tokenResult = await EmailToken.findOne({ where: { email } });
      let token;
      const release = await passwordMutex.acquire();
      if (tokenResult) {
        if (tokenResult.send_count + 1 > constants.LIMIT_SEND_COUNT) {
          throw new errorHandler.CustomError(errorHandler.STATUS_CODE.sendLimitExceeded);
        }
        await EmailToken.update({
          EmailToken: tokenResult.send_count + 1,
        }, {
          where: { email: result.email },
        });
        token = tokenResult.token;
      } else {
        token = randomstring.generate();
        await EmailToken.create({
          email,
          token,
          send_count: 1,
        });
      }
      release();

      EmailService.send(
        [email],
        constants.ADMIN_EMAIL,
        RESET_TEMPLATE.html.replace('{token}', token).replace('{email}', email),
        RESET_TEMPLATE.subject,
      );
      const query = SCHEDULE_TEMPLATE.create
        .replace('{eventName}', `${email.replace('@', '_').replace('.', '_')}_token`)
        .replace('{days}', '2')
        .replace('{query}', `DELETE FROM Email_Token WHERE (email = "${email}");`);
      await db.query(query);
      res.send({ statusCode: errorHandler.STATUS_CODE.success });
    } catch (error) {
      if (error instanceof errorHandler.CustomError) {
        res.send(error.getData());
      } else {
        log.error(error);
        await Slack.send('error', error);
        res.send({ statusCode: '500', errorMessage: errorHandler.CustomError.MESSAGE['500'] });
      }
    }
  };
}
