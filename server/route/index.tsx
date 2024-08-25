import { Router } from "express"
import userRoute from "./users.route"
import stockRoute from "./stock.route"
import authRoute from "./auth.route"



const baseRouter: Router = Router()

baseRouter.use("/api/user", userRoute)
baseRouter.use("/api/auth", authRoute)
baseRouter.use("/api/stock",stockRoute)

export default baseRouter