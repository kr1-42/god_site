import express from 'express'
import cors from 'cors'
import './db.js'
import productsRouter from './routes/products.js'
import adminRouter from './routes/admin.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/products', productsRouter)
app.use('/api/admin', adminRouter)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`API listening on :${PORT}`))
