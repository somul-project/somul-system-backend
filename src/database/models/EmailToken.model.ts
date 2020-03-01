import { Model, Table, Column, AllowNull, AutoIncrement, PrimaryKey, Comment } from 'sequelize-typescript';

@Table({ tableName: 'Email_Token' })
export class EmailToken extends Model<EmailToken> {
  
  @Comment('')
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Comment('')
  @AllowNull(false)
  @Column
  email: string;

  @Comment('')
  @AllowNull(false)
  @Column
  token: string;

  @Comment('')
  @AllowNull(false)
  @Column
  name: string;

  @Comment('')
  @AllowNull(false)
  @Column
  phone_number: string;

  @Comment('')
  @AllowNull(false)
  @Column
  password: string;

  @Comment('')
  @AllowNull(false)
  @Column
  createdAt: Date;

  @Comment('')
  @AllowNull(false)
  @Column
  updatedAt: Date;
}
