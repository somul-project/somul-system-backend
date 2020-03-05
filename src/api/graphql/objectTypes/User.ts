import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export default class User {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  phonenumber?: string;
}
