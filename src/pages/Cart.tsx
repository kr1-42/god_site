import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Layout from '../components/Layout'
import { useCartStore } from '../stores/cartStore'
import { Product } from '../types'
import { useProducts } from '../services/products'
import { useTranslation } from '../stores/languageStore'
import './Cart.css'

export default function CartPage() {
  const navigate = useNavigate()
  const { items, removeItem, updateQuantity } = useCartStore()
  const { t } = useTranslation()
  const { data: allProducts = [], isLoading } = useProducts()
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(items.map(item => [item.productId, item.quantity]))
  )

  const cartItemsWithProduct: (Product & { quantity: number })[] = items
    .map(item => {
      const product = allProducts.find(p => p.id === item.productId)
      if (product) {
        return { ...product, quantity: quantities[item.productId] || item.quantity }
      }
      return null
    })
    .filter((item): item is Product & { quantity: number } => item !== null)

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      setQuantities(prev => ({ ...prev, [productId]: newQuantity }))
      updateQuantity(productId, newQuantity)
    }
  }

  const handleRemove = (productId: string) => {
    removeItem(productId)
    const newQuantities = { ...quantities }
    delete newQuantities[productId]
    setQuantities(newQuantities)
  }

  const subtotal = cartItemsWithProduct.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 50
  const total = subtotal + shipping

  if (isLoading && items.length > 0) {
    return (
      <Layout>
        <section className="cart-section">
          <div className="container">
            <h1>{t('cart.title')}</h1>
            <p>{t('common.loading')}</p>
          </div>
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="cart-section">
        <div className="container">
          <h1>{t('cart.title')}</h1>

          {cartItemsWithProduct.length > 0 ? (
            <div className="cart-layout">
              <div className="cart-items">
                {cartItemsWithProduct.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="cart-item-info">
                      <h3>{item.name}</h3>
                      <p className="item-price">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="cart-item-quantity">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="cart-item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      className="remove-button"
                      aria-label={t('cart.remove')}
                      onClick={() => handleRemove(item.id)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <h2>{t('common.orderSummary')}</h2>
                <div className="summary-row">
                  <span>{t('common.subtotal')}</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>{t('common.shipping')}</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="summary-row tax">
                  <span>{t('common.tax')}</span>
                  <span>{t('cart.taxAtCheckout')}</span>
                </div>
                <div className="summary-total">
                  <span>{t('common.total')}</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button
                  className="checkout-button"
                  onClick={() => navigate('/checkout')}
                >
                  {t('cart.checkout')}
                </button>
                <Link to="/catalog" className="continue-shopping">{t('common.continueShopping')}</Link>
              </div>
            </div>
          ) : (
            <div className="empty-cart">
              <p>{t('cart.empty')}</p>
              <Link to="/catalog" className="continue-shopping">{t('cart.startShopping')}</Link>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
