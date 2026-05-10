import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import './Cart.css'

export default function CartPage() {
  // Mock cart data
  const cartItems = [
    {
      id: '1',
      name: 'Crystal Black Bag',
      price: 1850,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop',
    },
    {
      id: '2',
      name: 'Minimal Leather Tote',
      price: 1650,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=200&h=200&fit=crop',
    },
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 50
  const total = subtotal + shipping

  return (
    <Layout>
      <section className="cart-section">
        <div className="container">
          <h1>Shopping Cart</h1>

          {cartItems.length > 0 ? (
            <div className="cart-layout">
              <div className="cart-items">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="cart-item-info">
                      <h3>{item.name}</h3>
                      <p className="item-price">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="cart-item-quantity">
                      <input type="number" min="1" defaultValue={item.quantity} />
                    </div>
                    <div className="cart-item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button className="remove-button" aria-label="Remove item">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <h2>Order Summary</h2>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="summary-row tax">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button className="checkout-button">Proceed to Checkout</button>
                <Link to="/catalog" className="continue-shopping">Continue Shopping</Link>
              </div>
            </div>
          ) : (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <Link to="/catalog" className="continue-shopping">Start Shopping</Link>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
