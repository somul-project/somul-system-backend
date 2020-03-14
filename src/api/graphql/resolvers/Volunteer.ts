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
import * as LibraryTypes from '../types/Library';
import * as UsersHandlers from '../resolver_handler/User';
import * as VolunteerHandlers from '../resolver_handler/Volunteer';
import * as LibraryHandlers from '../resolver_handler/Library';
import Volunteer from '../../../database/models/Volunteer.model';

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

  @Mutation(() => MutationType)
  async createVolunteer(
    @Args() args: VolunteerTypes.VolunteerCreateArgs,
  ): Promise<MutationType> {
    const result = await VolunteerHandlers.createVolunteer(args);
    return result;
  }

  @Mutation(() => MutationType)
  async updateVolunteer(
    @Args() changeValues: VolunteerTypes.VolunteerArgs,
    @Args() args: VolunteerTypes.VolunteerArgs,
    @Ctx() context: any,
  ): Promise<MutationType> {
    const result = await VolunteerHandlers.updateVolunteer(changeValues, args, context);
    return result;
  }

  @Mutation(() => MutationType)
  async deleteVolunteer(
    @Args() args: VolunteerTypes.VolunteerArgs,
    @Ctx() context: any,
  ): Promise<MutationType> {
    const result = await VolunteerHandlers.deleteVolunteer(args, context);
    return result;
  }

  @FieldResolver(() => UsersTypes.UserObject)
  async user(
    @Root() volunteer: Volunteer,
  ): Promise<UsersTypes.UserObject> {
    if (!volunteer.user_email) {
      return {};
    }
    const result = await UsersHandlers.queryUser(volunteer.user_email);
    return result;
  }

  @FieldResolver(() => LibraryTypes.LibraryObject)
  async library(
    @Root() volunteer: Volunteer,
  ): Promise<LibraryTypes.LibraryObject> {
    if (!volunteer.library_id) {
      return {};
    }
    const result = await LibraryHandlers.queryLibrary(volunteer.library_id);
    return result;
  }
}
