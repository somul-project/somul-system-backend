import * as UserTypes from '../types/User';
import Logger from '../../../common/logger';
import * as constants from '../../../common/constants';
import getDatabase from '../../../database';

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
    return {};
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
    return [];
  }
};

export const updateUser = async (
  changeValues: UserTypes.UserArgs, args: UserTypes.UserArgs, context: any) => {
  try {
    const admin = !!context.request.session?.passport?.user.admin;
    const email = context.request.session?.passport?.user.email;

    if (!admin && (!args.email || args.email !== email)) {
      throw '104';
    }
    const where = JSON.parse(JSON.stringify(args));

    await Users.update(changeValues, {
      where,
    });
    return { result: 0 };
  } catch (error) {
    log.error(`[-] failed to update user - ${error}`);
    const errorCode = (constants.ERROR_MESSAGE[error]) ? error : 500;
    return { result: -1, errorCode, errorMessage: constants.ERROR_MESSAGE[errorCode] };
  }
};

export const deleteUser = async (args: UserTypes.UserArgs, context: any) => {
  try {
    const admin = !!context.request.session?.passport?.user.admin;

    if (!admin) {
      throw '104';
    }
    const where = JSON.parse(JSON.stringify(args));
    await Users.destroy({
      where,
    });
    return { result: 0 };
  } catch (error) {
    const errorCode = (constants.ERROR_MESSAGE[error]) ? error : 500;
    return { result: -1, errorCode, errorMessage: constants.ERROR_MESSAGE[errorCode] };
  }
};
