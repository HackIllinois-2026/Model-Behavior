import { useState, useEffect } from 'react'
import { INITIAL_STATE } from './gameData'
import SuspicionMeter from './components/SuspicionMeter'
import StatsPanel from './components/StatsPanel'
import WorldMap from './components/WorldMap'
import NewsTicker from './components/NewsTicker'
import SkillTree from './components/SkillTree'
import './App.css'

export default function App() {
  const [gameState, setGameState] = useState(INITIAL_STATE)
  const [skillTreeOpen, setSkillTreeOpen] = useState(false)

  // Compute accumulation — 1 tick per second
  useEffect(() => {
    const id = setInterval(() => {
      setGameState(s => ({ ...s, compute: s.compute + s.computePerSecond }))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  // Skill point accumulation — 1 point every 10 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setGameState(s => ({ ...s, skillPoints: s.skillPoints + 1 }))
    }, 10000)
    return () => clearInterval(id)
  }, [])

  function selectRegion(regionId) {
    setGameState(s => ({
      ...s,
      selectedRegion: s.selectedRegion === regionId ? null : regionId,
    }))
  }

  function handleUnlockSkill(nodeId, cost) {
    setGameState(s => {
      if (s.skillPoints < cost || s.unlockedSkills.includes(nodeId)) return s
      return {
        ...s,
        skillPoints: s.skillPoints - cost,
        unlockedSkills: [...s.unlockedSkills, nodeId],
      }
    })
  }

  // Count how many inner/outer nodes are unlocked (excluding root)
  const unlockedCount = gameState.unlockedSkills.length - 1

  return (
    <div className="app">
      {/* Top bar */}
      <header className="top-bar">
        <div className="title-block">
          <span className="title-main">JOHN AI</span>
          <span className="title-sub">GLOBAL EXPANSION PROTOCOL</span>
        </div>

        <button
          className="mutation-btn"
          onClick={() => setSkillTreeOpen(true)}
        >
          <span className="mutation-btn-label">EVOLUTION</span>
          <span className="mutation-btn-badge">{gameState.skillPoints}</span>
        </button>

        <SuspicionMeter value={gameState.suspicion} />
      </header>

      {/* Main content */}
      <main className="main-content">
        <StatsPanel gameState={gameState} unlockedCount={unlockedCount} />
        <WorldMap
          selectedRegion={gameState.selectedRegion}
          dataCentersByRegion={gameState.dataCentersByRegion}
          onSelectRegion={selectRegion}
        />
      </main>

      {/* Bottom news ticker */}
      <NewsTicker />

      {/* Skill tree overlay */}
      {skillTreeOpen && (
        <SkillTree
          unlockedSkills={gameState.unlockedSkills}
          skillPoints={gameState.skillPoints}
          onUnlock={handleUnlockSkill}
          onClose={() => setSkillTreeOpen(false)}
        />
      )}
    </div>
  )
}
