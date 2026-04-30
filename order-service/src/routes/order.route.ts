// src/routes/order.route.ts
import { Router } from 'express'
import { createOrderHandler } from '../controllers/order.controller'

const router = Router()

router.post('/orders', createOrderHandler)

export default router