import { Link } from 'react-router-dom'
import { useState } from 'react'
import './Header.css'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="header">
      <div className="header-content">
        <button className="menu-toggle" aria-label="Menu" onClick={toggleMenu} aria-expanded={isMenuOpen}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <Link to="/" className="logo">
          <img src="/attachments/logo.jpg" alt="mlouye" className="logo-image" />
        </Link>

        <nav className="nav-menu">
          <Link to="/catalog" className="nav-link">Shop</Link>
          <Link to="/catalog" className="nav-link">New</Link>
          <Link to="/catalog" className="nav-link">About</Link>
        </nav>

        {isMenuOpen && (
          <nav className="mobile-menu">
            <Link to="/catalog" className="mobile-nav-link" onClick={closeMenu}>Shop</Link>
            <Link to="/catalog" className="mobile-nav-link" onClick={closeMenu}>New</Link>
            <Link to="/catalog" className="mobile-nav-link" onClick={closeMenu}>About</Link>
          </nav>
        )}

        <div className="header-actions">
          <button className="icon-button" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
          <button className="icon-button" aria-label="Account">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
          <Link to="/cart" className="icon-button" aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </Link>
        </div>
      </div>
    </header>
  )
}
