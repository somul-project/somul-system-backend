import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class User {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  phoneNumber?: string;
}