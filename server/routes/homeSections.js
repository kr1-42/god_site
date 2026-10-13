import { Router } from 'express'
import { requireAdmin } from '../middleware/auth.js'
import { homeSectionSchema } from '../validation.js'
import { getProductById } from '../repository/productsRepository.js'
import { HOME_SECTIONS, getHomeSections, setHomeSection } from '../repository/homeSectionsRepository.js'

const router = Router()

router.get('/', (req, res) => {
  res.json(getHomeSections())
})

router.put('/:section', requireAdmin, (req, res) => {
  if (!HOME_SECTIONS.includes(req.params.section)) {
    return res.status(404).json({ error: 'Unknown homepage section' })
  }

  const result = homeSectionSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid section', issues: result.error.issues })
  }

  const ids = [...new Set(result.data.ids)]
  const unknown = ids.filter((id) => !getProductById(id))
  if (unknown.length > 0) {
    return res.status(400).json({ error: 'Some products no longer exist', unknown })
  }

  setHomeSection(req.params.section, ids)
  res.json(getHomeSections())
})

export default router
