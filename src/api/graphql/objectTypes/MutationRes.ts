import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export default class MutationRes {
  @Field({ nullable: true })
  result?: boolean;

  @Field({ nullable: true })
  error?: string;
}
