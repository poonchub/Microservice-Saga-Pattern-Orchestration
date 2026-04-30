// src/controllers/payment.controller.ts

import type { Request, Response } from "express"
import { processPayment } from "../service/payment.service"

export const paymentHandler = async (req: Request, res: Response) => {
  try {
    const { orderId, amount } = req.body

    await processPayment(orderId, amount)

    res.json({ success: true })

  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message
    })
  }
}