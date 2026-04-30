// src/controllers/inventory.controller.ts

import type { Request, Response } from 'express'
import * as service from '../services/inventory.service'

export const reserveHandler = async (req: Request, res: Response) => {
  try {
    const { orderId, productId, quantity } = req.body

    await service.reserveStock(orderId, productId, quantity)

    res.json({ success: true })
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const releaseHandler = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body

    await service.releaseStock(orderId)

    res.json({ success: true })
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message })
  }
}