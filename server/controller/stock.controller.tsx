import { Op } from "sequelize";
import Stock from "../model/stock.model";
import { IQuerys } from "../interface/common.interface";
import moment from "moment-timezone";

const genQuery = (args: IQuerys) => {
  let body: any = {};
  if (args?.query) {
    body = {
      ...body,
      [Op.or]: [
        { id: { [Op.like]: `%${args.query}%` } },
        { type: { [Op.like]: `%${args.query}%` } },
        { name: { [Op.like]: `%${args.query}%` } },
        { order_date: { [Op.like]: `%${args.query}%` } },
        { created_date: { [Op.like]: `%${args.query}%` } },
      ],
    };
  }
  return body;
};

const stockController = {
  stock: async (args: IQuerys) => {
    try {
      const result = await Stock.findAndCountAll({
        where: genQuery(args),
        limit: args?.limit,
        offset: args?.skip,
      });

      if (Array.isArray(result.rows)) {
        return { count: result.count, rows: result.rows };
      } else {
        console.error("Error: rows is not an array");
        return { count: 0, rows: [] }; 
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
      throw error; 
    }
  },
  create: async (args: Stock) => {
    const timezone = "Asia/Bangkok";
    const formattedDate = moment().tz(timezone).format("YYYY-MM-DD HH:mm:ss");

    let newStock = await Stock.create({
      type: args.type,
      name: args.name,
      order_date: formattedDate,
      created_date: formattedDate,
      updated_date: formattedDate,
      details: args.details,
      status: args.status,
    });
    return newStock;
  },
  update: async (args: Stock) => {
    const timezone = "Asia/Bangkok";
    const formattedDate = moment().tz(timezone).format("YYYY-MM-DD HH:mm:ss");
    let update = await Stock.findOne({ where: { id: args.id } });
    if (!update) throw Error("ไม่พบผู้ใช้งานนี้มีอยู่ในระบบ");

    let newUpdate = await update.update({
      type:args.type,
      name:args.name,
      updated_date: formattedDate,
      details:args.details,
      status:args.status
    });
    return "Updated";
  },
  delete: async (args: Stock) => {
    let stock = await Stock.findByPk(args?.id);
    if (!stock) throw Error("ไม่พบ ID นี้ ในระบบ");
    await stock.destroy();
    return "Delete Device Successfully";
  },
};

export default stockController;
