import {
  Model, Table, Column, AllowNull, AutoIncrement, PrimaryKey, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import Library from './Library.model';
import Users from './Users.model';

@Table({ tableName: 'Session' })
export default class Session extends Model<Session> {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(true)
  @ForeignKey(() => Library)
  @Column
  library_id: number;

  @AllowNull(false)
  @ForeignKey(() => Users)
  @Column
  user_email: string;

  @AllowNull(false)
  @Column
  session_name: string;

  @AllowNull(false)
  @Column
  session_time: string;

  @AllowNull(true)
  @Column
  introduce?: string;

  @AllowNull(false)
  @Column
  document: string;

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

  @BelongsTo(() => Library)
  Library: Library;
}
