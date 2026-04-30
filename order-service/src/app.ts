// src/app.ts
import express from 'express'
import orderRoutes from './routes/order.route'

const app = express()

app.use(express.json())
app.use(orderRoutes)

app.listen(4000, () => {
    console.log('Order service running on port 4000')
})