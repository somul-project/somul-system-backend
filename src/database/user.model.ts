import { Table, Model, PrimaryKey, Column, CreatedAt, UpdatedAt, DataType } from "sequelize-typescript";

/**
 * @see Notion / AIN / Engineering / V1 / Database Structure
 */
@Table
export class User extends Model<User> {
    /**
     * Primary ID
     * @desc UUID
     */
    @PrimaryKey
    @Column(DataType.STRING(36))
    public email: string;

    /**
     * User Name
     * @desc Name
     */
    @Column(DataType.STRING(30))
    public name: string;

    /**
     * Public key of the client
     */
    @Column(DataType.STRING(42))
    public password: string;

    /**
     * Unique key of the worker
     */
    @Column(DataType.STRING(42))
    public phone_number: string;

    /**
     * Unique key of the worker
     */
    @Column(DataType.BOOLEAN)
    public admin: boolean;

    /**
     * Timestamps
     * @desc This fields will be updated automatically by sequelize.
     */
    @CreatedAt
    public createdAt: Date;

    @UpdatedAt
    public updatedAt: Date;
}
