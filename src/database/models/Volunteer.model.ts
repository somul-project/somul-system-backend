import {
  Model, Table, Column, AllowNull, AutoIncrement, PrimaryKey, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import Library from './Library.model';
import Users from './Users.model';

@Table({ tableName: 'Volunteer' })
export default class Volunteer extends Model<Volunteer> {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;


  @AllowNull(false)
  @ForeignKey(() => Library)
  @Column
  library_id: number;


  @AllowNull(false)
  @ForeignKey(() => Users)
  @Column
  user_email: string;


  @AllowNull(true)
  @Column
  introduce?: string;


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
}
