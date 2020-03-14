import {
  Model, Table, Column, AllowNull, PrimaryKey, Comment, HasMany,
} from 'sequelize-typescript';
import Library from './Library.model';
import Session from './Session.model';
import Volunteer from './Volunteer.model';


@Table({ tableName: 'Users' })
export default class Users extends Model<Users> {
  @Comment('')
  @AllowNull(false)
  @PrimaryKey
  @Column
  email: string;

  @Comment('')
  @AllowNull(false)
  @Column
  name: string;

  @Comment('')
  @AllowNull(false)
  @Column
  phonenumber: string;

  @Comment('')
  @AllowNull(false)
  @Column
  admin: boolean;

  @Comment('')
  @AllowNull(false)
  @Column
  verify_email: boolean;

  @Comment('')
  @AllowNull(true)
  @Column
  password?: string;

  @Comment('')
  @AllowNull(false)
  @Column
  createdAt: Date;

  @Comment('')
  @AllowNull(false)
  @Column
  updatedAt: Date;

  @HasMany(() => Library)
  Library: Library[];

  @HasMany(() => Volunteer)
  Volunteer: Volunteer[];

  @HasMany(() => Session)
  Session: Session[];
}
