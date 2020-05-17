import sinon from 'sinon';
import * as sessionHandler from '../../api/graphql/resolver_handler/Session';
import getDatabase from '../../database';
import * as errorHandler from '../../common/error';


const database = getDatabase(true);
const db = database.getInstance();
const sessionDatas = [
  {
    id: 1,
    library_id: 1,
    user_email: 'test@gmail.com',
    session_name: 'testSession',
    session_time: '10:30',
    introduce: 'temp',
    session_explainer: 'temp',
    document: 'temp',
    admin_approved: '3',
  },
  {
    id: 2,
    library_id: 1,
    user_email: 'test@gmail.com',
    session_name: 'testSession',
    session_time: '10:30',
    introduce: 'temp',
    session_explainer: 'temp',
    document: 'temp',
    admin_approved: '0',
  },
];

describe('resolver_handler [Session]', () => {
  beforeEach(() => {
    sinon.stub(database.getSession(), 'findOne' as any)
      .callsFake(async (args: {where: {id: number}}) => {
        if (args.where.id === 1) {
          return sessionDatas[0];
        }
        return {};
      });

    sinon.stub(db, 'query' as any)
      .resolves(0);

    sinon.stub(database.getSession(), 'create' as any)
      .resolves(0);

    sinon.stub(database.getSession(), 'update' as any)
      .resolves(0);

    sinon.stub(database.getSession(), 'destroy' as any)
      .resolves(0);

    sinon.stub(database.getSession(), 'findAll' as any)
      .callsFake(async (
        args: {where: {user_email?: string, admin_approved?: string, library_id?: number}}) => {
        const result: Object[] = [];
        await sessionDatas.forEach((sessionData) => {
          if (
            (!args.where.user_email
              || args.where.user_email === sessionData.user_email)
            && (!args.where.admin_approved
              || args.where.admin_approved === sessionData.admin_approved)
            && (!args.where.library_id
              || args.where.library_id === sessionData.library_id)) {
            result.push(sessionData);
          }
        });
        return result;
      });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('is the case when data exists <querySession>', async () => {
    const result = await sessionHandler.querySession(1);
    expect(sessionDatas[0]).toEqual(result);
  });

  it('is the case when data not exists <querySession>', async () => {
    const result = await sessionHandler.querySession(2);
    expect({}).toEqual(result);
  });

  it('is the case when admin makes a request <querySessions>', async () => {
    const context = { request: { session: { passport: { user: { admin: true } } } } };
    const result = await sessionHandler.querySessions({ user_email: 'test@gmail.com' }, context);
    expect(sessionDatas).toEqual(result);
  });

  it('is the case when  user who is not admin makes a request <querySessions>', async () => {
    const context = { request: { session: { passport: { user: { email: 'test@gmail.com' } } } } };
    const result = await sessionHandler.querySessions({ user_email: 'test@gmail.com' }, context);
    expect(sessionDatas).toEqual(result);
  });

  it('is the case when user who is not admin makes a request about Other users <querySessions>', async () => {
    const context = { request: { session: { passport: { user: { email: 'test2@gmail.com' } } } } };
    const result = await sessionHandler.querySessions({ user_email: 'test@gmail.com' }, context);
    expect([sessionDatas[0]]).toEqual(result);
  });

  it('is the case when the session is not full <createSession>', async () => {
    const result = await sessionHandler.createSession({
      library_id: 2,
      user_email: 'test@gmail.com',
      session_name: 'testSession',
      session_time: '10:30',
      introduce: 'temp',
      session_explainer: 'temp',
      document: 'temp',
    });
    expect({ statusCode: '0' }).toEqual(result);
  });

  it('is the case when the session is full <createSession>', async () => {
    const result = await sessionHandler.createSession({
      library_id: 1,
      user_email: 'test@gmail.com',
      session_name: 'testSession',
      session_time: '10:30',
      introduce: 'temp',
      session_explainer: 'temp',
      document: 'temp',
    });
    expect({ statusCode: '106', errorMessage: errorHandler.CustomError.MESSAGE['106'] }).toEqual(result);
  });

  it('is the case when user have permission <updateSession>', async () => {
    const context = { request: { session: { passport: { user: { email: 'test@gmail.com' } } } } };
    const result = await sessionHandler.updateSession({}, { user_email: 'test@gmail.com' }, context);
    expect({ statusCode: '0' }).toEqual(result);
  });

  it('is the case when user do not have permission <updateSession>', async () => {
    const context = { request: { session: { passport: { user: { email: 'test2@gmail.com' } } } } };
    const result = await sessionHandler.updateSession({}, { user_email: 'test@gmail.com' }, context);
    expect({ statusCode: '104', errorMessage: errorHandler.CustomError.MESSAGE['104'] }).toEqual(result);
  });

  it('is the case when user have permission <deleteSession>', async () => {
    const context = { request: { session: { passport: { user: { email: 'test@gmail.com' } } } } };
    const result = await sessionHandler.deleteSession({ user_email: 'test@gmail.com' }, context);
    expect({ statusCode: '0' }).toEqual(result);
  });

  it('is the case when user do not have permission <deleteSession>', async () => {
    const context = { request: { session: { passport: { user: { email: 'test2@gmail.com' } } } } };
    const result = await sessionHandler.deleteSession({ user_email: 'test@gmail.com' }, context);
    expect({ statusCode: '104', errorMessage: errorHandler.CustomError.MESSAGE['104'] }).toEqual(result);
  });
});
