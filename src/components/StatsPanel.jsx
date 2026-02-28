import { COUNTRIES } from '../gameData'

function MiniBar({ value, max = 100, colorClass }) {
  return (
    <div className="mini-bar-track">
      <div
        className={`mini-bar-fill ${colorClass}`}
        style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
      />
    </div>
  )
}

function StatRow({ label, value, colorClass }) {
  return (
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      <span className={`stat-value ${colorClass}`}>{value}</span>
    </div>
  )
}

// Centered perception bar: -100 (red) ← 0 → +100 (green)
function PerceptionMiniBar({ value }) {
  const clamped  = Math.max(-100, Math.min(100, value))
  const isNeg    = clamped < 0
  const halfW    = Math.abs(clamped) / 2 // 0–50% from center
  const fillStyle = {
    position: 'absolute',
    top: 0,
    height: '100%',
    width: `${halfW}%`,
    left: isNeg ? `${50 - halfW}%` : '50%',
    background: isNeg
      ? 'linear-gradient(90deg, #ef4444, #b91c1c)'
      : 'linear-gradient(90deg, #22c55e, #16a34a)',
    borderRadius: '2px',
    transition: 'all 0.4s ease',
  }
  return (
    <div className="mini-bar-track" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: '#1e3050', zIndex: 1 }} />
      <div style={fillStyle} />
    </div>
  )
}

export default function StatsPanel({ gameState }) {
  const { compute, computePerTurn, performance, globalUsage, regulation, countries, selectedCountry } = gameState
  const region     = COUNTRIES.find(c => c.id === selectedCountry)
  const regionData = selectedCountry ? countries[selectedCountry] : null

  const regColor = regulation > 66 ? 'red' : regulation > 33 ? 'warn' : 'green'

  return (
    <aside className="stats-panel">

      {/* Resources */}
      <div className="stats-group">
        <div className="stats-section-label">Resources</div>
        <StatRow label="Compute"  value={Math.floor(compute)}              colorClass="green" />
        <StatRow label="Per turn" value={`+${Math.floor(computePerTurn)}`} colorClass="green" />
      </div>

      {/* Capability */}
      <div className="stats-group">
        <div className="stats-section-label">Capability</div>
        <div className="stat-row">
          <span className="stat-label">Performance</span>
          <span className="stat-value cyan">{Math.round(performance)}%</span>
        </div>
        <MiniBar value={performance} colorClass="bar-cyan" />

        <div className="stat-row" style={{ marginTop: 8 }}>
          <span className="stat-label">Global Usage</span>
          <span className="stat-value cyan">{Math.round(globalUsage)}%</span>
        </div>
        <MiniBar value={globalUsage} colorClass="bar-green" />
      </div>

      {/* Regulation */}
      <div className="stats-group">
        <div className="stats-section-label">Threat Level</div>
        <div className="stat-row">
          <span className="stat-label">Regulation</span>
          <span className={`stat-value ${regColor}`}>{Math.round(regulation)}%</span>
        </div>
        <MiniBar value={regulation} colorClass={regulation > 66 ? 'bar-red' : regulation > 33 ? 'bar-warn' : 'bar-green'} />
      </div>

      {/* Selected region */}
      <div className="stats-group">
        <div className="stats-section-label">Selected Region</div>
        {regionData ? (
          <div className="region-detail">
            <div className="region-detail-title">Region {region.label}</div>

            <div className="region-stat-label">
              <span>Usage</span>
              <span className="usage-col">{Math.round(regionData.usage)}%</span>
            </div>
            <MiniBar value={regionData.usage} colorClass="bar-green" />

            <div className="region-stat-label" style={{ marginTop: 6 }}>
              <span>Perception</span>
              <span className={regionData.perception >= 0 ? 'usage-col' : 'susp-col'}>
                {regionData.perception > 0 ? '+' : ''}{Math.round(regionData.perception)}
              </span>
            </div>
            <PerceptionMiniBar value={regionData.perception} />
          </div>
        ) : (
          <div className="no-selection">Click a region on the map</div>
        )}
      </div>

    </aside>
  )
}
