import express, { Router } from 'express'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { requireAdmin } from '../middleware/auth.js'

export const UPLOADS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'uploads')
fs.mkdirSync(UPLOADS_DIR, { recursive: true })

const EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}

const router = Router()

router.post(
  '/',
  requireAdmin,
  express.raw({ type: Object.keys(EXTENSIONS), limit: '10mb' }),
  (req, res) => {
    const ext = EXTENSIONS[req.headers['content-type']]
    if (!ext || !Buffer.isBuffer(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Upload a JPEG, PNG, WebP, GIF or AVIF image' })
    }

    const filename = `${crypto.randomUUID()}.${ext}`
    fs.writeFileSync(path.join(UPLOADS_DIR, filename), req.body)
    res.status(201).json({ url: `/api/uploads/${filename}` })
  },
)

router.use(express.static(UPLOADS_DIR, { maxAge: '7d' }))

export default router
