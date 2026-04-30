// src/clients/payment.client.ts
import axios from 'axios'

const PAYMENT_URL = 'http://localhost:4002'

export const processPayment = async (orderId: string, amount: number) => {
  return axios.post(`${PAYMENT_URL}/pay`, {
    orderId,
    amount
  })
}