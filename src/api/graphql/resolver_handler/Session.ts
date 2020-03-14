import * as SessionTypes from '../types/Session';
import Session from '../../../database/models/Session.model';
import Logger from '../../../common/logger';
import * as constants from '../../../common/constants';

const log = Logger.createLogger('graphql.resolver_handler.Session');

export const querySession = async (id: number) => {
  try {
    const result = await Session.findOne({ where: { id } });
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
      && (args.user_email && args.user_email !== email)) ? '0' : args.admin_approved;
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
    await Session.build({ ...args, admin_approved: '0' }).save();
    return { result: true };
  } catch (error) {
    log.error(`[-] failed to create user - ${error}`);
    return { result: false, error };
  }
};

export const updateSession = async (
  changeValues: SessionTypes.SessionArgs, args: SessionTypes.SessionArgs, context: any) => {
  try {
    const admin = !!context.request.session?.passport?.user.admin;
    const email = context.request.session?.passport?.user.email;

    if (!admin && (args.user_email && args.user_email !== email)) {
      throw new Error(constants.ERROR_MESSAGE['104']);
    }
    const where = JSON.parse(JSON.stringify(args));
    await Session.update(changeValues, {
      where,
    });
    return { result: true };
  } catch (error) {
    log.error(`[-] failed to create user - ${error}`);
    return { result: false, error };
  }
};

export const deleteSession = async (args: SessionTypes.SessionArgs, context: any) => {
  try {
    const admin = !!context.request.session.passport.user.admin;
    const email = context.request.session?.passport?.user.email;
    if (!admin && (args.user_email && args.user_email !== email)) {
      throw new Error(constants.ERROR_MESSAGE['104']);
    }
    const where = JSON.parse(JSON.stringify(args));
    await Session.destroy({
      where,
    });
    return { result: true };
  } catch (error) {
    log.error(`[-] failed to delete user - ${error}`);
    return { result: false, error };
  }
};
