import jwt from 'jsonwebtoken'

if (!process.env.ADMIN_PASSWORD) {
  throw new Error('ADMIN_PASSWORD environment variable must be set to run the server')
}

if (!process.env.ADMIN_JWT_SECRET) {
  console.warn('ADMIN_JWT_SECRET not set — using an insecure development-only default. Set it explicitly in production.')
}

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'dev-only-insecure-secret'

export function signAdminToken() {
  return jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '12h' })
}

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : null

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    if (payload.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    next()
  } catch {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}
