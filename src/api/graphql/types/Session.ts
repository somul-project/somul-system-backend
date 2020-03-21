import { ObjectType, Field, ArgsType } from 'type-graphql';
import 'reflect-metadata';

@ObjectType()
export class SessionObject {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  library_id?: number;

  @Field({ nullable: true })
  user_email?: string;

  @Field({ nullable: true })
  session_name?: string;

  @Field({ nullable: true })
  session_time?: string;

  @Field({ nullable: true })
  introduce?: string;

  @Field({ nullable: true })
  history?: string;

  @Field({ nullable: true })
  session_explainer?: string;

  @Field({ nullable: true })
  document?: string;

  @Field({ nullable: true })
  admin_approved?: '0' | '1' | '2' | '3';

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updateAt?: Date;
}

@ArgsType()
export class SessionArgs {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  library_id?: number;

  @Field({ nullable: true })
  user_email?: string;

  @Field({ nullable: true })
  session_name?: string;

  @Field({ nullable: true })
  session_time?: string;

  @Field({ nullable: true })
  introduce?: string;

  @Field({ nullable: true })
  history?: string;

  @Field({ nullable: true })
  session_explainer?: string;

  @Field({ nullable: true })
  document?: string;

  @Field({ nullable: true })
  admin_approved?: '0' | '1' | '2' | '3';
}


@ArgsType()
export class SessionCreateArgs {
  @Field()
  library_id: number;

  @Field()
  user_email: string;

  @Field()
  session_name: string;

  @Field()
  session_time: string;

  @Field()
  introduce: string;

  @Field()
  history: string;

  @Field()
  session_explainer: string;

  @Field()
  document: string;

  @Field({ nullable: true })
  admin_approved?: '0' | '1' | '2' | '3';
}
