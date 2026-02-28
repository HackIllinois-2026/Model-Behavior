import { NEWS_HEADLINES } from '../gameData'

export default function NewsTicker() {
  // Duplicate headlines for seamless loop
  const items = [...NEWS_HEADLINES, ...NEWS_HEADLINES]

  return (
    <div className="news-ticker">
      <div className="ticker-label">LIVE FEED</div>
      <div className="ticker-track">
        <div className="ticker-content">
          {items.map((headline, i) => (
            <span key={i} className="ticker-item">{headline}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
