import { useState } from 'react'
import Layout from '../components/Layout'
import './Product.css'

const productData = {
  id: '1',
  name: 'Crystal Black Bag',
  price: 1850,
  description: 'A timeless luxury handbag crafted with meticulous attention to detail. Made from premium black leather with hand-finished edges and gold-plated hardware.',
  image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop',
  images: [
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=800&fit=crop',
  ],
  details: [
    'Material: Genuine leather',
    'Hardware: 24k gold-plated',
    'Dimensions: 35cm × 25cm × 12cm',
    'Weight: 1.2kg',
    'Interior: Silk lining with zippered pocket',
    'Care: Professional leather cleaning recommended',
  ],
  inStock: true,
}

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <Layout>
      <section className="product-section">
        <div className="container">
          <div className="product-layout">
            <div className="product-images">
              <div className="main-image">
                <img src={productData.images[selectedImage]} alt={productData.name} />
              </div>
              <div className="thumbnail-images">
                {productData.images.map((image, index) => (
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
                {productData.inStock ? (
                  <span className="in-stock">In Stock</span>
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
                <button className="add-to-cart">Add to Cart</button>
                <button className="wishlist-button" aria-label="Add to wishlist">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              </div>

              <div className="product-specifications">
                <h3>Details</h3>
                <ul>
                  {productData.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
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
