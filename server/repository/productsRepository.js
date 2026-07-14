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
    INSERT INTO products (id, name, description, price, image, images, stock, category)
    VALUES (@id, @name, @description, @price, @image, @images, @stock, @category)
  `).run({ ...product, images: JSON.stringify(product.images ?? []) })

  return getProductById(product.id)
}
