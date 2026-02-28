export const REGIONS = [
  { id: 'northAmerica',  name: 'North America', x: 18, y: 33 },
  { id: 'southAmerica',  name: 'South America', x: 27, y: 63 },
  { id: 'europe',        name: 'Europe',        x: 48, y: 25 },
  { id: 'africa',        name: 'Africa',         x: 50, y: 57 },
  { id: 'middleEast',    name: 'Middle East',    x: 58, y: 40 },
  { id: 'russia',        name: 'Russia',         x: 65, y: 18 },
  { id: 'southAsia',     name: 'South Asia',     x: 67, y: 45 },
  { id: 'eastAsia',      name: 'East Asia',      x: 78, y: 32 },
  { id: 'seAsia',        name: 'SE Asia',        x: 78, y: 54 },
  { id: 'oceania',       name: 'Oceania',        x: 83, y: 72 },
]

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

// Skill tree nodes in a 300x310 SVG viewBox.
// Hexagonal layout: root at center, 6 inner nodes, 6 outer nodes.
export const SKILL_TREE = [
  { id: 0,  x: 150, y: 152, cost: 0, prereqs: [] },   // ROOT — always unlocked
  { id: 1,  x: 150, y: 87,  cost: 1, prereqs: [0] },  // inner top
  { id: 2,  x: 206, y: 119, cost: 1, prereqs: [0] },  // inner top-right
  { id: 3,  x: 206, y: 185, cost: 1, prereqs: [0] },  // inner bottom-right
  { id: 4,  x: 150, y: 217, cost: 1, prereqs: [0] },  // inner bottom
  { id: 5,  x: 94,  y: 185, cost: 1, prereqs: [0] },  // inner bottom-left
  { id: 6,  x: 94,  y: 119, cost: 1, prereqs: [0] },  // inner top-left
  { id: 7,  x: 150, y: 37,  cost: 2, prereqs: [1] },  // outer top
  { id: 8,  x: 250, y: 95,  cost: 2, prereqs: [2] },  // outer top-right
  { id: 9,  x: 250, y: 210, cost: 2, prereqs: [3] },  // outer bottom-right
  { id: 10, x: 150, y: 268, cost: 2, prereqs: [4] },  // outer bottom
  { id: 11, x: 50,  y: 210, cost: 2, prereqs: [5] },  // outer bottom-left
  { id: 12, x: 50,  y: 95,  cost: 2, prereqs: [6] },  // outer top-left
]

export const INITIAL_STATE = {
  compute: 50,
  computePerSecond: 1,
  totalDataCenters: 0,
  dataCentersByRegion: {},
  suspicion: 5,
  ethicalProblems: 0,
  selectedRegion: null,
  skillPoints: 3,        // starts with 3 so player can try immediately
  unlockedSkills: [0],   // root is always unlocked
}
