import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  FieldResolver,
  Root,
  Args,
} from 'type-graphql';
import ResultType from '../types/Result';
import * as constants from '../../../common/constants';
import * as UsersTypes from '../types/User';
import * as VolunteerTypes from '../types/Volunteer';
import * as LibraryTypes from '../types/Library';
import * as UsersHandlers from '../resolver_handler/User';
import * as VolunteerHandlers from '../resolver_handler/Volunteer';
import * as LibraryHandlers from '../resolver_handler/Library';
import * as errorHandler from '../../../common/error';

@Resolver((of) => VolunteerTypes.VolunteerObject)
export default class VolunteerResolver {
  @Query(() => VolunteerTypes.VolunteerObject)
  async volunteer(
    @Arg('id') id: number,
    @Ctx() context: any,
  ): Promise<VolunteerTypes.VolunteerObject> {
    const admin = !!context.request.session?.passport?.user.admin;
    if (!admin) {
      throw errorHandler.CustomError.MESSAGE[errorHandler.STATUS_CODE.insufficientPermission];
    }
    const result = await VolunteerHandlers.queryVolunteer(id);
    return result;
  }

  @Query(() => [VolunteerTypes.VolunteerObject])
  async volunteers(
    @Args() args: VolunteerTypes.VolunteerArgs,
    @Ctx() context: any,
  ): Promise<VolunteerTypes.VolunteerObject[]> {
    const admin = !!context.request.session?.passport?.user.admin;
    const email = context.request.session?.passport?.user.email;
    const verifyEmail = context.request.session?.passport?.user.verify_email;
    const where = JSON.parse(JSON.stringify(args));
    const admin_approved = (!admin
      && (!verifyEmail || !args.user_email || (args.user_email && args.user_email !== email)))
      ? constants.ADMIN_APPROVED.APPROVAL : args.admin_approved;
    if (admin_approved) where.admin_approved = admin_approved;
    const result = await VolunteerHandlers.queryVolunteers(where);
    return result;
  }

  @Mutation(() => ResultType)
  async createVolunteer(
    @Args() args: VolunteerTypes.VolunteerCreateArgs,
    @Ctx() context: any,
  ): Promise<ResultType> {
    const verifyEmail = context.request.session?.passport?.user.verify_email;
    if (!verifyEmail) {
      throw errorHandler.CustomError.MESSAGE[errorHandler.STATUS_CODE.insufficientPermission];
    }
    const result = await VolunteerHandlers.createVolunteer(args);
    return result;
  }

  @Mutation(() => ResultType)
  async updateVolunteer(
    @Arg('changeValues') changeValues: VolunteerTypes.VolunteerArgs,
    @Arg('where') where: VolunteerTypes.VolunteerArgs,
    @Ctx() context: any,
  ): Promise<ResultType> {
    const admin = !!context.request.session?.passport?.user.admin;
    const email = context.request.session?.passport?.user.email;
    const verifyEmail = context.request.session?.passport?.user.verify_email;
    if (!admin && !verifyEmail && (where.user_email && where.user_email !== email)) {
      throw new errorHandler.CustomError(errorHandler.STATUS_CODE.insufficientPermission);
    }

    const args = JSON.parse(JSON.stringify(where));
    if (!admin && changeValues.admin_approved) {
      delete args.admin_approved;
    }
    const result = await VolunteerHandlers.updateVolunteer(changeValues, args);
    return result;
  }

  @Mutation(() => ResultType)
  async deleteVolunteer(
    @Args() args: VolunteerTypes.VolunteerArgs,
    @Ctx() context: any,
  ): Promise<ResultType> {
    const admin = !!context.request.session.passport.user.admin;
    const email = context.request.session?.passport?.user.email;
    const verifyEmail = context.request.session?.passport?.user.verify_email;

    if (!admin && !verifyEmail && (args.user_email && args.user_email !== email)) {
      throw new errorHandler.CustomError(errorHandler.STATUS_CODE.insufficientPermission);
    }
    const where = JSON.parse(JSON.stringify(args));
    const result = await VolunteerHandlers.deleteVolunteer(where);
    return result;
  }

  @FieldResolver(() => UsersTypes.UserObject)
  async user(
    @Root() volunteer: VolunteerTypes.VolunteerArgs,
  ): Promise<UsersTypes.UserObject> {
    const data = volunteer['dataValues'];
    if (!data.user_email) {
      return {};
    }
    const result = await UsersHandlers.queryUser(data.user_email);
    return result;
  }

  @FieldResolver(() => LibraryTypes.LibraryObject)
  async library(
    @Root() volunteer: VolunteerTypes.VolunteerArgs,
  ): Promise<LibraryTypes.LibraryObject> {
    const data = volunteer['dataValues'];
    if (!data.library_id) {
      return {};
    }
    const result = await LibraryHandlers.queryLibrary(data.library_id);
    return result;
  }
}
