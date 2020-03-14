import * as LibraryTypes from '../types/Library';
import * as constants from '../../../common/constants';
import Logger from '../../../common/logger';
import Library from '../../../database/models/Library.model';

const log = Logger.createLogger('graphql.resolver_handler.Library');

export const queryLibrary = async (id: number) => {
  try {
    const result = await Library.findOne({ where: { id } });
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
      && (args.manager_email && args.manager_email !== email)) ? '0' : args.admin_approved;
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
    await Library.build({ ...args, admin_approved: '0' }).save();
    return { result: true };
  } catch (error) {
    log.error(`[-] failed to create user - ${error}`);
    return { result: false, error };
  }
};

export const updateLibrary = async (
  changeValues: LibraryTypes.LibraryArgs, args: LibraryTypes.LibraryArgs, context: any) => {
  try {
    const admin = !!context.request.session?.passport?.user.admin;
    const email = context.request.session?.passport?.user.email;

    if (!admin && (args.manager_email && args.manager_email !== email)) {
      throw new Error(constants.ERROR_MESSAGE['104']);
    }
    const where = JSON.parse(JSON.stringify(args));
    await Library.update(changeValues, {
      where,
    });
    return { result: true };
  } catch (error) {
    log.error(`[-] failed to create user - ${error}`);
    return { result: false, error };
  }
};

export const deleteLibrary = async (args: LibraryTypes.LibraryArgs, context: any) => {
  try {
    const admin = !!context.request.session.passport.user.admin;
    const email = context.request.session?.passport?.user.email;
    if (!admin && (args.manager_email && args.manager_email !== email)) {
      throw new Error(constants.ERROR_MESSAGE['104']);
    }
    const where = JSON.parse(JSON.stringify(args));
    await Library.destroy({
      where,
    });
    return { result: true };
  } catch (error) {
    log.error(`[-] failed to delete user - ${error}`);
    return { result: false, error };
  }
};
