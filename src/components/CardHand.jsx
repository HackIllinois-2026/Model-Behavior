import { CARDS, CATEGORY_META } from '../gameData'
import CARD_IMAGES from '../cardImages'

function CardItem({ card, isSelected, canAfford, onClick, onRightClick }) {
  const catColor = CATEGORY_META[card.category]?.color ?? '#888'

  return (
    <div
      className={`card-item${isSelected ? ' selected' : ''}${!canAfford ? ' cant-afford' : ''}`}
      style={{ '--cat-color': catColor }}
      onClick={canAfford ? onClick : undefined}
      onContextMenu={onRightClick}
      title={card.name}
    >
      <img
        src={CARD_IMAGES[card.imgKey]}
        alt={card.name}
        className="card-img"
        draggable={false}
      />
    </div>
  )
}

export default function CardHand({ dealtCards, selectedCard, compute, phase, onCardClick, onCardRightClick }) {
  const isTargeting = phase === 'select-country'
  const selectedCardObj = selectedCard ? CARDS.find(c => c.id === selectedCard) : null

  return (
    <div className="card-hand-section">
      {/* Info panel to the left of the cards */}
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
            <div className="ci-hint">Left-click to play a card</div>
            <div className="ci-hint">Right-click to inspect</div>
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
              canAfford={compute >= card.cost}
              onClick={() => onCardClick(cardId)}
              onRightClick={e => { e.preventDefault(); onCardRightClick(cardId) }}
            />
          )
        })}
      </div>
    </div>
  )
}
