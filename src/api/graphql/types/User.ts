import {
  ObjectType,
  Field,
  ArgsType,
  InputType,
} from 'type-graphql';
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

@InputType()
@ArgsType()
export class UserArgs {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  phonenumber?: string;
}
