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
import * as SessionTypes from '../types/Session';
import * as LibraryTypes from '../types/Library';
import * as UsersHandlers from '../resolver_handler/User';
import * as SessionHandlers from '../resolver_handler/Session';
import * as LibraryHandlers from '../resolver_handler/Library';
import * as errorHandler from '../../../common/error';

@Resolver((of) => SessionTypes.SessionObject)
export default class SessionResolver {
  @Query(() => SessionTypes.SessionObject)
  async session(
    @Arg('id') id: number,
    @Ctx() context: any,
  ): Promise<SessionTypes.SessionObject> {
    const admin = !!context.request.session?.passport?.user.admin;
    if (!admin) {
      throw errorHandler.CustomError.MESSAGE[errorHandler.STATUS_CODE.insufficientPermission];
    }
    const result = await SessionHandlers.querySession(id);
    return result;
  }

  @Query(() => [SessionTypes.SessionObject])
  async sessions(
    @Args() args: SessionTypes.SessionArgs,
    @Ctx() context: any,
  ): Promise<SessionTypes.SessionObject[]> {
    const admin = !!context.request.session?.passport?.user.admin;
    const email = context.request.session?.passport?.user.email;
    const verifyEmail = context.request.session?.passport?.user.verify_email;
    const where = JSON.parse(JSON.stringify(args));
    const admin_approved = (!admin
      && (!verifyEmail || !args.user_email || (args.user_email && args.user_email !== email)))
      ? constants.ADMIN_APPROVED.APPROVAL : args.admin_approved;
    if (admin_approved) where.admin_approved = admin_approved;
    const result = await SessionHandlers.querySessions(where);
    return result;
  }

  @Mutation(() => ResultType)
  async createSession(
    @Args() args: SessionTypes.SessionCreateArgs,
    @Ctx() context: any,
  ): Promise<ResultType> {
    const verifyEmail = context.request.session?.passport?.user.verify_email;
    if (!verifyEmail) {
      throw errorHandler.CustomError.MESSAGE[errorHandler.STATUS_CODE.insufficientPermission];
    }
    const result = await SessionHandlers.createSession(args);
    return result;
  }

  @Mutation(() => ResultType)
  async updateSession(
    @Arg('changeValues') changeValues: SessionTypes.SessionArgs,
    @Arg('where') where: SessionTypes.SessionArgs,
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
    const result = await SessionHandlers.updateSession(changeValues, args);
    return result;
  }

  @Mutation(() => ResultType)
  async deleteSession(
    @Args() args: SessionTypes.SessionArgs,
    @Ctx() context: any,
  ): Promise<ResultType> {
    const admin = !!context.request.session.passport.user.admin;
    const email = context.request.session?.passport?.user.email;
    const verifyEmail = context.request.session?.passport?.user.verify_email;
    if (!admin && !verifyEmail && (args.user_email && args.user_email !== email)) {
      throw new errorHandler.CustomError(errorHandler.STATUS_CODE.insufficientPermission);
    }
    const result = await SessionHandlers.deleteSession(args);
    return result;
  }

  @FieldResolver(() => UsersTypes.UserObject)
  async user(
    @Root() session: SessionTypes.SessionArgs,
  ): Promise<UsersTypes.UserObject> {
    const data = session['dataValues'];
    if (!data.user_email) {
      return {};
    }
    const result = await UsersHandlers.queryUser(data.user_email);
    return result;
  }

  @FieldResolver(() => [LibraryTypes.LibraryObject])
  async library(
    @Root() session: SessionTypes.SessionArgs,
  ): Promise<LibraryTypes.LibraryObject> {
    const data = session['dataValues'];
    if (!data.library_id) {
      return {};
    }
    const result = await LibraryHandlers.queryLibrary(data.library_id);
    return result;
  }
}
