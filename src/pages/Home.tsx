import Layout from '../components/Layout'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import { DOG_PRODUCTS, PRODUCTS } from '../services/productData'
import './Home.css'

export default function HomePage() {
  const carouselProducts = [
    ...PRODUCTS.slice(0, 3).map((product, index) => ({
      ...product,
      badge: index === 0 ? 'New' : undefined,
    })),
    ...DOG_PRODUCTS.slice(0, 3).map((product, index) => ({
      ...product,
      badge: index === 0 ? 'New' : undefined,
    })),
  ]

  return (
    <Layout>
      <Hero
        title="Crystal Black"
        badge="New Collection"
        backgroundImage="/attachments/showcase.jpg"
      />
      <section className="new-arrivals-section carousel-section">
        <div className="container">
          <div className="section-header">
            <h2>New Arrivals</h2>
          </div>
          <div className="carousel-shell" aria-label="Bags and dogs product carousel">
            {carouselProducts.map((product) => (
              <div key={product.id} className="carousel-item">
                <ProductCard {...product} />
              </div>
            ))}
          </div>
          <p className="carousel-note">Scroll sideways to browse bags and dogs.</p>
        </div>
      </section>
    </Layout>
  )
}
