
import sinon from 'sinon';
import UserResolver from '../../api/graphql/resolvers/User';
import * as UsersHandlers from '../../api/graphql/resolver_handler/User';
import * as errorHandler from '../../common/error';

const user = new UserResolver();

describe('auth', () => {
  beforeEach(() => {
    sinon.stub(UsersHandlers, 'queryUser' as any)
      .callsFake(async (email: string) => {
        const result = { email, phonenumber: '01010101010', name: 'Donghyeon' };
        return result;
      });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('is a successful case <register:local>', async () => {
    const result = await user.deleteUser({
    }, { request: { session: {} } })
      .catch((error) => error);

    expect(result.getData().statusCode).toEqual(errorHandler.STATUS_CODE.insufficientPermission);
  });
});
