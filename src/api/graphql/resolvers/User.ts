import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
} from 'type-graphql';
import { User } from '../objectTypes/User';
import { MutationRes } from '../objectTypes/MutationRes';
import { Users } from "../../../database/models/Users.model";
import { EmailToken } from "../../../database/models/EmailToken.model";
import * as sendgrid from "../../../util/sendgrid";
import * as constants from "../../../common/constants";
import { Logger } from "../../../common/logger";
import sha256 from "sha256";
import randomstring from "randomstring";

const log = Logger.createLogger("graphql.resolvers.User");

const EMAIL_TEMPLATE = constants.EMAIL_TEMPLATE;
const ERROR_MESSAGE = "invalid request";

@Resolver()
export class UserResolver {

  @Query(() => [User] || [])
  async users(
    @Arg('phonenumber', { nullable: true }) phonenumber: string,
    @Arg('name', { nullable: true }) name: string,
    @Ctx() context: any
  ): Promise<[User?]> {
    try {
      const passportSession = context.request.session.passport;
      if (!passportSession || !passportSession.user.admin) {
        throw ERROR_MESSAGE;
      }
      const result = await Users.findAll({
        attributes: ['name', 'phonenumber', 'email'],
        where: {name, phonenumber}});
      if (!result) {return [];}
      const res: [User?] = [];
      result.forEach((item) => {
        res.push({name: item.name, email: item.email, phonenumber: item.phonenumber});
      });
      return res;

    } catch (error) {
      log.error(`[-] failed to query(users) - ${error}`);
      return [];
    }
  }

  @Query(() => User)
  async user(
    @Arg('email') email: string,
    @Ctx() context: any
  ): Promise<User> {
    try {
      const passportSession = context.request.session.passport;
      if (!passportSession || (passportSession.user.email !== email && !passportSession.user.admin)) {
        throw ERROR_MESSAGE;
      }
      const result = await Users.findOne({where: {email}});
      if (result === undefined) {return {};}
      if (passportSession.user.admin) {
        return {name: result!.name, email: result!.email!,
          phonenumber: result!.phonenumber,};
      } else {
        return {name: result!.name, email: result!.email!};
      }
    } catch (error) {
      log.error(`[-] failed to query - ${error}`);
      return {};
    }
  }

  @Mutation(() => MutationRes)
  async createUser(
    @Arg('email') email: string,
    @Arg('name') name: string,
    @Arg('password', { nullable: true }) password: string,
    @Arg('phonenumber') phonenumber: string,
    @Ctx() context: any
  ): Promise<MutationRes> {
    try {
      const passportSession = context.request.session.passport;
      if (passportSession) {
        // Passport Auth
        await Users.build({
          email: passportSession.user.email,
          name,
          phonenumber,
          admin: false,
        }).save();
        passportSession.user.admin = false;
      } else if (password) {
        // Local Register
        const hashedPassword = await sha256(password);
        const token = randomstring.generate();
        await EmailToken.build({
          email,
          name,
          token,
          phonenumber,
          password: hashedPassword
        }).save();
        // send email for verifying
        sendgrid.send({
          from: constants.ADMIN_EMAIL,
          to: email,
          subject: constants.EMAIL_SUBJECT,
          text: EMAIL_TEMPLATE.replace("{token}", token).replace("{email}", email),
        });
      } else {
        throw ERROR_MESSAGE;
      }
      return {result: true};
    } catch (error) {
      log.error(`[-] failed to create user - ${error}`);
      return {result: false, error};
    }
  }

  @Mutation(() => MutationRes)
  async deleteUser(
    @Arg('email') email: string,
    @Ctx() context: any
  ): Promise<MutationRes> {
    try {
      const passportInfo = context.request.session.passport;
      if (passportInfo && (passportInfo.user.email === email || passportInfo.user.admin)) {
        await Users.destroy({
          where: {email: passportInfo.user.email}
        });
      } else {
        throw ERROR_MESSAGE;
      }
      return {result: true};
    } catch (error) {
      log.error(`[-] failed to delete user - ${error}`);
      return {result: false, error};
    }
  }

  @Mutation(() => Boolean)
  async updateUser(
    @Arg('email') email: string,
    @Arg('name') name: string,
    @Arg('admin', { nullable: true }) admin: boolean,
    @Arg('phonenumber') phonenumber: string,
    @Ctx() context: any
  ): Promise<MutationRes> {
    try {
      const passportInfo = context.request.session.passport;
      if (passportInfo && (passportInfo.user.email === email || passportInfo.user.admin)) {
         const args = {
           admin: (passportInfo.user.admin)? admin: undefined,
           name,
           phonenumber,
         };
        await Users.update(args, {
          where: {email: (passportInfo.user.email)? email: passportInfo.user.email}
        });
      } else {
        throw ERROR_MESSAGE;
      }
      return {result: true};
    } catch (error) {
      log.error(`[-] failed to update user - ${error}`);
      return {result: false, error};
    }
  }
}
