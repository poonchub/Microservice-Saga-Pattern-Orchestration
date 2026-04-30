// src/services/payment.service.ts

import { prisma } from "../config/prisma"

export const processPayment = async (orderId: string, amount: number) => {

    return prisma.$transaction(async (tx) => {

        // ❗ simulate fail (เอาไว้ test)
        if (amount > 500) {
            await tx.payment.create({
                data: {
                    orderId,
                    amount,
                    status: 'FAILED'
                }
            })

            throw new Error('Payment failed (mock)')
        }

        await tx.payment.create({
            data: {
                orderId,
                amount,
                status: 'SUCCESS'
            }
        })

        return true
    })
}
