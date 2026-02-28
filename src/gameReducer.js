import { COUNTRIES } from './gameData'

function makeCountryState() {
  return { influence: 0, suspicion: 0, usage: 0 }
}

function calcGlobalUsage(countries) {
  const vals = Object.values(countries).map(c => c.usage)
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

export const INITIAL_STATE = {
  perception: 0,
  globalUsage: 0,
  compute: 1000,
  computePerTurn: 200,
  performance: 0,
  turn: 1,
  countries: Object.fromEntries(COUNTRIES.map(c => [c.id, makeCountryState()])),
  dealtCards: [],
  selectedCard: null,
  phase: 'loading',   // 'loading' | 'select-card' | 'select-country' | 'resolving'
  lastResult: null,
  gameStatus: 'playing', // 'playing' | 'won' | 'lost'
}

export function gameReducer(state, action) {
  switch (action.type) {

    case 'RESTART':
      return {
        ...INITIAL_STATE,
        countries: Object.fromEntries(COUNTRIES.map(c => [c.id, makeCountryState()])),
      }

    // AI has drawn cards — show them to the player
    case 'SET_DEALT_CARDS':
      return {
        ...state,
        dealtCards: action.cards,
        phase: 'select-card',
        selectedCard: null,
      }

    // Player clicks a card (toggle select / deselect)
    case 'SELECT_CARD':
      if (state.selectedCard === action.cardId) {
        return { ...state, selectedCard: null, phase: 'select-card' }
      }
      return { ...state, selectedCard: action.cardId, phase: 'select-country' }

    // Player deselects a card explicitly
    case 'DESELECT_CARD':
      return { ...state, selectedCard: null, phase: 'select-card' }

    // Waiting for AI to resolve card play
    case 'SET_RESOLVING':
      return { ...state, phase: 'resolving' }

    // AI returned card play result — apply deltas and advance turn
    case 'APPLY_RESULT': {
      const { countryId, cardName, cardCost, category, deltas, narrative, caught, globalEvent, impact_level } = action

      const prev = state.countries[countryId]
      const updatedCountry = {
        influence: Math.min(100, Math.max(0, prev.influence + Math.round(deltas.influence ?? 0))),
        usage:     Math.min(100, Math.max(0, prev.usage     + Math.round(deltas.countryUsage ?? 0))),
        suspicion: Math.min(100, Math.max(0, prev.suspicion + Math.round(deltas.suspicion ?? 0))),
      }
      const newCountries = { ...state.countries, [countryId]: updatedCountry }

      const newPerception    = Math.max(-100, Math.min(100, state.perception    + Math.round(deltas.perception    ?? 0)))
      const newPerformance   = Math.max(0,    Math.min(100, state.performance   + Math.round(deltas.performance   ?? 0)))
      const newComputePerTurn = Math.max(0, state.computePerTurn + Math.round(deltas.computePerTurn ?? 0))
      const newCompute        = Math.max(0, (state.compute - cardCost) + newComputePerTurn)
      const newGlobalUsage    = calcGlobalUsage(newCountries)

      const countryObj = COUNTRIES.find(c => c.id === countryId)
      const lastResult = {
        cardName,
        countryLabel: countryObj?.label ?? countryId,
        category,
        caught,
        narrative,
        globalEvent:  globalEvent  ?? null,
        impact_level: impact_level ?? null,
        deltas,
      }

      const capturedCount = Object.values(newCountries).filter(c => c.usage >= 90).length
      let gameStatus = 'playing'
      if (capturedCount >= 7)         gameStatus = 'won'
      else if (newPerception <= -100) gameStatus = 'lost'

      return {
        ...state,
        perception:     newPerception,
        globalUsage:    newGlobalUsage,
        compute:        newCompute,
        computePerTurn: newComputePerTurn,
        performance:    newPerformance,
        turn:           state.turn + 1,
        countries:      newCountries,
        selectedCard:   null,
        phase:          'loading',  // triggers next drawCards call
        lastResult,
        gameStatus,
      }
    }

    // Dismiss the result toast
    case 'CLEAR_RESULT':
      return { ...state, lastResult: null }

    default:
      return state
  }
}
