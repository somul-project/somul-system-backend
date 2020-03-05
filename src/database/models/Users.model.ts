import {
  Model, Table, Column, AllowNull, PrimaryKey, Comment,
} from 'sequelize-typescript';

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
}
