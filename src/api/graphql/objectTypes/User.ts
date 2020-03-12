import { ObjectType, Field } from 'type-graphql';
import 'reflect-metadata';

@ObjectType()
export default class UserType {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  phonenumber?: string;
}
