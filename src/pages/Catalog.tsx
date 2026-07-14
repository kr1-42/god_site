import Layout from '../components/Layout'
import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'
import { Link, useSearchParams } from 'react-router-dom'
import { BAG_PHOTOS } from '../services/galleryData'
import { useProducts } from '../services/products'
import './Catalog.css'

export default function CatalogPage() {
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category') || 'all'
  const search = searchParams.get('search') || ''
  const { data: products = [], isLoading, isError } = useProducts()

  const bagProducts = products
    .filter((product) => product.category === 'bags')
    .map((product, index) => ({
      ...product,
      badge: index === 0 ? 'New' : undefined,
    }))

  const dogProducts = products
    .filter((product) => product.category === 'dogs')
    .map((product, index) => ({
      ...product,
      badge: index === 0 ? 'New' : undefined,
    }))

  const categoryProducts = category === 'dogs'
    ? dogProducts
    : category === 'bags'
      ? bagProducts
      : [...bagProducts, ...dogProducts]

  const visibleProducts = search
    ? categoryProducts.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      )
    : categoryProducts

  const heroImage = search
    ? '/attachments/prod2.jpg'
    : category === 'dogs'
      ? dogProducts[0]?.image ?? '/attachments/prod1.jpg'
      : BAG_PHOTOS[12].src
  const heroTitle = search
    ? 'Search Results'
    : category === 'dogs'
      ? 'Dogs Collection'
      : 'Bags Collection'
  const heroSubtitle = search
    ? `Showing results for "${search}"`
    : category === 'dogs'
      ? 'Explore our curated selection of luxury dog products'
      : 'Explore our curated selection of luxury bags'
  const sectionTitle = search
    ? `Search results for "${search}"`
    : category === 'dogs'
      ? 'Dogs'
      : 'Bags'

  if (isLoading) {
    return (
      <Layout>
        <div className="container">
          <p>Loading…</p>
        </div>
      </Layout>
    )
  }

  if (isError) {
    return (
      <Layout>
        <div className="container">
          <p>Something went wrong loading products.</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Hero
        title={heroTitle}
        subtitle={heroSubtitle}
        backgroundImage={heroImage}
      />


      <section className="catalog-section">
        <div className="container">
          <div className="catalog-header">
            <div>
              <h1>{sectionTitle}</h1>
              <p>Showing {visibleProducts.length} items</p>
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

          <ProductGrid products={visibleProducts} columns={2} />
        </div>
      </section>

      <section className="catalog-split-section">
        <div className="container">
          <div className="catalog-split">
            <Link
              to="/catalog"
              className="catalog-split-panel catalog-split-panel--bags"
              style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.45)), url(${BAG_PHOTOS[0].src})` }}
            >
              <div className="catalog-split-panel-inner">
                <p className="catalog-split-kicker">Shop</p>
                <h2>Bags</h2>
                <span>Browse the bags collection</span>
              </div>
            </Link>

            <div className="catalog-split-divider" aria-hidden="true">
              <span>or</span>
            </div>

            <Link
              to="/dogs"
              className="catalog-split-panel catalog-split-panel--dogs"
              style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.45)), url('/attachments/prod1.jpg')" }}
            >
              <div className="catalog-split-panel-inner">
                <p className="catalog-split-kicker">Shop</p>
                <h2>Dogs</h2>
                <span>Browse the dogs collection</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
