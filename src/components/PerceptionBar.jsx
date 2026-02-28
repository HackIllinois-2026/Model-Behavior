// Displays global Regulation from 0 (safe) to 100 (shutdown)
// Named PerceptionBar for legacy import compat — imported as RegulationBar in App.jsx
// Fills left→right, red gradient. Replaces the old perception bar.
export default function RegulationBar({ value }) {
  const clamped  = Math.max(0, Math.min(100, value))
  const danger   = clamped > 66
  const warning  = clamped > 33

  const fillStyle = {
    position: 'absolute',
    top: 0,
    height: '100%',
    width: `${clamped}%`,
    left: 0,
    background: danger
      ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
      : warning
        ? 'linear-gradient(90deg, #22c55e, #f59e0b)'
        : 'linear-gradient(90deg, #22c55e, #16a34a)',
    borderRadius: '2px',
    transition: 'all 0.4s ease',
  }

  const valClass = danger ? 'neg' : warning ? 'warn' : 'pos'

  return (
    <div className="perception-bar">
      <div className="perception-label-row">
        <span className="perception-label">GLOBAL REGULATION</span>
        <span className={`perception-val ${valClass}`}>
          {Math.round(clamped)}%
        </span>
      </div>
      <div className="perception-track">
        <div style={fillStyle} />
      </div>
    </div>
  )
}
