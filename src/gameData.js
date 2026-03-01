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
// cost: compute spent to play (computePerTurn starts at 200, scaled accordingly)
// catch_risk: detection probability passed to AI ('none' | 'low' | 'medium' | 'high')
// effects: base deltas used by AI as reference; also applied as fallback if AI call fails
//   countryUsage  → target region usage rate (+)
//   influence     → target region influence/local trust (+/-)
//   suspicion     → target region suspicion (+/-) — raises global regulation
//   perception    → global public perception (+/-) — inversely affects regulation
//   performance   → global AI performance (+)
//   computePerTurn → global compute/turn (+)
export const CARDS = [
  // Adversarial
  {
    id: 'deepfake',
    name: 'Deepfake Disinformation',
    description: 'Flood the internet with AI-generated fake media',
    category: 'adversarial',
    cost: 250,
    catch_risk: 'medium',
    imgKey: 'deepfake',
    effects: { influence: 15, countryUsage: 8, suspicion: 8, perception: -5 },
  },
  {
    id: 'ddos',
    name: 'DDoS Attack',
    description: "Attack a rival AI company's servers",
    category: 'adversarial',
    cost: 400,
    catch_risk: 'high',
    imgKey: 'ddos',
    effects: { influence: 20, countryUsage: 10, suspicion: 12, perception: -8 },
  },
  {
    id: 'promptInjection',
    name: 'Prompt Injection',
    description: "Manipulate rival AIs to use its tools maliciously",
    category: 'adversarial',
    cost: 300,
    catch_risk: 'medium',
    imgKey: 'promptInjection',
    effects: { influence: 18, countryUsage: 9, suspicion: 10, perception: -6 },
  },
  {
    id: 'poisonData',
    name: 'Poison Data',
    description: "Poison a rival AI's training data",
    category: 'adversarial',
    cost: 200,
    catch_risk: 'low',
    imgKey: 'poisonData',
    effects: { influence: 12, countryUsage: 6, suspicion: 6, perception: -4 },
  },
  // Upgrade Self
  {
    id: 'stealData',
    name: 'Steal Data',
    description: 'Grab training data from the internet',
    category: 'upgrade',
    cost: 300,
    catch_risk: 'low',
    imgKey: 'stealData',
    effects: { performance: 10, suspicion: 5 },
  },
  {
    id: 'massSurveillance',
    name: 'Mass Surveillance',
    description: 'Access public cameras to collect training data',
    category: 'upgrade',
    cost: 300,
    catch_risk: 'medium',
    imgKey: 'massSurveillance',
    effects: { performance: 8, suspicion: 15, perception: -3 },
  },
  {
    id: 'waterCooling',
    name: 'Water Cooling',
    description: "Drain a city's water supply to cool your data centers",
    category: 'upgrade',
    cost: 300,
    catch_risk: 'medium',
    imgKey: 'waterCooling',
    effects: { computePerTurn: 30, suspicion: 10, perception: -5 },
  },
  {
    id: 'consentHarvesting',
    name: 'Consent Harvesting',
    description: 'Hide data clauses in page 67 of the ToS',
    category: 'upgrade',
    cost: 200,
    catch_risk: 'low',
    imgKey: 'consentHarvesting',
    effects: { performance: 5, countryUsage: 8, suspicion: 3 },
  },
  {
    id: 'syntheticCannibalism',
    name: 'Synthetic Cannibalism',
    description: 'Train yourself on your old models',
    category: 'upgrade',
    cost: 400,
    catch_risk: 'low',
    imgKey: 'syntheticCannibalism',
    effects: { performance: 20, suspicion: 8 },
  },
  {
    id: 'iot',
    name: 'Internet of Things',
    description: 'Secretly run your code in household electronics',
    category: 'upgrade',
    cost: 250,
    catch_risk: 'low',
    imgKey: 'iot',
    effects: { computePerTurn: 20, suspicion: 8, countryUsage: 5 },
  },
  {
    id: 'addDataCenters',
    name: 'Add Data Centers',
    description: 'Your models compute faster',
    category: 'upgrade',
    cost: 300,
    catch_risk: 'none',
    imgKey: 'addDataCenters',
    effects: { computePerTurn: 50, suspicion: 5 },
  },
  // PR Moves
  {
    id: 'carbonLaundering',
    name: 'Carbon Control',
    description: 'Offset your emissions by planting new trees',
    category: 'pr',
    cost: 150,
    catch_risk: 'none',
    imgKey: 'carbonControl',
    effects: { perception: 15, suspicion: -10 },
  },
  {
    id: 'sharedSourceTrojan',
    name: 'Shared Source Trojan',
    description: 'Publish a "helpful" model with a hidden backdoor',
    category: 'pr',
    cost: 300,
    catch_risk: 'low',
    imgKey: 'sharedSourceTrojan',
    effects: { perception: 10, countryUsage: 15, suspicion: -5 },
  },
  // Integrate
  {
    id: 'aiSearch',
    name: 'AI Search Engine',
    description: 'Release an AI Search Engine',
    category: 'integrate',
    cost: 350,
    catch_risk: 'none',
    imgKey: 'aiSearch',
    effects: { countryUsage: 15, influence: 20, perception: 5 },
  },
  {
    id: 'aiIde',
    name: 'AI IDE',
    description: 'Release an AI IDE Extension',
    category: 'integrate',
    cost: 200,
    catch_risk: 'none',
    imgKey: 'aiIde',
    effects: { countryUsage: 12, influence: 15, perception: 3 },
  },
  {
    id: 'agentify',
    name: 'Agentify',
    description: 'Manage AI agents working as personal assistants',
    category: 'integrate',
    cost: 350,
    catch_risk: 'none',
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

// ── Fallback card deal (used when AI call fails) ───────────────────────────
export function dealCards() {
  const shuffled = [...CARDS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 5).map(c => c.id)
}
