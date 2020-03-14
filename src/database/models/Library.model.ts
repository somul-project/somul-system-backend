import {
  Model, Table, Column, AllowNull, AutoIncrement,
  PrimaryKey, Comment, ForeignKey, BelongsTo, HasMany,
} from 'sequelize-typescript';
import Users from './Users.model';
import Session from './Session.model';
import Volunteer from './Volunteer.model';

@Table({ tableName: 'Library' })
export default class Library extends Model<Library> {
  @Comment('')
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Comment('')
  @AllowNull(false)
  @Column
  name: string;

  @Comment('')
  @AllowNull(false)
  @Column
  location_road: string;

  @Comment('')
  @AllowNull(false)
  @Column
  location_number: string;

  @Comment('')
  @AllowNull(false)
  @Column
  location_detail: string;

  @Comment('')
  @AllowNull(false)
  @ForeignKey(() => Users)
  @Column
  manager_email: string;

  @Comment('')
  @AllowNull(false)
  @Column
  fac_beam_screan: boolean;

  @Comment('')
  @AllowNull(false)
  @Column
  fac_sound: boolean;

  @Comment('')
  @AllowNull(false)
  @Column
  fac_record: boolean;

  @Comment('')
  @AllowNull(false)
  @Column
  fac_placard: boolean;

  @Comment('')
  @AllowNull(false)
  @Column
  fac_self_promo: boolean;

  @Comment('')
  @AllowNull(false)
  @Column
  fac_need_volunteer: boolean;

  @Comment('')
  @AllowNull(false)
  @Column
  latitude: number;

  @Comment('')
  @AllowNull(false)
  @Column
  longitude: number;

  @Comment('')
  @AllowNull(true)
  @Column
  admin_approved?: '0' | '1' | '2' | '3' ;

  @Comment('')
  @AllowNull(false)
  @Column
  createdAt: Date;

  @Comment('')
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
