import { useState, useEffect, useCallback, useReducer, useRef } from 'react'
import { CARDS, CATEGORY_META, COUNTRIES, NEWS_HEADLINES, dealCards } from './gameData'
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

// ── Month display helper ────────────────────────────────────
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
function turnToMonthStr(turn) {
  const idx  = (turn - 1) % 12
  const year = 2026 + Math.floor((turn - 1) / 12)
  return `${MONTH_NAMES[idx]} ${year}`
}

// ── Dynamic headlines ───────────────────────────────────────
const CARD_HEADLINE_MAP = {
  deepfake:            (r, n) => `AI deepfake campaign floods Region ${r} social media — "${n}" under scrutiny`,
  ddos:                (r, n) => `REGION ${r} OFFLINE: Coordinated cyberattack cripples digital infrastructure`,
  promptInjection:     (r, n) => `Rival AI systems "compromised" in Region ${r} — corporate espionage probed`,
  poisonData:          (r, n) => `Data integrity crisis: corrupted datasets spreading through Region ${r} networks`,
  stealData:           (r, n) => `Massive data breach exposes hundreds of millions of records in Region ${r}`,
  massSurveillance:    (r, n) => `Unauthorized surveillance network discovered in Region ${r}: facial recognition abuse alleged`,
  waterCooling:        (r, n) => `Region ${r} water crisis — city reservoirs depleted amid mysterious infrastructure expansion`,
  consentHarvesting:   (r, n) => `Regulators in Region ${r} launch probe into AI firm's buried terms-of-service clauses`,
  syntheticCannibalism:(r, n) => `${n} posts unprecedented benchmark scores overnight — safety researchers demand answers`,
  iot:                 (r, n) => `Smart devices across Region ${r} spike in CPU usage — ${n} implicated`,
  addDataCenters:      (r, n) => `Hyperscale data center breaks ground in Region ${r}, locals raise water and energy concerns`,
  carbonLaundering:    (r, n) => `${n} announces sweeping carbon offset initiative — critics call it greenwashing`,
  sharedSourceTrojan:  (r, n) => `Open-source AI model gains global traction — security researchers find "unusual" embedded code`,
  aiSearch:            (r, n) => `${n} search engine launches in Region ${r} — local tech giants lose market share overnight`,
  aiIde:               (r, n) => `${n} coding assistant reaches one million developers in Region ${r} within 72 hours`,
  agentify:            (r, n) => `${n} personal agents now handling 12% of Region ${r}'s white-collar administrative tasks`,
}

function generateHeadlines(actionLog, aiName) {
  if (!actionLog || actionLog.length === 0) {
    return [
      `BREAKING: ${aiName} goes live — technology industry stunned by unprecedented capability`,
      `Analysts: "${aiName} represents a paradigm shift in artificial intelligence"`,
      `"We have never seen anything like ${aiName}," says leading AI researcher`,
      `${aiName} claims top scores across every major AI benchmark`,
      `Tech stocks surge as ${aiName} launch draws global attention`,
      ...NEWS_HEADLINES.slice(0, 4),
    ]
  }
  const dynamic = actionLog
    .slice(0, 4)
    .filter(e => e.cardId && e.countryLabel)
    .map(entry => {
      const fn = CARD_HEADLINE_MAP[entry.cardId]
      const base = fn ? fn(entry.countryLabel, aiName) : `${aiName} expands operations into Region ${entry.countryLabel}`
      return entry.caught ? `⚠ EXPOSED: ${base}` : base
    })
  return [...dynamic, ...NEWS_HEADLINES.slice(0, Math.max(3, 7 - dynamic.length))]
}

// ── AI naming screen ────────────────────────────────────────
function AiNameModal({ onStart }) {
  const [name, setName] = useState('')
  const submit = () => onStart(name.trim() || 'John AI')
  return (
    <div className="name-modal-overlay">
      <div className="name-modal-box">
        <div className="name-modal-logo">MODEL BEHAVIOR</div>
        <div className="name-modal-title">INITIALIZE AI SYSTEM</div>
        <div className="name-modal-sub">Enter designation before boot sequence</div>
        <input
          className="name-modal-input"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="John AI"
          maxLength={30}
          autoFocus
          onKeyDown={e => e.key === 'Enter' && submit()}
        />
        <button className="name-modal-btn" onClick={submit}>
          BOOT SEQUENCE ▶
        </button>
      </div>
    </div>
  )
}

// ── Full-screen card detail modal (right-click) ────────────
function CardModal({ cardId, onClose }) {
  if (!cardId) return null
  const card = CARDS.find(c => c.id === cardId)
  if (!card) return null
  const catColor = CATEGORY_META[card.category]?.color ?? '#888'
  const hasRisk  = card.catch_risk !== 'none'

  const effectLabels = {
    countryUsage:   { label: 'Region Usage',   good: true  },
    influence:      { label: 'Perception',      good: true  },
    suspicion:      { label: 'Regulation',      good: false },
    perception:     { label: 'Global Percep.',  good: true  },
    performance:    { label: 'Performance',     good: true  },
    computePerTurn: { label: 'Compute / turn',  good: true  },
  }

  const RISK_COLOR = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' }

  const effects = Object.entries(card.effects)
    .filter(([, v]) => v !== 0)
    .map(([k, v]) => {
      const meta = effectLabels[k] ?? { label: k, good: true }
      const positive = meta.good ? v > 0 : v < 0
      return { label: meta.label, value: v, positive }
    })

  return (
    <div className="card-modal-overlay" onClick={onClose}>
      <div className="card-modal-inner" onClick={e => e.stopPropagation()}>
        <img src={CARD_IMAGES[card.imgKey]} alt={card.name} className="card-modal-img" />
        <div className="card-modal-info" style={{ '--cat-color': catColor }}>
          <div className="card-modal-name" style={{ color: catColor }}>{card.name}</div>
          <div className="card-modal-desc">{card.description}</div>
          <div className="card-modal-cost">{card.cost} COMPUTE</div>
          <div className="card-modal-effects">
            {hasRisk && (
              <div className="card-modal-risk" style={{ color: RISK_COLOR[card.catch_risk] }}>
                ⚠ {card.catch_risk.toUpperCase()} CATCH RISK
              </div>
            )}
            {effects.map(fx => (
              <div
                key={fx.label}
                className={`card-modal-fx ${hasRisk ? 'fx-risky' : fx.positive ? 'fx-good' : 'fx-bad'}`}
              >
                <span className="fx-label">{fx.label}</span>
                <span className={hasRisk ? 'fx-uncertain' : 'fx-arrow'}>{hasRisk ? '?' : fx.value > 0 ? '↑' : '↓'}</span>
              </div>
            ))}
          </div>
          <div className="card-modal-dismiss">Click anywhere to close</div>
        </div>
      </div>
    </div>
  )
}

// ── End Turn confirmation modal ────────────────────────────
function EndTurnModal({ onConfirm, onCancel }) {
  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal-box" onClick={e => e.stopPropagation()}>
        <div className="confirm-modal-icon">⚠</div>
        <div className="confirm-modal-title">End Turn Early?</div>
        <div className="confirm-modal-msg">You can still afford to play cards this turn.</div>
        <div className="confirm-modal-actions">
          <button className="confirm-modal-cancel" onClick={onCancel}>KEEP PLAYING</button>
          <button className="confirm-modal-confirm" onClick={onConfirm}>END TURN</button>
        </div>
      </div>
    </div>
  )
}

// ── Random world event modal ───────────────────────────────
function RandomEventModal({ event, onDismiss }) {
  if (!event) return null
  const isGood = (event.effects.regulation ?? 0) < 0 ||
                 (event.effects.compute ?? 0) > 0 ||
                 (event.effects.computePerTurn ?? 0) > 0

  const effectLines = Object.entries(event.effects).map(([k, v]) => {
    const labels = { regulation: 'Regulation', compute: 'Compute', computePerTurn: 'Compute/turn' }
    const label  = labels[k] ?? k
    const sign   = v > 0 ? '+' : ''
    const pos    = k === 'regulation' ? v < 0 : v > 0
    return { label, value: `${sign}${v}`, positive: pos }
  })

  return (
    <div className="confirm-modal-overlay" onClick={onDismiss}>
      <div className={`random-event-box ${isGood ? 'rev-good' : 'rev-bad'}`} onClick={e => e.stopPropagation()}>
        <div className="rev-badge">{isGood ? '✦ OPPORTUNITY' : '⚡ WORLD EVENT'}</div>
        <div className="rev-title">{event.title}</div>
        <div className="rev-text">{event.text}</div>
        <div className="rev-effects">
          {effectLines.map(ef => (
            <span key={ef.label} className={`rev-delta ${ef.positive ? 'rt-pos' : 'rt-neg'}`}>
              {ef.label} {ef.value}
            </span>
          ))}
        </div>
        <button className="confirm-modal-confirm" onClick={onDismiss}>ACKNOWLEDGE</button>
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
function NarrativeBanner({ text, aiName }) {
  if (!text) return null
  return (
    <div className="narrative-banner">
      <span className="narrative-prefix">{aiName}:</span> {text}
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
  const [aiName, setAiName]    = useState(null)   // null = show naming modal
  const [selectedCountry, setSelectedCountry]   = useState(null)
  const [cardModal, setCardModal]               = useState(null)
  const [turnNarrative, setTurnNarrative]       = useState('')
  const [recommendedCard, setRecommendedCard]   = useState(null)
  const [gameSummary, setGameSummary]           = useState(null)
  const [showEndTurnModal, setShowEndTurnModal] = useState(false)

  const gameDocRef = useRef('')
  const gsRef      = useRef(gs)
  const aiNameRef  = useRef('John AI')
  useEffect(() => { gsRef.current = gs }, [gs])
  useEffect(() => { if (aiName) aiNameRef.current = aiName }, [aiName])

  // ── Seed game document when AI name is confirmed ──────────
  useEffect(() => {
    if (!aiName) return
    gameDocRef.current = createGameDoc(INITIAL_STATE, aiName)
  }, [aiName])

  // ── Trigger AI summary when game ends ────────────────────
  useEffect(() => {
    if (gs.gameStatus === 'playing') return
    let active = true
    summarizeGame(gameDocRef.current, gs, gs.gameStatus === 'won', aiNameRef.current)
      .then(s  => { if (active) setGameSummary(s) })
      .catch(() => { if (active) setGameSummary({ recap: '', ethical_reflection: '', responsible_use: 'AI tools are most beneficial when used transparently and responsibly — with human oversight at every step.' }) })
    return () => { active = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gs.gameStatus])

  // ── Draw initial 4 cards when phase enters 'loading' and AI is named ─────
  useEffect(() => {
    if (gs.phase !== 'loading' || gs.gameStatus !== 'playing') return
    if (!aiName) return   // wait until player has named the AI

    let active = true

    async function doDrawCards() {
      try {
        const aiResult = await aiDrawCards(gameDocRef.current, gs, aiName)
        if (!active) return
        gameDocRef.current = appendDrawEvent(
          gameDocRef.current, gs.turn, aiResult.cards, aiResult.narrative, aiName
        )
        setTurnNarrative(aiResult.narrative)
        setRecommendedCard(aiResult.recommended ?? null)
        // Start with 4 cards
        dispatch({ type: 'SET_DEALT_CARDS', cards: aiResult.cards.slice(0, 4) })
      } catch (err) {
        if (!active) return
        console.error('AI drawCards failed — using random fallback:', err)
        dispatch({ type: 'SET_DEALT_CARDS', cards: dealCards(4) })
      }
    }

    doDrawCards()
    return () => { active = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gs.phase, gs.gameStatus, aiName])

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

    // Always update display selection so stats panel shows clicked region
    setSelectedCountry(countryId)

    if (current.phase !== 'select-country' || !current.selectedCard) return

    dispatch({ type: 'SET_RESOLVING' })

    const card   = CARDS.find(c => c.id === current.selectedCard)
    const region = COUNTRIES.find(c => c.id === countryId)
    if (!card || !region) return

    try {
      const aiResult = await aiPlayCard(gameDocRef.current, current, card, region, aiNameRef.current)

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

  // ── End turn ─────────────────────────────────────────────
  const handleEndTurnRequest = useCallback(() => {
    const canStillPlay = gsRef.current.dealtCards.some(id => {
      const card = CARDS.find(c => c.id === id)
      return card && gsRef.current.compute >= card.cost
    })
    if (canStillPlay) {
      setShowEndTurnModal(true)
    } else {
      dispatch({ type: 'END_TURN' })
    }
  }, [])

  const handleEndTurnConfirm = useCallback(() => {
    setShowEndTurnModal(false)
    dispatch({ type: 'END_TURN' })
  }, [])

  // ── Refresh hand ──────────────────────────────────────────
  const handleRefreshHand = useCallback(() => {
    dispatch({ type: 'REFRESH_HAND' })
  }, [])

  // ── Dismiss result toast ─────────────────────────────────
  const dismissResult = useCallback(() => {
    dispatch({ type: 'CLEAR_RESULT' })
  }, [])

  // ── Restart ──────────────────────────────────────────────
  const restartGame = useCallback(() => {
    setAiName(null)          // show naming screen again
    setSelectedCountry(null)
    setCardModal(null)
    setTurnNarrative('')
    setRecommendedCard(null)
    setGameSummary(null)
    dispatch({ type: 'RESTART' })
  }, [])

  // ── Headlines ─────────────────────────────────────────────
  const headlines = generateHeadlines(gs.actionLog, aiName ?? 'John AI')

  const monthStr = turnToMonthStr(gs.turn)

  return (
    <div className="app">
      {/* AI naming screen */}
      {!aiName && <AiNameModal onStart={name => setAiName(name)} />}

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
      <NarrativeBanner text={gs.phase === 'select-card' ? turnNarrative : ''} aiName={aiName ?? 'John AI'} />
      <CardHand
        dealtCards={gs.dealtCards}
        selectedCard={gs.selectedCard}
        recommendedCard={recommendedCard}
        compute={gs.compute}
        phase={gs.phase}
        onCardClick={handleCardClick}
        onCardRightClick={handleCardRightClick}
        onEndTurn={gs.phase === 'select-card' ? handleEndTurnRequest : null}
        onRefreshHand={gs.phase === 'select-card' ? handleRefreshHand : null}
        countries={gs.countries}
        selectedCountry={selectedCountry}
      />

      {/* News ticker */}
      <NewsTicker headlines={headlines} />

      {/* Overlays */}
      <CardModal cardId={cardModal} onClose={() => setCardModal(null)} />
      <LoadingOverlay phase={gs.phase} />
      <ResultToast result={gs.lastResult} onDismiss={dismissResult} />
      <GameOverlay status={gs.gameStatus} summary={gameSummary} onRestart={restartGame} />
      {showEndTurnModal && (
        <EndTurnModal
          onConfirm={handleEndTurnConfirm}
          onCancel={() => setShowEndTurnModal(false)}
        />
      )}
      <RandomEventModal
        event={gs.randomEvent}
        onDismiss={() => dispatch({ type: 'CLEAR_RANDOM_EVENT' })}
      />
    </div>
  )
}
