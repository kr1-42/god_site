import { ReactNode } from 'react'
import Header from './Header'
import { useTranslation } from '../stores/languageStore'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { t } = useTranslation()

  return (
    <div className="layout">
      <Header />
      <main className="layout-main">
        {children}
      </main>
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>{t('footer.customerService')}</h4>
              <ul>
                <li><a href="#contact">{t('footer.contact')}</a></li>
                <li><a href="#shipping">{t('footer.shippingInfo')}</a></li>
                <li><a href="#returns">{t('footer.returns')}</a></li>
                <li><a href="#faq">{t('footer.faq')}</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>{t('footer.about')}</h4>
              <ul>
                <li><a href="#about">{t('footer.ourStory')}</a></li>
                <li><a href="#sustainability">{t('footer.sustainability')}</a></li>
                <li><a href="#careers">{t('footer.careers')}</a></li>
                <li><a href="#press">{t('footer.press')}</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>{t('footer.connect')}</h4>
              <ul>
                <li><a href="#instagram">Instagram</a></li>
                <li><a href="#twitter">Twitter</a></li>
                <li><a href="#facebook">Facebook</a></li>
                <li><a href="#newsletter">{t('footer.newsletter')}</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>{t('footer.legal')}</h4>
              <ul>
                <li><a href="#privacy">{t('footer.privacy')}</a></li>
                <li><a href="#terms">{t('footer.terms')}</a></li>
                <li><a href="#cookies">{t('footer.cookies')}</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Mlouye. {t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
