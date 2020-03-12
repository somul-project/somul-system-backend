import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
} from 'type-graphql';
import sha256 from 'sha256';
import UserType from '../objectTypes/User';
import MutationType from '../objectTypes/Mutation';
import Users from '../../../database/models/Users.model';
import Logger from '../../../common/logger';

const log = Logger.createLogger('graphql.resolvers.User');

const ADMIN_ERROR_MESSAGE = 'not admin';

@Resolver()
export default class UserResolver {
  @Query(() => [UserType])
  async users(
    @Arg('phonenumber', { nullable: true }) phonenumber: string,
    @Arg('name', { nullable: true }) name: string,
    @Ctx() context: any,
  ): Promise<Users[]> {
    try {
      const where = JSON.parse(JSON.stringify({ phonenumber, name }));
      const result = await Users.findAll({
        attributes: ['name', 'phonenumber', 'email'],
        where,
      });

      return result;
    } catch (error) {
      log.error(`[-] failed to query(users) - ${error}`);
      return [];
    }
  }

  @Query(() => UserType)
  async user(
    @Arg('email') email: string,
    @Ctx() context: any,
  ): Promise<UserType> {
    try {
      const result = await Users.findOne({
        attributes: ['name', 'phonenumber', 'email'],
        where: { email },
      });
      if (!result) { return {}; }
      return {
        name: result!.name,
        email: result!.email!,
        phonenumber: result!.phonenumber,
      };
    } catch (error) {
      log.error(`[-] failed to query - ${error}`);
      return {};
    }
  }

  @Mutation(() => MutationType)
  async createUser(
    @Arg('email', { nullable: true }) email: string,
    @Arg('name') name: string,
    @Arg('password', { nullable: true }) password: string,
    @Arg('phonenumber') phonenumber: string,
    @Ctx() context: any,
  ): Promise<MutationType> {
    try {
      const admin = !!context.request.session.passport.user.admin;
      if (!admin) throw ADMIN_ERROR_MESSAGE;

      const hashedPassword = await sha256(password);
      await Users.build({
        email,
        name,
        phonenumber,
        verify_email: true,
        admin: false,
        password: hashedPassword,
      }).save();
      return { result: true };
    } catch (error) {
      log.error(`[-] failed to create user - ${error}`);
      return { result: false, error };
    }
  }

  @Mutation(() => MutationType)
  async deleteUser(
    @Arg('email') email: string,
    @Ctx() context: any,
  ): Promise<MutationType> {
    try {
      const admin = !!context.request.session.passport.user.admin;
      await Users.destroy({
        where: { email: (admin) ? email : context.request.session.passport.user.email },
      });
      return { result: true };
    } catch (error) {
      log.error(`[-] failed to delete user - ${error}`);
      return { result: false, error };
    }
  }

  @Mutation(() => MutationType)
  async updateUser(
    @Arg('phonenumber', { nullable: true }) phonenumber: string,
    @Arg('name', { nullable: true }) name: string,
    @Arg('email', { nullable: true }) email: string,
    @Arg('admin', { nullable: true }) admin: boolean,
    @Ctx() context: any,
  ): Promise<MutationType> {
    try {
      const sessionAdmin = !!context.request.session.passport.user.admin;
      const sessionEmail = context.request.session.passport.user.email;
      const args = {
        admin: (sessionAdmin) ? admin : undefined,
        name,
        phonenumber,
      };
      await Users.update(args, {
        where: { email: (admin && email) ? email : sessionEmail },
      });
      return { result: true };
    } catch (error) {
      log.error(`[-] failed to update user - ${error}`);
      return { result: false, error };
    }
  }
}
