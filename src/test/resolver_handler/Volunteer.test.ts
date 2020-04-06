import sinon from 'sinon';
import * as volunteerHandler from '../../api/graphql/resolver_handler/Volunteer';
import getDatabase from '../../database';
import * as constants from '../../common/constants';

const database = getDatabase(true);

const volunteerDatas = [
  {
    id: 1,
    library_id: 1,
    user_email: 'test@gmail.com',
    session_name: 'testSession',
    history: 'temp',
    admin_approved: '3',
  },
  {
    id: 2,
    library_id: 1,
    user_email: 'test@gmail.com',
    introduce: 'temp',
    history: 'temp',
    admin_approved: '0',
  },
];

describe('resolver_handler [Volunteer]', () => {
  beforeEach(() => {
    sinon.stub(database.getVolunteer(), 'findOne' as any)
      .callsFake(async (args: {where: {id: number}}) => {
        if (args.where.id === 1) {
          return volunteerDatas[0];
        }
        return {};
      });

    sinon.stub(database.getVolunteer(), 'create' as any)
      .resolves(0);

    sinon.stub(database.getVolunteer(), 'update' as any)
      .resolves(0);

    sinon.stub(database.getVolunteer(), 'destroy' as any)
      .resolves(0);

    sinon.stub(database.getVolunteer(), 'findAll' as any)
      .callsFake(async (
        args: {where: {user_email?: string, admin_approved?: string, library_id?: number}}) => {
        const result: Object[] = [];
        await volunteerDatas.forEach((volunteerData) => {
          if (
            (!args.where.user_email
              || args.where.user_email === volunteerData.user_email)
            && (!args.where.admin_approved
              || args.where.admin_approved === volunteerData.admin_approved)
            && (!args.where.library_id
              || args.where.library_id === volunteerData.library_id)) {
            result.push(volunteerData);
          }
        });
        return result;
      });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('is the case when data exists <queryVolunteer>', async () => {
    const result = await volunteerHandler.queryVolunteer(1);
    expect(volunteerDatas[0]).toEqual(result);
  });

  it('is the case when data not exists <queryVolunteer>', async () => {
    const result = await volunteerHandler.queryVolunteer(2);
    expect({}).toEqual(result);
  });

  it('is the case when admin makes a request <queryVolunteers>', async () => {
    const context = { request: { session: { passport: { user: { admin: true } } } } };
    const result = await volunteerHandler.queryVolunteers({ user_email: 'test@gmail.com' }, context);
    expect(volunteerDatas).toEqual(result);
  });

  it('is the case when  user who is not admin makes a request <queryVolunteers>', async () => {
    const context = { request: { session: { passport: { user: { email: 'test@gmail.com' } } } } };
    const result = await volunteerHandler.queryVolunteers({ user_email: 'test@gmail.com' }, context);
    expect(volunteerDatas).toEqual(result);
  });

  it('is the case when user who is not admin makes a request about Other users <queryVolunteers>', async () => {
    const context = { request: { session: { passport: { user: { email: 'test2@gmail.com' } } } } };
    const result = await volunteerHandler.queryVolunteers({ user_email: 'test@gmail.com' }, context);
    expect([volunteerDatas[0]]).toEqual(result);
  });

  it('is the case when the session is not full <createVolunteer>', async () => {
    const result = await volunteerHandler.createVolunteer({
      library_id: 2,
      user_email: 'test@gmail.com',
      introduce: 'temp',
      history: 'temp',
    });
    expect({ statusCode: '0' }).toEqual(result);
  });

  it('is the case when user have permission <updateVolunteer>', async () => {
    const context = { request: { session: { passport: { user: { email: 'test@gmail.com' } } } } };
    const result = await volunteerHandler.updateVolunteer({}, { user_email: 'test@gmail.com' }, context);
    expect({ statusCode: '0' }).toEqual(result);
  });

  it('is the case when user do not have permission <updateVolunteer>', async () => {
    const context = { request: { session: { passport: { user: { email: 'test2@gmail.com' } } } } };
    const result = await volunteerHandler.updateVolunteer({}, { user_email: 'test@gmail.com' }, context);
    expect({ statusCode: '104', errorMessage: constants.CustomError.MESSAGE['104'] }).toEqual(result);
  });

  it('is the case when user have permission <deleteVolunteer>', async () => {
    const context = { request: { session: { passport: { user: { email: 'test@gmail.com' } } } } };
    const result = await volunteerHandler.deleteVolunteer({ user_email: 'test@gmail.com' }, context);
    expect({ statusCode: '0' }).toEqual(result);
  });

  it('is the case when user do not have permission <deleteVolunteer>', async () => {
    const context = { request: { session: { passport: { user: { email: 'test2@gmail.com' } } } } };
    const result = await volunteerHandler.deleteVolunteer({ user_email: 'test@gmail.com' }, context);
    expect({ statusCode: '104', errorMessage: constants.CustomError.MESSAGE['104'] }).toEqual(result);
  });
});
