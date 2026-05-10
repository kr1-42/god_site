import Layout from '../components/Layout'
import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'
import './Catalog.css'

const allProducts = [
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
  {
    id: '9',
    name: 'Vintage Satchel',
    price: 1900,
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=600&fit=crop',
  },
  {
    id: '10',
    name: 'Structured Bag',
    price: 1600,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop',
  },
]

export default function CatalogPage() {
  return (
    <Layout>
      <Hero 
        title="Our Collection"
        subtitle="Explore our curated selection of luxury handbags"
      />

      <section className="catalog-section">
        <div className="container">
          <div className="catalog-header">
            <div>
              <h1>All Products</h1>
              <p>Showing {allProducts.length} items</p>
            </div>
            <div className="catalog-filters">
              <select defaultValue="">
                <option value="">Sort By</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          <ProductGrid products={allProducts} columns={2} />
        </div>
      </section>
    </Layout>
  )
}
