export default function NewsTicker({ headlines }) {
  // Duplicate for seamless loop
  const items = [...headlines, ...headlines]

  return (
    <div className="news-ticker">
      <div className="ticker-label">LIVE FEED</div>
      <div className="ticker-track">
        <div className="ticker-content" key={headlines.length}>
          {items.map((headline, i) => (
            <span key={i} className="ticker-item">{headline}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
