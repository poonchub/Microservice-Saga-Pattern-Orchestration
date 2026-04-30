// src/services/inventory.service.ts
import { prisma } from "../config/prisma"

export const reserveStock = async (orderId: string, productId: string, quantity: number) => {
  return prisma.$transaction(async (tx) => {

    const product = await tx.product.findUnique({
      where: { id: productId }
    })

    if (!product) throw new Error('Product not found')

    if (product.stock < quantity) {
      throw new Error('Stock not enough')
    }

    // หัก stock
    await tx.product.update({
      where: { id: productId },
      data: {
        stock: product.stock - quantity
      }
    })

    // สร้าง reservation
    await tx.reservation.create({
      data: {
        orderId,
        productId,
        quantity
      }
    })

    return true
  })
}

export const releaseStock = async (orderId: string) => {
  return prisma.$transaction(async (tx) => {

    const reservation = await tx.reservation.findUnique({
      where: { orderId }
    })

    if (!reservation) {
      // idempotent: ถ้าไม่มีถือว่าเคย rollback แล้ว
      return true
    }

    // คืน stock
    await tx.product.update({
      where: { id: reservation.productId },
      data: {
        stock: {
          increment: reservation.quantity
        }
      }
    })

    // ลบ reservation
    await tx.reservation.delete({
      where: { orderId }
    })

    return true
  })
}