// src/routes/inventory.route.ts
import { Router } from 'express'
import { reserveHandler, releaseHandler } from '../controllers/inventory.controller'

const router = Router()

router.post('/reserve', reserveHandler)
router.post('/release', releaseHandler)

export default router