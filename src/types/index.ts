// Core domain types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  images?: string[]
  stock: number
  category: 'bags' | 'dogs'
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
