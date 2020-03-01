import { Model, Table, Column, AllowNull, AutoIncrement, PrimaryKey, Comment, ForeignKey } from 'sequelize-typescript';
import { Library } from './Library.model';
import { Users } from './Users.model';

@Table({ tableName: 'Session' })
export class Session extends Model<Session> {

  @Comment('')
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Comment('')
  @AllowNull(false)
  @ForeignKey(() => Library)
  @Column
  library_id: number;

  @Comment('')
  @AllowNull(false)
  @ForeignKey(() => Users)
  @Column
  user_email: string;

  @Comment('')
  @AllowNull(false)
  @Column
  session_name: string;

  @Comment('')
  @AllowNull(false)
  @Column
  session_time: Date;
  
  @Comment('')
  @AllowNull(true)
  @Column
  introduce?: string;
  
  @Comment('')
  @AllowNull(true)
  @Column
  history?: string;

  @Comment('')
  @AllowNull(true)
  @Column
  session_explainer?: string;
  
  @Comment('')
  @AllowNull(false)
  @Column
  document: string;
  
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
}
