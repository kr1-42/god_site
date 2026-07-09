import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useCartStore } from '../stores/cartStore'
import { Product } from '../types'
import { getProductById } from '../services/productData'
import './checkout.css'

type Step = 'shipping' | 'payment' | 'review' | 'confirmation'

interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
}

interface PaymentInfo {
  cardName: string
  cardNumber: string
  expiryDate: string
  cvv: string
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, clearCart } = useCartStore()
  const [currentStep, setCurrentStep] = useState<Step>('shipping')
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  })
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  })
  const [orderNumber] = useState(() => `ORD-${Date.now().toString().slice(-8)}`)

  // Get product details for cart items
  const cartItemsWithProduct: (Product & { quantity: number })[] = items
    .map(item => {
      const product = getProductById(item.productId)
      if (product) {
        return { ...product, quantity: item.quantity }
      }
      return null
    })
    .filter((item): item is Product & { quantity: number } => item !== null)

  const subtotal = cartItemsWithProduct.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 50
  const tax = Math.round(subtotal * 0.08 * 100) / 100
  const total = subtotal + shipping + tax

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingInfo(prev => ({ ...prev, [name]: value }))
  }

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target

    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').slice(0, 16)
      value = value.replace(/(\d{4})/g, '$1 ').trim()
    }

    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '').slice(0, 4)
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2)
      }
    }

    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3)
    }

    setPaymentInfo(prev => ({ ...prev, [name]: value }))
  }

  const validateShipping = () => {
    return Object.values(shippingInfo).every(field => field.trim().length > 0)
  }

  const validatePayment = () => {
    const cardNumberDigits = paymentInfo.cardNumber.replace(/\s/g, '')
    return (
      paymentInfo.cardName.trim().length > 0 &&
      cardNumberDigits.length === 16 &&
      /^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate) &&
      paymentInfo.cvv.length === 3
    )
  }

  const handleNextStep = () => {
    if (currentStep === 'shipping' && validateShipping()) {
      setCurrentStep('payment')
    } else if (currentStep === 'payment' && validatePayment()) {
      setCurrentStep('review')
    } else if (currentStep === 'review') {
      setCurrentStep('confirmation')
      clearCart()
    }
  }

  const handlePrevStep = () => {
    if (currentStep === 'payment') {
      setCurrentStep('shipping')
    } else if (currentStep === 'review') {
      setCurrentStep('payment')
    }
  }

  const steps: Step[] = ['shipping', 'payment', 'review', 'confirmation']
  const stepLabels = {
    shipping: 'Shipping',
    payment: 'Payment',
    review: 'Review',
    confirmation: 'Confirmation',
  }

  return (
    <Layout>
      <section className="checkout-section">
        <div className="container">
          {currentStep !== 'confirmation' && (
            <>
              <h1>Checkout</h1>
              <div className="checkout-progress">
                {steps.slice(0, 3).map((step, index) => (
                  <div key={step} className="progress-item">
                    <div className={`progress-number ${currentStep === step ? 'active' : ''} ${steps.indexOf(currentStep) > index ? 'completed' : ''}`}>
                      {index + 1}
                    </div>
                    <span className={`progress-label ${currentStep === step ? 'active' : ''}`}>
                      {stepLabels[step]}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="checkout-layout">
            {/* Main Form */}
            <div className="checkout-form">
              {currentStep === 'shipping' && (
                <div className="form-section">
                  <h2>Shipping Address</h2>
                  <div className="form-grid">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={shippingInfo.firstName}
                      onChange={handleShippingChange}
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={shippingInfo.lastName}
                      onChange={handleShippingChange}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={shippingInfo.email}
                      onChange={handleShippingChange}
                      style={{ gridColumn: '1 / -1' }}
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      style={{ gridColumn: '1 / -1' }}
                    />
                    <input
                      type="text"
                      name="address"
                      placeholder="Street Address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      style={{ gridColumn: '1 / -1' }}
                    />
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={shippingInfo.state}
                      onChange={handleShippingChange}
                    />
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="ZIP Code"
                      value={shippingInfo.zipCode}
                      onChange={handleShippingChange}
                    />
                  </div>
                </div>
              )}

              {currentStep === 'payment' && (
                <div className="form-section">
                  <h2>Payment Method</h2>
                  <div className="form-grid">
                    <input
                      type="text"
                      name="cardName"
                      placeholder="Cardholder Name"
                      value={paymentInfo.cardName}
                      onChange={handlePaymentChange}
                      style={{ gridColumn: '1 / -1' }}
                    />
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentChange}
                      style={{ gridColumn: '1 / -1' }}
                      maxLength={19}
                    />
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={paymentInfo.expiryDate}
                      onChange={handlePaymentChange}
                      maxLength={5}
                    />
                    <input
                      type="text"
                      name="cvv"
                      placeholder="CVV"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentChange}
                      maxLength={3}
                    />
                  </div>
                </div>
              )}

              {currentStep === 'review' && (
                <div className="form-section">
                  <div className="review-section">
                    <h2>Shipping Address</h2>
                    <div className="review-content">
                      <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                      <p>{shippingInfo.address}</p>
                      <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                      <p>{shippingInfo.email}</p>
                      <p>{shippingInfo.phone}</p>
                    </div>
                  </div>

                  <div className="review-section">
                    <h2>Payment Method</h2>
                    <div className="review-content">
                      <p>{paymentInfo.cardName}</p>
                      <p>Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 'confirmation' && (
                <div className="confirmation-section">
                  <div className="confirmation-icon">✓</div>
                  <h2>Order Confirmed</h2>
                  <p className="confirmation-number">Order Number: <strong>{orderNumber}</strong></p>
                  <p className="confirmation-message">
                    Thank you for your purchase! A confirmation email has been sent to <strong>{shippingInfo.email}</strong>
                  </p>
                  <div className="confirmation-details">
                    <p>We'll notify you when your order ships.</p>
                  </div>
                  <button className="continue-button" onClick={() => navigate('/catalog')}>
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="checkout-summary">
              <h2>Order Summary</h2>
              <div className="summary-items">
                {cartItemsWithProduct.map(item => (
                  <div key={item.id} className="summary-item">
                    <div className="summary-item-details">
                      <p className="summary-item-name">{item.name}</p>
                      <p className="summary-item-qty">Qty: {item.quantity}</p>
                    </div>
                    <p className="summary-item-price">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="totals-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="totals-row">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="totals-row">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="totals-total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {currentStep !== 'confirmation' && (
                <div className="checkout-actions">
                  {currentStep !== 'shipping' && (
                    <button className="btn-secondary" onClick={handlePrevStep}>
                      Back
                    </button>
                  )}
                  <button
                    className="btn-primary"
                    onClick={handleNextStep}
                    disabled={
                      (currentStep === 'shipping' && !validateShipping()) ||
                      (currentStep === 'payment' && !validatePayment())
                    }
                  >
                    {currentStep === 'review' ? 'Complete Order' : 'Continue'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
