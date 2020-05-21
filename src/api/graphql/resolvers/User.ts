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
    @Arg('email') email: string,
    @Ctx() context: any,
  ): Promise<UsersTypes.UserObject> {
    const admin = !!context.request.session?.passport?.user.admin;
    if (!admin) {
      throw errorHandler.CustomError.MESSAGE[errorHandler.STATUS_CODE.insufficientPermission];
    }
    const result = await UsersHandlers.queryUser(email);
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
    const result = await UsersHandlers.queryUsers(args, context);
    return result;
  }

  @Mutation(() => ResultType)
  async updateUser(
    @Args() changeValues: UsersTypes.UserArgs,
    @Args() args: UsersTypes.UserArgs,
    @Ctx() context: any,
  ): Promise<ResultType> {
    const result = await UsersHandlers.updateUser(changeValues, args, context);
    return result;
  }

  @Mutation(() => ResultType)
  async deleteUser(
    @Args() args: UsersTypes.UserArgs,
    @Ctx() context: any,
  ): Promise<ResultType> {
    const result = await UsersHandlers.deleteUser(args, context);
    return result;
  }

  @FieldResolver(() => [LibraryTypes.LibraryObject])
  async librarys(
    @Root() user: UsersTypes.UserArgs,
    @Ctx() context: any,
  ): Promise<LibraryTypes.LibraryObject[]> {
    const result = await LibraryHandlers.queryLibraries({ manager_email: user.email }, context);
    return result;
  }

  @FieldResolver(() => [SessionTypes.SessionObject])
  async sessions(
    @Root() user: UsersTypes.UserArgs,
    @Ctx() context: any,
  ): Promise<SessionTypes.SessionObject[]> {
    const result = await SessionHandlers.querySessions({ user_email: user.email }, context);
    return result;
  }

  @FieldResolver(() => [VolunteerTypes.VolunteerObject])
  async volunteers(
    @Root() user: UsersTypes.UserArgs,
    @Ctx() context: any,
  ): Promise<VolunteerTypes.VolunteerObject[]> {
    const result = await VolunteerHandlers.queryVolunteers({ user_email: user.email }, context);
    return result;
  }
}
