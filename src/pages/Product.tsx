import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useCartStore } from '../stores/cartStore'
import { getProductById } from '../services/productData'
import './Product.css'

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const { addItem } = useCartStore()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showAddedMessage, setShowAddedMessage] = useState(false)

  const productData = id ? getProductById(id) : null

  if (!productData) {
    return (
      <Layout>
        <section className="product-section">
          <div className="container">
            <div className="product-not-found">
              <h1>Product not found</h1>
              <p>The product you're looking for doesn't exist.</p>
              <Link to="/catalog" className="back-link">Back to Catalog</Link>
            </div>
          </div>
        </section>
      </Layout>
    )
  }

  const handleAddToCart = () => {
    addItem(productData.id, quantity)
    setShowAddedMessage(true)
    setTimeout(() => setShowAddedMessage(false), 2000)
  }

  // Use the product image as the only image for now
  const images = [productData.image, productData.image, productData.image]

  return (
    <Layout>
      <section className="product-section">
        <div className="container">
          <div className="product-layout">
            <div className="product-images">
              <div className="main-image">
                <img src={images[selectedImage]} alt={productData.name} />
              </div>
              <div className="thumbnail-images">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${productData.name} view ${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="product-details">
              <div className="product-header">
                <h1>{productData.name}</h1>
                <p className="price">${productData.price.toFixed(2)}</p>
              </div>

              <div className="product-description">
                <p>{productData.description}</p>
              </div>

              <div className="product-status">
                {productData.stock > 0 ? (
                  <span className="in-stock">In Stock ({productData.stock} available)</span>
                ) : (
                  <span className="out-of-stock">Out of Stock</span>
                )}
              </div>

              <div className="product-options">
                <div className="quantity-selector">
                  <label htmlFor="quantity">Quantity</label>
                  <div className="quantity-input">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    />
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                </div>
              </div>

              <div className="product-actions">
                <button
                  className="add-to-cart"
                  onClick={handleAddToCart}
                  disabled={productData.stock === 0}
                >
                  {showAddedMessage ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
                <button className="wishlist-button" aria-label="Add to wishlist">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              </div>

              <div className="product-specifications">
                <h3>Details</h3>
                <ul>
                  <li>Product ID: {productData.id}</li>
                  <li>Price: ${productData.price.toFixed(2)}</li>
                  <li>Stock: {productData.stock} available</li>
                </ul>
              </div>

              <div className="product-shipping">
                <h3>Shipping & Returns</h3>
                <p>Free express shipping worldwide on orders over $500. Returns accepted within 30 days of purchase.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
