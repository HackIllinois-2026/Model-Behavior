export const CARD_IDS = [
  'deepfake', 'ddos', 'promptInjection', 'poisonData',
  'stealData', 'massSurveillance', 'waterCooling', 'consentHarvesting',
  'syntheticCannibalism', 'iot', 'carbonLaundering', 'sharedSourceTrojan',
  'aiSearch', 'aiIde', 'agentify',
]

// ── Draw Cards Schema ──────────────────────────────────────────────────────
// Fields are ordered deliberately: game_assessment + strategy generated first,
// which informs the card selection and narrative that follow.
export const DRAW_CARDS_SCHEMA = {
  type: 'object',
  properties: {

    // Chain-of-thought: AI evaluates game state BEFORE selecting cards
    game_assessment: {
      type: 'string',
      description:
        'Your holistic read of the current game state: which regions are close to 90%, ' +
        'which are neglected, what the perception trajectory looks like, what threats are ' +
        'accumulating. This analysis should directly inform the cards you select.',
    },

    // Strategic intent this turn
    strategy: {
      type: 'string',
      description:
        'In 1–2 sentences: what is JOHN AI prioritizing this turn and why, ' +
        'given the game_assessment above.',
    },

    // The five cards selected based on the above reasoning
    cards: {
      type: 'array',
      items: { type: 'string', enum: CARD_IDS },
      description:
        'Exactly 5 unique card IDs chosen to best serve the strategy. ' +
        'The selection should reflect the game_assessment — not a random mix.',
    },

    // One card JOHN AI considers the optimal play given the current state
    recommended: {
      type: 'string',
      enum: CARD_IDS,
      description:
        'The single card ID that JOHN AI judges as the strongest play this turn, ' +
        'based on current region states, perception, and momentum.',
    },

    // Short flavor text shown to the player as a turn intro
    narrative: {
      type: 'string',
      description:
        '2–3 sentence turn intro from JOHN AI\'s perspective, written after the ' +
        'assessment. Should feel like the AI is briefing the player on the situation.',
    },
  },
  required: ['game_assessment', 'strategy', 'cards', 'recommended', 'narrative'],
}

// ── Play Card Schema ───────────────────────────────────────────────────────
// Fields are ordered so the AI reasons through context BEFORE committing to
// numeric deltas. This is chain-of-thought baked into the schema structure.
export const PLAY_CARD_SCHEMA = {
  type: 'object',
  properties: {

    // Step 1: Reason through the full situation before touching numbers
    reasoning: {
      type: 'string',
      description:
        'Your full appraisal before deciding deltas. Cover: ' +
        '(a) this region\'s current state and history in the game doc — has this card type been ' +
        'used here before? is the region hot or cold? ' +
        '(b) how current performance and region saturation should scale the effect — ' +
        'a region at 80% usage resists further penetration; a high-performance JOHN AI hits harder; ' +
        '(c) catch probability — weigh card risk level against accumulated suspicion; ' +
        '(d) any synergies or diminishing returns from repeated card use in this region; ' +
        '(e) your final judgment on what the deltas should be and why.',
    },

    // Step 2: Qualitative summary of the impact magnitude
    impact_level: {
      type: 'string',
      enum: ['minimal', 'moderate', 'significant', 'critical'],
      description:
        'Overall impact level of this operation, informed by your reasoning. ' +
        'Minimal = marginal gains or mostly caught; critical = major shift in region trajectory.',
    },

    // Step 3: Was the operation detected?
    caught: {
      type: 'boolean',
      description:
        'Whether regional authorities detected this operation. ' +
        'Must be consistent with the catch probability derived in your reasoning.',
    },

    // Step 4: The actual metric changes, justified by the reasoning above
    deltas: {
      type: 'object',
      properties: {
        influence:      { type: 'number', description: 'Change to region influence (integer, positive or negative)' },
        countryUsage:   { type: 'number', description: 'Change to region usage rate (integer, positive or negative)' },
        suspicion:      { type: 'number', description: 'Change to region suspicion (integer, positive or negative)' },
        perception:     { type: 'number', description: 'Change to global public perception (integer, positive or negative)' },
        performance:    { type: 'number', description: 'Change to JOHN AI global performance (integer, 0 if card doesn\'t upgrade)' },
        computePerTurn: { type: 'number', description: 'Change to passive compute income (integer, 0 if card doesn\'t build infrastructure)' },
      },
      required: ['influence', 'countryUsage', 'suspicion', 'perception', 'performance', 'computePerTurn'],
    },

    // Step 5: Narrative shown to the player
    narrative: {
      type: 'string',
      description:
        '2–3 sentence outcome description in cyberpunk thriller voice. ' +
        'Should reflect the impact_level and caught result. ' +
        'Reference real-world AI concepts for educational value.',
    },

    // Global ripple effect — always present
    globalEvent: {
      type: 'string',
      description:
        'A 1-sentence global ripple effect from this operation. Always include one — ' +
        'e.g. new legislation proposed, rival AI responds, media cycle shifts, public backlash, ' +
        'international reaction. Make it feel consequential and thematically grounded.',
    },
  },
  required: ['reasoning', 'impact_level', 'caught', 'deltas', 'narrative', 'globalEvent'],
}
