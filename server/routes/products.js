import { Router } from 'express'
import crypto from 'node:crypto'
import { requireAdmin } from '../middleware/auth.js'
import { productInputSchema, productUpdateSchema, productOrderSchema } from '../validation.js'
import { listProducts, getProductById, insertProduct, updateProduct, deleteProduct, reorderProducts, duplicateProduct } from '../repository/productsRepository.js'
import { getCategory } from '../repository/categoriesRepository.js'

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
  if (!getCategory(result.data.category)) {
    return res.status(400).json({ error: `Unknown category "${result.data.category}"` })
  }

  const product = insertProduct({ id: crypto.randomUUID(), ...result.data })
  res.status(201).json(product)
})

router.post('/:id/duplicate', requireAdmin, (req, res) => {
  const product = duplicateProduct(req.params.id, crypto.randomUUID())
  if (!product) {
    return res.status(404).json({ error: 'Product not found' })
  }
  res.status(201).json(product)
})

router.put('/order', requireAdmin, (req, res) => {
  const result = productOrderSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid order', issues: result.error.issues })
  }

  reorderProducts(result.data.ids)
  res.json(listProducts())
})

router.patch('/:id', requireAdmin, (req, res) => {
  const result = productUpdateSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid product', issues: result.error.issues })
  }
  if (result.data.category && !getCategory(result.data.category)) {
    return res.status(400).json({ error: `Unknown category "${result.data.category}"` })
  }

  const product = updateProduct(req.params.id, result.data)
  if (!product) {
    return res.status(404).json({ error: 'Product not found' })
  }

  res.json(product)
})

router.delete('/:id', requireAdmin, (req, res) => {
  if (!deleteProduct(req.params.id)) {
    return res.status(404).json({ error: 'Product not found' })
  }
  res.status(204).end()
})

export default router
