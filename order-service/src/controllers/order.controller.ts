// src/controllers/order.controller.ts
import type { Request, Response } from 'express'
import { createOrder } from '../service/order.service'


export const createOrderHandler = async (req: Request, res: Response) => {
    try {
        const result = await createOrder(req.body)

        res.status(201).json({
            success: true,
            data: result
        })

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}