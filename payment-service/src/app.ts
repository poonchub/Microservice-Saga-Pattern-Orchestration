// src/app.ts
import express from 'express'
import routes from './routes/payment.route'

const app = express()

app.use(express.json())
app.use(routes)

app.listen(4002, () => {
  console.log('Payment service running on 4002')
})