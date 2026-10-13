import { db } from '../db.js'

const SELECT = 'SELECT slug, name, name_it AS nameIt FROM categories'

export function listCategories() {
  return db.prepare(`${SELECT} ORDER BY created_at, rowid`).all()
}

export function getCategory(slug) {
  return db.prepare(`${SELECT} WHERE slug = ?`).get(slug)
}

export function insertCategory(category) {
  db.prepare('INSERT INTO categories (slug, name, name_it) VALUES (@slug, @name, @nameIt)').run({
    ...category,
    nameIt: category.nameIt ?? '',
  })
  return getCategory(category.slug)
}

export function updateCategory(slug, { name, nameIt }) {
  if (name !== undefined) db.prepare('UPDATE categories SET name = ? WHERE slug = ?').run(name, slug)
  if (nameIt !== undefined) db.prepare('UPDATE categories SET name_it = ? WHERE slug = ?').run(nameIt, slug)
  return getCategory(slug)
}

export function countProductsInCategory(slug) {
  return db.prepare('SELECT COUNT(*) AS count FROM products WHERE category = ?').get(slug).count
}

export function deleteCategory(slug) {
  return db.prepare('DELETE FROM categories WHERE slug = ?').run(slug).changes > 0
}
