import {
  Model, Table, Column, AllowNull, AutoIncrement,
  PrimaryKey, ForeignKey, BelongsTo, HasMany,
} from 'sequelize-typescript';
import Users from './Users.model';
import Session from './Session.model';
import Volunteer from './Volunteer.model';

@Table({ tableName: 'Library' })
export default class Library extends Model<Library> {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  location_road: string;

  @AllowNull(false)
  @Column
  location_number: string;

  @AllowNull(false)
  @Column
  location_detail: string;

  @AllowNull(false)
  @ForeignKey(() => Users)
  @Column
  manager_email: string;

  @AllowNull(false)
  @Column
  fac_beam_screan: boolean;

  @AllowNull(false)
  @Column
  fac_sound: boolean;

  @AllowNull(false)
  @Column
  fac_record: boolean;

  @AllowNull(false)
  @Column
  fac_placard: boolean;

  @AllowNull(false)
  @Column
  fac_self_promo: boolean;

  @AllowNull(false)
  @Column
  fac_need_volunteer: boolean;

  @AllowNull(false)
  @Column
  latitude: number;

  @AllowNull(false)
  @Column
  longitude: number;

  @AllowNull(true)
  @Column
  admin_approved?: '0' | '1' | '2' | '3' ;

  @AllowNull(false)
  @Column
  createdAt: Date;

  @AllowNull(false)
  @Column
  updatedAt: Date;

  @BelongsTo(() => Users)
  User: Users;

  @HasMany(() => Volunteer)
  Volunteer: Volunteer[];

  @HasMany(() => Session)
  Session: Session[];
}
