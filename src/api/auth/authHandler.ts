import express from 'express';
import EmailService, { VERIFY_TEMPLATE, RESET_TEMPLATE } from '../../util/emailService';
import getDatabase from '../../database';
import * as constants from '../../common/constants';
import * as errorHandler from '../../common/error';

import Logger from '../../common/logger';

const log = Logger.createLogger('auth.authHandler');

const EmailToken = getDatabase().getEmailToken();
const Users = getDatabase().getUsers();
const randomstring = require('randomstring');
const sha256 = require('sha256');


export default class AuthHandler {
  static getPassportSession = (req: express.Request) => {
    const result = (req.session && req.session.passport) ? req.session.passport.user : undefined;
    return result;
  };

  static verifyRegisterHandler = async (req: express.Request, res: express.Response) => {
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
        throw new errorHandler.CustomError(errorHandler.STATUS_CODE.failedToVerify);
      }
      res.send({ statusCode: '0' });
    } catch (error) {
      if (error instanceof errorHandler.CustomError) {
        res.send(error.getData());
      } else {
        log.error(error);
        res.send({ statusCode: '500', errorMessage: errorHandler.CustomError.MESSAGE['500'] });
      }
    }
  };

  static validateCheck(password?: string, phonenumber?: string, email?: string) {
    if (!(password
      && (/^[a-zA-Z0-9]*$/.test(password) && password.length >= 8 && password.length < 100))) {
      throw new errorHandler.CustomError(errorHandler.STATUS_CODE.invalidPassword);
    }

    if (!(phonenumber && /^[0-9]*$/.test(phonenumber))) {
      throw new errorHandler.CustomError(errorHandler.STATUS_CODE.invalidPhonenumber);
    }

    if (!(email
      && /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i.test(email))) {
      throw new errorHandler.CustomError(errorHandler.STATUS_CODE.invalidEmail);
    }
  }

  static registerHandler = async (req: express.Request, res: express.Response) => {
    const {
      email, name, phonenumber, password,
    } = req.body;

    const passportUser = AuthHandler.getPassportSession(req);
    const passportEmail = (passportUser) ? passportUser.email : undefined;

    try {
      if (
        // OAuth
        !(passportEmail && name && phonenumber)
        // local
        && !(email && name && phonenumber && password)
      ) {
        throw new errorHandler.CustomError(errorHandler.STATUS_CODE.invalidParams);
      }
      AuthHandler.validateCheck(password, phonenumber, email);

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
        });
        // send email for verifying
        EmailService.send(
          [email],
          constants.ADMIN_EMAIL,
          VERIFY_TEMPLATE.html.replace('{token}', token).replace('{email}', email),
          VERIFY_TEMPLATE.subject,
        );
      }
      res.send({ statusCode: '0' });
    } catch (error) {
      if (error instanceof errorHandler.CustomError) {
        res.send(error.getData());
      } else {
        log.error(error);
        res.send({ statusCode: '500', errorMessage: errorHandler.CustomError.MESSAGE['500'] });
      }
    }
  };

  static withdrawHandler = async (req: express.Request, res: express.Response) => {
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
      res.send({ statusCode: '0' });
    } catch (error) {
      if (error instanceof errorHandler.CustomError) {
        res.send(error.getData());
      } else {
        log.error(error);
        res.send({ statusCode: '500', errorMessage: errorHandler.CustomError.MESSAGE['500'] });
      }
    }
  };

  static verifyResetPwdHandler = async (req: express.Request, res: express.Response) => {
    const { password } = req.body;

    try {
      AuthHandler.validateCheck(password);

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
      res.send({ statusCode: '0' });
    } catch (error) {
      if (error instanceof errorHandler.CustomError) {
        res.send(error.getData());
      } else {
        log.error(error);
        res.send({ statusCode: '500', errorMessage: errorHandler.CustomError.MESSAGE['500'] });
      }
    }
  };

  static resetPwdHandler = async (req: express.Request, res: express.Response) => {
    const {
      email,
    } = req.body;
    try {
      const result = await Users.findOne({ where: { email } });
      if (!result || !result.password) {
        throw new errorHandler.CustomError(errorHandler.STATUS_CODE.invalidEmail);
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
      res.send({ statusCode: '0' });
    } catch (error) {
      if (error instanceof errorHandler.CustomError) {
        res.send(error.getData());
      } else {
        log.error(error);
        res.send({ statusCode: '500', errorMessage: errorHandler.CustomError.MESSAGE['500'] });
      }
    }
  };
}
