import sinon from 'sinon';
import * as userHandler from '../../api/graphql/resolver_handler/User';
import getDatabase from '../../database';
import * as errorHandler from '../../common/error';

const database = getDatabase(true);

const userDatas = [
  {
    name: 'donghyeon',
    email: 'test@gmail.com',
  },
  {
    name: 'donghyeon2',
    email: 'test2@gmail.com',
  },
];

describe('resolver_handler [Users]', () => {
  beforeEach(() => {
    sinon.stub(database.getUsers(), 'findOne' as any)
      .callsFake(async (args: {where: {email: string}}) => {
        if (args.where.email === 'test@gmail.com') {
          return { name: 'donghyeon' };
        }
        return undefined;
      });

    sinon.stub(database.getUsers(), 'findAll' as any)
      .callsFake(async (
        args: {where: {email?: string}}) => {
        const result: Object[] = [];
        await userDatas.forEach((userData) => {
          if (
            !args.where.email
              || args.where.email === userData.email) {
            result.push(userData);
          }
        });
        return result;
      });
    sinon.stub(database.getUsers(), 'update' as any)
      .resolves(0);

    sinon.stub(database.getUsers(), 'destroy' as any)
      .resolves(0);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('is the case when data exists <queryUser>', async () => {
    const result = await userHandler.queryUser('test@gmail.com');
    expect({ name: 'donghyeon' }).toEqual(result);
  });

  it('is the case when data not exists <queryUser>', async () => {
    const result = await userHandler.queryUser('test2@gmail.com');
    expect({}).toEqual(result);
  });

  it('is the case when data exists <queryUsers>', async () => {
    const result = await userHandler.queryUsers({ email: 'test@gmail.com' }, {});
    expect([{ name: 'donghyeon', email: 'test@gmail.com' }]).toEqual(result);
  });

  it('is the case when user have permission <updateUser>', async () => {
    const context = { request: { session: { passport: { user: { email: 'test@gmail.com' } } } } };
    const result = await userHandler.updateUser({}, { email: 'test@gmail.com' }, context);
    expect({ statusCode: '0' }).toEqual(result);
  });

  it('is the case when user do not have permission <updateUser>', async () => {
    const context = { request: { session: { passport: { user: { email: 'test@gmail.com' } } } } };
    const result = await userHandler.updateUser({}, { email: 'test3@gmail.com' }, context);
    expect({ statusCode: '104', errorMessage: errorHandler.CustomError.MESSAGE['104'] }).toEqual(result);
  });

  it('is the case when admin makes a request <deleteUser>', async () => {
    const context = { request: { session: { passport: { user: { admin: true } } } } };
    const result = await userHandler.deleteUser({ email: 'test@gmail.com' }, context);
    expect({ statusCode: '0' }).toEqual(result);
  });

  it('is the case when  user who is not admin makes a request <deleteUser>', async () => {
    const context = { request: { session: { passport: { user: { email: 'test@gmail.com' } } } } };
    const result = await userHandler.deleteUser({ email: 'test3@gmail.com' }, context);
    expect({ statusCode: '104', errorMessage: errorHandler.CustomError.MESSAGE['104'] }).toEqual(result);
  });
});
