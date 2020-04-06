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
import * as LibraryTypes from '../types/Library';
import * as UsersHandlers from '../resolver_handler/User';
import * as VolunteerHandlers from '../resolver_handler/Volunteer';
import * as LibraryHandlers from '../resolver_handler/Library';

@Resolver((of) => VolunteerTypes.VolunteerObject)
export default class VolunteerResolver {
  @Query(() => VolunteerTypes.VolunteerObject)
  async volunteer(
    @Arg('id') id: number,
  ): Promise<VolunteerTypes.VolunteerObject> {
    const result = await VolunteerHandlers.queryVolunteer(id);
    return result;
  }

  @Query(() => [VolunteerTypes.VolunteerObject])
  async volunteers(
    @Args() args: VolunteerTypes.VolunteerArgs,
    @Ctx() context: any,
  ): Promise<VolunteerTypes.VolunteerObject[]> {
    const result = await VolunteerHandlers.queryVolunteers(args, context);
    return result;
  }

  @Mutation(() => ResultType)
  async createVolunteer(
    @Args() args: VolunteerTypes.VolunteerCreateArgs,
  ): Promise<ResultType> {
    const result = await VolunteerHandlers.createVolunteer(args);
    return result;
  }

  @Mutation(() => ResultType)
  async updateVolunteer(
    @Args() changeValues: VolunteerTypes.VolunteerArgs,
    @Args() args: VolunteerTypes.VolunteerArgs,
    @Ctx() context: any,
  ): Promise<ResultType> {
    const result = await VolunteerHandlers.updateVolunteer(changeValues, args, context);
    return result;
  }

  @Mutation(() => ResultType)
  async deleteVolunteer(
    @Args() args: VolunteerTypes.VolunteerArgs,
    @Ctx() context: any,
  ): Promise<ResultType> {
    const result = await VolunteerHandlers.deleteVolunteer(args, context);
    return result;
  }

  @FieldResolver(() => UsersTypes.UserObject)
  async user(
    @Root() volunteer: VolunteerTypes.VolunteerArgs,
  ): Promise<UsersTypes.UserObject> {
    if (!volunteer.user_email) {
      return {};
    }
    const result = await UsersHandlers.queryUser(volunteer.user_email);
    return result;
  }

  @FieldResolver(() => LibraryTypes.LibraryObject)
  async library(
    @Root() volunteer: VolunteerTypes.VolunteerArgs,
  ): Promise<LibraryTypes.LibraryObject> {
    if (!volunteer.library_id) {
      return {};
    }
    const result = await LibraryHandlers.queryLibrary(volunteer.library_id);
    return result;
  }
}
