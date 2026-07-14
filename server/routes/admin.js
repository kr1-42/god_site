import { Router } from 'express'
import crypto from 'node:crypto'
import { signAdminToken } from '../middleware/auth.js'

const router = Router()

function safeEquals(a, b) {
  const hashA = crypto.createHash('sha256').update(a).digest()
  const hashB = crypto.createHash('sha256').update(b).digest()
  return crypto.timingSafeEqual(hashA, hashB)
}

router.post('/login', (req, res) => {
  const { password } = req.body || {}

  if (typeof password !== 'string' || !safeEquals(password, process.env.ADMIN_PASSWORD)) {
    return res.status(401).json({ error: 'Invalid password' })
  }

  res.json({ token: signAdminToken() })
})

export default router
