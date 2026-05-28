import Layout from '../components/Layout'
import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'
import { PRODUCTS } from '../services/productData'
import './Home.css'

export default function HomePage() {
  // Use first 3 products for featured and rotate for new arrivals
  const featuredProducts = PRODUCTS.map(p => ({ ...p, badge: p.id === '1' ? 'New' : undefined }))
  const newArrivals = PRODUCTS.map(p => ({ ...p, badge: ['1', '2'].includes(p.id) ? 'New' : undefined }))

  return (
    <Layout>
      <Hero
        title="Crystal Black"
        badge="New Collection"
        backgroundImage="/attachments/showcase.jpg"
      />

      <section className="promo-banner">
        <div className="container">
          <p>Free Express Shipping Worldwide</p>
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Collection</h2>
          </div>
          <ProductGrid products={featuredProducts} columns={2} />
        </div>
      </section>

      <section className="new-arrivals-section">
        <div className="container">
          <div className="section-header">
            <h2>New Arrivals</h2>
          </div>
          <ProductGrid products={newArrivals} columns={2} />
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Discover Our Craftsmanship</h2>
            <p>Each piece is carefully designed and handcrafted using premium materials.</p>
            <a href="/catalog" className="cta-button">Explore Collection</a>
          </div>
        </div>
      </section>
    </Layout>
  )
}
