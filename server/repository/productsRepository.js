import { db } from '../db.js'

function parseRow({ sort_order, description_it, details_it, dimensions_it, ...row }) {
  return {
    ...row,
    descriptionIt: description_it,
    detailsIt: details_it,
    dimensionsIt: dimensions_it,
    images: JSON.parse(row.images),
  }
}

export function listProducts() {
  return db.prepare('SELECT * FROM products ORDER BY sort_order, rowid').all().map(parseRow)
}

export function getProductById(id) {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id)
  return row ? parseRow(row) : undefined
}

export function insertProduct(product) {
  db.prepare(`
    INSERT INTO products (id, name, description, description_it, details, details_it, dimensions, dimensions_it,
      price, image, images, stock, category, status, sort_order)
    VALUES (@id, @name, @description, @descriptionIt, @details, @detailsIt, @dimensions, @dimensionsIt,
      @price, @image, @images, @stock, @category, @status,
      (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM products))
  `).run({
    ...product,
    images: JSON.stringify(product.images ?? []),
    descriptionIt: product.descriptionIt ?? '',
    details: product.details ?? '',
    detailsIt: product.detailsIt ?? '',
    dimensions: product.dimensions ?? '',
    dimensionsIt: product.dimensionsIt ?? '',
    status: product.status ?? 'active',
  })

  return getProductById(product.id)
}

const UPDATABLE_FIELDS = [
  'name', 'description', 'descriptionIt', 'details', 'detailsIt', 'dimensions', 'dimensionsIt',
  'price', 'image', 'images', 'stock', 'category', 'status',
]
const COLUMNS = { descriptionIt: 'description_it', detailsIt: 'details_it', dimensionsIt: 'dimensions_it' }

export function updateProduct(id, patch) {
  const existing = getProductById(id)
  if (!existing) {
    return undefined
  }

  const fields = Object.keys(patch).filter((key) => UPDATABLE_FIELDS.includes(key))
  if (fields.length === 0) {
    return existing
  }

  const assignments = fields.map((field) => `${COLUMNS[field] ?? field} = @${field}`).join(', ')
  const params = { id }
  for (const field of fields) {
    params[field] = field === 'images' ? JSON.stringify(patch.images ?? []) : patch[field]
  }

  db.prepare(`UPDATE products SET ${assignments} WHERE id = @id`).run(params)

  return getProductById(id)
}

export function deleteProduct(id) {
  db.prepare('DELETE FROM home_sections WHERE product_id = ?').run(id)
  return db.prepare('DELETE FROM products WHERE id = ?').run(id).changes > 0
}

// Sets each product's shop position to its index in `ids`
export const reorderProducts = db.transaction((ids) => {
  const update = db.prepare('UPDATE products SET sort_order = ? WHERE id = ?')
  ids.forEach((id, index) => update.run(index, id))
})

// Copies a product (as inactive, named "… (copy)") and places it right after the original
export const duplicateProduct = db.transaction((id, newId) => {
  const original = db.prepare('SELECT * FROM products WHERE id = ?').get(id)
  if (!original) {
    return undefined
  }

  db.prepare('UPDATE products SET sort_order = sort_order + 1 WHERE sort_order > ?').run(original.sort_order)
  db.prepare(`
    INSERT INTO products (id, name, description, description_it, details, details_it, dimensions, dimensions_it,
      price, image, images, stock, category, status, sort_order)
    SELECT @newId, name || ' (copy)', description, description_it, details, details_it, dimensions, dimensions_it,
      price, image, images, stock, category, 'inactive', sort_order + 1
    FROM products WHERE id = @id
  `).run({ id, newId })

  return getProductById(newId)
})
