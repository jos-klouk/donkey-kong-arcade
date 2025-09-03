import React, { useEffect, useState } from 'react'
import { useGameStore } from '../state/gameStore'
import Menu from './routes/Menu'
import Settings from './routes/Settings'
import GameOver from './routes/GameOver'
import HUD from './ui/HUD'
import CanvasStack from './ui/CanvasStack'
import LoadingScreen from './ui/LoadingScreen'

function App() {
  const { gameState, isLoading, loadingProgress } = useGameStore()
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    // Initialize the game engine when the app mounts
    const initGame = async () => {
      try {
        // Import and initialize the game engine
        const { boot } = await import('../core/loop')
        await boot()
      } catch (error) {
        console.error('Failed to initialize game:', error)
      }
    }

    initGame()
  }, [])

  // Show loading screen while assets are loading
  if (isLoading) {
    return <LoadingScreen progress={loadingProgress} />
  }

  // Render appropriate screen based on game state
  const renderCurrentScreen = () => {
    switch (gameState) {
      case 'menu':
        return <Menu onShowSettings={() => setShowSettings(true)} />
      case 'playing':
        return (
          <>
            <CanvasStack />
            <HUD />
          </>
        )
      case 'paused':
        return (
          <>
            <CanvasStack />
            <HUD />
            <div className="pause-overlay">
              <div className="pause-content">
                <div className="pause-title">PAUSED</div>
                <p>Press P to resume</p>
                <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Tip: M mute · F fullscreen</p>
                <button 
                  className="menu-button"
                  onClick={() => useGameStore.getState().resumeGame()}
                >
                  Resume
                </button>
                <button 
                  className="menu-button"
                  onClick={() => useGameStore.getState().returnToMenu()}
                >
                  Main Menu
                </button>
              </div>
            </div>
          </>
        )
      case 'gameOver':
        return <GameOver />
      default:
        return <Menu onShowSettings={() => setShowSettings(true)} />
    }
  }

  return (
    <div className="app">
      {renderCurrentScreen()}
      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}
    </div>
  )
}

export default App
