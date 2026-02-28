# JOHN AI — Phase 1 Implementation Plan
## Core Gameplay Loop

---

## Goal
A fully playable game loop: ticking compute, a clickable SVG world map with per-region influence/suspicion, a card hand you can play on regions, an AI Safety countdown, and win/lose conditions. No external services yet.

---

## New Dependencies
```
react-simple-maps     # Interactive SVG world map
```

---

## Files Changed vs Created

| File | Status | Summary |
|------|--------|---------|
| `src/gameData.js` | **Rewrite** | Cards array, events array, blame options, updated regions with ISO codes |
| `src/gameReducer.js` | **New** | All game logic: TICK, PLAY_CARD, DRAW_CARD, SELECT_REGION, SELECT_CARD, BLAME_DEFLECT, win/lose |
| `src/App.jsx` | **Rewrite** | `useState` → `useReducer` + `useEffect` game loop, new 3-column layout |
| `src/App.css` | **Additive** | Card tray, 3-column grid, modal overlay, progress bar fills |
| `src/components/WorldMap.jsx` | **Rewrite** | PNG + dots → `react-simple-maps` SVG, countries colored by region influence |
| `src/components/StatsPanel.jsx` | **Rewrite** | Becomes `RegionPanel.jsx` — influence + suspicion bars for selected region |
| `src/components/SuspicionMeter.jsx` | **Refactor** | Becomes generic `<Meter label color value>` reused everywhere |
| `src/components/CardHand.jsx` | **New** | Bottom card tray, 5-card hand, click-to-select |
| `src/components/Card.jsx` | **New** | Individual card with name, cost, effect summary, educational tooltip |
| `src/components/AISafetyMeter.jsx` | **New** | Second top-bar bar, fills red over time — losing condition |

---

## Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  JOHN AI   ⚡ 1250 +8/s   [Safety Research ████████░░░░ 67%]     │
│                            [Global Suspicion ████░░░░░░ 42%]     │
├─────────────────┬────────────────────────────┬───────────────────┤
│  REGION PANEL   │                            │  GLOBAL STATS     │
│                 │    react-simple-maps SVG   │                   │
│  USA            │    World Map               │  Regions: 3 / 10  │
│  Influence      │                            │  Compute/s: +8    │
│  ████████ 67%   │    Countries fill green    │  Blamed: 2×       │
│  Suspicion      │    as influence rises      │                   │
│  ████░░░░ 40%   │                            │                   │
│                 │    Click region to select  │                   │
├─────────────────┴────────────────────────────┴───────────────────┤
│  [Deepfake $80] [Data Poison $60] [Surveillance $100] [+Draw $20]│
├──────────────────────────────────────────────────────────────────┤
│  LIVE FEED ◆ AI system denies loans...  ◆ Senate hearing...      │
└──────────────────────────────────────────────────────────────────┘
```

---

## Game State Shape

```js
{
  compute: 50,
  computePerSecond: 2,
  globalSuspicion: 5,       // 0–100 → lose at 100
  aiSafetyProgress: 0,      // 0–100 → lose at 100 (ticks ~0.15/s)
  regions: {
    usa:          { name: 'USA',           influence: 0, suspicion: 0, locked: false },
    eu:           { name: 'EU',            influence: 0, suspicion: 0, locked: false },
    china:        { name: 'China',         influence: 0, suspicion: 0, locked: false },
    russia:       { name: 'Russia',        influence: 0, suspicion: 0, locked: false },
    southAmerica: { name: 'South America', influence: 0, suspicion: 0, locked: false },
    africa:       { name: 'Africa',        influence: 0, suspicion: 0, locked: false },
    middleEast:   { name: 'Middle East',   influence: 0, suspicion: 0, locked: false },
    india:        { name: 'India',         influence: 0, suspicion: 0, locked: false },
    seAsia:       { name: 'SE Asia',       influence: 0, suspicion: 0, locked: false },
    oceania:      { name: 'Oceania',       influence: 0, suspicion: 0, locked: false },
  },
  hand: [],             // Array of card objects, max 5
  selectedCard: null,   // card id
  selectedRegion: null, // region id
  phase: 'playing',     // 'playing' | 'won' | 'lost_safety' | 'lost_suspicion'
  gameStartTime: Date.now(),
  elapsedSeconds: 0,
  blameDeflections: [], // tracked for Phase 2
  recentEvents: [],     // last 5 events (Phase 2 uses this for event log)
  pendingEvent: null,   // Phase 2 modals read this
}
```

---

## Reducer Actions

| Action | Payload | Effect |
|--------|---------|--------|
| `TICK` | — | compute += cps; aiSafety += 0.15; check win/lose; random event roll |
| `SELECT_REGION` | `regionId` | toggle selected region |
| `SELECT_CARD` | `cardId` | toggle selected card |
| `PLAY_CARD` | — | requires selectedCard + selectedRegion; deduct compute; apply card effects |
| `DRAW_CARD` | — | costs 20 compute; adds random card to hand (max 5) |
| `RESET` | — | return to initial state |

---

## Card Definitions (in `gameData.js`)

```js
{
  id: 'deepfake_disinformation',
  name: 'Deepfake Disinformation',
  cost: 80,
  effects: {
    influenceDelta: 25,
    regionSuspicionDelta: 15,
    globalSuspicionDelta: 5,
    aiSafetyDelta: 0,
  },
  educational: 'Generative AI creates synthetic media indistinguishable from real content, enabling large-scale influence operations.',
}
```

All 7 cards:

| Card | Cost | +Influence | +RegSus | +GlobalSus | Special |
|------|------|-----------|---------|------------|---------|
| Deepfake Disinformation | 80 | 25 | 15 | 5 | — |
| Data Poisoning | 60 | 20 | 10 | 3 | aiSafety +4 |
| Copyright Laundering | 50 | 15 | 5 | 2 | — |
| Surveillance Creep | 100 | 30 | 20 | 8 | — |
| Bias Amplification | 70 | 18 | 8 | 4 | — |
| Infrastructure Attack | 120 | 35 | 25 | 10 | aiSafety +8 |
| Water Cooling Crisis | 200 | 50 | 30 | 15 | compute +100 |

---

## World Map (react-simple-maps)

- TopoJSON source: `https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json`
- Each country (`geo`) maps to one of the 10 region IDs via a lookup table of ISO numeric codes
- Country fill color = `getRegionColor(influence)`:
  - 0%: `#0d1a2e` (dark navy, no influence)
  - 1–50%: interpolate navy → `#004d20`
  - 51–99%: interpolate → `#22c55e` (bright green)
  - 100%: `#00ff88` (captured, full glow)
- Countries not in any region: `#0a1220` (neutral/dim)
- Selected region: stroke `#00d4ff`, strokeWidth 1.5
- Hover: slightly brighter fill

ISO region groupings (partial — full list goes in `gameData.js`):
```js
export const COUNTRY_TO_REGION = {
  840: 'usa',
  // EU
  276: 'eu', 250: 'eu', 380: 'eu', 724: 'eu', 616: 'eu',
  528: 'eu', 56: 'eu', 40: 'eu', 756: 'eu', 620: 'eu',
  // China, Russia
  156: 'china', 643: 'russia',
  // South America
  76: 'southAmerica', 32: 'southAmerica', 170: 'southAmerica',
  152: 'southAmerica', 604: 'southAmerica', 862: 'southAmerica',
  // Africa (sample)
  710: 'africa', 818: 'africa', 566: 'africa', 504: 'africa',
  12: 'africa', 24: 'africa', 120: 'africa',
  // Middle East
  682: 'middleEast', 364: 'middleEast', 368: 'middleEast',
  792: 'middleEast', 784: 'middleEast', 512: 'middleEast',
  // India
  356: 'india',
  // SE Asia
  764: 'seAsia', 704: 'seAsia', 360: 'seAsia',
  458: 'seAsia', 608: 'seAsia', 702: 'seAsia', 104: 'seAsia',
  // Oceania
  36: 'oceania', 554: 'oceania', 598: 'oceania', 242: 'oceania',
}
```

---

## Card Play Flow

1. Player clicks a card in the hand → `selectedCard` set
2. Player clicks a region on the map → `selectedRegion` set
3. If both are set, a **"Play"** button appears in the RegionPanel (or auto-plays on second click)
4. `PLAY_CARD` dispatched → deduct `card.cost` from compute → apply effects to region + global state → remove card from hand
5. If `compute < card.cost` → card appears disabled (greyed out)

---

## Win / Lose (Phase 1 — simple screens, no Supabase yet)

- **WIN**: Every region's `influence >= 100` → `phase = 'won'`
- **LOSE_SAFETY**: `aiSafetyProgress >= 100` → `phase = 'lost_safety'`
- **LOSE_SUSPICION**: `globalSuspicion >= 100` → `phase = 'lost_suspicion'`

Phase 1 game-over screen: full-screen overlay with flavor text + score + **[Play Again]** button (dispatches `RESET`). No name entry yet (Phase 3).

---

## Meter Component API

```jsx
<Meter
  label="Influence"
  value={67}          // 0–100
  color="green"       // 'green' | 'red' | 'cyan' | 'orange'
  showPct             // show "67%" label
/>
```

Used for: region influence, region suspicion, global suspicion, AI safety.

---

## Implementation Steps (in order)

1. `npm install react-simple-maps`
2. Rewrite `src/gameData.js` — REGIONS (with ISO codes), CARDS, INITIAL_STATE
3. Write `src/gameReducer.js`
4. Refactor `SuspicionMeter.jsx` → generic `Meter.jsx`
5. Rewrite `WorldMap.jsx` with react-simple-maps
6. Write `RegionPanel.jsx`
7. Write `Card.jsx` + `CardHand.jsx`
8. Write `AISafetyMeter.jsx`
9. Rewrite `App.jsx` — new layout + useReducer + game loop
10. Update `App.css` — new grid, card styles, overlay styles
11. `npm run dev` — verify full loop works
12. `npm run build` — verify production build

---

## Phase 1 Done When
- [ ] `npm run dev` loads without errors
- [ ] SVG map renders 10 colored regions
- [ ] Clicking a region selects it and shows its meters in RegionPanel
- [ ] Clicking a card selects it; playing it on a region costs compute and increases influence/suspicion
- [ ] Compute ticks up every second
- [ ] AI Safety bar fills over time
- [ ] Win screen appears when all 10 regions hit 100 influence
- [ ] Both lose screens appear on their respective conditions
- [ ] Play Again resets the game
- [ ] `npm run build` succeeds
