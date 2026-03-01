import { CRISIS_RESPONSES } from '../gameData'

export default function CrisisModal({ crisis, onChoose }) {
  if (!crisis) return null

  const { card, country } = crisis
  const responses = CRISIS_RESPONSES[card.catch_risk]
  if (!responses) return null

  return (
    <div className="crisis-overlay">
      <div className="crisis-modal">
        <div className="crisis-header">⚠ CRISIS RESPONSE REQUIRED</div>
        <div className="crisis-title">{responses.title}</div>
        <div className="crisis-context">
          <span className="crisis-card-name">{card.name}</span>
          {' '}detected in Region {country.label}
        </div>
        <div className="crisis-subtitle">{responses.subtitle}</div>
        <div className="crisis-choices">
          {responses.choices.map(choice => (
            <button
              key={choice.id}
              className="crisis-choice-btn"
              onClick={() => onChoose(choice)}
            >
              <div className="crisis-choice-label">{choice.label}</div>
              <div className="crisis-choice-desc">{choice.description}</div>
              <div className="crisis-choice-effects">{choice.flavor}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
