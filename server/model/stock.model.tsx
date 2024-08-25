import {
  Table,
  Column,
  DataType,
  Model,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";

@Table({ timestamps: false, tableName: "stock", underscored: true })
class Stock extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;
  @Column({ type: DataType.STRING })
  type: string;
  @Column({ type: DataType.TEXT })
  name: string;
  @Column({ type: DataType.DATE })
  order_date: Date;
  @Column({type: DataType.DATE})
  created_date:Date;
  @Column({type: DataType.DATE})
  updated_date:Date;
  @Column({type: DataType.TEXT})
  details:string;
  @Column({type: DataType.TEXT})
  status:string;
}

export default Stock;
