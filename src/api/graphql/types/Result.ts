import { ObjectType, Field } from 'type-graphql';

import 'reflect-metadata';

@ObjectType()
export default class ResultObject {
  @Field({ nullable: true })
  statusCode?: string;

  @Field({ nullable: true })
  errorMessage?: string;
}
