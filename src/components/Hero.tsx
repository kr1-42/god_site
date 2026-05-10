import './Hero.css'

interface HeroProps {
  title: string
  subtitle?: string
  backgroundImage?: string
  badge?: string
}

export default function Hero({ title, subtitle, backgroundImage, badge }: HeroProps) {
  return (
    <section 
      className="hero"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      <div className="hero-overlay">
        <div className="hero-content">
          {badge && <span className="hero-badge">{badge}</span>}
          <h1 className="hero-title">{title}</h1>
          {subtitle && <p className="hero-subtitle">{subtitle}</p>}
        </div>
      </div>
    </section>
  )
}
