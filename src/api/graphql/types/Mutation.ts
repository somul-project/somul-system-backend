import { ObjectType, Field } from 'type-graphql';

import 'reflect-metadata';

@ObjectType()
export default class MutationObject {
  @Field({ nullable: true })
  result?: boolean;

  @Field({ nullable: true })
  error?: string;
}
