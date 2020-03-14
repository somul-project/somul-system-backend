import { ObjectType, Field, ArgsType } from 'type-graphql';
import 'reflect-metadata';

@ObjectType()
export class VolunteerObject {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  library_id?: number;

  @Field({ nullable: true })
  user_email?: string;

  @Field({ nullable: true })
  introduce?: string;

  @Field({ nullable: true })
  history?: string;

  @Field({ nullable: true })
  admin_approved?: '0' | '1' | '2' | '3';

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updateAt?: Date;
}

@ArgsType()
export class VolunteerArgs {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  library_id?: number;

  @Field({ nullable: true })
  user_email?: string;

  @Field({ nullable: true })
  introduce?: string;

  @Field({ nullable: true })
  history?: string;

  @Field({ nullable: true })
  admin_approved?: '0' | '1' | '2' | '3';
}

@ArgsType()
export class VolunteerCreateArgs {
  @Field()
  library_id: number;

  @Field()
  user_email: string;

  @Field()
  introduce: string;

  @Field()
  history: string;

  @Field({ nullable: true })
  admin_approved?: '0' | '1' | '2' | '3';
}
