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

const log = Logger.createLogger("graphql.resolvers.User");
const url_tem = "http://localhost/verify_email?email={email}&token={token}";
const sha256 = require("sha256");
const randomstring = require("randomstring");

@Resolver()
export class UserResolver {

  @Query(() => [User] || [])
  async users(
    @Arg('phone_number', { nullable: true }) phone_number: string,
    @Arg('name', { nullable: true }) name: string,
    @Ctx() context: any
  ): Promise<[User?]> {
    try {
      const passportSession = context.request.session.passport;
      if (!passportSession || !passportSession.user.admin) {
        throw "invalid request";
      }
      const result = await Users.findAll({
        attributes: ['name', 'phone_number', 'email'],
        where: {name, phone_number}});
      if (!result) {return [];}
     
      return [{email: "sss"}];

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
        throw "invalid request";
      }
      const result = await Users.findOne({where: {email}});
      if (result === undefined) {return {};}
      if (passportSession.user.admin) {
        return {name: result!.name, email: result!.email!,
          phone_number: result!.phone_number,};
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
    @Arg('phone_number') phone_number: string,
    @Ctx() context: any
  ): Promise<MutationRes> {
    try {
      const passportSession = context.request.session.passport;
      if (passportSession) {
        // Passport Auth
        await Users.build({
          email: passportSession.user.email,
          name,
          phone_number,
          admin: false,
        }).save();
        passportSession.user["admin"] = false;
      } else if (password) {
        // Local Register
        const hashedPassword = await sha256(password);
        const token = randomstring.generate();
        await EmailToken.build({
          email,
          name,
          token,
          phone_number,
          password: hashedPassword
        }).save();
        // send email for verifying
        sendgrid.send({
          from: constants.ADMIN_EMAIL,
          to: email,
          subject: "소물 이메일 인증!!",
          text: url_tem.replace("{token}", token).replace("{email}", email),
        })
      } else {throw "invalid request"}
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
        })
      } else {
        throw "Invalid request";
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
    @Arg('phone_number') phone_number: string,
    @Ctx() context: any
  ): Promise<MutationRes> {
    try {
      const passportInfo = context.request.session.passport;
      if (passportInfo && (passportInfo.user.email === email || passportInfo.user.admin)) {
         const args = {
           admin: (passportInfo.user.admin)? admin: undefined,
           name,
           phone_number,
         }
        await Users.update(args, {
          where: {email: (passportInfo.user.email)? email: passportInfo.user.email}
        });
      } else {
        throw "Invalid request";
      }
      return {result: true};
    } catch (error) {
      log.error(`[-] failed to update user - ${error}`);
      return {result: false, error};
    }
  }
}