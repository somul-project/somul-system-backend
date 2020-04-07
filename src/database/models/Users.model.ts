import {
  Model, Table, Column, AllowNull, PrimaryKey, HasMany,
} from 'sequelize-typescript';
import Library from './Library.model';
import Session from './Session.model';
import Volunteer from './Volunteer.model';


@Table({ tableName: 'Users' })
export default class Users extends Model<Users> {
  @AllowNull(false)
  @PrimaryKey
  @Column
  email: string;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  phonenumber: string;


  @AllowNull(false)
  @Column
  admin: boolean;


  @AllowNull(false)
  @Column
  verify_email: boolean;


  @AllowNull(true)
  @Column
  password?: string;

  @AllowNull(false)
  @Column
  createdAt: Date;


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
