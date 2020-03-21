import { Mutex } from 'async-mutex';
import * as SessionTypes from '../types/Session';
import Logger from '../../../common/logger';
import * as constants from '../../../common/constants';
import getDatabase from '../../../database';

const Session = getDatabase().getSession();
const log = Logger.createLogger('graphql.resolver_handler.Session');
const mutex = new Mutex();
let Release;

export const querySession = async (id: number) => {
  try {
    const result = await Session.findOne({ where: { id, admin_approved: '3' } });
    if (!result) {
      return {};
    }
    return result;
  } catch (error) {
    log.error(`[-] failed to query - ${error}`);
    return {};
  }
};

export const querySessions = async (args: SessionTypes.SessionArgs, context: any) => {
  try {
    const admin = !!context.request.session?.passport?.user.admin;
    const email = context.request.session?.passport?.user.email;
    const where = JSON.parse(JSON.stringify(args));
    const admin_approved = (!admin
      && (args.user_email && args.user_email !== email)) ? '3' : args.admin_approved;
    if (admin_approved) where.admin_approved = admin_approved;
    const result = await Session.findAll({
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

export const createSession = async (args: SessionTypes.SessionCreateArgs) => {
  try {
    Release = await mutex.acquire();
    try {
      const result = await Session.findAll({
        where: { library_id: args.library_id },
      });
      if (result.length >= 2) {
        throw '106';
      }
      Release();
    } catch (error) {
      Release();
      throw error;
    }
    await Session.create({ ...args, admin_approved: '0' });
    return { result: 0 };
  } catch (error) {
    log.error(`[-] failed to create user - ${error}`);
    const errorCode = (constants.ERROR_MESSAGE[error]) ? error : 500;
    return { result: -1, errorCode, errorMessage: constants.ERROR_MESSAGE[errorCode] };
  }
};

export const updateSession = async (
  changeValues: SessionTypes.SessionArgs, args: SessionTypes.SessionArgs, context: any) => {
  try {
    const admin = !!context.request.session?.passport?.user.admin;
    const email = context.request.session?.passport?.user.email;

    if (!admin && (args.user_email && args.user_email !== email)) {
      throw '104';
    }
    const where = JSON.parse(JSON.stringify(args));
    if (!admin && changeValues.admin_approved) {
      delete where.admin_approved;
    }
    await Session.update(changeValues, {
      where,
    });
    return { result: 0 };
  } catch (error) {
    const errorCode = (constants.ERROR_MESSAGE[error]) ? error : 500;
    return { result: -1, errorCode, errorMessage: constants.ERROR_MESSAGE[errorCode] };
  }
};

export const deleteSession = async (args: SessionTypes.SessionArgs, context: any) => {
  try {
    const admin = !!context.request.session.passport.user.admin;
    const email = context.request.session?.passport?.user.email;
    if (!admin && (args.user_email && args.user_email !== email)) {
      throw '104';
    }
    const where = JSON.parse(JSON.stringify(args));
    await Session.destroy({
      where,
    });
    return { result: 0 };
  } catch (error) {
    const errorCode = (constants.ERROR_MESSAGE[error]) ? error : 500;
    return { result: -1, errorCode, errorMessage: constants.ERROR_MESSAGE[errorCode] };
  }
};
