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

export default function StatsPanel({ gameState }) {
  const { compute, computePerTurn, performance, globalUsage, perception, countries, selectedCountry } = gameState
  const region     = COUNTRIES.find(c => c.id === selectedCountry)
  const regionData = selectedCountry ? countries[selectedCountry] : null

  return (
    <aside className="stats-panel">

      {/* Resources */}
      <div className="stats-group">
        <div className="stats-section-label">Resources</div>
        <StatRow label="Compute"  value={Math.floor(compute)}         colorClass="green" />
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

      {/* Perception */}
      <div className="stats-group">
        <div className="stats-section-label">Public Opinion</div>
        <div className="stat-row">
          <span className="stat-label">Perception</span>
          <span className={`stat-value ${perception >= 0 ? 'green' : 'red'}`}>
            {perception > 0 ? '+' : ''}{Math.round(perception)}
          </span>
        </div>
        <MiniBar value={perception + 100} max={200} colorClass={perception >= 0 ? 'bar-green' : 'bar-red'} />
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
              <span>Influence</span>
              <span className="infl-col">{Math.round(regionData.influence)}%</span>
            </div>
            <MiniBar value={regionData.influence} colorClass="bar-cyan" />

            <div className="region-stat-label" style={{ marginTop: 6 }}>
              <span>Suspicion</span>
              <span className="susp-col">{Math.round(regionData.suspicion)}%</span>
            </div>
            <MiniBar value={regionData.suspicion} colorClass="bar-red" />
          </div>
        ) : (
          <div className="no-selection">Click a region on the map</div>
        )}
      </div>

    </aside>
  )
}
