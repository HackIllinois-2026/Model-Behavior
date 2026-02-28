// Displays Public Perception from -100 (bad) to +100 (good)
// Bar fills right from center for positive, left from center for negative
export default function PerceptionBar({ value }) {
  const clamped   = Math.max(-100, Math.min(100, value))
  const isNeg     = clamped < 0
  const halfWidth = Math.abs(clamped) / 2   // 0–50% from center
  const fillStyle = {
    position: 'absolute',
    top: 0,
    height: '100%',
    width: `${halfWidth}%`,
    left: isNeg ? `${50 - halfWidth}%` : '50%',
    background: isNeg
      ? 'linear-gradient(90deg, #ef4444, #b91c1c)'
      : 'linear-gradient(90deg, #22c55e, #16a34a)',
    borderRadius: '2px',
    transition: 'all 0.4s ease',
  }

  return (
    <div className="perception-bar">
      <div className="perception-label-row">
        <span className="perception-label">PUBLIC PERCEPTION</span>
        <span className={`perception-val ${isNeg ? 'neg' : 'pos'}`}>
          {clamped > 0 ? '+' : ''}{Math.round(clamped)}
        </span>
      </div>
      <div className="perception-track">
        <div className="perception-center-mark" />
        <div style={fillStyle} />
      </div>
    </div>
  )
}
