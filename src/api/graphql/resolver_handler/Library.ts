import * as LibraryTypes from '../types/Library';
import * as constants from '../../../common/constants';
import Logger from '../../../common/logger';
import getDatabase from '../../../database';

const Library = getDatabase().getLibrary();

const log = Logger.createLogger('graphql.resolver_handler.Library');

export const queryLibrary = async (id: number) => {
  try {
    const result = await Library.findOne({ where: { id, admin_approved: '3' } });
    if (!result) {
      return {};
    }
    return result;
  } catch (error) {
    log.error(`[-] failed to query - ${error}`);
    return {};
  }
};

export const queryLibrarys = async (args: LibraryTypes.LibraryArgs, context: any) => {
  try {
    const admin = !!context.request.session?.passport?.user.admin;
    const email = context.request.session?.passport?.user.email;
    const where = JSON.parse(JSON.stringify(args));
    const admin_approved = (!admin
      && (args.manager_email && args.manager_email !== email)) ? '3' : args.admin_approved;
    if (admin_approved) where.admin_approved = admin_approved;
    const result = await Library.findAll({
      where,
    });
    if (!result) {
      return [];
    }
    return result;
  } catch (error) {
    log.error(`[-] failed to query - ${error}`);
    return [];
  }
};

export const createLibrary = async (args: LibraryTypes.LibraryCreateArgs) => {
  try {
    await Library.create({ ...args, admin_approved: '0' });
    return { result: 0 };
  } catch (error) {
    log.error(`[-] failed to create user - ${error}`);
    const errorCode = (constants.ERROR_MESSAGE[error]) ? error : 500;
    return { result: -1, errorCode, errorMessage: constants.ERROR_MESSAGE[errorCode] };
  }
};

export const updateLibrary = async (
  changeValues: LibraryTypes.LibraryArgs, args: LibraryTypes.LibraryArgs, context: any) => {
  try {
    const admin = !!context.request.session?.passport?.user.admin;
    const email = context.request.session?.passport?.user.email;

    if (!admin && (args.manager_email && args.manager_email !== email)) {
      throw '104';
    }
    const where = JSON.parse(JSON.stringify(args));
    if (!admin && changeValues.admin_approved) {
      delete where.admin_approved;
    }
    await Library.update(changeValues, {
      where,
    });
    return { result: 0 };
  } catch (error) {
    log.error(`[-] failed to create user - ${error}`);
    const errorCode = (constants.ERROR_MESSAGE[error]) ? error : 500;
    return { result: -1, errorCode, errorMessage: constants.ERROR_MESSAGE[errorCode] };
  }
};

export const deleteLibrary = async (args: LibraryTypes.LibraryArgs, context: any) => {
  try {
    const admin = !!context.request.session.passport.user.admin;
    const email = context.request.session?.passport?.user.email;
    if (!admin && (args.manager_email && args.manager_email !== email)) {
      throw '104';
    }
    const where = JSON.parse(JSON.stringify(args));
    await Library.destroy({
      where,
    });
    return { result: 0 };
  } catch (error) {
    log.error(`[-] failed to delete user - ${error}`);
    const errorCode = (constants.ERROR_MESSAGE[error]) ? error : 500;
    return { result: -1, errorCode, errorMessage: constants.ERROR_MESSAGE[errorCode] };
  }
};
