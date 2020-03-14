import * as VolunteerTypes from '../types/Volunteer';
import Volunteer from '../../../database/models/Volunteer.model';
import Logger from '../../../common/logger';
import * as constants from '../../../common/constants';

const log = Logger.createLogger('graphql.resolver_handler.Volunteer');

export const queryVolunteer = async (id: number) => {
  try {
    const result = await Volunteer.findOne({ where: { id } });
    if (!result) {
      return {};
    }
    return result;
  } catch (error) {
    log.error(`[-] failed to query - ${error}`);
    return {};
  }
};

export const queryVolunteers = async (args: VolunteerTypes.VolunteerArgs, context: any) => {
  try {
    const admin = !!context.request.session?.passport?.user.admin;
    const email = context.request.session?.passport?.user.email;
    const where = JSON.parse(JSON.stringify(args));
    const admin_approved = (!admin
      && (args.user_email && args.user_email !== email)) ? '0' : args.admin_approved;
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
    return [];
  }
};

export const createVolunteer = async (args: VolunteerTypes.VolunteerCreateArgs) => {
  try {
    await Volunteer.build({ ...args, admin_approved: '0' }).save();
    return { result: true };
  } catch (error) {
    log.error(`[-] failed to create user - ${error}`);
    return { result: false, error };
  }
};

export const updateVolunteer = async (
  changeValues: VolunteerTypes.VolunteerArgs, args: VolunteerTypes.VolunteerArgs, context: any) => {
  try {
    const admin = !!context.request.session?.passport?.user.admin;
    const email = context.request.session?.passport?.user.email;

    if (!admin && (args.user_email && args.user_email !== email)) {
      throw new Error(constants.ERROR_MESSAGE['104']);
    }
    const where = JSON.parse(JSON.stringify(args));
    await Volunteer.update(changeValues, {
      where,
    });
    return { result: true };
  } catch (error) {
    log.error(`[-] failed to create user - ${error}`);
    return { result: false, error };
  }
};

export const deleteVolunteer = async (args: VolunteerTypes.VolunteerArgs, context: any) => {
  try {
    const admin = !!context.request.session.passport.user.admin;
    const email = context.request.session?.passport?.user.email;
    if (!admin && (args.user_email && args.user_email !== email)) {
      throw new Error(constants.ERROR_MESSAGE['104']);
    }
    const where = JSON.parse(JSON.stringify(args));
    await Volunteer.destroy({
      where,
    });
    return { result: true };
  } catch (error) {
    log.error(`[-] failed to delete user - ${error}`);
    return { result: false, error };
  }
};
