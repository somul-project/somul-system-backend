import Logger from '../../../common/logger';
import * as constants from '../../../common/constants';
import getDatabase from '../../../database';
import * as UserTypes from '../types/User';

const Users = getDatabase().getUsers();
const log = Logger.createLogger('graphql.resolver_handler.User');

export const queryUser = async (email: string) => {
  try {
    const result = await Users.findOne({
      where: { email },
    });
    if (!result) {
      return {};
    }
    return result;
  } catch (error) {
    log.error(`[-] failed to query - ${error}`);
    throw error;
  }
};

export const queryUsers = async (args: UserTypes.UserArgs, context: any) => {
  try {
    const where = JSON.parse(JSON.stringify(args));
    const result = await Users.findAll({
      where,
    });
    if (!result) {
      return [];
    }
    return result;
  } catch (error) {
    log.error(`[-] failed to query(users) - ${error}`);
    throw error;
  }
};

export const updateUser = async (
  changeValues: UserTypes.UserArgs, args: UserTypes.UserArgs, context: any) => {
  try {
    const admin = !!context.request.session?.passport?.user.admin;
    const email = context.request.session?.passport?.user.email;

    if (!admin && (!args.email || args.email !== email)) {
      throw new constants.CustomError(constants.STATUS_CODE.insufficientPermission);
    }
    const where = JSON.parse(JSON.stringify(args));

    await Users.update(changeValues, {
      where,
    });
    return { statusCode: '0' };
  } catch (error) {
    if (error instanceof constants.CustomError) {
      return error.getData();
    }
    log.error(error);
    return { statusCode: '500', errorMessage: constants.CustomError.MESSAGE['500'] };
  }
};

export const deleteUser = async (args: UserTypes.UserArgs, context: any) => {
  try {
    const admin = !!context.request.session?.passport?.user.admin;

    if (!admin) {
      throw new constants.CustomError(constants.STATUS_CODE.insufficientPermission);
    }
    const where = JSON.parse(JSON.stringify(args));
    await Users.destroy({
      where,
    });
    return { statusCode: '0' };
  } catch (error) {
    if (error instanceof constants.CustomError) {
      return error.getData();
    }
    log.error(error);
    return { statusCode: '500', errorMessage: constants.CustomError.MESSAGE['500'] };
  }
};
