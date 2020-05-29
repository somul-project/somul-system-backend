import Slack from '../../../util/slack';
import Logger from '../../../common/logger';
import * as constants from '../../../common/constants';
import * as errorHandler from '../../../common/error';
import getDatabase from '../../../database';
import * as VolunteerTypes from '../types/Volunteer';

const Volunteer = getDatabase().getVolunteer();
const Library = getDatabase().getLibrary();
const log = Logger.createLogger('graphql.resolver_handler.Volunteer');
export const queryVolunteer = async (id: number) => {
  try {
    const result = await Volunteer.findOne(
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

export const queryVolunteers = async (args: VolunteerTypes.VolunteerArgs) => {
  try {
    const where = JSON.parse(JSON.stringify(args));
    const result = await Volunteer.findAll({
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

export const createVolunteer = async (args: VolunteerTypes.VolunteerCreateArgs) => {
  try {
    const resultLibrary = await Library.findOne({
      where: { id: args.library_id, admin_approved: constants.ADMIN_APPROVED.APPROVAL },
    });
    if (!resultLibrary) {
      throw new errorHandler.CustomError(errorHandler.STATUS_CODE.invalidParams);
    }
    await Volunteer.create({ ...args, admin_approved: constants.ADMIN_APPROVED.PROCESS });
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

export const updateVolunteer = async (
  changeValues: VolunteerTypes.VolunteerArgs, args: VolunteerTypes.VolunteerArgs) => {
  try {
    const where = JSON.parse(JSON.stringify(args));
    await Volunteer.update(changeValues, {
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

export const deleteVolunteer = async (args: VolunteerTypes.VolunteerArgs) => {
  try {
    const where = JSON.parse(JSON.stringify(args));
    await Volunteer.destroy({
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
