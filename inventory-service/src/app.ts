// src/app.ts
import express from 'express'
import routes from './routes/inventory.route'

const app = express()

app.use(express.json())
app.use(routes)

app.listen(4001, () => {
  console.log('Inventory service running on 4001')
})