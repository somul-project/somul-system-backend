import { ObjectType, Field } from 'type-graphql';

import 'reflect-metadata';

@ObjectType()
export default class MutationType {
  @Field({ nullable: true })
  result?: boolean;

  @Field({ nullable: true })
  error?: string;
}
