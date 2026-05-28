import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useCartStore } from '../stores/cartStore'
import './ProductCard.css'

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  badge?: string
}

export default function ProductCard({ id, name, price, image, badge }: ProductCardProps) {
  const [showAddedMessage, setShowAddedMessage] = useState(false)
  const { addItem } = useCartStore()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(id, 1)
    setShowAddedMessage(true)
    setTimeout(() => setShowAddedMessage(false), 2000)
  }

  return (
    <div className="product-card-container">
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
      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        {showAddedMessage ? '✓ Added' : 'Add to Cart'}
      </button>
    </div>
  )
}
