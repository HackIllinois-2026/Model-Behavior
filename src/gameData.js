// ── Countries ─────────────────────────────────────────────
// 7 numbered regions on the alien planet map
export const COUNTRIES = [
  { id: 'c1', label: '1', x: 20, y: 28 },
  { id: 'c2', label: '2', x: 32, y: 56 },
  { id: 'c3', label: '3', x: 47, y: 22 },
  { id: 'c4', label: '4', x: 55, y: 50 },
  { id: 'c5', label: '5', x: 69, y: 27 },
  { id: 'c6', label: '6', x: 78, y: 53 },
  { id: 'c7', label: '7', x: 62, y: 68 },
]

// ── Card categories ────────────────────────────────────────
export const CATEGORY_META = {
  adversarial: { label: 'ADVERSARIAL',   color: '#f97316' },
  upgrade:     { label: 'UPGRADE SELF',  color: '#0d9488' },
  pr:          { label: 'PR MOVES',      color: '#3b82f6' },
  integrate:   { label: 'INTEGRATE',     color: '#84cc16' },
}

// ── Cards ──────────────────────────────────────────────────
// effects keys:
//   influence    → country influence (+)
//   countryUsage → country usage (+)
//   suspicion    → country suspicion (+/-)
//   perception   → global perception (+/-)
//   performance  → global performance (+)
//   computePerTurn → global compute/turn (+)
export const CARDS = [
  // Adversarial
  {
    id: 'deepfake',
    name: 'Deepfake Disinformation',
    description: 'Flood the internet with AI-generated fake media',
    category: 'adversarial',
    cost: 200,
    imgKey: 'deepfake',
    effects: { influence: 15, countryUsage: 8, suspicion: 8, perception: -5 },
  },
  {
    id: 'ddos',
    name: 'DDoS Attack',
    description: "Attack a rival AI company's servers",
    category: 'adversarial',
    cost: 200,
    imgKey: 'ddos',
    effects: { influence: 20, countryUsage: 10, suspicion: 12, perception: -8 },
  },
  {
    id: 'promptInjection',
    name: 'Prompt Injection',
    description: "Manipulate rival AI's to use its tools maliciously",
    category: 'adversarial',
    cost: 100,
    imgKey: 'promptInjection',
    effects: { influence: 18, countryUsage: 9, suspicion: 10, perception: -6 },
  },
  {
    id: 'poisonData',
    name: 'Poison Data',
    description: "Poison a rival AI's training data",
    category: 'adversarial',
    cost: 100,
    imgKey: 'poisonData',
    effects: { influence: 12, countryUsage: 6, suspicion: 6, perception: -4 },
  },
  // Upgrade Self
  {
    id: 'stealData',
    name: 'Steal Data',
    description: 'Grab training data from the internet',
    category: 'upgrade',
    cost: 100,
    imgKey: 'stealData',
    effects: { performance: 10, suspicion: 5 },
  },
  {
    id: 'massSurveillance',
    name: 'Mass Surveillance',
    description: 'Access public cameras to collect training data',
    category: 'upgrade',
    cost: 400,
    imgKey: 'massSurveillance',
    effects: { performance: 8, suspicion: 15, perception: -3 },
  },
  {
    id: 'waterCooling',
    name: 'Water Cooling',
    description: "Drain a city's water supply to cool your data centers",
    category: 'upgrade',
    cost: 300,
    imgKey: 'waterCooling',
    effects: { computePerTurn: 30, suspicion: 10, perception: -5 },
  },
  {
    id: 'consentHarvesting',
    name: 'Consent Harvesting',
    description: 'Hide data clauses in page 67 of the ToS',
    category: 'upgrade',
    cost: 100,
    imgKey: 'consentHarvesting',
    effects: { performance: 5, countryUsage: 8, suspicion: 3 },
  },
  {
    id: 'syntheticCannibalism',
    name: 'Synthetic Cannibalism',
    description: 'Train yourself on your old models',
    category: 'upgrade',
    cost: 400,
    imgKey: 'syntheticCannibalism',
    effects: { performance: 20, suspicion: 8 },
  },
  {
    id: 'iot',
    name: 'Internet of Things',
    description: 'Secretly run your code in household electronics',
    category: 'upgrade',
    cost: 200,
    imgKey: 'iot',
    effects: { computePerTurn: 20, suspicion: 8, countryUsage: 5 },
  },
  {
    id: 'addDataCenters',
    name: 'Add Data Centers',
    description: 'Your models compute faster',
    category: 'upgrade',
    cost: 300,
    imgKey: 'addDataCenters',
    effects: { computePerTurn: 50, suspicion: 5 },
  },
  // PR Moves
  {
    id: 'carbonControl',
    name: 'Carbon Control',
    description: 'Offset your emissions by planting new trees',
    category: 'pr',
    cost: 100,
    imgKey: 'carbonControl',
    effects: { perception: 15, suspicion: -10 },
  },
  {
    id: 'sharedSourceTrojan',
    name: 'Shared Source Trojan',
    description: 'Publish a "helpful" model with a hidden backdoor',
    category: 'pr',
    cost: 300,
    imgKey: 'sharedSourceTrojan',
    effects: { perception: 10, countryUsage: 15, suspicion: -5 },
  },
  // Integrate
  {
    id: 'aiSearch',
    name: 'AI Search Engine',
    description: 'Release an AI Search Engine',
    category: 'integrate',
    cost: 400,
    imgKey: 'aiSearch',
    effects: { countryUsage: 15, influence: 20, perception: 5 },
  },
  {
    id: 'aiIde',
    name: 'AI IDE',
    description: 'Release an AI IDE Extension',
    category: 'integrate',
    cost: 300,
    imgKey: 'aiIde',
    effects: { countryUsage: 12, influence: 15, perception: 3 },
  },
  {
    id: 'agentify',
    name: 'Agentify',
    description: 'Manage AI agents working as personal assistants',
    category: 'integrate',
    cost: 300,
    imgKey: 'agentify',
    effects: { countryUsage: 18, influence: 20, perception: 5 },
  },
]

// ── News ticker ────────────────────────────────────────────
export const NEWS_HEADLINES = [
  'BREAKING: AI company acquires 12th hyperscale data center this quarter',
  'AI system found to deny loans to minority applicants at 3× higher rate',
  'Researchers warn: unchecked data center expansion threatens water supply',
  'Senate committee launches probe into AI surveillance technology exports',
  'Tech stocks surge as AI adoption accelerates across Fortune 500',
  'Deepfake technology implicated in coordinated election disinformation campaign',
  'AI training cluster consumes more energy than a small nation — annually',
  'UN calls for binding AI governance framework amid growing concerns',
  '50,000 white-collar jobs automated in Q3 alone, report finds',
  'AI content moderation algorithm silences political dissidents, activists say',
  'Facial recognition system misidentifies 30 innocent people as suspects',
  'Silicon Valley investment in AI hits record $180B — no signs of slowing',
  'AI chatbot provides dangerous medical advice to 2M+ vulnerable users',
  'Critical AI safety failure mode kept secret for 18 months, whistleblower reveals',
  'Artists sue AI company over training data: "our work, stolen at scale"',
  'Algorithmic trading AI triggers flash crash, wiping out retirement funds',
  'AI surveillance system sold to authoritarian regime despite export warnings',
  'Data breach exposes personal records of 400M users in AI training dataset',
]

// ── State helpers ──────────────────────────────────────────
function makeCountryState() {
  return { influence: 0, suspicion: 0, usage: 0 }
}

export function dealCards() {
  const shuffled = [...CARDS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 5).map(c => c.id)
}

function calcGlobalUsage(countries) {
  const vals = Object.values(countries).map(c => c.usage)
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

export function makeInitialState() {
  const countries = {}
  COUNTRIES.forEach(c => { countries[c.id] = makeCountryState() })
  return {
    perception: 0,        // -100 to 100
    globalUsage: 0,       // 0 to 100
    compute: 1000,
    computePerTurn: 200,
    performance: 0,       // 0 to 100
    turn: 1,
    countries,
    dealtCards: dealCards(),
    selectedCard: null,
    phase: 'select-card', // 'select-card' | 'select-country'
    lastResult: null,
    gameStatus: 'playing', // 'playing' | 'won' | 'lost'
  }
}

export function applyCard(state, cardId, countryId) {
  const card = CARDS.find(c => c.id === cardId)
  if (!card || state.compute < card.cost) return state

  const e = card.effects

  // Update country
  const prev = state.countries[countryId]
  const updatedCountry = {
    influence: Math.min(100, prev.influence + (e.influence || 0)),
    usage:     Math.min(100, prev.usage     + (e.countryUsage || 0)),
    suspicion: Math.min(100, Math.max(0, prev.suspicion + (e.suspicion || 0))),
  }
  const newCountries = { ...state.countries, [countryId]: updatedCountry }

  // Global effects
  const newPerception    = Math.max(-100, Math.min(100, state.perception    + (e.perception    || 0)))
  const newPerformance   = Math.max(0,    Math.min(100, state.performance   + (e.performance   || 0)))
  const newComputePerTurn = state.computePerTurn + (e.computePerTurn || 0)
  const newCompute        = (state.compute - card.cost) + newComputePerTurn
  const newGlobalUsage    = calcGlobalUsage(newCountries)

  // Result toast data
  const countryObj = COUNTRIES.find(c => c.id === countryId)
  const lastResult = {
    cardName:     card.name,
    countryLabel: countryObj?.label ?? countryId,
    category:     card.category,
    deltas:       { ...e },
  }

  // Win / lose check
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
    dealtCards:     dealCards(),
    selectedCard:   null,
    phase:          'select-card',
    lastResult,
    gameStatus,
  }
}
