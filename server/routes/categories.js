import { Router } from 'express'
import { requireAdmin } from '../middleware/auth.js'
import { categoryInputSchema, categoryUpdateSchema } from '../validation.js'
import {
  listCategories,
  getCategory,
  insertCategory,
  updateCategory,
  countProductsInCategory,
  deleteCategory,
} from '../repository/categoriesRepository.js'

const router = Router()

function slugify(name) {
  return name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

router.get('/', (req, res) => {
  res.json(listCategories())
})

router.post('/', requireAdmin, (req, res) => {
  const result = categoryInputSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ error: 'Category name is required', issues: result.error.issues })
  }

  const slug = slugify(result.data.name)
  if (!slug) {
    return res.status(400).json({ error: 'Category name must contain letters or numbers' })
  }
  if (getCategory(slug)) {
    return res.status(409).json({ error: `Category "${result.data.name}" already exists` })
  }

  res.status(201).json(insertCategory({ slug, name: result.data.name, nameIt: result.data.nameIt }))
})

// The slug stays the same so existing product links keep working
router.patch('/:slug', requireAdmin, (req, res) => {
  const result = categoryUpdateSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid category', issues: result.error.issues })
  }
  if (!getCategory(req.params.slug)) {
    return res.status(404).json({ error: 'Category not found' })
  }

  res.json(updateCategory(req.params.slug, result.data))
})

router.delete('/:slug', requireAdmin, (req, res) => {
  const inUse = countProductsInCategory(req.params.slug)
  if (inUse > 0) {
    return res.status(409).json({ error: `Can't delete: ${inUse} product(s) still use this category` })
  }
  if (!deleteCategory(req.params.slug)) {
    return res.status(404).json({ error: 'Category not found' })
  }
  res.status(204).end()
})

export default router
