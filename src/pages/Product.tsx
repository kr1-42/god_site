import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useCartStore } from '../stores/cartStore'
import { useProduct } from '../services/products'
import { flyHeartToCart } from '../utils/flyToCart'
import { useTranslation } from '../stores/languageStore'
import './Product.css'

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const { addItem } = useCartStore()
  const { t, describe, listItems } = useTranslation()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showAddedMessage, setShowAddedMessage] = useState(false)

  const { data: productData, isLoading } = useProduct(id ?? '')

  if (isLoading) {
    return (
      <Layout>
        <section className="product-section">
          <div className="container">
            <p>{t('common.loading')}</p>
          </div>
        </section>
      </Layout>
    )
  }

  if (!productData) {
    return (
      <Layout>
        <section className="product-section">
          <div className="container">
            <div className="product-not-found">
              <h1>{t('product.notFound')}</h1>
              <p>{t('product.notFoundText')}</p>
              <Link to="/catalog" className="back-link">{t('product.backToCatalog')}</Link>
            </div>
          </div>
        </section>
      </Layout>
    )
  }

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    addItem(productData.id, quantity)
    flyHeartToCart(e.currentTarget)
    setShowAddedMessage(true)
    setTimeout(() => setShowAddedMessage(false), 2000)
  }

  const details = listItems(productData, 'details')
  const dimensions = listItems(productData, 'dimensions')

  const images = productData.images && productData.images.length > 0
    ? productData.images
    : [productData.image]

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
                    <img src={image} alt={t('product.view', { name: productData.name, index: index + 1 })} />
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
                <p>{describe(productData)}</p>
              </div>

              {(details.length > 0 || dimensions.length > 0) && (
                <div className="product-info-lists">
                  {details.length > 0 && (
                    <div className="product-info-list">
                      <h3>{t('product.details')}</h3>
                      <ul>
                        {details.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {dimensions.length > 0 && (
                    <div className="product-info-list">
                      <h3>{t('product.dimensions')}</h3>
                      <ul>
                        {dimensions.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="product-status">
                {productData.stock > 0 ? (
                  <span className="in-stock">{t('product.inStock', { count: productData.stock })}</span>
                ) : (
                  <span className="out-of-stock">{t('product.outOfStock')}</span>
                )}
              </div>

              <div className="product-purchase">
                <div className="product-options">
                  <div className="quantity-selector">
                    <label htmlFor="quantity">{t('product.quantity')}</label>
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
                    {showAddedMessage ? t('product.addedToCart') : t('common.addToCart')}
                  </button>
                  <button className="wishlist-button" aria-label={t('product.wishlist')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <Link to="/cart" className="go-to-cart">{t('product.goToCart')}</Link>

              <div className="product-info-lists product-info-lists--shipping">
                <div className="product-info-list">
                  <h3>{t('product.shippingReturns')}</h3>
                  <ul>
                    <li>{t('product.shippingItaly')}</li>
                    <li>{t('product.shippingItalyFree')}</li>
                    <li>{t('product.shippingEu')}</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
