import Logger from '../../../common/logger';
import * as constants from '../../../common/constants';
import getDatabase from '../../../database';
import * as VolunteerTypes from '../types/Volunteer';

const Volunteer = getDatabase().getVolunteer();
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

export const queryVolunteers = async (args: VolunteerTypes.VolunteerArgs, context: any) => {
  try {
    const admin = !!context.request.session?.passport?.user.admin;
    const email = context.request.session?.passport?.user.email;
    const where = JSON.parse(JSON.stringify(args));
    const admin_approved = (!admin
      && (args.user_email && args.user_email !== email))
      ? constants.ADMIN_APPROVED.APPROVAL : args.admin_approved;
    if (admin_approved) where.admin_approved = admin_approved;
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
    await Volunteer.create({ ...args, admin_approved: constants.ADMIN_APPROVED.PROCESS });
    return { result: 0 };
  } catch (error) {
    log.error(`[-] failed to create user - ${error}`);
    const errorCode = (constants.ERROR.MESSAGE[error]) ? error : 500;
    return { result: -1, errorCode, errorMessage: constants.ERROR.MESSAGE[errorCode] };
  }
};

export const updateVolunteer = async (
  changeValues: VolunteerTypes.VolunteerArgs, args: VolunteerTypes.VolunteerArgs, context: any) => {
  try {
    const admin = !!context.request.session?.passport?.user.admin;
    const email = context.request.session?.passport?.user.email;

    if (!admin && (args.user_email && args.user_email !== email)) {
      throw constants.ERROR.CODE.notPermission;
    }

    const where = JSON.parse(JSON.stringify(args));
    if (!admin && changeValues.admin_approved) {
      delete where.admin_approved;
    }
    await Volunteer.update(changeValues, {
      where,
    });
    return { result: 0 };
  } catch (error) {
    log.error(`[-] failed to create user - ${error}`);
    const errorCode = (constants.ERROR.MESSAGE[error]) ? error : 500;
    return { result: -1, errorCode, errorMessage: constants.ERROR.MESSAGE[errorCode] };
  }
};

export const deleteVolunteer = async (args: VolunteerTypes.VolunteerArgs, context: any) => {
  try {
    const admin = !!context.request.session.passport.user.admin;
    const email = context.request.session?.passport?.user.email;
    if (!admin && (args.user_email && args.user_email !== email)) {
      throw constants.ERROR.CODE.notPermission;
    }
    const where = JSON.parse(JSON.stringify(args));
    await Volunteer.destroy({
      where,
    });
    return { result: 0 };
  } catch (error) {
    log.error(`[-] failed to delete user - ${error}`);
    const errorCode = (constants.ERROR.MESSAGE[error]) ? error : 500;
    return { result: -1, errorCode, errorMessage: constants.ERROR.MESSAGE[errorCode] };
  }
};
