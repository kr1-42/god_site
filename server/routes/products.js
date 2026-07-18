import { Router } from 'express'
import crypto from 'node:crypto'
import { requireAdmin } from '../middleware/auth.js'
import { productInputSchema, productUpdateSchema } from '../validation.js'
import { listProducts, getProductById, insertProduct, updateProduct } from '../repository/productsRepository.js'

const router = Router()

router.get('/', (req, res) => {
  res.json(listProducts())
})

router.get('/:id', (req, res) => {
  const product = getProductById(req.params.id)
  if (!product) {
    return res.status(404).json({ error: 'Product not found' })
  }
  res.json(product)
})

router.post('/', requireAdmin, (req, res) => {
  const result = productInputSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid product', issues: result.error.issues })
  }

  const product = insertProduct({ id: crypto.randomUUID(), ...result.data })
  res.status(201).json(product)
})

router.patch('/:id', requireAdmin, (req, res) => {
  const result = productUpdateSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid product', issues: result.error.issues })
  }

  const product = updateProduct(req.params.id, result.data)
  if (!product) {
    return res.status(404).json({ error: 'Product not found' })
  }

  res.json(product)
})

export default router
