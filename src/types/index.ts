// Core domain types
export interface Product {
  id: string
  name: string
  description: string
  descriptionIt?: string
  /** One list item per line */
  details?: string
  detailsIt?: string
  /** One list item per line */
  dimensions?: string
  dimensionsIt?: string
  price: number
  image: string
  images?: string[]
  stock: number
  category: string
  status: 'active' | 'inactive'
}

export interface Category {
  slug: string
  name: string
  nameIt?: string
}

export interface CartItem {
  productId: string
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  createdAt: Date
}
