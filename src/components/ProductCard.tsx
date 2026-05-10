import { Link } from 'react-router-dom'
import './ProductCard.css'

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  badge?: string
}

export default function ProductCard({ id, name, price, image, badge }: ProductCardProps) {
  return (
    <Link to={`/product/${id}`} className="product-card">
      <div className="product-image-wrapper">
        {badge && <div className="product-badge">{badge}</div>}
        <img src={image} alt={name} className="product-image" />
      </div>
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-price">${price.toFixed(2)}</p>
      </div>
    </Link>
  )
}
