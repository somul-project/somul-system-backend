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
import * as SessionTypes from '../types/Session';
import * as LibraryTypes from '../types/Library';
import * as UsersHandlers from '../resolver_handler/User';
import * as SessionHandlers from '../resolver_handler/Session';
import * as LibraryHandlers from '../resolver_handler/Library';

@Resolver((of) => SessionTypes.SessionObject)
export default class SessionResolver {
  @Query(() => SessionTypes.SessionObject)
  async session(
    @Arg('id') id: number,
  ): Promise<SessionTypes.SessionObject> {
    const result = await SessionHandlers.querySession(id);
    return result;
  }

  @Query(() => [SessionTypes.SessionObject])
  async sessions(
    @Args() args: SessionTypes.SessionArgs,
    @Ctx() context: any,
  ): Promise<SessionTypes.SessionObject[]> {
    const result = await SessionHandlers.querySessions(args, context);
    return result;
  }

  @Mutation(() => ResultType)
  async createSession(
    @Args() args: SessionTypes.SessionCreateArgs,
  ): Promise<ResultType> {
    const result = await SessionHandlers.createSession(args);
    return result;
  }

  @Mutation(() => ResultType)
  async updateSession(
    @Args() changeValues: SessionTypes.SessionArgs,
    @Args() args: SessionTypes.SessionArgs,
    @Ctx() context: any,
  ): Promise<ResultType> {
    const result = await SessionHandlers.updateSession(changeValues, args, context);
    return result;
  }

  @Mutation(() => ResultType)
  async deleteSession(
    @Args() args: SessionTypes.SessionArgs,
    @Ctx() context: any,
  ): Promise<ResultType> {
    const result = await SessionHandlers.deleteSession(args, context);
    return result;
  }

  @FieldResolver(() => UsersTypes.UserObject)
  async user(
    @Root() session: SessionTypes.SessionArgs,
  ): Promise<UsersTypes.UserObject> {
    if (!session.user_email) {
      return {};
    }
    const result = await UsersHandlers.queryUser(session.user_email);
    return result;
  }

  @FieldResolver(() => [LibraryTypes.LibraryObject])
  async library(
    @Root() session: SessionTypes.SessionArgs,
  ): Promise<LibraryTypes.LibraryObject> {
    if (!session.library_id) {
      return {};
    }
    const result = await LibraryHandlers.queryLibrary(session.library_id);
    return result;
  }
}
