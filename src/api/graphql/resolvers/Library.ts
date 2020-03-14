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
import MutationType from '../types/Mutation';
import * as UsersTypes from '../types/User';
import * as VolunteerTypes from '../types/Volunteer';
import * as SessionTypes from '../types/Session';
import * as LibraryTypes from '../types/Library';
import * as UsersHandlers from '../resolver_handler/User';
import * as VolunteerHandlers from '../resolver_handler/Volunteer';
import * as SessionHandlers from '../resolver_handler/Session';
import * as LibraryHandlers from '../resolver_handler/Library';

@Resolver((of) => LibraryTypes.LibraryObject)
export default class LibraryResolver {
  @Query(() => LibraryTypes.LibraryObject)
  async library(
    @Arg('id') id: number,
  ): Promise<LibraryTypes.LibraryObject> {
    const result = await LibraryHandlers.queryLibrary(id);
    return result;
  }

  @Query(() => [LibraryTypes.LibraryObject])
  async librarys(
    @Args() args: LibraryTypes.LibraryArgs,
    @Ctx() context: any,
  ): Promise<LibraryTypes.LibraryObject[]> {
    const result = await LibraryHandlers.queryLibrarys(args, context);
    return result;
  }

  @Mutation(() => MutationType)
  async creteLibrary(
    @Args() args: LibraryTypes.LibraryCreateArgs,
  ): Promise<MutationType> {
    const result = await LibraryHandlers.createLibrary(args);
    return result;
  }

  @Mutation(() => MutationType)
  async updateLibrary(
    @Args() changeValues: LibraryTypes.LibraryArgs,
    @Args() args: LibraryTypes.LibraryArgs,
    @Ctx() context: any,
  ): Promise<MutationType> {
    const result = await LibraryHandlers.updateLibrary(changeValues, args, context);
    return result;
  }

  @Mutation(() => MutationType)
  async deleteULibrary(
    @Args() args: LibraryTypes.LibraryArgs,
    @Ctx() context: any,
  ): Promise<MutationType> {
    const result = await LibraryHandlers.deleteLibrary(args, context);
    return result;
  }

  @FieldResolver(() => UsersTypes.UserObject)
  async user(
    @Root() library: LibraryTypes.LibraryArgs,
  ): Promise<UsersTypes.UserObject> {
    if (!library.manager_email) {
      return {};
    }
    const result = await UsersHandlers.queryUser(library.manager_email);
    return result;
  }

  @FieldResolver(() => [SessionTypes.SessionObject])
  async sessions(
    @Root() library: LibraryTypes.LibraryArgs,
    @Ctx() context: any,
  ): Promise<SessionTypes.SessionObject[]> {
    const result = await SessionHandlers.querySessions({ library_id: library.id }, context);
    return result;
  }

  @FieldResolver(() => [VolunteerTypes.VolunteerObject])
  async volunteers(
    @Root() library: LibraryTypes.LibraryArgs,
    @Ctx() context: any,
  ): Promise<VolunteerTypes.VolunteerObject[]> {
    const result = await VolunteerHandlers.queryVolunteers({ library_id: library.id }, context);
    return result;
  }
}
