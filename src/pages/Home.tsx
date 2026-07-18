import Layout from '../components/Layout'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../services/products'
import './Home.css'

export default function HomePage() {
  const { data: allProducts = [], isLoading } = useProducts()
  const products = allProducts.filter((product) => product.status === 'active')
  const bagProducts = products.filter((product) => product.category === 'bags')
  const dogProducts = products.filter((product) => product.category === 'dogs')

  const newArrivals = [...bagProducts.slice(0, 2), ...dogProducts.slice(0, 1)].map(
    (product, index) => ({
      ...product,
      badge: index === 0 ? 'New' : undefined,
    })
  )

  const inEvidence = [...bagProducts.slice(2, 4), ...dogProducts.slice(1, 3)]

  if (isLoading) {
    return (
      <Layout>
        <div className="container">
          <p>Loading…</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Hero
        title=""
        badge="New Collection"
        backgroundImage="/attachments/hero.jpeg"
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
