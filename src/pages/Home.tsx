import Layout from '../components/Layout'
import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'
import './Home.css'

const featuredProducts = [
  {
    id: '1',
    name: 'Crystal Black Bag',
    price: 1850,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop',
    badge: 'New',
  },
  {
    id: '2',
    name: 'Minimal Leather Tote',
    price: 1650,
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&h=600&fit=crop',
  },
  {
    id: '3',
    name: 'Textured Crossbody',
    price: 1450,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop',
  },
  {
    id: '4',
    name: 'Modern Clutch',
    price: 950,
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&h=600&fit=crop',
  },
]

const newArrivals = [
  {
    id: '5',
    name: 'Woven Handle Bag',
    price: 1750,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop',
    badge: 'New',
  },
  {
    id: '6',
    name: 'Sleek Crossbody',
    price: 1350,
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=600&fit=crop',
    badge: 'New',
  },
  {
    id: '7',
    name: 'Classic Hobo',
    price: 1550,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop',
  },
  {
    id: '8',
    name: 'Elegant Evening Bag',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&h=600&fit=crop',
  },
]

export default function HomePage() {
  return (
    <Layout>
      <Hero 
        title="Crystal Black"
        badge="New Collection"
        backgroundImage="https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1400&h=700&fit=crop"
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
