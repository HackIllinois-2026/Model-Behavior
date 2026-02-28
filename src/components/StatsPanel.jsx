import { REGIONS } from '../gameData'

export default function StatsPanel({ gameState }) {
  const { compute, computePerSecond, totalDataCenters, ethicalProblems, suspicion, selectedRegion } = gameState
  const region = REGIONS.find(r => r.id === selectedRegion)
  const regionCenters = selectedRegion ? (gameState.dataCentersByRegion[selectedRegion] || 0) : 0

  return (
    <aside className="stats-panel">
      {/* Resources */}
      <div>
        <div className="stats-section-label">Resources</div>
        <div className="stat-row">
          <span className="stat-label">Compute</span>
          <span className="stat-value green">{Math.floor(compute)}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Per second</span>
          <span className="stat-value green">+{computePerSecond}/s</span>
        </div>
      </div>

      {/* Infrastructure */}
      <div>
        <div className="stats-section-label">Infrastructure</div>
        <div className="stat-row">
          <span className="stat-label">Data Centers</span>
          <span className="stat-value cyan">{totalDataCenters}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Regions Active</span>
          <span className="stat-value cyan">
            {Object.values(gameState.dataCentersByRegion).filter(v => v > 0).length}
          </span>
        </div>
      </div>

      {/* Ethics */}
      <div>
        <div className="stats-section-label">Impact</div>
        <div className="stat-row">
          <span className="stat-label">Ethical Issues</span>
          <span className="stat-value red">{ethicalProblems}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Suspicion</span>
          <span className="stat-value red">{suspicion.toFixed(0)}%</span>
        </div>
      </div>

      {/* Selected region */}
      <div>
        <div className="stats-section-label">Selected Region</div>
        {region ? (
          <div className="region-info">
            <div className="region-info-name">{region.name}</div>
            <div className="stat-row">
              <span className="stat-label">Data Centers</span>
              <span className="stat-value cyan">{regionCenters}</span>
            </div>
          </div>
        ) : (
          <div className="no-selection">Click a region on the map</div>
        )}
      </div>
    </aside>
  )
}
