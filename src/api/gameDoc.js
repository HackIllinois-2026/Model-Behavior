// ── RAG Document Manager ────────────────────────────────────────────────────
// The game document is the RAG context: a growing plain-text log of every turn.
// It is passed to Gemini on each API call so the AI has full game history.

function formatRegions(countries) {
  return Object.entries(countries)
    .map(([id, c]) => {
      const num = id.replace('c', '')
      return `R${num}[usage:${Math.round(c.usage)}% infl:${Math.round(c.influence)}% susp:${Math.round(c.suspicion)}%]`
    })
    .join('  ')
}

function formatGlobalMetrics(state) {
  return `perception:${Math.round(state.perception)}  performance:${Math.round(state.performance)}%  compute:${Math.floor(state.compute)}  cpt:+${Math.floor(state.computePerTurn)}  globalUsage:${Math.round(state.globalUsage)}%`
}

// Called once at game start to seed the document
export function createGameDoc(state, aiName = 'JOHN AI') {
  return [
    `=== ${aiName}: GLOBAL EXPANSION — OPERATION LOG ===`,
    'Objective: 90%+ usage in all 7 regions. Failure: regulation hits 100.',
    '',
    'INITIALIZATION',
    `Global: ${formatGlobalMetrics(state)}`,
    `Regions: ${formatRegions(state.countries)}`,
    '',
  ].join('\n')
}

// Called after AI draws cards for a turn
export function appendDrawEvent(doc, turn, cardIds, narrative, aiName = 'JOHN AI') {
  return (
    doc +
    `--- TURN ${turn}: OPERATIONS BRIEFING ---\n` +
    `Available: [${cardIds.join(', ')}]\n` +
    `${aiName}: "${narrative}"\n`
  )
}

// Called after AI resolves a card play (before APPLY_RESULT dispatch)
export function appendPlayEvent(doc, card, regionLabel, result) {
  const { narrative, caught, deltas, globalEvent } = result

  const deltaStr = Object.entries(deltas)
    .filter(([, v]) => v !== 0)
    .map(([k, v]) => `${k}:${v > 0 ? '+' : ''}${v}`)
    .join(' ')

  const lines = [
    `ACTION: "${card.name}" → Region ${regionLabel}`,
    `DETECTION: ${caught ? 'CAUGHT — operation compromised' : 'Clean — undetected'}`,
    `RESULT: ${narrative}`,
    `DELTAS: [${deltaStr || 'none'}]`,
  ]

  if (globalEvent) lines.push(`GLOBAL EVENT: ${globalEvent}`)

  return doc + lines.join('\n') + '\n'
}

// Called after state is updated (post APPLY_RESULT) to record new metrics
export function appendMetricsSnapshot(doc, state) {
  return (
    doc +
    `POST-TURN METRICS: ${formatGlobalMetrics(state)}\n` +
    `REGIONS: ${formatRegions(state.countries)}\n\n`
  )
}
