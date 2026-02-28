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

export const INITIAL_STATE = {
  compute: 50,
  computePerSecond: 1,
  totalDataCenters: 0,
  dataCentersByRegion: {},
  suspicion: 5,
  ethicalProblems: 0,
  selectedRegion: null,
}
