import { db } from '../db.js'

function parseRow(row) {
  return { ...row, images: JSON.parse(row.images) }
}

export function listProducts() {
  return db.prepare('SELECT * FROM products').all().map(parseRow)
}

export function getProductById(id) {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id)
  return row ? parseRow(row) : undefined
}

export function insertProduct(product) {
  db.prepare(`
    INSERT INTO products (id, name, description, price, image, images, stock, category, status)
    VALUES (@id, @name, @description, @price, @image, @images, @stock, @category, @status)
  `).run({
    ...product,
    images: JSON.stringify(product.images ?? []),
    status: product.status ?? 'active',
  })

  return getProductById(product.id)
}

const UPDATABLE_FIELDS = ['name', 'description', 'price', 'image', 'images', 'stock', 'category', 'status']

export function updateProduct(id, patch) {
  const existing = getProductById(id)
  if (!existing) {
    return undefined
  }

  const fields = Object.keys(patch).filter((key) => UPDATABLE_FIELDS.includes(key))
  if (fields.length === 0) {
    return existing
  }

  const assignments = fields.map((field) => `${field} = @${field}`).join(', ')
  const params = { id }
  for (const field of fields) {
    params[field] = field === 'images' ? JSON.stringify(patch.images ?? []) : patch[field]
  }

  db.prepare(`UPDATE products SET ${assignments} WHERE id = @id`).run(params)

  return getProductById(id)
}
