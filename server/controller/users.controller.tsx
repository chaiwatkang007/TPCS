import { v4 } from "uuid";
import {
  CreateUser,
  UpdateUser,
} from "../interface/users.interface";
import Users from "../model/users.model";
import { IId, IQuerys } from "../interface/common.interface";
import { Op } from "sequelize";
import bcrypt from "bcrypt";

const genQuery = (args: IQuerys) => {
  let body: any = {};
  if (args?.query) {
    body = {
      ...body,
      [Op.or]: [{ username: { [Op.like]: `%${args?.query}%` } }],
    };
  }
  return body;
};

const usersController = {
  users: async (args: IQuerys) => {
    return Users.findAndCountAll({
      where: genQuery(args),
      limit: args?.limit,
      offset: args?.skip,
    }).then(({ rows, count }) => {
      return { count, rows: rows };
    });
  },
  create: async (args: CreateUser) => {
    let user = await Users.findOne({ where: { username: args?.username } });
    if (user) throw Error("ผู้ใช้งานนี้มีอยู่ในระบบอยู่แล้ว");

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(args.password, saltRounds);

    let newUser = await Users.create({
      id: v4(),
      ...args,
      password: hashedPassword,
    });
    return newUser;
  },
 
};

export default usersController;
