import express from 'express';
import httpMocks from 'node-mocks-http';
import sinon from 'sinon';
import googlePassport from 'passport-google-oauth20';
import getDatabase from '../database';
import AuthHandler from '../api/auth/authHandler';
import * as errorHandler from '../common/error';
import EmailService from '../util/emailService';

const database = getDatabase(true);
const db = getDatabase().getInstance();

const userData = {
  email: 'test@gmail.com',
  name: 'donghyeon',
  phonenumber: '0100000000',
  password: 'assdasdasd123',
};

const profile: googlePassport.Profile = {
  profileUrl: '',
  _raw: '',
  _json: '',
  provider: '',
  id: '',
  displayName: '',
  emails: [{
    value: userData.email,
  }],
};

describe('auth', () => {
  beforeEach(() => {
    sinon.stub(database.getUsers(), 'update' as any)
      .resolves('0');

    sinon.stub(database.getEmailToken(), 'destroy' as any)
      .resolves('0');

    sinon.stub(database.getUsers(), 'destroy' as any)
      .resolves('0');

    sinon.stub(database.getUsers(), 'create' as any)
      .resolves('0');

    sinon.stub(database.getEmailToken(), 'create' as any)
      .resolves('0');

    sinon.stub(database.getEmailToken(), 'update' as any)
      .resolves('0');

    sinon.stub(EmailService, 'send' as any)
      .returns('0');

    sinon.stub(db, 'query' as any)
      .returns('0');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('is a successful case <register:local>', async () => {
    sinon.stub(database.getEmailToken(), 'findOne' as any)
      .callsFake(async (args: {where: {email: string, token: string}}) => {
        const result = { email: args.where.email };
        return result;
      });
    sinon.stub(database.getUsers(), 'findOne' as any)
      .callsFake(async (_: {where: {email: string}}) => {
        const result = null;
        return result;
      });
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    req.body = userData;

    await AuthHandler.register(req, res);
    expect(res._getData().statusCode).toEqual(errorHandler.STATUS_CODE.success);
  });

  it('is a successful case <register:oauth>', async () => {
    sinon.stub(database.getEmailToken(), 'findOne' as any)
      .callsFake(async (args: {where: {email: string, token: string}}) => {
        const result = { email: args.where.email };
        return result;
      });
    sinon.stub(database.getUsers(), 'findOne' as any)
      .callsFake(async (_: {where: {email: string}}) => {
        const result = null;
        return result;
      });
    sinon.stub(AuthHandler, 'getPassportSession' as any)
      .callsFake((_: express.Request) => {
        const result = { email: userData.email };
        return result;
      });
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    req.body = {
      phonenumber: userData.phonenumber,
      name: userData.name,
    };

    await AuthHandler.register(req, res);
    expect(res._getData().statusCode).toEqual(errorHandler.STATUS_CODE.success);
  });

  it('is the case if an account already exists <register>', async () => {
    sinon.stub(database.getEmailToken(), 'findOne' as any)
      .callsFake(async (args: {where: {email: string, token: string}}) => {
        const result = { email: args.where.email };
        return result;
      });
    sinon.stub(database.getUsers(), 'findOne' as any)
      .callsFake(async (args: {where: {email: string}}) => {
        const result = { email: args.where.email };
        return result;
      });
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    req.body = userData;

    await AuthHandler.register(req, res);
    expect(res._getData().statusCode).toEqual(errorHandler.STATUS_CODE.alreadyRegistered);
  });

  it('is a successful case if user resend <sendToken:local>', async () => {
    sinon.stub(database.getEmailToken(), 'findOne' as any)
      .callsFake(async (args: {where: {email: string, token: string}}) => {
        const result = { email: args.where.email, send_count: 1 };
        return result;
      });
    sinon.stub(AuthHandler, 'getSession' as any)
      .callsFake((_: express.Request) => {
        const result = { email: userData.email, register: true };
        return result;
      });
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    await AuthHandler.sendToken(req, res);
    expect(res._getData().statusCode).toEqual(errorHandler.STATUS_CODE.success);
  });

  it('is the case if user do not register <sendToken:local>', async () => {
    sinon.stub(database.getEmailToken(), 'findOne' as any)
      .callsFake(async (_: {where: {email: string, token: string}}) => {
        const result = null;
        return result;
      });
    sinon.stub(AuthHandler, 'getSession' as any)
      .callsFake((_: express.Request) => {
        const result = { email: userData.email, register: true };
        return result;
      });
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    await AuthHandler.sendToken(req, res);
    expect(res._getData().statusCode).toEqual(errorHandler.STATUS_CODE.tokenNotExist);
  });

  it('is the case if user resend more than 5 times <sendToken:local>', async () => {
    sinon.stub(database.getEmailToken(), 'findOne' as any)
      .callsFake(async (args: {where: {email: string, token: string}}) => {
        const result = { email: args.where.email, send_count: 5 };
        return result;
      });
    sinon.stub(AuthHandler, 'getSession' as any)
      .callsFake((_: express.Request) => {
        const result = { email: userData.email, register: true };
        return result;
      });
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    await AuthHandler.sendToken(req, res);
    expect(res._getData().statusCode).toEqual(errorHandler.STATUS_CODE.sendLimitExceeded);
  });

  it('is a successful case <login:local>', async () => {
    sinon.stub(database.getUsers(), 'findOne' as any)
      .callsFake(async (_: {where: {email: string}}) => {
        const result = { ...userData, verify_email: true };
        return result;
      });
    const req = httpMocks.createRequest();
    const done = (_: any, value: object) => {
      const result = value;
      return result;
    };
    const result = await AuthHandler.localLogin(req, userData.email, userData.password, done);
    expect(result.statusCode).toEqual(errorHandler.STATUS_CODE.success);
  });

  it('is the case if user do not register <login:local>', async () => {
    sinon.stub(database.getUsers(), 'findOne' as any)
      .callsFake(async (_: {where: {email: string}}) => {
        const result = null;
        return result;
      });
    const req = httpMocks.createRequest();
    const done = (_: any, value: object) => {
      const result = value;
      return result;
    };
    const result = await AuthHandler.localLogin(req, userData.email, userData.password, done);
    expect(result.statusCode).toEqual(errorHandler.STATUS_CODE.notRegistered);
  });

  it('is the case if user do not verify token <login:local>', async () => {
    sinon.stub(database.getUsers(), 'findOne' as any)
      .callsFake(async (_: {where: {email: string}}) => {
        const result = { ...userData, verify_email: false };
        return result;
      });
    const req = httpMocks.createRequest();
    const done = (_: any, value: object) => {
      const result = value;
      return result;
    };
    const result = await AuthHandler.localLogin(req, userData.email, userData.password, done);
    expect(result.statusCode).toEqual(errorHandler.STATUS_CODE.emailNotVerified);
  });

  it('is a successful case <login:oauth>', async () => {
    const cb = (_: any, value: object) => {
      const result = value;
      return result;
    };
    sinon.stub(database.getUsers(), 'findOne' as any)
      .callsFake(async (_: {where: {email: string}}) => {
        const result = userData;
        return result;
      });
    const result = await AuthHandler.googleLogin('accessToken', 'refreshToken', profile, cb);
    expect(result.statusCode).toEqual(errorHandler.STATUS_CODE.success);
  });

  it('is the case if user do not register <login:oauth>', async () => {
    const cb = (_: any, value: object) => {
      const result = value;
      return result;
    };
    sinon.stub(database.getUsers(), 'findOne' as any)
      .callsFake(async (_: {where: {email: string}}) => {
        const result = null;
        return result;
      });
    const result = await AuthHandler.googleLogin('accessToken', 'refreshToken', profile, cb);
    expect(result.email).toEqual(userData.email);
  });

  it('is the case if user do not login <logout>', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    sinon.stub(AuthHandler, 'getPassportSession' as any)
      .callsFake((_: express.Request) => {
        const result = null;
        return result;
      });
    await AuthHandler.logout(req, res);
    expect(res._getData().statusCode).toEqual(errorHandler.STATUS_CODE.insufficientPermission);
  });


  it('is the case if user do not login <withdraw>', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    sinon.stub(AuthHandler, 'getPassportSession' as any)
      .callsFake((_: express.Request) => {
        const result = null;
        return result;
      });
    await AuthHandler.withdraw(req, res);
    expect(res._getData().statusCode).toEqual(errorHandler.STATUS_CODE.insufficientPermission);
  });

  it('is the case if user do not login and send newPassword <resetPwd>', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    sinon.stub(AuthHandler, 'getPassportSession' as any)
      .callsFake((_: express.Request) => {
        const result = null;
        return result;
      });
    req.body = {
      email: userData.email,
      newPassword: userData.password,
    };
    await AuthHandler.resetPwd(req, res);
    expect(res._getData().statusCode).toEqual(errorHandler.STATUS_CODE.insufficientPermission);
  });

  it('is the case if there is no password on database(oauth) <resetPwd>', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    sinon.stub(database.getUsers(), 'findOne' as any)
      .callsFake(async (_: {where: {email: string}}) => {
        const result = { email: userData.email };
        return result;
      });
    req.body = {
      email: userData.email,
    };
    await AuthHandler.resetPwd(req, res);
    expect(res._getData().statusCode).toEqual(errorHandler.STATUS_CODE.invalidParams);
  });

  it('is the case if user resend more than 5 times <resetPwd>', async () => {
    sinon.stub(database.getUsers(), 'findOne' as any)
      .callsFake(async (_: {where: {email: string}}) => {
        const result = { email: userData.email, password: userData.password };
        return result;
      });
    sinon.stub(database.getEmailToken(), 'findOne' as any)
      .callsFake(async (args: {where: {email: string, token: string}}) => {
        const result = { email: args.where.email, send_count: 5 };
        return result;
      });
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    req.body = {
      email: userData.email,
    };
    await AuthHandler.resetPwd(req, res);
    expect(res._getData().statusCode).toEqual(errorHandler.STATUS_CODE.sendLimitExceeded);
  });
});
