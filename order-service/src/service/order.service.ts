// src/services/order.service.ts
import { reserveStock, releaseStock } from '../clients/inventory.client'
import { processPayment } from '../clients/payment.client'
import { prisma } from '../config/prisma'

export const createOrder = async (payload: {
    productId: string
    quantity: number
    amount: number
}) => {

    // 1. create order (local transaction)
    const order = await prisma.order.create({
        data: {
            productId: payload.productId,
            quantity: payload.quantity,
            status: 'PENDING'
        }
    })

    try {
        // 2. reserve stock
        await reserveStock(order.id, payload.productId, payload.quantity)

        // 3. process payment
        await processPayment(order.id, payload.amount)

        // 4. confirm order
        await prisma.order.update({
            where: { id: order.id },
            data: { status: 'CONFIRMED' }
        })

        return order

    } catch (error: any) {

        console.error('Saga failed:', {
            message: error.message,
            response: error.response?.data
        })

        // ❗ compensating transaction
        try {
            await releaseStock(order.id)
        } catch (rollbackError: any) {
            console.error('Rollback failed:', rollbackError.message)
        }

        await prisma.order.update({
            where: { id: order.id },
            data: { status: 'FAILED' }
        })

        throw new Error('Order failed')
    }
}