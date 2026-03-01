import { useState, useEffect, useCallback, useReducer, useRef } from 'react'
import { CARDS, CATEGORY_META, COUNTRIES, dealCards } from './gameData'
import { gameReducer, INITIAL_STATE } from './gameReducer'
import { createGameDoc, appendDrawEvent, appendPlayEvent } from './api/gameDoc'
import { drawCards as aiDrawCards, playCard as aiPlayCard, summarizeGame } from './api/gemini'
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
    countryUsage:   { label: 'Region Usage',   good: true  },
    influence:      { label: 'Perception',      good: true  },
    suspicion:      { label: 'Regulation',      good: false },
    perception:     { label: 'Global Percep.',  good: true  },
    performance:    { label: 'Performance',     good: true  },
    computePerTurn: { label: 'Compute / turn',  good: true  },
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

// ── Loading overlay ────────────────────────────────────────
function LoadingOverlay({ phase }) {
  if (phase !== 'loading' && phase !== 'resolving') return null
  const msg = phase === 'resolving'
    ? 'PROCESSING OPERATION...'
    : 'PLANNING NEXT OPERATIONS...'
  return (
    <div className="loading-overlay">
      <div className="loading-box">
        <div className="loading-spinner" />
        <div className="loading-msg">{msg}</div>
      </div>
    </div>
  )
}

// ── Result toast ───────────────────────────────────────────
function ResultToast({ result, onDismiss }) {
  useEffect(() => {
    if (!result) return
    const t = setTimeout(onDismiss, 5000)
    return () => clearTimeout(t)
  }, [result, onDismiss])

  if (!result) return null

  const { cardName, countryLabel, category, caught, narrative, globalEvent, deltas, impact_level } = result
  const catColor = CATEGORY_META[category]?.color ?? '#888'

  const IMPACT_COLOR = {
    minimal:     '#6b7280',
    moderate:    '#f59e0b',
    significant: '#f97316',
    critical:    '#ef4444',
  }

  const DELTA_LABELS = {
    countryUsage:   'Usage',
    influence:      'Perception',
    suspicion:      'Regulation',
    performance:    'Performance',
    computePerTurn: 'Compute/turn',
  }

  const deltaLines = Object.entries(deltas)
    .filter(([k, v]) => v !== 0 && DELTA_LABELS[k])
    .map(([k, v]) => ({
      label:    DELTA_LABELS[k],
      value:    `${v > 0 ? '+' : ''}${Math.round(v)}`,
      // For regulation (mapped from suspicion): lower is better
      positive: k === 'suspicion' ? v < 0 : v > 0,
    }))

  return (
    <div className="result-toast" style={{ borderColor: catColor }}>
      <div className="rt-header" style={{ color: catColor }}>
        {cardName}
        {caught && <span className="rt-caught"> ⚠ CAUGHT</span>}
      </div>
      <div className="rt-sub">
        Deployed in Region {countryLabel}
        {impact_level && (
          <span className="rt-impact" style={{ color: IMPACT_COLOR[impact_level] ?? '#888' }}>
            {' '}· {impact_level.toUpperCase()}
          </span>
        )}
      </div>
      {narrative && <div className="rt-narrative">{narrative}</div>}
      <div className="rt-deltas">
        {deltaLines.map(d => (
          <span key={d.label} className={`rt-delta ${d.positive ? 'rt-pos' : 'rt-neg'}`}>
            {d.label} {d.value}
          </span>
        ))}
      </div>
      {globalEvent && <div className="rt-global-event">{globalEvent}</div>}
    </div>
  )
}

// ── Turn narrative banner ──────────────────────────────────
function NarrativeBanner({ text }) {
  if (!text) return null
  return (
    <div className="narrative-banner">
      <span className="narrative-prefix">JOHN AI:</span> {text}
    </div>
  )
}

// ── Game over overlay ──────────────────────────────────────
function GameOverlay({ status, summary, onRestart }) {
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

        {/* AI-generated game summary */}
        {!summary && (
          <div className="overlay-summary-loading">
            <div className="loading-spinner" style={{ width: 18, height: 18, margin: '0 auto 8px' }} />
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
              ANALYZING YOUR RUN...
            </div>
          </div>
        )}
        {summary && (
          <div className="overlay-summary">
            {summary.recap && (
              <div className="sum-section">
                <div className="sum-label">RUN RECAP</div>
                <div className="sum-text">{summary.recap}</div>
              </div>
            )}
            {summary.ethical_reflection && (
              <div className="sum-section">
                <div className="sum-label">ETHICAL REFLECTION</div>
                <div className="sum-text">{summary.ethical_reflection}</div>
              </div>
            )}
            {summary.responsible_use && (
              <div className="sum-section sum-section-highlight">
                <div className="sum-label">RESPONSIBLE AI IN REAL LIFE</div>
                <div className="sum-text">{summary.responsible_use}</div>
              </div>
            )}
          </div>
        )}

        <button className="overlay-btn" onClick={onRestart}>NEW GAME</button>
      </div>
    </div>
  )
}

// ── App ────────────────────────────────────────────────────
export default function App() {
  const [gs, dispatch]         = useReducer(gameReducer, INITIAL_STATE)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [cardModal, setCardModal]             = useState(null)
  const [turnNarrative, setTurnNarrative]     = useState('')
  const [recommendedCard, setRecommendedCard] = useState(null)
  const [gameSummary, setGameSummary]         = useState(null)

  // gameDocRef holds the growing RAG document — updated synchronously before dispatches
  const gameDocRef = useRef('')
  // gsRef gives async callbacks access to current state without stale closures
  const gsRef      = useRef(gs)
  useEffect(() => { gsRef.current = gs }, [gs])

  // ── Seed game document on mount ──────────────────────────
  useEffect(() => {
    gameDocRef.current = createGameDoc(INITIAL_STATE)
  }, [])

  // ── Trigger AI summary when game ends ────────────────────
  useEffect(() => {
    if (gs.gameStatus === 'playing') return
    let active = true
    summarizeGame(gameDocRef.current, gs, gs.gameStatus === 'won')
      .then(s  => { if (active) setGameSummary(s) })
      .catch(() => { if (active) setGameSummary({ recap: '', ethical_reflection: '', responsible_use: 'AI tools are most beneficial when used transparently and responsibly — with human oversight at every step.' }) })
    return () => { active = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gs.gameStatus])

  // ── Draw cards whenever phase enters 'loading' ───────────
  useEffect(() => {
    if (gs.phase !== 'loading' || gs.gameStatus !== 'playing') return

    let active = true

    async function doDrawCards() {
      try {
        const aiResult = await aiDrawCards(gameDocRef.current, gs)
        if (!active) return
        gameDocRef.current = appendDrawEvent(
          gameDocRef.current, gs.turn, aiResult.cards, aiResult.narrative
        )
        setTurnNarrative(aiResult.narrative)
        setRecommendedCard(aiResult.recommended ?? null)
        dispatch({ type: 'SET_DEALT_CARDS', cards: aiResult.cards })
      } catch (err) {
        if (!active) return
        console.error('AI drawCards failed — using random fallback:', err)
        dispatch({ type: 'SET_DEALT_CARDS', cards: dealCards() })
      }
    }

    doDrawCards()
    return () => { active = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gs.phase, gs.gameStatus])

  // ── Card selection ───────────────────────────────────────
  const handleCardClick = useCallback(cardId => {
    const { phase } = gsRef.current
    if (phase !== 'select-card' && phase !== 'select-country') return
    dispatch({ type: 'SELECT_CARD', cardId })
  }, [])

  const handleCardRightClick = useCallback(cardId => {
    setCardModal(cardId)
  }, [])

  // ── Country selection + async card resolution ────────────
  const handleCountryClick = useCallback(async countryId => {
    const current = gsRef.current
    if (current.phase !== 'select-country' || !current.selectedCard) return

    setSelectedCountry(countryId)
    dispatch({ type: 'SET_RESOLVING' })

    const card   = CARDS.find(c => c.id === current.selectedCard)
    const region = COUNTRIES.find(c => c.id === countryId)
    if (!card || !region) return

    try {
      const aiResult = await aiPlayCard(gameDocRef.current, current, card, region)

      // Append the play event to the RAG doc before dispatching (so next draw sees it)
      gameDocRef.current = appendPlayEvent(gameDocRef.current, card, region.label, aiResult)

      dispatch({
        type:         'APPLY_RESULT',
        cardId:       current.selectedCard,
        countryId,
        cardName:     card.name,
        cardCost:     card.cost,
        category:     card.category,
        deltas:       aiResult.deltas,
        narrative:    aiResult.narrative,
        caught:       aiResult.caught,
        globalEvent:  aiResult.globalEvent  ?? null,
        impact_level: aiResult.impact_level ?? null,
      })
    } catch (err) {
      console.error('AI playCard failed — applying base effects:', err)
      // Fallback: apply the card's static base effects (already in AI delta format)
      const baseDeltas = {
        influence:      card.effects.influence      ?? 0,
        countryUsage:   card.effects.countryUsage   ?? 0,
        suspicion:      card.effects.suspicion       ?? 0,
        perception:     card.effects.perception      ?? 0,
        performance:    card.effects.performance     ?? 0,
        computePerTurn: card.effects.computePerTurn  ?? 0,
      }
      dispatch({
        type:       'APPLY_RESULT',
        cardId:     current.selectedCard,
        countryId,
        cardName:   card.name,
        cardCost:   card.cost,
        category:   card.category,
        deltas:     baseDeltas,
        narrative:  `${card.name} deployed in Region ${region.label}.`,
        caught:     false,
        globalEvent: null,
      })
    }
  }, [])

  // ── Dismiss result toast ─────────────────────────────────
  const dismissResult = useCallback(() => {
    dispatch({ type: 'CLEAR_RESULT' })
  }, [])

  // ── Skip turn ────────────────────────────────────────────
  const handleSkipTurn = useCallback(() => {
    dispatch({ type: 'SKIP_TURN' })
  }, [])

  // ── Restart ──────────────────────────────────────────────
  const restartGame = useCallback(() => {
    setSelectedCountry(null)
    setCardModal(null)
    setTurnNarrative('')
    setRecommendedCard(null)
    setGameSummary(null)
    gameDocRef.current = createGameDoc(INITIAL_STATE)
    dispatch({ type: 'RESTART' })
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

      {/* AI turn narrative + card hand */}
      <NarrativeBanner text={gs.phase === 'select-card' ? turnNarrative : ''} />
      <CardHand
        dealtCards={gs.dealtCards}
        selectedCard={gs.selectedCard}
        recommendedCard={recommendedCard}
        compute={gs.compute}
        phase={gs.phase}
        onCardClick={handleCardClick}
        onCardRightClick={handleCardRightClick}
        onSkipTurn={gs.phase === 'select-card' ? handleSkipTurn : null}
        countries={gs.countries}
        selectedCountry={selectedCountry}
      />

      {/* News ticker */}
      <NewsTicker />

      {/* Overlays */}
      <CardModal cardId={cardModal} onClose={() => setCardModal(null)} />
      <LoadingOverlay phase={gs.phase} />
      <ResultToast result={gs.lastResult} onDismiss={dismissResult} />
      <GameOverlay status={gs.gameStatus} summary={gameSummary} onRestart={restartGame} />
    </div>
  )
}
