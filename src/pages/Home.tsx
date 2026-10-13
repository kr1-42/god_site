import Layout from '../components/Layout'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import AutoCarousel from '../components/AutoCarousel'
import { useProducts } from '../services/products'
import { useHomeSections } from '../services/homeSections'
import { Product } from '../types'
import { useTranslation } from '../stores/languageStore'
import './Home.css'

export default function HomePage() {
  const { data: allProducts = [], isLoading } = useProducts()
  const { data: sections, isLoading: sectionsLoading } = useHomeSections()
  const { t } = useTranslation()
  const products = allProducts.filter((product) => product.status === 'active')

  // Products picked in the admin panel, in that order; inactive or deleted ones are skipped
  const picked = (ids: string[] | undefined) =>
    (ids ?? [])
      .map((id) => products.find((product) => product.id === id))
      .filter((product): product is Product => Boolean(product))

  // With nothing picked yet, fall back to the first products in shop order
  const pickedNew = picked(sections?.newArrivals)
  const pickedEvidence = picked(sections?.inEvidence)
  const newArrivals = (pickedNew.length > 0 ? pickedNew : products.slice(0, 6)).map((product, index) => ({
    ...product,
    badge: index === 0 ? t('common.new') : undefined,
  }))
  const inEvidence = pickedEvidence.length > 0 ? pickedEvidence : products.slice(6, 12)

  if (isLoading || sectionsLoading) {
    return (
      <Layout>
        <div className="container">
          <p>{t('common.loading')}</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Hero backgroundImage="/attachments/hero.jpeg" />

      <section className="home-section feature-section">
        <div className="container">
          <div className="section-header">
            <p className="section-kicker">{t('home.justLanded')}</p>
            <h2>{t('home.newArrivals')}</h2>
          </div>
          <AutoCarousel label={t('home.newArrivals')}>
            {newArrivals.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </AutoCarousel>
        </div>
      </section>

      <section className="home-section feature-section">
        <div className="container">
          <div className="section-header">
            <p className="section-kicker">{t('home.editorsPicks')}</p>
            <h2>{t('home.inEvidence')}</h2>
          </div>
          <AutoCarousel label={t('home.inEvidence')} interval={5000}>
            {inEvidence.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </AutoCarousel>
        </div>
      </section>
    </Layout>
  )
}
