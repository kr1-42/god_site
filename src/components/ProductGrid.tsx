import ProductCard from './ProductCard'
import './ProductGrid.css'

interface Product {
  id: string
  name: string
  price: number
  image: string
  images?: string[]
  badge?: string
}

interface ProductGridProps {
  products: Product[]
  columns?: number
}

export default function ProductGrid({ products, columns = 2 }: ProductGridProps) {
  return (
    <div className={`product-grid product-grid--${columns}col`}>
      {products.map(product => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  )
}
