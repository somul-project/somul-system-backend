import sinon from 'sinon';
import * as libraryHandler from '../../api/graphql/resolver_handler/Library';
import getDatabase from '../../database';
import * as errorHandler from '../../common/error';

const database = getDatabase(true);

const libraryDatas = [
  {
    id: 1,
    name: 'lib',
    admin_approved: '3',
    manager_email: 'test@gmail.com',
  },
  {
    id: 2,
    name: 'lib2',
    admin_approved: '0',
    manager_email: 'test@gmail.com',
  },
];

describe('resolver_handler [Library]', () => {
  beforeEach(() => {
    sinon.stub(database.getLibrary(), 'findOne' as any)
      .callsFake(async (args: {where: {id: number}}) => {
        if (args.where.id === 1) {
          return libraryDatas[0];
        }
        return {};
      });

    sinon.stub(database.getLibrary(), 'create' as any)
      .resolves(0);

    sinon.stub(database.getLibrary(), 'update' as any)
      .resolves(0);

    sinon.stub(database.getLibrary(), 'destroy' as any)
      .resolves(0);

    sinon.stub(database.getLibrary(), 'findAll' as any)
      .callsFake(async (
        args: {where: {manager_email?: string, admin_approved?: string, library_id?: number}}) => {
        const result: Object[] = [];
        await libraryDatas.forEach((libraryData) => {
          if (
            (!args.where.manager_email
              || args.where.manager_email === libraryData.manager_email)
            && (!args.where.admin_approved
              || args.where.admin_approved === libraryData.admin_approved)) {
            result.push(libraryData);
          }
        });
        return result;
      });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('is the case when data exists <queryLibrary>', async () => {
    const result = await libraryHandler.queryLibrary(1);
    expect(libraryDatas[0]).toEqual(result);
  });

  it('is the case when data not exists <queryLibrary>', async () => {
    const result = await libraryHandler.queryLibrary(2);
    expect({}).toEqual(result);
  });

  it('is the case when admin makes a request <queryLibraries>', async () => {
    const context = { request: { session: { passport: { user: { admin: true } } } } };
    const result = await libraryHandler.queryLibraries({ manager_email: 'test@gmail.com' }, context);
    expect(libraryDatas).toEqual(result);
  });

  it('is the case when  user who is not admin makes a request <queryLibraries>', async () => {
    const context = { request: { session: { passport: { user: { email: 'test@gmail.com' } } } } };
    const result = await libraryHandler.queryLibraries({ manager_email: 'test@gmail.com' }, context);
    expect(libraryDatas).toEqual(result);
  });

  it('is the case when user who is not admin makes a request about Other users <queryLibraries>', async () => {
    const context = { request: { session: { passport: { user: { email: 'test2@gmail.com' } } } } };
    const result = await libraryHandler.queryLibraries({ manager_email: 'test@gmail.com' }, context);
    expect([libraryDatas[0]]).toEqual(result);
  });

  it('is the case when user have permission <updateLibrary>', async () => {
    const context = { request: { session: { passport: { user: { email: 'test@gmail.com' } } } } };
    const result = await libraryHandler.updateLibrary({}, { manager_email: 'test@gmail.com' }, context);
    expect({ statusCode: '0' }).toEqual(result);
  });

  it('is the case when user do not have permission <updateLibrary>', async () => {
    const context = { request: { session: { passport: { user: { email: 'test2@gmail.com' } } } } };
    const result = await libraryHandler.updateLibrary({}, { manager_email: 'test@gmail.com' }, context);
    expect({ statusCode: '104', errorMessage: errorHandler.CustomError.MESSAGE['104'] }).toEqual(result);
  });

  it('is the case when user have permission <deleteLibrary>', async () => {
    const context = { request: { session: { passport: { user: { email: 'test@gmail.com' } } } } };
    const result = await libraryHandler.deleteLibrary({ manager_email: 'test@gmail.com' }, context);
    expect({ statusCode: '0' }).toEqual(result);
  });

  it('is the case when user do not have permission <deleteLibrary>', async () => {
    const context = { request: { session: { passport: { user: { email: 'test2@gmail.com' } } } } };
    const result = await libraryHandler.deleteLibrary({ manager_email: 'test@gmail.com' }, context);
    expect({ statusCode: '104', errorMessage: errorHandler.CustomError.MESSAGE['104'] }).toEqual(result);
  });
});
