import Database from 'better-sqlite3'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SEED_PRODUCTS } from './seedProducts.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const db = new Database(process.env.DB_PATH || path.join(__dirname, 'data.sqlite'))

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT NOT NULL,
    images TEXT NOT NULL DEFAULT '[]',
    stock INTEGER NOT NULL DEFAULT 0,
    category TEXT NOT NULL DEFAULT 'bags'
  );
`)

function seedIfEmpty() {
  const { count } = db.prepare('SELECT COUNT(*) AS count FROM products').get()
  if (count > 0) {
    return
  }

  const insert = db.prepare(`
    INSERT INTO products (id, name, description, price, image, images, stock, category)
    VALUES (@id, @name, @description, @price, @image, @images, @stock, @category)
  `)

  const insertMany = db.transaction((products) => {
    for (const product of products) {
      insert.run({ ...product, images: JSON.stringify(product.images ?? []) })
    }
  })

  insertMany(SEED_PRODUCTS)
  console.log(`Seeded ${SEED_PRODUCTS.length} products`)
}

seedIfEmpty()
