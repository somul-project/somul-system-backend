import {
  ObjectType,
  Field,
  ArgsType,
  InputType,
} from 'type-graphql';
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
  document?: string;

  @Field({ nullable: true })
  admin_approved?: '0' | '1' | '2' | '3';

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updateAt?: Date;
}

@InputType()
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
  document?: string;

  @Field({ nullable: true })
  admin_approved?: '0' | '1' | '2' | '3';
}


@ArgsType()
export class SessionCreateArgs {
  @Field({ nullable: true })
  library_id?: number;

  @Field()
  user_email: string;

  @Field({ nullable: true })
  session_name?: string;

  @Field({ nullable: true })
  session_time?: string;

  @Field({ nullable: true })
  introduce?: string;

  @Field({ nullable: true })
  document?: string;

  @Field({ nullable: true })
  admin_approved?: '0' | '1' | '2' | '3';
}
