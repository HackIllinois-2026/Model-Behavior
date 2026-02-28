import { SKILL_TREE } from '../gameData'

const NODE_R = 16
const ROOT_R = 22

// Returns one of: 'unlocked' | 'available' | 'insufficient' | 'locked'
function nodeState(node, unlockedSkills, skillPoints) {
  if (unlockedSkills.includes(node.id)) return 'unlocked'
  const prereqsMet = node.prereqs.every(p => unlockedSkills.includes(p))
  if (!prereqsMet) return 'locked'
  return skillPoints >= node.cost ? 'available' : 'insufficient'
}

const STYLES = {
  unlocked:     { fill: '#002e14', stroke: '#22c55e', sw: 2,   text: '#22c55e', cost: null },
  available:    { fill: '#001e2e', stroke: '#00d4ff', sw: 2,   text: '#00d4ff', cost: '#00d4ff' },
  insufficient: { fill: '#0a1420', stroke: '#00405a', sw: 1.5, text: '#004a6a', cost: '#004a6a' },
  locked:       { fill: '#080e18', stroke: '#16263a', sw: 1,   text: '#1e3248', cost: '#1e3248' },
}

function edgeColor(fromId, toId, unlockedSkills) {
  const fromU = unlockedSkills.includes(fromId)
  const toU   = unlockedSkills.includes(toId)
  if (fromU && toU) return { stroke: 'rgba(34,197,94,0.7)',   width: 2 }
  if (fromU)        return { stroke: 'rgba(0,212,255,0.4)',   width: 1.5 }
  return              { stroke: 'rgba(20,50,80,0.35)',          width: 1 }
}

export default function SkillTree({ unlockedSkills, skillPoints, onUnlock, onClose }) {
  const edges = SKILL_TREE.flatMap(node =>
    node.prereqs.map(pid => ({ from: pid, to: node.id }))
  )

  function handleClick(node) {
    if (nodeState(node, unlockedSkills, skillPoints) === 'available') {
      onUnlock(node.id, node.cost)
    }
  }

  return (
    <div className="skill-tree-overlay" onClick={onClose}>
      <div className="skill-tree-panel" onClick={e => e.stopPropagation()}>

        <div className="skill-tree-header">
          <span className="skill-tree-title">ACCESS EVOLUTION TREE</span>
          <div className="skill-pts-block">
            <span className="skill-pts-label">SKILL PTS</span>
            <span className="skill-pts-value">{skillPoints}</span>
          </div>
          <button className="skill-tree-close" onClick={onClose}>✕</button>
        </div>

        <svg viewBox="0 0 300 310" className="skill-tree-svg">
          <defs>
            <filter id="sk-glow-cyan">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="sk-glow-green">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Edges */}
          {edges.map(({ from, to }, i) => {
            const fn = SKILL_TREE.find(n => n.id === from)
            const tn = SKILL_TREE.find(n => n.id === to)
            const { stroke, width } = edgeColor(from, to, unlockedSkills)
            return (
              <line key={i}
                x1={fn.x} y1={fn.y} x2={tn.x} y2={tn.y}
                stroke={stroke} strokeWidth={width}
              />
            )
          })}

          {/* Nodes */}
          {SKILL_TREE.map(node => {
            const state  = nodeState(node, unlockedSkills, skillPoints)
            const s      = STYLES[state]
            const isRoot = node.id === 0
            const r      = isRoot ? ROOT_R : NODE_R
            const clickable = state === 'available'
            const glowFilter = state === 'available'  ? 'url(#sk-glow-cyan)'
                             : state === 'unlocked'   ? 'url(#sk-glow-green)'
                             : undefined

            return (
              <g key={node.id}
                className={`skill-node skill-node--${state}`}
                onClick={() => handleClick(node)}
                style={{ cursor: clickable ? 'pointer' : 'default' }}
              >
                {/* Outer glow ring for available nodes */}
                {state === 'available' && (
                  <circle cx={node.x} cy={node.y} r={r + 7}
                    fill="none" stroke="#00d4ff" strokeWidth={0.5} opacity={0.25}
                  />
                )}

                <circle cx={node.x} cy={node.y} r={r}
                  fill={s.fill} stroke={s.stroke} strokeWidth={s.sw}
                  filter={glowFilter}
                />

                <text x={node.x} y={node.y}
                  textAnchor="middle" dominantBaseline="central"
                  fill={s.text}
                  fontSize={isRoot ? 7 : 11}
                  fontFamily="'Share Tech Mono', monospace"
                  fontWeight="bold"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {isRoot ? 'CORE' : node.id}
                </text>

                {/* Cost badge below non-root, non-unlocked nodes */}
                {!isRoot && state !== 'unlocked' && (
                  <text x={node.x} y={node.y + r + 10}
                    textAnchor="middle"
                    fill={s.cost}
                    fontSize={7}
                    fontFamily="'Share Tech Mono', monospace"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    [{node.cost}]
                  </text>
                )}

                <title>
                  {isRoot
                    ? 'CORE — Root node, always active'
                    : state === 'unlocked' ? `Node ${node.id} — Unlocked`
                    : `Node ${node.id} — Cost: ${node.cost} pts | ${state}`}
                </title>
              </g>
            )
          })}
        </svg>

        <div className="skill-tree-legend">
          <span className="legend-unlocked">■ UNLOCKED</span>
          <span className="legend-available">■ AVAILABLE</span>
          <span className="legend-locked">■ LOCKED</span>
        </div>

      </div>
    </div>
  )
}
