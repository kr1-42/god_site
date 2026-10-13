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
    description_it TEXT NOT NULL DEFAULT '',
    details TEXT NOT NULL DEFAULT '',
    details_it TEXT NOT NULL DEFAULT '',
    dimensions TEXT NOT NULL DEFAULT '',
    dimensions_it TEXT NOT NULL DEFAULT '',
    price REAL NOT NULL,
    image TEXT NOT NULL,
    images TEXT NOT NULL DEFAULT '[]',
    stock INTEGER NOT NULL DEFAULT 0,
    category TEXT NOT NULL DEFAULT 'bags',
    status TEXT NOT NULL DEFAULT 'active',
    sort_order INTEGER NOT NULL DEFAULT 0
  );
`)

function migrateAddStatusColumn() {
  const columns = db.prepare('PRAGMA table_info(products)').all()
  const hasStatus = columns.some((column) => column.name === 'status')
  if (!hasStatus) {
    db.exec("ALTER TABLE products ADD COLUMN status TEXT NOT NULL DEFAULT 'active'")
  }
}

migrateAddStatusColumn()

function migrateAddSortOrderColumn() {
  const columns = db.prepare('PRAGMA table_info(products)').all()
  if (!columns.some((column) => column.name === 'sort_order')) {
    db.exec('ALTER TABLE products ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0')
    db.exec('UPDATE products SET sort_order = rowid')
  }
}

migrateAddSortOrderColumn()

function migrateAddDescriptionItColumn() {
  const columns = db.prepare('PRAGMA table_info(products)').all()
  if (!columns.some((column) => column.name === 'description_it')) {
    db.exec("ALTER TABLE products ADD COLUMN description_it TEXT NOT NULL DEFAULT ''")
  }
}

migrateAddDescriptionItColumn()

// Details and dimensions are stored as text with one list item per line
function migrateAddDetailsColumns() {
  const columns = db.prepare('PRAGMA table_info(products)').all()
  for (const name of ['details', 'details_it', 'dimensions', 'dimensions_it']) {
    if (!columns.some((column) => column.name === name)) {
      db.exec(`ALTER TABLE products ADD COLUMN ${name} TEXT NOT NULL DEFAULT ''`)
    }
  }
}

migrateAddDetailsColumns()

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    slug TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_it TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`)

function migrateAddCategoryNameItColumn() {
  const columns = db.prepare('PRAGMA table_info(categories)').all()
  if (!columns.some((column) => column.name === 'name_it')) {
    db.exec("ALTER TABLE categories ADD COLUMN name_it TEXT NOT NULL DEFAULT ''")
  }
  // The two original categories had hard-coded Italian names; keep them
  db.exec("UPDATE categories SET name_it = 'Borse' WHERE slug = 'bags' AND name_it = ''")
  db.exec("UPDATE categories SET name_it = 'Cani' WHERE slug = 'dogs' AND name_it = ''")
}

function seedCategories() {
  const insert = db.prepare('INSERT OR IGNORE INTO categories (slug, name) VALUES (?, ?)')
  const { count } = db.prepare('SELECT COUNT(*) AS count FROM categories').get()
  if (count === 0) {
    insert.run('bags', 'Bags')
    insert.run('dogs', 'Dogs')
  }
  // Make sure every category already used by a product exists
  for (const { category } of db.prepare('SELECT DISTINCT category FROM products').all()) {
    insert.run(category, category.charAt(0).toUpperCase() + category.slice(1))
  }
}

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

// Products hand-picked for the homepage sections, in display order
db.exec(`
  CREATE TABLE IF NOT EXISTS home_sections (
    section TEXT NOT NULL,
    product_id TEXT NOT NULL,
    position INTEGER NOT NULL,
    PRIMARY KEY (section, product_id)
  );
`)

seedIfEmpty()
seedCategories()
migrateAddCategoryNameItColumn()
