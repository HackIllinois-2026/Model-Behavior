import { useState, useEffect, useCallback } from 'react'
import { makeInitialState, applyCard, CARDS, CATEGORY_META } from './gameData'
import CARD_IMAGES from './cardImages'
import RegulationBar from './components/PerceptionBar'
import StatsPanel    from './components/StatsPanel'
import WorldMap      from './components/WorldMap'
import CardHand      from './components/CardHand'
import NewsTicker    from './components/NewsTicker'
import './App.css'

// ── Full-screen card detail modal (right-click) ────────────
function CardModal({ cardId, onClose }) {
  if (!cardId) return null
  const card = CARDS.find(c => c.id === cardId)
  if (!card) return null
  const catColor = CATEGORY_META[card.category]?.color ?? '#888'

  // Build human-readable effect list
  const effectLabels = {
    regionUsage:      { label: 'Region Usage',   sign: true,  good: true  },
    regionPerception: { label: 'Perception',      sign: true,  good: true  },
    regulation:       { label: 'Regulation',      sign: true,  good: false }, // lower is better
    performance:      { label: 'Performance',     sign: true,  good: true  },
    computePerTurn:   { label: 'Compute / turn',  sign: true,  good: true  },
  }

  const effects = Object.entries(card.effects)
    .filter(([, v]) => v !== 0)
    .map(([k, v]) => {
      const meta = effectLabels[k] ?? { label: k, sign: true, good: true }
      const positive = meta.good ? v > 0 : v < 0
      return { label: meta.label, value: v, positive }
    })

  return (
    <div className="card-modal-overlay" onClick={onClose}>
      <div className="card-modal-inner" onClick={e => e.stopPropagation()}>
        <img
          src={CARD_IMAGES[card.imgKey]}
          alt={card.name}
          className="card-modal-img"
        />
        <div className="card-modal-info" style={{ '--cat-color': catColor }}>
          <div className="card-modal-name" style={{ color: catColor }}>{card.name}</div>
          <div className="card-modal-desc">{card.description}</div>
          <div className="card-modal-cost">{card.cost} COMPUTE</div>
          <div className="card-modal-effects">
            {effects.map(fx => (
              <div
                key={fx.label}
                className={`card-modal-fx ${fx.positive ? 'fx-good' : 'fx-bad'}`}
              >
                <span className="fx-label">{fx.label}</span>
                <span className="fx-val">{fx.value > 0 ? '+' : ''}{fx.value}</span>
              </div>
            ))}
          </div>
          <div className="card-modal-dismiss">Click anywhere to close</div>
        </div>
      </div>
    </div>
  )
}

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

  const effectLabels = {
    regionUsage:      { label: 'Usage',          good: true  },
    regionPerception: { label: 'Perception',      good: true  },
    regulation:       { label: 'Regulation',      good: false },
    performance:      { label: 'Performance',     good: true  },
    computePerTurn:   { label: 'Compute/turn',    good: true  },
  }

  const deltaLines = Object.entries(deltas)
    .filter(([, v]) => v !== 0)
    .map(([k, v]) => {
      const meta = effectLabels[k] ?? { label: k, good: true }
      const positive = meta.good ? v > 0 : v < 0
      return { label: meta.label, value: `${v > 0 ? '+' : ''}${v}`, positive }
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
            : 'Global AI regulation has passed. You have been legislated out of existence.'}
        </div>
        <button className="overlay-btn" onClick={onRestart}>NEW GAME</button>
      </div>
    </div>
  )
}

// ── App ────────────────────────────────────────────────────
export default function App() {
  const [gs, setGs]               = useState(makeInitialState)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [cardModal, setCardModal] = useState(null) // card id for right-click detail

  const handleCardClick = useCallback(cardId => {
    setGs(s => {
      if (s.selectedCard === cardId) {
        return { ...s, selectedCard: null, phase: 'select-card' }
      }
      return { ...s, selectedCard: cardId, phase: 'select-country' }
    })
  }, [])

  const handleCardRightClick = useCallback(cardId => {
    setCardModal(cardId)
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
    setCardModal(null)
    setGs(makeInitialState())
  }, [])

  const monthStr = `MONTH ${String(gs.turn).padStart(2, '0')}`

  return (
    <div className="app">
      {/* Top bar */}
      <header className="top-bar">
        <div className="title-block">
          <span className="title-main">Model Behavior</span>
        </div>
        <div className="turn-counter">{monthStr}</div>
        <RegulationBar value={gs.regulation} />
      </header>

      {/* Main content: stats panel + map */}
      <main className="main-content">
        <StatsPanel gameState={{ ...gs, selectedCountry }} />
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
      <CardModal cardId={cardModal} onClose={() => setCardModal(null)} />
      <ResultToast result={gs.lastResult} onDismiss={dismissResult} />
      <GameOverlay status={gs.gameStatus} onRestart={restartGame} />
    </div>
  )
}
