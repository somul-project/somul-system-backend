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

@Resolver((of) => LibraryTypes.LibraryObject)
export default class LibraryResolver {
  @Query(() => LibraryTypes.LibraryObject)
  async library(
    @Arg('id') id: number,
    @Ctx() context: any,
  ): Promise<LibraryTypes.LibraryObject> {
    const admin = !!context.request.session?.passport?.user.admin;
    if (!admin) {
      throw errorHandler.CustomError.MESSAGE[errorHandler.STATUS_CODE.insufficientPermission];
    }
    const result = await LibraryHandlers.queryLibrary(id);
    return result;
  }

  @Query(() => [LibraryTypes.LibraryObject])
  async librarys(
    @Args() args: LibraryTypes.LibraryArgs,
    @Ctx() context: any,
  ): Promise<LibraryTypes.LibraryObject[]> {
    const admin = !!context.request.session?.passport?.user.admin;
    const email = context.request.session?.passport?.user.email;
    const verifyEmail = context.request.session?.passport?.user.verify_email;

    const where = JSON.parse(JSON.stringify(args));
    const admin_approved = (!admin
      && (!verifyEmail || (args.manager_email && args.manager_email !== email)))
      ? constants.ADMIN_APPROVED.APPROVAL : args.admin_approved;
    if (admin_approved) where.admin_approved = admin_approved;
    const result = await LibraryHandlers.queryLibraries(where);
    return result;
  }

  @Mutation(() => ResultType)
  async createLibrary(
    @Args() args: LibraryTypes.LibraryCreateArgs,
    @Ctx() context: any,
  ): Promise<ResultType> {
    const verifyEmail = context.request.session?.passport?.user.verify_email;
    if (!verifyEmail) {
      throw errorHandler.CustomError.MESSAGE[errorHandler.STATUS_CODE.insufficientPermission];
    }
    const result = await LibraryHandlers.createLibrary(args);
    return result;
  }

  @Mutation(() => ResultType)
  async updateLibrary(
    @Arg('changeValues') changeValues: LibraryTypes.LibraryArgs,
    @Arg('where') where: LibraryTypes.LibraryArgs,
    @Ctx() context: any,
  ): Promise<ResultType> {
    const admin = !!context.request.session?.passport?.user.admin;
    const email = context.request.session?.passport?.user.email;
    const verifyEmail = context.request.session?.passport?.user.verify_email;

    if (!admin && !verifyEmail && (where.manager_email && where.manager_email !== email)) {
      throw new errorHandler.CustomError(errorHandler.STATUS_CODE.insufficientPermission);
    }
    const args = JSON.parse(JSON.stringify(where));
    if (!admin && changeValues.admin_approved) {
      delete args.admin_approved;
    }
    const result = await LibraryHandlers.updateLibrary(changeValues, args);
    return result;
  }

  @Mutation(() => ResultType)
  async deleteLibrary(
    @Args() args: LibraryTypes.LibraryArgs,
    @Ctx() context: any,
  ): Promise<ResultType> {
    const admin = !!context.request.session.passport.user.admin;
    const email = context.request.session?.passport?.user.email;
    const verifyEmail = context.request.session?.passport?.user.verify_email;

    if (!admin && !verifyEmail && (args.manager_email && args.manager_email !== email)) {
      throw new errorHandler.CustomError(errorHandler.STATUS_CODE.insufficientPermission);
    }
    const where = JSON.parse(JSON.stringify(args));
    const result = await LibraryHandlers.deleteLibrary(where);
    return result;
  }

  @FieldResolver(() => UsersTypes.UserObject)
  async user(
    @Root() library: LibraryTypes.LibraryArgs,
  ): Promise<UsersTypes.UserObject> {
    const data = library['dataValues'];
    if (!data.manager_email) {
      return {};
    }
    const result = await UsersHandlers.queryUser(data.manager_email);
    return result;
  }

  @FieldResolver(() => [SessionTypes.SessionObject])
  async sessions(
    @Root() library: LibraryTypes.LibraryArgs,
    @Ctx() context: any,
  ): Promise<SessionTypes.SessionObject[]> {
    const data = library['dataValues'];
    if (!data.manager_email) {
      return [];
    }
    const admin = !!context.request.session?.passport?.user.admin;
    const result = await SessionHandlers.querySessions({
      library_id: data.id,
      admin_approved: (!admin)
        ? constants.ADMIN_APPROVED.APPROVAL : undefined,
    });
    return result;
  }

  @FieldResolver(() => [VolunteerTypes.VolunteerObject])
  async volunteers(
    @Root() library: LibraryTypes.LibraryArgs,
    @Ctx() context: any,
  ): Promise<VolunteerTypes.VolunteerObject[]> {
    const data = library['dataValues'];
    if (!data.manager_email) {
      return [];
    }
    const admin = !!context.request.session?.passport?.user.admin;
    const result = await VolunteerHandlers.queryVolunteers({
      library_id: data.id,
      admin_approved: (!admin)
        ? constants.ADMIN_APPROVED.APPROVAL : undefined,
    });
    return result;
  }
}
