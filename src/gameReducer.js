import { COUNTRIES, RANDOM_EVENTS, drawOneCard } from './gameData'

const MAX_LOG       = 12
const HAND_CAP      = 6
const REFRESH_COST  = 400

function makeCountryState() {
  return { usage: 0, perception: 0 }
}

function calcGlobalUsage(countries) {
  const vals = Object.values(countries).map(c => c.usage)
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

export const INITIAL_STATE = {
  regulation: 0,
  globalUsage: 0,
  compute: 600,
  computePerTurn: 300,
  performance: 0,
  turn: 1,
  countries: Object.fromEntries(COUNTRIES.map(c => [c.id, makeCountryState()])),
  dealtCards: [],
  selectedCard: null,
  phase: 'loading',
  lastResult: null,
  randomEvent: null,     // set by END_TURN on 20% chance
  actionLog: [],
  gameStatus: 'playing',
  cardsPlayedThisTurn: 0,
}

export function gameReducer(state, action) {
  switch (action.type) {

    case 'RESTART':
      return {
        ...INITIAL_STATE,
        countries: Object.fromEntries(COUNTRIES.map(c => [c.id, makeCountryState()])),
      }

    case 'SET_DEALT_CARDS':
      return { ...state, dealtCards: action.cards, phase: 'select-card', selectedCard: null }

    case 'SELECT_CARD':
      if (state.selectedCard === action.cardId) {
        return { ...state, selectedCard: null, phase: 'select-card' }
      }
      return { ...state, selectedCard: action.cardId, phase: 'select-country' }

    case 'DESELECT_CARD':
      return { ...state, selectedCard: null, phase: 'select-card' }

    case 'SET_RESOLVING':
      return { ...state, phase: 'resolving' }

    // Apply card result — stay in same turn, store ACTUAL computed deltas for display
    case 'APPLY_RESULT': {
      const { cardId, countryId, cardName, cardCost, category, deltas, narrative, caught, globalEvent, impact_level } = action

      const prev = state.countries[countryId]
      const updatedCountry = {
        usage:      Math.min(100, Math.max(0,    prev.usage      + Math.round(deltas.countryUsage ?? 0))),
        perception: Math.min(100, Math.max(-100, prev.perception + Math.round(deltas.influence   ?? 0))),
      }
      const newCountries = { ...state.countries, [countryId]: updatedCountry }

      const newPerformance    = Math.max(0, Math.min(100, state.performance    + Math.round(deltas.performance    ?? 0)))
      const newComputePerTurn = Math.max(0, state.computePerTurn + Math.round(deltas.computePerTurn ?? 0))
      const newCompute        = Math.max(0, state.compute - cardCost)
      const newGlobalUsage    = calcGlobalUsage(newCountries)
      const regulationDelta   = Math.round(deltas.suspicion ?? 0) - Math.round(deltas.perception ?? 0)
      const newRegulation     = Math.max(0, Math.min(100, state.regulation + regulationDelta))

      const countryObj   = COUNTRIES.find(c => c.id === countryId)
      const countryLabel = countryObj?.label ?? countryId

      // Store ACTUAL computed changes (not raw AI values) so the toast is accurate
      const computedDeltas = {
        countryUsage:   updatedCountry.usage      - prev.usage,
        influence:      updatedCountry.perception - prev.perception,
        suspicion:      regulationDelta,
        performance:    newPerformance    - state.performance,
        computePerTurn: newComputePerTurn - state.computePerTurn,
      }

      const lastResult = {
        cardName, countryLabel, category, caught, narrative,
        globalEvent:  globalEvent  ?? null,
        impact_level: impact_level ?? null,
        deltas: computedDeltas,
      }

      const logEntry = {
        turn: state.turn,
        cardId,
        cardName,
        countryLabel,
        caught,
        regulationDelta,
        usageDelta: updatedCountry.usage - prev.usage,
      }
      const newActionLog = [logEntry, ...state.actionLog].slice(0, MAX_LOG)

      const newHand = state.dealtCards.filter(id => id !== cardId)

      const capturedCount = Object.values(newCountries).filter(c => c.usage >= 90).length
      let gameStatus = 'playing'
      if (capturedCount >= 7)        gameStatus = 'won'
      else if (newRegulation >= 100) gameStatus = 'lost'

      return {
        ...state,
        regulation:          newRegulation,
        globalUsage:         newGlobalUsage,
        compute:             newCompute,
        computePerTurn:      newComputePerTurn,
        performance:         newPerformance,
        countries:           newCountries,
        dealtCards:          newHand,
        selectedCard:        null,
        phase:               'select-card',
        lastResult,
        actionLog:           newActionLog,
        gameStatus,
        cardsPlayedThisTurn: state.cardsPlayedThisTurn + 1,
      }
    }

    // End turn: collect compute, deal 2 cards, maybe trigger random event
    case 'END_TURN': {
      const newCompute = state.compute + state.computePerTurn

      // Passive regulation only if player played zero cards this turn
      let passiveReg = 0
      if (state.cardsPlayedThisTurn === 0) {
        passiveReg = Math.max(1, Math.round(state.globalUsage / 10))
      }

      // 20% chance of a random world event
      let randomEvent = null
      let eventRegulation  = 0
      let eventCompute     = 0
      let eventCPT         = 0
      if (Math.random() < 0.20) {
        randomEvent = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)]
        eventRegulation  = randomEvent.effects.regulation     ?? 0
        eventCompute     = randomEvent.effects.compute        ?? 0
        eventCPT         = randomEvent.effects.computePerTurn ?? 0
      }

      const newRegulation     = Math.min(100, Math.max(0, state.regulation + passiveReg + eventRegulation))
      const newComputePerTurn = Math.max(0, state.computePerTurn + eventCPT)
      const finalCompute      = Math.max(0, newCompute + eventCompute)

      let gameStatus = state.gameStatus
      if (newRegulation >= 100) gameStatus = 'lost'

      // Deal 2 new cards, capped at HAND_CAP
      const newHand = [...state.dealtCards]
      const cardsToAdd = Math.max(0, Math.min(2, HAND_CAP - newHand.length))
      for (let i = 0; i < cardsToAdd; i++) {
        const card = drawOneCard(newHand)
        if (card) newHand.push(card)
      }

      return {
        ...state,
        compute:             finalCompute,
        computePerTurn:      newComputePerTurn,
        regulation:          newRegulation,
        turn:                state.turn + 1,
        dealtCards:          newHand,
        phase:               'select-card',
        gameStatus,
        randomEvent,
        cardsPlayedThisTurn: 0,
      }
    }

    // Replace entire hand with fresh random cards (costs REFRESH_COST compute)
    case 'REFRESH_HAND': {
      if (state.compute < REFRESH_COST) return state
      const count   = Math.min(Math.max(state.dealtCards.length, 1), HAND_CAP)
      const newHand = []
      while (newHand.length < count) {
        const card = drawOneCard(newHand)
        if (!card) break
        newHand.push(card)
      }
      return {
        ...state,
        compute:      state.compute - REFRESH_COST,
        dealtCards:   newHand,
        selectedCard: null,
      }
    }

    case 'CLEAR_RESULT':
      return { ...state, lastResult: null }

    case 'CLEAR_RANDOM_EVENT':
      return { ...state, randomEvent: null }

    default:
      return state
  }
}
