import {
  ObjectType,
  Field,
  ArgsType,
  InputType,
} from 'type-graphql';
import 'reflect-metadata';

@ObjectType()
export class LibraryObject {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  manager_email?: string;

  @Field({ nullable: true })
  location_road?: string;

  @Field({ nullable: true })
  location_number?: string;

  @Field({ nullable: true })
  location_detail?: string;

  @Field({ nullable: true })
  fac_sound?: boolean;

  @Field({ nullable: true })
  fac_record?: boolean;

  @Field({ nullable: true })
  fac_placard?: boolean;

  @Field({ nullable: true })
  fac_self_promo?: boolean;

  @Field({ nullable: true })
  fac_need_volunteer?: boolean;

  @Field({ nullable: true })
  fac_beam_screen?: boolean;

  @Field({ nullable: true })
  latitude?: number;

  @Field({ nullable: true })
  longitude?: number;

  @Field({ nullable: true })
  admin_approved?: '0' | '1' | '2' | '3';

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updateAt?: Date;
}

@InputType()
@ArgsType()
export class LibraryArgs {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  manager_email?: string;

  @Field({ nullable: true })
  location_road?: string;

  @Field({ nullable: true })
  location_number?: string;

  @Field({ nullable: true })
  location_detail?: string;

  @Field({ nullable: true })
  fac_sound?: boolean;

  @Field({ nullable: true })
  fac_record?: boolean;

  @Field({ nullable: true })
  fac_placard?: boolean;

  @Field({ nullable: true })
  fac_self_promo?: boolean;

  @Field({ nullable: true })
  fac_need_volunteer?: boolean;

  @Field({ nullable: true })
  fac_beam_screen?: boolean;

  @Field({ nullable: true })
  latitude?: number;

  @Field({ nullable: true })
  longitude?: number;

  @Field({ nullable: true })
  admin_approved?: '0' | '1' | '2' | '3';
}

@ArgsType()
export class LibraryCreateArgs {
  @Field()
  name: string;

  @Field()
  manager_email: string;

  @Field()
  location_road: string;

  @Field()
  location_number: string;

  @Field()
  location_detail: string;

  @Field()
  fac_sound: boolean;

  @Field()
  fac_record: boolean;

  @Field()
  fac_placard: boolean;

  @Field()
  fac_self_promo: boolean;

  @Field()
  fac_need_volunteer: boolean;

  @Field()
  fac_beam_screen: boolean;

  @Field()
  latitude: number;

  @Field()
  longitude: number;

  @Field({ nullable: true })
  admin_approved?: '0' | '1' | '2' | '3';
}
