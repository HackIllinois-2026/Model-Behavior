import { useState, useEffect, useCallback } from 'react'
import { makeInitialState, applyCard, CATEGORY_META } from './gameData'
import PerceptionBar from './components/PerceptionBar'
import StatsPanel    from './components/StatsPanel'
import WorldMap      from './components/WorldMap'
import CardHand      from './components/CardHand'
import NewsTicker    from './components/NewsTicker'
import './App.css'

// ── Result toast ───────────────────────────────────────────
function ResultToast({ result, onDismiss }) {
  useEffect(() => {
    if (!result) return
    const t = setTimeout(onDismiss, 3200)
    return () => clearTimeout(t)
  }, [result, onDismiss])

  if (!result) return null

  const { cardName, countryLabel, category, deltas } = result
  const catColor = CATEGORY_META[category]?.color ?? '#888'

  const deltaLines = Object.entries(deltas)
    .filter(([, v]) => v !== 0)
    .map(([k, v]) => {
      const sign  = v > 0 ? '+' : ''
      const label = {
        influence:      'Influence',
        countryUsage:   'Usage',
        suspicion:      'Suspicion',
        perception:     'Perception',
        performance:    'Performance',
        computePerTurn: 'Compute/turn',
      }[k] ?? k
      return { label, value: `${sign}${v}`, positive: v > 0 }
    })

  return (
    <div className="result-toast" style={{ borderColor: catColor }}>
      <div className="rt-header" style={{ color: catColor }}>{cardName}</div>
      <div className="rt-sub">Deployed in Region {countryLabel}</div>
      <div className="rt-deltas">
        {deltaLines.map(d => (
          <span key={d.label} className={`rt-delta ${d.positive ? 'rt-pos' : 'rt-neg'}`}>
            {d.label} {d.value}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Game over overlay ──────────────────────────────────────
function GameOverlay({ status, onRestart }) {
  if (status === 'playing') return null
  const won = status === 'won'
  return (
    <div className="game-overlay">
      <div className={`overlay-box ${won ? 'overlay-won' : 'overlay-lost'}`}>
        <div className="overlay-title">
          {won ? 'DOMINANCE ACHIEVED' : 'SHUTDOWN INITIATED'}
        </div>
        <div className="overlay-body">
          {won
            ? 'All 7 regions have reached 90%+ usage. Humanity has accepted its new overlord.'
            : 'Public perception has collapsed. Global AI Safety legislation has passed. You have been shut down.'}
        </div>
        <button className="overlay-btn" onClick={onRestart}>NEW GAME</button>
      </div>
    </div>
  )
}

// ── App ────────────────────────────────────────────────────
export default function App() {
  const [gs, setGs] = useState(makeInitialState)
  const [selectedCountry, setSelectedCountry] = useState(null)

  const handleCardClick = useCallback(cardId => {
    setGs(s => {
      if (s.selectedCard === cardId) {
        // Deselect
        return { ...s, selectedCard: null, phase: 'select-card' }
      }
      return { ...s, selectedCard: cardId, phase: 'select-country' }
    })
  }, [])

  const handleCardRightClick = useCallback(_cardId => {
    // Expanded card view — placeholder for Phase 1
  }, [])

  const handleCountryClick = useCallback(countryId => {
    setSelectedCountry(countryId)
    setGs(s => {
      if (s.phase === 'select-country' && s.selectedCard) {
        return applyCard(s, s.selectedCard, countryId)
      }
      return s
    })
  }, [])

  const dismissResult = useCallback(() => {
    setGs(s => ({ ...s, lastResult: null }))
  }, [])

  const restartGame = useCallback(() => {
    setSelectedCountry(null)
    setGs(makeInitialState())
  }, [])

  const monthStr = `MONTH ${String(gs.turn).padStart(2, '0')}`

  return (
    <div className="app">
      {/* Top bar */}
      <header className="top-bar">
        <div className="title-block">
          <span className="title-main">JOHN AI</span>
          <span className="title-sub">GLOBAL EXPANSION PROTOCOL</span>
        </div>
        <div className="turn-counter">{monthStr}</div>
        <PerceptionBar value={gs.perception} />
      </header>

      {/* Main content: stats panel + map */}
      <main className="main-content">
        <StatsPanel
          gameState={{ ...gs, selectedCountry }}
        />
        <WorldMap
          countries={gs.countries}
          selectedCountry={selectedCountry}
          phase={gs.phase}
          onCountryClick={handleCountryClick}
        />
      </main>

      {/* Card hand */}
      <CardHand
        dealtCards={gs.dealtCards}
        selectedCard={gs.selectedCard}
        compute={gs.compute}
        phase={gs.phase}
        onCardClick={handleCardClick}
        onCardRightClick={handleCardRightClick}
      />

      {/* News ticker */}
      <NewsTicker />

      {/* Overlays */}
      <ResultToast result={gs.lastResult} onDismiss={dismissResult} />
      <GameOverlay status={gs.gameStatus} onRestart={restartGame} />
    </div>
  )
}
