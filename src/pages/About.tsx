import Layout from '../components/Layout'
import { useProducts } from '../services/products'
import { useTranslation } from '../stores/languageStore'
import './About.css'

const GALLERY_SIZE = 4

export default function AboutPage() {
  const { t } = useTranslation()
  const { data: products = [] } = useProducts()

  const pick = (category: string) =>
    products.filter((p) => p.status === 'active' && p.category === category).slice(0, GALLERY_SIZE)
  const gallery = [...pick('collar'), ...pick('patch')]

  return (
    <Layout>
      <section className="about-section">
        <div className="container">
          <div className="section-header">
            <p className="section-kicker">{t('about.kicker')}</p>
            <h2>Interno 13 Studio</h2>
          </div>
          <div className="about-layout">
            <div className="about-content">
              {(['about.p1', 'about.p2', 'about.p3', 'about.p4', 'about.p5'] as const).map((key) => (
                <p key={key}>{t(key)}</p>
              ))}
            </div>
            <img className="about-hero-image" src="/attachments/colpatchhero.png" alt="Collars and patches" />
          </div>
          {gallery.length > 0 && (
            <div className="about-gallery">
              {gallery.map((product) => (
                <img key={product.id} src={product.image} alt={product.name} loading="lazy" />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
