import { useEffect, useState } from 'react'
import './Hero.css'

interface HeroProps {
  title?: string
  subtitle?: string
  backgroundImage?: string
  badge?: string
  mediaImage?: string
  mediaAlt?: string
}

export default function Hero({ title, subtitle, backgroundImage, badge, mediaImage, mediaAlt }: HeroProps) {
  // On small screens the banner takes the photo's own shape so nothing gets cropped
  const [aspectRatio, setAspectRatio] = useState<number | null>(null)

  useEffect(() => {
    setAspectRatio(null)
    if (!backgroundImage) return
    const img = new Image()
    img.onload = () => img.naturalHeight && setAspectRatio(img.naturalWidth / img.naturalHeight)
    img.src = backgroundImage
    return () => {
      img.onload = null
    }
  }, [backgroundImage])

  const style = backgroundImage
    ? ({
        backgroundImage: `url(${backgroundImage})`,
        ...(aspectRatio ? { '--hero-aspect': aspectRatio } : {}),
      } as React.CSSProperties)
    : {}

  return (
    <section className="hero" style={style}>
      {(title || subtitle || badge || mediaImage) && (
        <div className="hero-overlay">
          <div className="hero-content">
            {badge && <span className="hero-badge">{badge}</span>}
            {title && <h1 className="hero-title">{title}</h1>}
            {subtitle && <p className="hero-subtitle">{subtitle}</p>}
            {mediaImage && (
              <div className="hero-media">
                <img src={mediaImage} alt={mediaAlt || ''} className="hero-media-image" decoding="async" />
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
