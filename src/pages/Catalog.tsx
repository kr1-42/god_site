import Layout from '../components/Layout'
import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'
import { Link, useSearchParams } from 'react-router-dom'
import { BAG_PHOTOS } from '../services/galleryData'
import { useProducts } from '../services/products'
import { useCategories } from '../services/categories'
import { useTranslation } from '../stores/languageStore'
import './Catalog.css'

// Hero images picked for specific categories (by slug)
const CATEGORY_HERO_IMAGES: Record<string, string> = {
  collar: '/attachments/colpatchhero.png',
  patch: '/attachments/colpatchhero.png',
}

export default function CatalogPage() {
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category') || 'all'
  const search = searchParams.get('search') || ''
  const { t, categoryName: translateCategory } = useTranslation()
  const { data: allProducts = [], isLoading, isError } = useProducts()
  const products = allProducts.filter((product) => product.status === 'active')

  const { data: categories = [] } = useCategories()
  const currentCategory = categories.find((c) => c.slug === category)

  const withNewBadge = <T extends { category: string }>(list: T[]) => {
    const seen = new Set<string>()
    return list.map((product) => {
      const first = !seen.has(product.category)
      seen.add(product.category)
      return { ...product, badge: first ? t('common.new') : undefined }
    })
  }

  const categoryProducts = withNewBadge(
    category === 'all' ? products : products.filter((product) => product.category === category),
  )

  const visibleProducts = search
    ? categoryProducts.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      )
    : categoryProducts

  // Bags and dogs keep their hand-picked hero copy; other categories get generic text
  const categoryName = currentCategory ? translateCategory(currentCategory) : category
  const heroImage = search
    ? '/attachments/prod2.jpg'
    : CATEGORY_HERO_IMAGES[category]
      ? CATEGORY_HERO_IMAGES[category]
      : category === 'dogs'
        ? categoryProducts[0]?.image ?? '/attachments/prod1.jpg'
        : category === 'all' || category === 'bags'
          ? BAG_PHOTOS[12].src
          : categoryProducts[0]?.image ?? BAG_PHOTOS[12].src
  // Links to the other categories at the bottom; only categories with products in the shop
  const categoryLinks = categories
    .filter((c) => c.slug !== category)
    .map((c) => {
      const inCategory = products.filter((product) => product.category === c.slug)
      return { slug: c.slug, name: translateCategory(c), image: inCategory[0]?.image, count: inCategory.length }
    })
    .filter((link) => link.count > 0)

  const sectionTitle = search
    ? t('catalog.searchResultsFor', { query: search })
    : category === 'all'
      ? t('catalog.allProducts')
      : categoryName

  if (isLoading) {
    return (
      <Layout>
        <div className="container">
          <p>{t('common.loading')}</p>
        </div>
      </Layout>
    )
  }

  if (isError) {
    return (
      <Layout>
        <div className="container">
          <p>{t('catalog.error')}</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Hero backgroundImage={heroImage} />


      <section className="catalog-section">
        <div className="container">
          <div className="catalog-header">
            <div>
              <h1>{sectionTitle}</h1>
              <p>{t('catalog.showingItems', { count: visibleProducts.length })}</p>
            </div>
            <div className="catalog-filters">
              <select defaultValue="">
                <option value="">{t('catalog.sortBy')}</option>
                <option value="price-low">{t('catalog.priceLow')}</option>
                <option value="price-high">{t('catalog.priceHigh')}</option>
                <option value="newest">{t('catalog.newest')}</option>
              </select>
            </div>
          </div>

          <ProductGrid products={visibleProducts} columns={2} />
        </div>
      </section>

      {categoryLinks.length > 0 && (
        <section className="catalog-categories-section">
          <div className="container">
            <div className="catalog-categories-header">
              <h2>{category === 'all' ? t('catalog.shopByCategory') : t('catalog.otherCategories')}</h2>
              {category !== 'all' && (
                <Link to="/catalog" className="catalog-categories-all">{t('catalog.viewAll')}</Link>
              )}
            </div>
            <div className="catalog-categories-grid">
              {categoryLinks.map(({ slug, name, image, count }) => (
                <Link key={slug} to={`/catalog?category=${encodeURIComponent(slug)}`} className="catalog-category-card">
                  <div className="catalog-category-image">
                    {image && <img src={image} alt="" loading="lazy" decoding="async" />}
                  </div>
                  <div className="catalog-category-info">
                    <h3>{name}</h3>
                    <span>{t('catalog.itemCount', { count })}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  )
}
