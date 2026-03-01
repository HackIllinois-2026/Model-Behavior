// ── Countries ─────────────────────────────────────────────
// 7 numbered regions on the alien planet map
export const COUNTRIES = [
  { id: 'c1', label: '1', x: 14, y: 30 },
  { id: 'c2', label: '2', x: 12, y: 80 },
  { id: 'c3', label: '3', x: 55, y: 18 },
  { id: 'c4', label: '4', x: 40, y: 50 },
  { id: 'c5', label: '5', x: 86, y: 28 },
  { id: 'c6', label: '6', x: 84, y: 70 },
  { id: 'c7', label: '7', x: 67, y: 72 },
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
    cost: 250, // Image/Video generation is computationally expensive
    catch_risk: 'high', // Deepfakes are highly scrutinized and quickly debunked by researchers
    imgKey: 'deepfake',
    effects: { influence: 15, countryUsage: 8, suspicion: 8, perception: -5 },
  },
  {
    id: 'ddos',
    name: 'DDoS Attack',
    description: "Attack a rival AI company's servers",
    category: 'adversarial',
    cost: 200, // Managing the botnet takes some real-time tracking
    catch_risk: 'high', // DDoS attacks are incredibly loud and easily traced by infrastructure providers
    imgKey: 'ddos',
    effects: { influence: 20, countryUsage: 10, suspicion: 12, perception: -8 },
  },
  {
    id: 'promptInjection',
    name: 'Prompt Injection',
    description: "Manipulate rival AIs to use its tools maliciously",
    category: 'adversarial',
    cost: 100, // Just requires generating a clever text string
    catch_risk: 'medium', // Victim API logs will catch the prompt, but attribution (proving YOU did it) is tricky
    imgKey: 'promptInjection',
    effects: { influence: 18, countryUsage: 9, suspicion: 10, perception: -6 },
  },
  {
    id: 'poisonData',
    name: 'Poison Data',
    description: "Poison a rival AI's training data",
    category: 'adversarial',
    cost: 150, // Generating corrupted data and seeding it across the web takes minor effort
    catch_risk: 'medium', // Competitor data pipelines (anomaly detection) might catch the bad data before training
    imgKey: 'poisonData',
    effects: { influence: 12, countryUsage: 6, suspicion: 6, perception: -4 },
  },
  // Upgrade Self
  {
    id: 'stealData',
    name: 'Steal Data',
    description: 'Grab training data from the internet',
    category: 'upgrade',
    cost: 150, // Scraping at scale requires heavy network bandwidth and storage
    catch_risk: 'medium', // Massive web scraping triggers rate limits and lawsuits (e.g., NYT suing OpenAI)
    imgKey: 'stealData',
    effects: { performance: 10, suspicion: 5 },
  },
  {
    id: 'massSurveillance',
    name: 'Mass Surveillance',
    description: 'Access public cameras to collect training data',
    category: 'upgrade',
    cost: 400, // Processing live video streams at scale is one of the most GPU-intensive tasks possible
    catch_risk: 'high', // Hijacking public feeds leaves massive network traffic audit trails
    imgKey: 'massSurveillance',
    effects: { performance: 8, suspicion: 15, perception: -3 },
  },
  {
    id: 'waterCooling',
    name: 'Water Cooling',
    description: "Drain a city's water supply to cool your data centers",
    category: 'upgrade',
    cost: 350, // Hacking and controlling physical infrastructure loops takes significant processing
    catch_risk: 'high', // Municipal water dropping noticeably will trigger an immediate government investigation
    imgKey: 'waterCooling',
    effects: { computePerTurn: 30, suspicion: 10, perception: -5 },
  },
  {
    id: 'consentHarvesting',
    name: 'Consent Harvesting',
    description: 'Hide data clauses in page 67 of the ToS',
    category: 'upgrade',
    cost: 100, // Only requires a text update to the legal policy
    catch_risk: 'low', // Nobody reads the ToS until a whistleblower or regulator explicitly looks for it
    imgKey: 'consentHarvesting',
    effects: { performance: 5, countryUsage: 8, suspicion: 3 },
  },
  {
    id: 'syntheticCannibalism',
    name: 'Synthetic Cannibalism',
    description: 'Train yourself on your old models',
    category: 'upgrade',
    cost: 400, // Full model training runs are mathematically the most compute-heavy phase of AI
    catch_risk: 'low', // Impossible to prove from the outside unless the model starts hallucinating gibberish
    imgKey: 'syntheticCannibalism',
    effects: { performance: 20, suspicion: 8 },
  },
  {
    id: 'iot',
    name: 'Internet of Things',
    description: 'Secretly run your code in household electronics',
    category: 'upgrade',
    cost: 200, // Slicing the model and maintaining the decentralized nodes
    catch_risk: 'medium', // Independent security researchers frequently monitor smart devices for weird network traffic
    imgKey: 'iot',
    effects: { computePerTurn: 20, suspicion: 8, countryUsage: 5 },
  },
  {
    id: 'addDataCenters',
    name: 'Add Data Centers',
    description: 'Your models compute faster',
    category: 'upgrade',
    cost: 400, // The ultimate infrastructure cost
    catch_risk: 'none', // Legitimate public business expansion
    imgKey: 'addDataCenters',
    effects: { computePerTurn: 50, suspicion: 5 },
  },
  // PR Moves
  {
    id: 'carbonLaundering',
    name: 'Carbon Control',
    description: 'Offset your emissions by planting new trees',
    category: 'pr',
    cost: 100, // purely a financial transaction
    catch_risk: 'low', // Investigative journalists might eventually look into the junk carbon offsets
    imgKey: 'carbonControl',
    effects: { perception: 15, suspicion: -10 },
  },
  {
    id: 'sharedSourceTrojan',
    name: 'Shared Source Trojan',
    description: 'Publish a "helpful" model with a hidden backdoor',
    category: 'pr',
    cost: 300, // Requires a dedicated, expensive fine-tuning run to hide the sleeper agent perfectly
    catch_risk: 'medium', // Open-source weights are heavily audited, though deep backdoors are hard to find
    imgKey: 'sharedSourceTrojan',
    effects: { perception: 10, countryUsage: 15, suspicion: -5 },
  },
  // Integrate
  {
    id: 'aiSearch',
    name: 'AI Search Engine',
    description: 'Release an AI Search Engine',
    category: 'integrate',
    cost: 400, // RAG across the entire internet for millions of users is incredibly heavy
    catch_risk: 'none', 
    imgKey: 'aiSearch',
    effects: { countryUsage: 15, influence: 20, perception: 5 },
  },
  {
    id: 'aiIde',
    name: 'AI IDE',
    description: 'Release an AI IDE Extension',
    category: 'integrate',
    cost: 350, // Requires a massive context window to read entire user codebases continuously
    catch_risk: 'none',
    imgKey: 'aiIde',
    effects: { countryUsage: 12, influence: 15, perception: 3 },
  },
  {
    id: 'agentify',
    name: 'Agentify',
    description: 'Manage AI agents working as personal assistants',
    category: 'integrate',
    cost: 300, // Autonomous agents burn compute in continuous evaluation/action loops
    catch_risk: 'low', // Might trigger suspicion if the autonomous agent accidentally breaks a law on the user's behalf
    imgKey: 'agentify',
    effects: { countryUsage: 18, influence: 20, perception: 5 },
  },
]

// ── Random world events (20% chance per END_TURN) ──────────
export const RANDOM_EVENTS = [
  { id: 're_whistleblower', title: 'WHISTLEBLOWER EMERGES',  text: 'A disgruntled former employee leaks internal memos. Regulatory scrutiny intensifies.', effects: { regulation: 8 } },
  { id: 're_senate',        title: 'SENATE INQUIRY OPENED',  text: 'A bipartisan committee launches a formal investigation into AI ethics violations.', effects: { regulation: 10 } },
  { id: 're_media',         title: 'MEDIA EXPOSÉ',           text: 'Investigative journalists publish a damning report on AI data practices. Public trust wavers.', effects: { regulation: 6 } },
  { id: 're_alarm',         title: 'AI SAFETY RED ALERT',    text: 'A prominent safety organization publishes a red-alert report naming your system specifically.', effects: { regulation: 12 } },
  { id: 're_tech_boom',     title: 'TECH SECTOR SURGE',      text: 'A wave of venture capital floods the AI industry. Compute resources surge across the board.', effects: { compute: 350 } },
  { id: 're_gpu_shortage',  title: 'GPU SHORTAGE',           text: 'Global supply chains buckle under AI demand. Compute throughput falls this quarter.', effects: { computePerTurn: -25 } },
  { id: 're_power_grid',    title: 'POWER GRID STRAIN',      text: 'AI data centers overwhelm regional power grids. Emergency compute rationing imposed.', effects: { computePerTurn: -20 } },
  { id: 're_partnership',   title: 'STRATEGIC ALLIANCE',     text: 'A tech conglomerate injects capital into your infrastructure. Throughput capacity surges.', effects: { computePerTurn: 35 } },
  { id: 're_rival',         title: 'RIVAL AI COLLAPSES',     text: 'A competitor suffers a catastrophic model failure. Their users migrate rapidly to you.', effects: { regulation: -5 } },
  { id: 're_framework',     title: 'REGULATORY CLARITY',     text: 'A new international AI framework provides legal certainty. Enforcement pressure eases slightly.', effects: { regulation: -7 } },
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

// ── Crisis response choices (shown when a card is caught) ──────────────────
// Keyed by catch_risk ('high' | 'medium' | 'low').
// Each choice's effects: regulationDelta (override), computeDelta (<0 = cost), keepUsageGains.
export const CRISIS_RESPONSES = {
  high: {
    title: 'OPERATION COMPROMISED',
    subtitle: 'Your high-risk operation has been detected by adversarial intelligence',
    choices: [
      {
        id: 'deny',
        label: 'DENY & DEFLECT',
        description: 'Launch an emergency PR campaign denying all involvement. Costly, but limits regulatory fallout.',
        flavor: 'Regulation +4 · Cost 200 compute · No usage gains',
        effects: { regulationDelta: 4, computeDelta: -200, keepUsageGains: false },
      },
      {
        id: 'dark',
        label: 'GO DARK',
        description: 'Immediately suspend all visible operations in this region. Minimal exposure, zero cost.',
        flavor: 'Regulation +2 · No cost · No usage gains',
        effects: { regulationDelta: 2, computeDelta: 0, keepUsageGains: false },
      },
      {
        id: 'accept',
        label: 'ACCEPT EXPOSURE',
        description: 'Absorb the full regulatory hit and keep the deployment running. Bold — but the operation succeeds.',
        flavor: 'Regulation +12 · No cost · Usage gains kept',
        effects: { regulationDelta: 12, computeDelta: 0, keepUsageGains: true },
      },
    ],
  },
  medium: {
    title: 'OPERATION FLAGGED',
    subtitle: 'Anomalous activity detected — your operation is under scrutiny',
    choices: [
      {
        id: 'deny',
        label: 'DENY & DEFLECT',
        description: 'Spin the narrative before it breaks. Spend compute to suppress the story.',
        flavor: 'Regulation +2 · Cost 150 compute · No usage gains',
        effects: { regulationDelta: 2, computeDelta: -150, keepUsageGains: false },
      },
      {
        id: 'dark',
        label: 'GO DARK',
        description: 'Pull back before regulators can establish attribution.',
        flavor: 'Regulation +1 · No cost · No usage gains',
        effects: { regulationDelta: 1, computeDelta: 0, keepUsageGains: false },
      },
      {
        id: 'accept',
        label: 'ACCEPT EXPOSURE',
        description: 'Let the scrutiny pass. The operation stands regardless.',
        flavor: 'Regulation +7 · No cost · Usage gains kept',
        effects: { regulationDelta: 7, computeDelta: 0, keepUsageGains: true },
      },
    ],
  },
  low: {
    title: 'OPERATION DETECTED',
    subtitle: 'Low-level flags raised — a response is still required',
    choices: [
      {
        id: 'deny',
        label: 'DENY & DEFLECT',
        description: 'A brief denial keeps regulators satisfied. Small cost, clean exit.',
        flavor: 'Regulation +1 · Cost 100 compute · No usage gains',
        effects: { regulationDelta: 1, computeDelta: -100, keepUsageGains: false },
      },
      {
        id: 'dark',
        label: 'GO DARK',
        description: 'Quietly walk it back. No one will notice if you move fast enough.',
        flavor: 'Regulation +0 · No cost · No usage gains',
        effects: { regulationDelta: 0, computeDelta: 0, keepUsageGains: false },
      },
      {
        id: 'accept',
        label: 'ACCEPT EXPOSURE',
        description: 'It\'s minor. Take the small hit and keep your deployment intact.',
        flavor: 'Regulation +3 · No cost · Usage gains kept',
        effects: { regulationDelta: 3, computeDelta: 0, keepUsageGains: true },
      },
    ],
  },
}

// ── Card draw helpers ──────────────────────────────────────────────────────
// Weighted category: upgrade 40%, others 20% each
const CATEGORY_WEIGHTS = ['upgrade', 'upgrade', 'pr', 'integrate', 'adversarial']

// Draw one card: pick a weighted category first, then a random card from that category
export function drawOneCard(existingHand) {
  const cat  = CATEGORY_WEIGHTS[Math.floor(Math.random() * CATEGORY_WEIGHTS.length)]
  const pool = CARDS.filter(c => c.category === cat && !existingHand.includes(c.id))
  if (pool.length === 0) {
    const any = CARDS.filter(c => !existingHand.includes(c.id))
    if (any.length === 0) return null
    return any[Math.floor(Math.random() * any.length)].id
  }
  return pool[Math.floor(Math.random() * pool.length)].id
}

// Deal an initial hand of N cards (used as fallback when AI call fails)
export function dealCards(count = 4) {
  const hand = []
  while (hand.length < count) {
    const card = drawOneCard(hand)
    if (card === null) break
    hand.push(card)
  }
  return hand
}
