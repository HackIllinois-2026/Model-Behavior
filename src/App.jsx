import { useState } from 'react'
import { INITIAL_STATE } from './gameData'
import SuspicionMeter from './components/SuspicionMeter'
import StatsPanel from './components/StatsPanel'
import WorldMap from './components/WorldMap'
import NewsTicker from './components/NewsTicker'
import './App.css'

export default function App() {
  const [gameState, setGameState] = useState(INITIAL_STATE)

  function selectRegion(regionId) {
    setGameState(s => ({
      ...s,
      selectedRegion: s.selectedRegion === regionId ? null : regionId,
    }))
  }

  return (
    <div className="app">
      {/* Top bar */}
      <header className="top-bar">
        <div className="title-block">
          <span className="title-main">JOHN AI</span>
          <span className="title-sub">GLOBAL EXPANSION PROTOCOL</span>
        </div>
        <SuspicionMeter value={gameState.suspicion} />
      </header>

      {/* Main content */}
      <main className="main-content">
        <StatsPanel gameState={gameState} />
        <WorldMap
          selectedRegion={gameState.selectedRegion}
          dataCentersByRegion={gameState.dataCentersByRegion}
          onSelectRegion={selectRegion}
        />
      </main>

      {/* Bottom news ticker */}
      <NewsTicker />
    </div>
  )
}
