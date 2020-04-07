import {
  Model, Table, Column, AllowNull, AutoIncrement, PrimaryKey,
} from 'sequelize-typescript';

@Table({ tableName: 'Email_Token' })
export default class EmailToken extends Model<EmailToken> {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  email: string;


  @AllowNull(false)
  @Column
  token: string;

  @AllowNull(false)
  @Column
  send_count: number;

  @AllowNull(false)
  @Column
  createdAt: Date;

  @AllowNull(false)
  @Column
  updatedAt: Date;
}
