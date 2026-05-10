import { ReactNode } from 'react'
import Header from './Header'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
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
              <h4>Customer Service</h4>
              <ul>
                <li><a href="#contact">Contact Us</a></li>
                <li><a href="#shipping">Shipping Info</a></li>
                <li><a href="#returns">Returns</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>About</h4>
              <ul>
                <li><a href="#about">Our Story</a></li>
                <li><a href="#sustainability">Sustainability</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#press">Press</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Connect</h4>
              <ul>
                <li><a href="#instagram">Instagram</a></li>
                <li><a href="#twitter">Twitter</a></li>
                <li><a href="#facebook">Facebook</a></li>
                <li><a href="#newsletter">Newsletter</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="#cookies">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Mlouye. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
