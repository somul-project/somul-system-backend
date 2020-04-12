import * as constants from '../../../common/constants';
import * as errorHandler from '../../../common/error';
import Slack from '../../../util/slack';
import Logger from '../../../common/logger';
import getDatabase from '../../../database';
import * as LibraryTypes from '../types/Library';

const Library = getDatabase().getLibrary();

const log = Logger.createLogger('graphql.resolver_handler.Library');

export const queryLibrary = async (id: number) => {
  try {
    const result = await Library.findOne(
      {
        where:
        {
          id, admin_approved: constants.ADMIN_APPROVED.APPROVAL,
        },
      },
    );
    if (!result) {
      return {};
    }
    return result;
  } catch (error) {
    log.error(`[-] failed to query - ${error}`);
    throw error;
  }
};

export const queryLibraries = async (args: LibraryTypes.LibraryArgs, context: any) => {
  try {
    const admin = !!context.request.session?.passport?.user.admin;
    const email = context.request.session?.passport?.user.email;
    const where = JSON.parse(JSON.stringify(args));
    const admin_approved = (!admin
      && (args.manager_email && args.manager_email !== email))
      ? constants.ADMIN_APPROVED.APPROVAL : args.admin_approved;
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
    throw error;
  }
};

export const createLibrary = async (args: LibraryTypes.LibraryCreateArgs) => {
  try {
    await Library.create({ ...args, admin_approved: constants.ADMIN_APPROVED.PROCESS });
    return { statusCode: '0' };
  } catch (error) {
    if (error instanceof errorHandler.CustomError) {
      return error.getData();
    }
    log.error(error);
    await Slack.send('error', error);
    return { statusCode: '500', errorMessage: errorHandler.CustomError.MESSAGE['500'] };
  }
};

export const updateLibrary = async (
  changeValues: LibraryTypes.LibraryArgs, args: LibraryTypes.LibraryArgs, context: any) => {
  try {
    const admin = !!context.request.session?.passport?.user.admin;
    const email = context.request.session?.passport?.user.email;

    if (!admin && (args.manager_email && args.manager_email !== email)) {
      throw new errorHandler.CustomError(errorHandler.STATUS_CODE.insufficientPermission);
    }
    const where = JSON.parse(JSON.stringify(args));
    if (!admin && changeValues.admin_approved) {
      delete where.admin_approved;
    }
    await Library.update(changeValues, {
      where,
    });
    return { statusCode: '0' };
  } catch (error) {
    if (error instanceof errorHandler.CustomError) {
      return error.getData();
    }
    log.error(error);
    await Slack.send('error', error);
    return { statusCode: '500', errorMessage: errorHandler.CustomError.MESSAGE['500'] };
  }
};

export const deleteLibrary = async (args: LibraryTypes.LibraryArgs, context: any) => {
  try {
    const admin = !!context.request.session.passport.user.admin;
    const email = context.request.session?.passport?.user.email;
    if (!admin && (args.manager_email && args.manager_email !== email)) {
      throw new errorHandler.CustomError(errorHandler.STATUS_CODE.insufficientPermission);
    }
    const where = JSON.parse(JSON.stringify(args));
    await Library.destroy({
      where,
    });
    return { statusCode: '0' };
  } catch (error) {
    if (error instanceof errorHandler.CustomError) {
      return error.getData();
    }
    log.error(error);
    await Slack.send('error', error);
    return { statusCode: '500', errorMessage: errorHandler.CustomError.MESSAGE['500'] };
  }
};
