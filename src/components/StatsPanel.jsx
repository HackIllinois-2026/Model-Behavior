import { COUNTRIES } from '../gameData'
import { MAINTENANCE_RATE } from '../gameReducer'

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
  const { compute, computePerTurn, performance, globalUsage, actionLog, countries } = gameState

  const totalUsage      = Object.values(countries).reduce((s, c) => s + c.usage, 0)
  const maintenanceCost = Math.round(totalUsage * MAINTENANCE_RATE)
  const netPerTurn      = Math.floor(computePerTurn) - maintenanceCost

  return (
    <aside className="stats-panel">

      {/* Resources */}
      <div className="stats-group">
        <div className="stats-section-label">Resources</div>
        <StatRow label="Compute"     value={Math.floor(compute)}              colorClass="green" />
        <StatRow label="Income"      value={`+${Math.floor(computePerTurn)}`} colorClass="green" />
        {maintenanceCost > 0 && (
          <StatRow label="Maintenance" value={`-${maintenanceCost}`}          colorClass="red" />
        )}
        <StatRow label="Net / turn"  value={`${netPerTurn >= 0 ? '+' : ''}${netPerTurn}`} colorClass={netPerTurn >= 0 ? 'green' : 'red'} />
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

      {/* Action history */}
      <div className="stats-group stats-group-history">
        <div className="stats-section-label">Action Log</div>
        {(!actionLog || actionLog.length === 0) ? (
          <div className="no-selection">No actions yet</div>
        ) : (
          <div className="action-log">
            {actionLog.map((entry, i) => {
              const regSign  = entry.regulationDelta > 0 ? '+' : ''
              const usagSign = entry.usageDelta > 0 ? '+' : ''
              // Show turn partition when the turn number changes between entries
              const prevEntry = actionLog[i - 1]
              const showPartition = prevEntry && prevEntry.turn !== entry.turn
              return (
                <div key={i}>
                  {showPartition && (
                    <div className="al-turn-divider">
                      <span className="al-turn-divider-label">Turn {entry.turn}</span>
                    </div>
                  )}
                  <div className={`al-entry ${entry.caught ? 'al-caught' : ''}`}>
                    <div className="al-top">
                      <span className="al-turn">T{entry.turn}</span>
                      <span className="al-card">{entry.cardName}</span>
                      {entry.caught && <span className="al-flag">⚠</span>}
                    </div>
                    <div className="al-deltas">
                      {entry.countryLabel && (
                        <span className="al-region">R{entry.countryLabel}</span>
                      )}
                      {entry.usageDelta !== 0 && (
                        <span className={`al-d ${entry.usageDelta > 0 ? 'al-pos' : 'al-neg'}`}>
                          Use {usagSign}{entry.usageDelta}
                        </span>
                      )}
                      <span className={`al-d ${entry.regulationDelta < 0 ? 'al-pos' : 'al-neg'}`}>
                        Reg {regSign}{entry.regulationDelta}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </aside>
  )
}
