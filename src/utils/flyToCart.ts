const HEART_SRC = '/attachments/heart.png'
const HEART_SIZE = 32
const DURATION_MS = 800

// Flies a heart from the clicked element into the header cart icon.
export function flyHeartToCart(from: Element) {
  const cart = document.querySelector<HTMLElement>('[data-cart-icon]')
  if (!cart || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const start = from.getBoundingClientRect()
  const end = cart.getBoundingClientRect()
  const startX = start.left + start.width / 2 - HEART_SIZE / 2
  const startY = start.top + start.height / 2 - HEART_SIZE / 2
  // If the header has scrolled out of view, aim for the top edge above the cart
  const endY = Math.max(end.top + end.height / 2, 0)
  const dx = end.left + end.width / 2 - HEART_SIZE / 2 - startX
  const dy = endY - HEART_SIZE / 2 - startY

  const heart = document.createElement('img')
  heart.src = HEART_SRC
  heart.alt = ''
  heart.setAttribute('aria-hidden', 'true')
  Object.assign(heart.style, {
    position: 'fixed',
    left: `${startX}px`,
    top: `${startY}px`,
    width: `${HEART_SIZE}px`,
    height: `${HEART_SIZE}px`,
    objectFit: 'contain',
    pointerEvents: 'none',
    zIndex: '9999',
  })
  // Fall back to an emoji heart until the PNG exists
  heart.onerror = () => {
    const emoji = document.createElement('span')
    emoji.textContent = '❤️'
    emoji.style.cssText = heart.style.cssText
    emoji.style.fontSize = `${HEART_SIZE * 0.8}px`
    emoji.style.lineHeight = `${HEART_SIZE}px`
    emoji.style.textAlign = 'center'
    heart.replaceWith(emoji)
    animate(emoji)
  }
  document.body.appendChild(heart)
  animate(heart)

  function animate(el: HTMLElement) {
    el.getAnimations().forEach((a) => a.cancel())
    // Quadratic curve that bends sideways, never rising above the cart
    const cx = dx * 0.1
    const cy = dy * 0.7
    const steps = 20
    const keyframes = Array.from({ length: steps + 1 }, (_, i) => {
      const t = i / steps
      const x = 2 * (1 - t) * t * cx + t * t * dx
      const y = 2 * (1 - t) * t * cy + t * t * dy
      const scale = 1 + 0.2 * Math.sin(Math.PI * t) - 0.6 * t * t
      return { transform: `translate(${x}px, ${y}px) scale(${scale})`, opacity: t < 0.85 ? 1 : (1 - t) / 0.15 }
    })
    const flight = el.animate(keyframes, { duration: DURATION_MS, easing: 'ease-in-out', fill: 'forwards' })
    flight.onfinish = () => el.remove()
  }
}
