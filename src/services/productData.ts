import { Product } from '../types'

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Crystal Black Bag',
    description: 'Elegant crystal black leather bag perfect for any occasion',
    price: 1850,
    image: '/attachments/prod1.jpg',
    stock: 5,
  },
  {
    id: '2',
    name: 'Minimal Leather Tote',
    description: 'Minimalist design leather tote with spacious interior',
    price: 1650,
    image: '/attachments/prod2.jpg',
    stock: 8,
  },
  {
    id: '3',
    name: 'Textured Crossbody',
    description: 'Stylish crossbody bag with textured finish',
    price: 1450,
    image: '/attachments/prod3.jpg',
    stock: 6,
  },
]

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id)
}

export function getProductsByIds(ids: string[]): Product[] {
  return ids.map(id => getProductById(id)).filter((p): p is Product => !!p)
}
