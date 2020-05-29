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
import * as SessionTypes from '../types/Session';
import * as LibraryTypes from '../types/Library';
import * as UsersHandlers from '../resolver_handler/User';
import * as VolunteerHandlers from '../resolver_handler/Volunteer';
import * as SessionHandlers from '../resolver_handler/Session';
import * as LibraryHandlers from '../resolver_handler/Library';
import * as errorHandler from '../../../common/error';

@Resolver((of) => UsersTypes.UserObject)
export default class UserResolver {
  @Query(() => UsersTypes.UserObject)
  async user(
    @Ctx() context: any,
    @Arg('email', { nullable: true }) email?: string,
  ): Promise<UsersTypes.UserObject> {
    const admin = !!context.request.session?.passport?.user.admin;
    const sessionEmail = context.request.session?.passport?.user.email;
    if (!sessionEmail) {
      throw errorHandler.CustomError.MESSAGE[errorHandler.STATUS_CODE.insufficientPermission];
    }
    const key = (admin) ? email || sessionEmail : sessionEmail;
    const result = await UsersHandlers.queryUser(key);
    return result;
  }

  @Query(() => [UsersTypes.UserObject])
  async users(
    @Args() args: UsersTypes.UserArgs,
    @Ctx() context: any,
  ): Promise<UsersTypes.UserObject[]> {
    const admin = !!context.request.session?.passport?.user.admin;
    if (!admin) {
      throw errorHandler.CustomError.MESSAGE[errorHandler.STATUS_CODE.insufficientPermission];
    }
    const result = await UsersHandlers.queryUsers(args);
    return result;
  }

  @Mutation(() => ResultType)
  async updateUser(
    @Arg('changeValues') changeValues: UsersTypes.UserArgs,
    @Arg('where') where: UsersTypes.UserArgs,
    @Ctx() context: any,
  ): Promise<ResultType> {
    const admin = !!context.request.session?.passport?.user.admin;
    const email = context.request.session?.passport?.user.email;
    const verifyEmail = context.request.session?.passport?.user.verify_email;

    if (!admin && !verifyEmail && (!where.email || where.email !== email)) {
      throw new errorHandler.CustomError(errorHandler.STATUS_CODE.insufficientPermission);
    }
    const result = await UsersHandlers.updateUser(changeValues, where);
    return result;
  }

  @Mutation(() => ResultType)
  async deleteUser(
    @Args() args: UsersTypes.UserArgs,
    @Ctx() context: any,
  ): Promise<ResultType> {
    const admin = !!context.request.session?.passport?.user.admin;

    if (!admin) {
      throw new errorHandler.CustomError(errorHandler.STATUS_CODE.insufficientPermission);
    }
    const result = await UsersHandlers.deleteUser(args);
    return result;
  }

  @FieldResolver(() => [LibraryTypes.LibraryObject])
  async librarys(
    @Root() user: UsersTypes.UserArgs,
    @Ctx() context: any,
  ): Promise<LibraryTypes.LibraryObject[]> {
    const data = user['dataValues'];
    const admin = !!context.request.session?.passport?.user.admin;
    const email = context.request.session?.passport?.user.email;
    const result = await LibraryHandlers.queryLibraries({
      manager_email: data.email,
      admin_approved: (!admin && (data.email !== email))
        ? constants.ADMIN_APPROVED.APPROVAL : undefined,
    });
    return result;
  }

  @FieldResolver(() => [SessionTypes.SessionObject])
  async sessions(
    @Root() user: UsersTypes.UserArgs,
    @Ctx() context: any,
  ): Promise<SessionTypes.SessionObject[]> {
    const data = user['dataValues'];
    if (!data.email) {
      return [];
    }
    const admin = !!context.request.session?.passport?.user.admin;
    const email = context.request.session?.passport?.user.email;

    const result = await SessionHandlers.querySessions({
      user_email: data.email,
      admin_approved: (!admin && (data.email !== email))
        ? constants.ADMIN_APPROVED.APPROVAL : undefined,
    });
    return result;
  }

  @FieldResolver(() => [VolunteerTypes.VolunteerObject])
  async volunteers(
    @Root() user: UsersTypes.UserArgs,
    @Ctx() context: any,
  ): Promise<VolunteerTypes.VolunteerObject[]> {
    const data = user['dataValues'];
    if (!data.email) {
      return [];
    }
    const admin = !!context.request.session?.passport?.user.admin;
    const email = context.request.session?.passport?.user.email;
    const result = await VolunteerHandlers.queryVolunteers({
      user_email: data.email,
      admin_approved: (!admin && (data.email !== email))
        ? constants.ADMIN_APPROVED.APPROVAL : undefined,
    });
    return result;
  }
}
