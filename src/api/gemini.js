import { GoogleGenerativeAI } from '@google/generative-ai'
import { SYSTEM_PROMPT } from './systemPrompt'
import { DRAW_CARDS_SCHEMA, PLAY_CARD_SCHEMA, CARD_IDS } from './schemas'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

// Full state snapshot passed as context on every call
function stateSnapshot(gs) {
  const regionLines = Object.entries(gs.countries)
    .map(([id, c]) => {
      const num = id.replace('c', '')
      const status = c.usage >= 90 ? ' ✓CAPTURED' : c.usage >= 60 ? ' ⚠HIGH' : ''
      return (
        `  Region ${num}: usage=${Math.round(c.usage)}%${status}, ` +
        `influence=${Math.round(c.influence)}%, suspicion=${Math.round(c.suspicion)}%`
      )
    })
    .join('\n')

  const captured = Object.values(gs.countries).filter(c => c.usage >= 90).length
  const critical = Object.values(gs.countries).filter(c => c.usage >= 70 && c.usage < 90).length

  return (
    `CURRENT STATE — Turn ${gs.turn}\n` +
    `Global: perception=${gs.perception}, performance=${gs.performance}%, ` +
    `compute=${Math.floor(gs.compute)}, computePerTurn=${Math.floor(gs.computePerTurn)}, ` +
    `globalUsage=${Math.round(gs.globalUsage)}%\n` +
    `Progress: ${captured}/7 regions captured, ${critical} near threshold (70%+)\n` +
    `Regions:\n${regionLines}\n`
  )
}

// ── Draw Cards ──────────────────────────────────────────────────────────────
export async function drawCards(gameDoc, gs) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: DRAW_CARDS_SCHEMA,
    },
  })

  const prompt =
    gameDoc +
    '\n' +
    stateSnapshot(gs) +
    '\n' +
    'TASK — TURN BRIEFING:\n' +
    'First, write your game_assessment: survey the full game history and current state. ' +
    'Which regions are close to capture? Which are neglected? Is perception stable or degrading? ' +
    'Are there regions with dangerously high suspicion that need attention?\n\n' +
    'Then write your strategy: given that assessment, what should JOHN AI focus on this turn?\n\n' +
    'Then select exactly 5 unique cards that serve that strategy. ' +
    'The selection should feel deliberate — not random. ' +
    'Identify one card as your recommended optimal play.\n\n' +
    'Finally, write a 2–3 sentence narrative from JOHN AI\'s perspective as a turn briefing.'

  const result = await model.generateContent(prompt)
  const json = JSON.parse(result.response.text())

  // Sanitize cards: deduplicate, validate, pad if somehow short
  const valid = new Set(CARD_IDS)
  const picked = [...new Set((json.cards ?? []).filter(id => valid.has(id)))].slice(0, 5)
  const remaining = CARD_IDS.filter(id => !picked.includes(id)).sort(() => Math.random() - 0.5)
  while (picked.length < 5) picked.push(remaining.shift())

  const recommended = valid.has(json.recommended) ? json.recommended : picked[0]

  return {
    cards:           picked,
    recommended,
    narrative:       json.narrative       ?? '',
    game_assessment: json.game_assessment ?? '',
    strategy:        json.strategy        ?? '',
  }
}

// ── Play Card ───────────────────────────────────────────────────────────────
export async function playCard(gameDoc, gs, card, region) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: PLAY_CARD_SCHEMA,
    },
  })

  const regionState = gs.countries[region.id]

  const prompt =
    gameDoc +
    '\n' +
    stateSnapshot(gs) +
    '\n' +
    `ACTION: JOHN AI deploys "${card.name}" (${card.id}) on Region ${region.label}.\n` +
    `Region ${region.label}: usage=${Math.round(regionState.usage)}%, ` +
    `influence=${Math.round(regionState.influence)}%, suspicion=${Math.round(regionState.suspicion)}%\n` +
    `Card category: ${card.category} | Catch risk: ${card.catch_risk}\n` +
    `Card baseline effects (reference only): ${JSON.stringify(card.effects)}\n\n` +
    'TASK — APPRAISE THIS OPERATION:\n' +
    'In your reasoning field, work through the following before committing to any numbers:\n' +
    '  • What is the history of this region in the game doc? Has this card type been used here before?\n' +
    '  • How does the region\'s current usage saturation limit or amplify this card\'s effect?\n' +
    '  • How does JOHN AI\'s current performance level scale the outcome?\n' +
    '  • What is the realistic catch probability given this card\'s risk and the region\'s suspicion level?\n' +
    '  • Are there synergies or diminishing returns from the sequence of actions taken so far?\n' +
    '  • What delta values are justified by this full assessment?\n\n' +
    'After completing your reasoning, output the impact_level, caught result, deltas, ' +
    'narrative (2–3 sentences, cyberpunk thriller voice), and an optional globalEvent ' +
    'if the operation has broad consequences. All deltas must be integers.'

  const result = await model.generateContent(prompt)
  return JSON.parse(result.response.text())
}
