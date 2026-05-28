import Layout from '../components/Layout'
import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'
import { PRODUCTS } from '../services/productData'
import './Catalog.css'

export default function CatalogPage() {
  // Rotate products to create more variety for display
  const allProducts = [
    ...PRODUCTS.map(p => ({ ...p, badge: p.id === '1' ? 'New' : undefined })),
    ...PRODUCTS.map(p => ({ ...p, id: `${p.id}-alt`, badge: undefined })),
    ...PRODUCTS.map(p => ({ ...p, id: `${p.id}-alt2`, badge: p.id === '2' ? 'New' : undefined })),
  ]

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
