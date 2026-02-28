import { CARDS, CATEGORY_META } from '../gameData'
import CARD_IMAGES from '../cardImages'

function CardItem({ card, isSelected, isRecommended, canAfford, onClick, onRightClick }) {
  const catColor = CATEGORY_META[card.category]?.color ?? '#888'

  return (
    <div
      className={[
        'card-item',
        isSelected    ? 'selected'    : '',
        isRecommended ? 'recommended' : '',
        !canAfford    ? 'cant-afford' : '',
      ].filter(Boolean).join(' ')}
      style={{ '--cat-color': catColor }}
      onClick={canAfford ? onClick : undefined}
      onContextMenu={onRightClick}
      title={card.name}
    >
      {isRecommended && <div className="card-recommend-badge">★ OPTIMAL</div>}
      <img
        src={CARD_IMAGES[card.imgKey]}
        alt={card.name}
        className="card-img"
        draggable={false}
      />
      <div className="card-category-tag" style={{ background: catColor }}>
        {CATEGORY_META[card.category]?.label}
      </div>
    </div>
  )
}

export default function CardHand({ dealtCards, selectedCard, recommendedCard, compute, phase, onCardClick, onCardRightClick }) {
  const isTargeting = phase === 'select-country'

  return (
    <div className="card-hand-section">
      <div className={`card-hand-label${isTargeting ? ' targeting' : ''}`}>
        {isTargeting
          ? '▶  SELECT A REGION ON THE MAP TO TARGET'
          : 'SELECT A CARD  ·  RIGHT-CLICK FOR DETAILS'}
      </div>
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
              onClick={() => onCardClick(cardId)}
              onRightClick={e => { e.preventDefault(); onCardRightClick(cardId) }}
            />
          )
        })}
      </div>
    </div>
  )
}
