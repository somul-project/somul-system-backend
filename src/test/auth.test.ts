import httpMocks from 'node-mocks-http';
import sinon from 'sinon';
import getDatabase from '../database';
import AuthHandler from '../api/auth/authHandler';
import * as errorHandler from '../common/error';
import EmailService from '../util/emailService';

const database = getDatabase(true);

describe('auth', () => {
  beforeEach(() => {
    sinon.stub(database.getEmailToken(), 'findOne' as any)
      .callsFake(async (args: {where: {email: string, token: string}}) => {
        if (args.where.email === 'test@gmail.com' && args.where.token === 'testToken') {
          return { email: args.where.email };
        }
        return undefined;
      });

    sinon.stub(database.getUsers(), 'findOne' as any)
      .callsFake(async (args: {where: {email: string}}) => {
        if (args.where.email === 'test@gmail.com') {
          return { email: args.where.email };
        }
        return undefined;
      });

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

    sinon.stub(EmailService, 'send' as any)
      .returns('0');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('is the case if an account already exists <registerHandler>', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    req.body = {
      email: 'test@gmail.com',
      name: 'donghyeon',
      phonenumber: '0100000000',
      password: 'assdasdasd',
    };

    await AuthHandler.registerHandler(req, res);
    expect(res._getData()).toEqual({ statusCode: '102', errorMessage: errorHandler.CustomError.MESSAGE['102'] });
  });

  it('is invalid params(there is no name) <registerHandler>', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    req.body = {
      email: 'test@gmail.com',
      phonenumber: '0100000000',
      password: 'asdsdasdasd',
    };

    await AuthHandler.registerHandler(req, res);
    expect(res._getData()).toEqual({ statusCode: '1', errorMessage: errorHandler.CustomError.MESSAGE['1'] });
  });

  it('is invalid params(password)  <registerHandler>', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    req.body = {
      email: 'test@gmail.com',
      phonenumber: '0100000000',
      password: 'asdd',
      name: 'donghyeon',
    };

    await AuthHandler.registerHandler(req, res);
    expect(res._getData()).toEqual({ statusCode: '108', errorMessage: errorHandler.CustomError.MESSAGE['108'] });
  });

  it('is invalid params[OAuth] <registerHandler>', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    req.body = {
      phonenumber: '0100000000',
    };
    sinon.stub(AuthHandler, 'getPassportSession' as any)
      .returns({
        email: 'test@gmail.com',
      });

    await AuthHandler.registerHandler(req, res);
    expect(res._getData()).toEqual({ statusCode: '1', errorMessage: errorHandler.CustomError.MESSAGE['1'] });
  });

  it('is a successful case <registerHandler>', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    req.body = {
      email: 'test2@gmail.com',
      name: 'donghyeon',
      phonenumber: '0100000000',
      password: 'assdasdasd',
    };

    await AuthHandler.registerHandler(req, res);
    expect(res._getData()).toEqual({ statusCode: '0' });
  });

  it('succeed to find emailToken <verifyRegisterHandler> ', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    req.query = {
      email: 'test@gmail.com',
      token: 'testToken',
    };

    await AuthHandler.verifyRegisterHandler(req, res);
    expect(res._getRedirectUrl()).toEqual('?statusCode=0');
  });

  it('failed to find emailToken <verifyRegisterHandler> ', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    req.query = {
      email: 'notEmail@gmail.com',
      token: 'testToken',
    };

    await AuthHandler.verifyRegisterHandler(req, res);
    expect(res._getRedirectUrl()).toEqual('?statusCode=101');
  });
});
