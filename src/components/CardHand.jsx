import { useState, useEffect, useRef } from 'react'
import { CARDS, COUNTRIES, CATEGORY_META } from '../gameData'
import CARD_IMAGES from '../cardImages'

const REFRESH_COST = 400

function CardItem({ card, isSelected, isRecommended, canAfford, isNew, onClick, onRightClick }) {
  const catColor = CATEGORY_META[card.category]?.color ?? '#888'

  return (
    <div
      className={[
        'card-item',
        isSelected    ? 'selected'    : '',
        isRecommended ? 'recommended' : '',
        !canAfford    ? 'cant-afford' : '',
        isNew         ? 'card-slide-in' : '',
      ].filter(Boolean).join(' ')}
      style={{ '--cat-color': catColor }}
      onClick={canAfford ? onClick : undefined}
      onContextMenu={onRightClick}
      title={card.name}
    >
      {isRecommended && <div className="card-recommend-badge">★ OPTIMAL</div>}
      <div className="card-cost-badge">{card.cost} ⚡</div>
      <img
        src={CARD_IMAGES[card.imgKey]}
        alt={card.name}
        className="card-img"
        draggable={false}
      />
    </div>
  )
}

// ── Region stats panel (right side of card row) ────────────
function RegionPanel({ countries, selectedCountry }) {
  const regionMeta = COUNTRIES.find(c => c.id === selectedCountry)
  const regionData = selectedCountry ? countries?.[selectedCountry] : null

  if (!regionData || !regionMeta) {
    return (
      <div className="region-panel">
        <div className="rp-idle">Click a region<br />on the map</div>
      </div>
    )
  }

  const percColor = regionData.perception >= 0 ? '#22c55e' : '#ef4444'

  return (
    <div className="region-panel">
      <div className="rp-title">Region {regionMeta.label}</div>

      <div className="rp-row">
        <span className="rp-label">Usage</span>
        <span className="rp-value" style={{ color: '#22c55e' }}>{Math.round(regionData.usage)}%</span>
      </div>
      <div className="rp-bar-track">
        <div className="rp-bar-fill" style={{ width: `${regionData.usage}%`, background: '#22c55e' }} />
      </div>

      <div className="rp-row" style={{ marginTop: 6 }}>
        <span className="rp-label">Perception</span>
        <span className="rp-value" style={{ color: percColor }}>
          {regionData.perception > 0 ? '+' : ''}{Math.round(regionData.perception)}
        </span>
      </div>
      <div className="rp-bar-track" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: '#1e3050' }} />
        {(() => {
          const clamped = Math.max(-100, Math.min(100, regionData.perception))
          const isNeg   = clamped < 0
          const halfW   = Math.abs(clamped) / 2
          return (
            <div style={{
              position: 'absolute', top: 0, height: '100%',
              width: `${halfW}%`,
              left: isNeg ? `${50 - halfW}%` : '50%',
              background: isNeg ? '#ef4444' : '#22c55e',
              borderRadius: 2,
            }} />
          )
        })()}
      </div>
    </div>
  )
}

export default function CardHand({ dealtCards, selectedCard, recommendedCard, compute, phase, onCardClick, onCardRightClick, onEndTurn, onRefreshHand, countries, selectedCountry }) {
  const isTargeting      = phase === 'select-country'
  const selectedCardObj  = selectedCard ? CARDS.find(c => c.id === selectedCard) : null
  const canRefresh       = compute >= REFRESH_COST && !isTargeting

  // Track newly added cards for slide-in animation
  const [newCardIds, setNewCardIds]   = useState(new Set())
  const prevDealtRef                  = useRef(dealtCards)

  useEffect(() => {
    const prev    = new Set(prevDealtRef.current)
    const newOnes = dealtCards.filter(id => !prev.has(id))
    if (newOnes.length > 0) {
      setNewCardIds(new Set(newOnes))
      const t = setTimeout(() => setNewCardIds(new Set()), 550)
      return () => clearTimeout(t)
    }
    prevDealtRef.current = dealtCards
  }, [dealtCards])

  return (
    <div className="card-hand-section">
      {/* Info panel — left side */}
      <div className="card-info-panel">
        {isTargeting && selectedCardObj ? (
          <>
            <div className="ci-targeting-label">▶ SELECT REGION</div>
            <div className="ci-card-name">{selectedCardObj.name}</div>
            <div className="ci-card-cost">{selectedCardObj.cost} compute</div>
            <div className="ci-card-desc">{selectedCardObj.description}</div>
          </>
        ) : (
          <>
            <div className="ci-idle-title">YOUR HAND</div>
            <div className="ci-hint">Left-click to play</div>
            <div className="ci-hint">Right-click to inspect</div>
            {onRefreshHand && (
              <button
                className={`refresh-hand-btn ${!canRefresh ? 'cant-afford-btn' : ''}`}
                onClick={canRefresh ? onRefreshHand : undefined}
                title={`Costs ${REFRESH_COST} compute`}
              >
                ↺ REFRESH ({REFRESH_COST})
              </button>
            )}
            {onEndTurn && (
              <button className="skip-turn-btn" onClick={onEndTurn}>
                END TURN
              </button>
            )}
          </>
        )}
      </div>

      {/* Card hand */}
      <div className="card-hand">
        {dealtCards.map(cardId => {
          const card = CARDS.find(c => c.id === cardId)
          if (!card) return null
          return (
            <CardItem
              key={cardId}
              card={card}
              isSelected={selectedCard === cardId}
              isRecommended={recommendedCard === cardId}
              canAfford={compute >= card.cost}
              isNew={newCardIds.has(cardId)}
              onClick={() => onCardClick(cardId)}
              onRightClick={e => { e.preventDefault(); onCardRightClick(cardId) }}
            />
          )
        })}
      </div>

      {/* Region stats panel — right side */}
      <RegionPanel countries={countries} selectedCountry={selectedCountry} />
    </div>
  )
}
