import { ObjectType, Field, ArgsType } from 'type-graphql';
import 'reflect-metadata';

@ObjectType()
export class UserObject {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  phonenumber?: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updateAt?: Date;
}

@ArgsType()
export class UserArgs {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  phonenumber?: string;
}
