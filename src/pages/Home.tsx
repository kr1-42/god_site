import Layout from '../components/Layout'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import { DOG_PRODUCTS, PRODUCTS } from '../services/productData'
import './Home.css'

export default function HomePage() {
  const newArrivals = [...PRODUCTS.slice(0, 2), ...DOG_PRODUCTS.slice(0, 1)].map(
    (product, index) => ({
      ...product,
      badge: index === 0 ? 'New' : undefined,
    })
  )

  const inEvidence = [...PRODUCTS.slice(2, 4), ...DOG_PRODUCTS.slice(1, 3)]

  return (
    <Layout>
      <Hero
        title="Crystal Black"
        badge="New Collection"
        backgroundImage="/attachments/showcase.jpg"
        subtitle="Structured silhouettes, soft textures, and versatile pieces for everyday movement."
      />

      <section className="home-section feature-section">
        <div className="container">
          <div className="section-header">
            <p className="section-kicker">Just landed</p>
            <h2>New arrivals</h2>
          </div>
          <div className="product-grid product-grid--3col" aria-label="New arrivals">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      <section className="home-section feature-section">
        <div className="container">
          <div className="section-header">
            <p className="section-kicker">Editors' picks</p>
            <h2>In evidence</h2>
          </div>
          <div className="product-grid product-grid--3col" aria-label="In evidence">
            {inEvidence.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}
