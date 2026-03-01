import { useRef, useEffect } from 'react'

const SPEED_PX_PER_SEC = 50

export default function NewsTicker({ headlines }) {
  const contentRef  = useRef(null)
  const posRef      = useRef(0)
  const frameRef    = useRef(null)
  const lastTimeRef = useRef(null)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    const tick = (now) => {
      if (lastTimeRef.current !== null) {
        // Cap dt so a hidden tab resuming doesn't cause a large jump
        const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05)
        posRef.current += SPEED_PX_PER_SEC * dt
        const halfWidth = el.scrollWidth / 2
        if (halfWidth > 0 && posRef.current >= halfWidth) {
          posRef.current -= halfWidth
        }
        el.style.transform = `translate3d(${-posRef.current}px, 0, 0)`
      }
      lastTimeRef.current = now
      frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, []) // runs once — position persists across content updates

  const items = [...headlines, ...headlines]

  return (
    <div className="news-ticker">
      <div className="ticker-label">LIVE FEED</div>
      <div className="ticker-track">
        <div className="ticker-content" ref={contentRef}>
          {items.map((headline, i) => (
            <span key={i} className="ticker-item">{headline}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
