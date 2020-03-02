import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class MutationRes {
  @Field({ nullable: true })
  result?: boolean;

  @Field({ nullable: true })
  error?: string;
}
