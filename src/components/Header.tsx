import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { useCategories } from '../services/categories'
import { useTranslation } from '../stores/languageStore'
import './Header.css'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { data: categories = [] } = useCategories()
  const { t, language, setLanguage, categoryName } = useTranslation()
  const [searchParams] = useSearchParams()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const query = searchQuery.trim()
    if (!query) return
    navigate(`/catalog?search=${encodeURIComponent(query)}`)
    setIsSearchOpen(false)
    setSearchQuery('')
  }

  const handleShopFilter = (category: string) => {
    setIsShopDropdownOpen(false)
    if (category === 'all') {
      navigate('/catalog')
    } else {
      navigate(`/catalog?category=${encodeURIComponent(category)}`)
    }
  }

  const currentCategory = searchParams.get('category') || 'all'

  return (
    <header className="header">
      <div className="header-content">
        <button className="menu-toggle" aria-label={t('nav.menu')} onClick={toggleMenu} aria-expanded={isMenuOpen}>
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
          <div className="shop-dropdown-container">
            <button 
              className={`nav-link shop-dropdown-toggle ${isShopDropdownOpen ? 'active' : ''}`}
              onClick={() => setIsShopDropdownOpen(!isShopDropdownOpen)}
              aria-expanded={isShopDropdownOpen}
            >
              {t('nav.shop')}
              <svg 
                className="dropdown-arrow" 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            {isShopDropdownOpen && (
              <div className="shop-dropdown-menu">
                <button
                  className={`shop-dropdown-item ${currentCategory === 'all' ? 'active' : ''}`}
                  onClick={() => handleShopFilter('all')}
                >
                  {t('nav.allProducts')}
                </button>
                {categories.map((category) => (
                  <button
                    key={category.slug}
                    className={`shop-dropdown-item ${currentCategory === category.slug ? 'active' : ''}`}
                    onClick={() => handleShopFilter(category.slug)}
                  >
                    {categoryName(category)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link to="/catalog" className="nav-link">{t('nav.new')}</Link>
          <Link to="/about" className="nav-link">{t('nav.about')}</Link>
        </nav>

        {isMenuOpen && (
          <nav className="mobile-menu">
            <div className="mobile-shop-dropdown-container">
              <button
                className={`mobile-nav-link mobile-shop-toggle ${isShopDropdownOpen ? 'active' : ''}`}
                onClick={() => setIsShopDropdownOpen(!isShopDropdownOpen)}
                aria-expanded={isShopDropdownOpen}
              >
                {t('nav.shop')}
                <svg 
                  className="dropdown-arrow" 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              {isShopDropdownOpen && (
                <div className="mobile-shop-dropdown-menu">
                  <button
                    className={`mobile-shop-dropdown-item ${currentCategory === 'all' ? 'active' : ''}`}
                    onClick={() => {
                      handleShopFilter('all')
                      closeMenu()
                    }}
                  >
                    {t('nav.allProducts')}
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.slug}
                      className={`mobile-shop-dropdown-item ${currentCategory === category.slug ? 'active' : ''}`}
                      onClick={() => {
                        handleShopFilter(category.slug)
                        closeMenu()
                      }}
                    >
                      {categoryName(category)}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link to="/catalog" className="mobile-nav-link" onClick={closeMenu}>{t('nav.new')}</Link>
            <Link to="/about" className="mobile-nav-link" onClick={closeMenu}>{t('nav.about')}</Link>
          </nav>
        )}

        <div className="header-actions">
          <div className="language-toggle" role="group" aria-label={t('nav.language')}>
            {(['en', 'it'] as const).map((lang) => (
              <button
                key={lang}
                className={language === lang ? 'active' : undefined}
                aria-pressed={language === lang}
                onClick={() => setLanguage(lang)}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          {isSearchOpen && (
            <form className="search-form" onSubmit={handleSearchSubmit}>
              <input
                type="search"
                className="search-input"
                placeholder={t('nav.searchPlaceholder')}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                autoFocus
              />
            </form>
          )}
          <button
            className={`icon-button ${isSearchOpen ? 'active' : ''}`}
            aria-label={t('nav.search')}
            aria-expanded={isSearchOpen}
            onClick={toggleSearch}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
          <Link to="/cart" className="icon-button" aria-label={t('nav.cart')} data-cart-icon>
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
