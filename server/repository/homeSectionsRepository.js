import { db } from '../db.js'

export const HOME_SECTIONS = ['newArrivals', 'inEvidence']

export function getHomeSections() {
  const rows = db.prepare('SELECT section, product_id FROM home_sections ORDER BY section, position').all()
  const sections = Object.fromEntries(HOME_SECTIONS.map((section) => [section, []]))
  for (const row of rows) {
    sections[row.section]?.push(row.product_id)
  }
  return sections
}

export const setHomeSection = db.transaction((section, productIds) => {
  db.prepare('DELETE FROM home_sections WHERE section = ?').run(section)
  const insert = db.prepare('INSERT INTO home_sections (section, product_id, position) VALUES (?, ?, ?)')
  productIds.forEach((id, index) => insert.run(section, id, index))
})
