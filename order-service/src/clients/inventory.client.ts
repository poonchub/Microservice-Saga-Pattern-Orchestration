// src/clients/inventory.client.ts
import axios from 'axios'

const INVENTORY_URL = 'http://localhost:4001'

export const reserveStock = async (orderId: string, productId: string, quantity: number) => {
  return axios.post(`${INVENTORY_URL}/reserve`, {
    orderId,
    productId,
    quantity
  })
}

export const releaseStock = async (orderId: string) => {
  return axios.post(`${INVENTORY_URL}/release`, {
    orderId
  })
}