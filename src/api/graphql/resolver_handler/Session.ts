import { Mutex } from 'async-mutex';
import Slack from '../../../util/slack';
import Logger from '../../../common/logger';
import * as constants from '../../../common/constants';
import * as errorHandler from '../../../common/error';
import getDatabase from '../../../database';
import * as SessionTypes from '../types/Session';

const Session = getDatabase().getSession();
const Library = getDatabase().getLibrary();
const db = getDatabase().getInstance();
const log = Logger.createLogger('graphql.resolver_handler.Session');
const mutex = new Mutex();

const SCHEDULE_TEMPLATE = {
  create: 'CREATE EVENT {event_name} ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 2 DAY DO UPDATE somul.Session SET `admin_approved` = "2" WHERE (`library_id` = "{library_id}" AND `user_email` = "{user_email}" AND admin_approved` = "0");',
  delete: 'DROP EVENT {event_name}',
};

export const querySession = async (id: number) => {
  try {
    const result = await Session.findOne(
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

export const querySessions = async (args: SessionTypes.SessionArgs) => {
  try {
    const result = await Session.findAll({
      where: JSON.parse(JSON.stringify(args)),
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

export const createSession = async (args: SessionTypes.SessionCreateArgs) => {
  try {
    const release = await mutex.acquire();
    try {
      if (args.library_id) {
        const resultSession = await Session.findAll({
          where: { library_id: args.library_id },
        });
        if (resultSession.length >= 2) {
          throw new errorHandler.CustomError(errorHandler.STATUS_CODE.sessionFull);
        }
        const resultLibrary = await Library.findOne({
          where: { id: args.library_id, admin_approved: constants.ADMIN_APPROVED.APPROVAL },
        });
        if (!resultLibrary) {
          throw new errorHandler.CustomError(errorHandler.STATUS_CODE.invalidParams);
        }
      }

      release();
    } catch (error) {
      release();
      throw error;
    }
    await Session.create({ ...args, admin_approved: constants.ADMIN_APPROVED.PROCESS });
    if (!args.document) {
      const query = SCHEDULE_TEMPLATE.create
        .replace('{event_name}', `${args.library_id}_${args.user_email}`)
        .replace('{user_email}', args.user_email)
        .replace('{library_id}', String(args.library_id));
      await db.query(query);
    }
    return { statusCode: '0' };
  } catch (error) {
    if (error instanceof errorHandler.CustomError) {
      return error.getData();
    }
    log.error(error);
    await Slack.send('error', JSON.stringify(error));
    return { statusCode: '500', errorMessage: errorHandler.CustomError.MESSAGE['500'] };
  }
};

export const updateSession = async (
  changeValues: SessionTypes.SessionArgs, where: SessionTypes.SessionArgs) => {
  try {
    const args = JSON.parse(JSON.stringify(where));
    await Session.update(changeValues, {
      where: args,
    });
    if (args.document) {
      const query = SCHEDULE_TEMPLATE.delete
        .replace('{event_name}', `${args.library_id}_${args.user_email}`);
      await db.query(query).catch(() => {});
    }
    return { statusCode: '0' };
  } catch (error) {
    if (error instanceof errorHandler.CustomError) {
      return error.getData();
    }
    log.error(error);
    await Slack.send('error', JSON.stringify(error));
    return { statusCode: '500', errorMessage: errorHandler.CustomError.MESSAGE['500'] };
  }
};

export const deleteSession = async (args: SessionTypes.SessionArgs) => {
  try {
    const where = JSON.parse(JSON.stringify(args));
    await Session.destroy({
      where,
    });
    return { statusCode: '0' };
  } catch (error) {
    if (error instanceof errorHandler.CustomError) {
      return error.getData();
    }
    log.error(error);
    await Slack.send('error', JSON.stringify(error));
    return { statusCode: '500', errorMessage: errorHandler.CustomError.MESSAGE['500'] };
  }
};
