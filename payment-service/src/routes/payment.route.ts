// src/routes/payment.route.ts
import { Router } from 'express'
import { paymentHandler } from '../controllers/payment.controller'

const router = Router()

router.post('/pay', paymentHandler)

export default router