import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import './AutoCarousel.css'

interface AutoCarouselProps {
  label: string
  children: ReactNode
  /** Milliseconds between automatic steps */
  interval?: number
}

// Horizontal scroll row that advances by one item on its own, pausing while the visitor interacts with it
export default function AutoCarousel({ label, children, interval = 4000 }: AutoCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const [scrollable, setScrollable] = useState(false)

  const step = useCallback((direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const item = track.firstElementChild as HTMLElement | null
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    const distance = (item?.offsetWidth ?? track.clientWidth) + gap
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2
    const atStart = track.scrollLeft <= 2

    if (direction === 1 && atEnd) {
      track.scrollTo({ left: 0, behavior: 'smooth' })
    } else if (direction === -1 && atStart) {
      track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' })
    } else {
      track.scrollBy({ left: direction * distance, behavior: 'smooth' })
    }
  }, [])

  // Only scroll when the items don't all fit
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const update = () => setScrollable(track.scrollWidth > track.clientWidth + 2)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(track)
    return () => observer.disconnect()
  }, [children])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (paused || !scrollable || reduceMotion) return
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') step(1)
    }, interval)
    return () => window.clearInterval(id)
  }, [paused, scrollable, interval, step])

  return (
    <div
      className="auto-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => window.setTimeout(() => setPaused(false), interval)}
    >
      <div ref={trackRef} className="auto-carousel-track" role="region" aria-label={label} tabIndex={0}>
        {children}
      </div>
      {scrollable && (
        <div className="auto-carousel-controls">
          <button type="button" onClick={() => step(-1)} aria-label="Previous">‹</button>
          <button type="button" onClick={() => step(1)} aria-label="Next">›</button>
        </div>
      )}
    </div>
  )
}
