import { COUNTRIES, drawOneCard } from './gameData'

const MAX_LOG = 8

function makeCountryState() {
  // Each region tracks: usage (0-100), perception (-100 to 100)
  return { usage: 0, perception: 0 }
}

function calcGlobalUsage(countries) {
  const vals = Object.values(countries).map(c => c.usage)
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

export const INITIAL_STATE = {
  regulation: 0,      // 0 to 100 — global threat/cure bar, lose when it hits 100
  globalUsage: 0,
  compute: 600,
  computePerTurn: 300,
  performance: 0,     // 0 to 100, global AI capability
  turn: 1,
  countries: Object.fromEntries(COUNTRIES.map(c => [c.id, makeCountryState()])),
  dealtCards: [],
  selectedCard: null,
  phase: 'loading',   // 'loading' | 'select-card' | 'select-country' | 'resolving'
  lastResult: null,
  actionLog: [],      // recent action history [{turn, cardName, countryLabel, caught, regulationDelta, usageDelta}]
  gameStatus: 'playing', // 'playing' | 'won' | 'lost'
}

export function gameReducer(state, action) {
  switch (action.type) {

    case 'RESTART':
      return {
        ...INITIAL_STATE,
        countries: Object.fromEntries(COUNTRIES.map(c => [c.id, makeCountryState()])),
      }

    // AI has drawn initial cards — show them to the player
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
    // AI deltas use: countryUsage, influence, suspicion, perception, performance, computePerTurn
    // We map these to HEAD stat types: per-region (usage, perception), global (regulation, performance, computePerTurn)
    case 'APPLY_RESULT': {
      const { cardId, countryId, cardName, cardCost, category, deltas, narrative, caught, globalEvent, impact_level } = action

      const prev = state.countries[countryId]
      const updatedCountry = {
        // countryUsage → per-region usage (direct)
        usage:      Math.min(100, Math.max(0, prev.usage      + Math.round(deltas.countryUsage ?? 0))),
        // influence → per-region perception (local influence = local public perception)
        perception: Math.min(100, Math.max(-100, prev.perception + Math.round(deltas.influence ?? 0))),
      }
      const newCountries = { ...state.countries, [countryId]: updatedCountry }

      const newPerformance    = Math.max(0, Math.min(100, state.performance    + Math.round(deltas.performance    ?? 0)))
      const newComputePerTurn = Math.max(0, state.computePerTurn + Math.round(deltas.computePerTurn ?? 0))
      const newCompute        = Math.max(0, (state.compute - cardCost) + newComputePerTurn)
      const newGlobalUsage    = calcGlobalUsage(newCountries)

      // Regulation: suspicion raises it, positive perception lowers it
      const regulationDelta = Math.round(deltas.suspicion ?? 0) - Math.round(deltas.perception ?? 0)
      const newRegulation = Math.max(0, Math.min(100, state.regulation + regulationDelta))

      const countryObj = COUNTRIES.find(c => c.id === countryId)
      const countryLabel = countryObj?.label ?? countryId
      const lastResult = {
        cardName,
        countryLabel,
        category,
        caught,
        narrative,
        globalEvent:  globalEvent  ?? null,
        impact_level: impact_level ?? null,
        deltas,
      }

      // Action log entry (compact)
      const logEntry = {
        turn:           state.turn,
        cardName,
        countryLabel,
        caught,
        regulationDelta,
        usageDelta:     Math.round(deltas.countryUsage ?? 0),
      }
      const newActionLog = [logEntry, ...state.actionLog].slice(0, MAX_LOG)

      // Remove played card, add one new random card — hand persists across turns
      const remainingHand = state.dealtCards.filter(id => id !== cardId)
      const newCard = drawOneCard(remainingHand)
      const newHand = newCard ? [...remainingHand, newCard] : remainingHand

      const capturedCount = Object.values(newCountries).filter(c => c.usage >= 90).length
      let gameStatus = 'playing'
      if (capturedCount >= 7)       gameStatus = 'won'
      else if (newRegulation >= 100) gameStatus = 'lost'

      return {
        ...state,
        regulation:     newRegulation,
        globalUsage:    newGlobalUsage,
        compute:        newCompute,
        computePerTurn: newComputePerTurn,
        performance:    newPerformance,
        turn:           state.turn + 1,
        countries:      newCountries,
        dealtCards:     newHand,
        selectedCard:   null,
        phase:          'select-card',
        lastResult,
        actionLog:      newActionLog,
        gameStatus,
      }
    }

    // Player skips turn — regulation increases passively, hand unchanged
    case 'SKIP_TURN': {
      // Passive regulation based on global usage (more AI in world = more scrutiny)
      const passiveReg = Math.max(1, Math.round(state.globalUsage / 10))
      const newRegulation = Math.min(100, state.regulation + passiveReg)
      const newCompute = state.compute + state.computePerTurn
      let gameStatus = state.gameStatus
      if (newRegulation >= 100) gameStatus = 'lost'

      const logEntry = {
        turn: state.turn,
        cardName: '— SKIP —',
        countryLabel: null,
        caught: false,
        regulationDelta: passiveReg,
        usageDelta: 0,
      }
      const newActionLog = [logEntry, ...state.actionLog].slice(0, MAX_LOG)

      return {
        ...state,
        regulation: newRegulation,
        compute:    newCompute,
        turn:       state.turn + 1,
        actionLog:  newActionLog,
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
