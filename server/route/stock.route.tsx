import { Router, Request, Response } from "express"
import { IQuerys } from "../interface/common.interface"
import stockController from "../controller/stock.controller"


const stockRoute = Router()

stockRoute
    .get("/", async(req: Request, res: Response) => {
        try {
            const result = await stockController.stock(req?.params as unknown as IQuerys)
            res.status(200).json({ result })
        } catch(err: any) {
            res.status(400).json({ message: err?.message })
        }
    })
    .post("/create", async(req: Request, res: Response) => {
        try {
            const result = await stockController.create(req?.body)
            res.status(200).json({ result })
        } catch(err: any) {
            res.status(400).json({ message: err?.message })
        }
    })
    .post("/update", async(req: Request, res: Response) => {
        try {
            const result = await stockController.update(req?.body)
            res.status(200).json({ result })
        } catch(err: any) {
            res.status(400).json({ message: err?.message })
        }
    })
    .post("/delete", async(req: Request, res: Response) => {
        try {
            const result = await stockController.delete(req?.body)
            res.status(200).json({ result })
        } catch(err: any) {
            res.status(400).json({ message: err?.message })
        }
    })
   

export default stockRoute