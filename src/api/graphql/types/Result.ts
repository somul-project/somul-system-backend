import { ObjectType, Field } from 'type-graphql';

import 'reflect-metadata';

@ObjectType()
export default class resultObject {
  @Field({ nullable: true })
  result?: number;

  @Field({ nullable: true })
  errorCode?: string;

  @Field({ nullable: true })
  errorMessage?: string;
}
