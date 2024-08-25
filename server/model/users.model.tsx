import {
  Table,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Length,
} from "sequelize-typescript";

@Table({ timestamps: false, tableName: "users", underscored: true })
class Users extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;
  @Column({ type: DataType.TEXT })
  username: string;
  @Column({ type: DataType.TEXT })
  password: string;
  @Column({ type: DataType.DATE })
  create_date: string;
  @Column({ type: DataType.TEXT })
  role: string;
}

export default Users;
