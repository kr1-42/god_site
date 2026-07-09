import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useCartStore } from '../stores/cartStore'
import './ProductCard.css'

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  images?: string[]
  badge?: string
}

export default function ProductCard({ id, name, price, image, images, badge }: ProductCardProps) {
  const [showAddedMessage, setShowAddedMessage] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)
  const { addItem } = useCartStore()

  const imageSet = images && images.length > 0 ? images : [image]

  useEffect(() => {
    if (!hovered || imageSet.length < 2) {
      return
    }

    const intervalId = window.setInterval(() => {
      setImageIndex(current => (current + 1) % imageSet.length)
    }, 1400)

    return () => window.clearInterval(intervalId)
  }, [hovered, imageSet.length])

  useEffect(() => {
    if (!hovered) {
      setImageIndex(0)
    }
  }, [hovered])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(id, 1)
    setShowAddedMessage(true)
    setTimeout(() => setShowAddedMessage(false), 2000)
  }

  return (
    <div className="product-card-container">
      <Link
        to={`/product/${id}`}
        className="product-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="product-image-wrapper">
          {badge && <div className="product-badge">{badge}</div>}
          <img src={imageSet[imageIndex]} alt={name} className="product-image" />
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
