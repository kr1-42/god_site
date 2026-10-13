import Layout from '../components/Layout'
import { useTranslation } from '../stores/languageStore'
import './About.css'

export default function AboutPage() {
  const { t } = useTranslation()

  return (
    <Layout>
      <section className="about-section">
        <div className="container">
          <div className="section-header">
            <p className="section-kicker">{t('about.kicker')}</p>
            <h2>Interno 13 Studio</h2>
          </div>
          <div className="about-content">
            {(['about.p1', 'about.p2', 'about.p3', 'about.p4', 'about.p5'] as const).map((key) => (
              <p key={key}>{t(key)}</p>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}
