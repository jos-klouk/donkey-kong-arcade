import React from 'react'
import { useGameStore } from '../../state/gameStore'

interface MenuProps {
  onShowSettings: () => void
}

const Menu: React.FC<MenuProps> = ({ onShowSettings }) => {
  const { topScore, startGame } = useGameStore()

  return (
    <div className="menu-overlay">
      <div className="menu-content">
        <div className="menu-title">DONKEY KONG</div>
        <div className="menu-subtitle">ARCADE</div>
        
        <div style={{ marginBottom: '1rem' }}>
          <div>TOP SCORE: {topScore.toString().padStart(6, '0')}</div>
        </div>
        
        <button 
          className="menu-button primary"
          onClick={() => useGameStore.getState().setGameState('playing')}
        >
          PRESS ENTER TO START
        </button>
        
        <div style={{ marginTop: '1rem' }}>
          <button 
            className="menu-button"
            onClick={onShowSettings}
          >
            SETTINGS
          </button>
        </div>
        
        <div className="controls-card">
          <div className="controls-title">CONTROLS</div>
          <div className="control-row">
            <span>Move:</span>
            <span className="control-key">← →</span>
          </div>
          <div className="control-row">
            <span>Climb:</span>
            <span className="control-key">↑ ↓</span>
          </div>
          <div className="control-row">
            <span>Jump:</span>
            <span className="control-key">SPACE</span>
          </div>
          <div className="control-row">
            <span>Pause:</span>
            <span className="control-key">P</span>
          </div>
          <div className="control-row">
            <span>Fullscreen:</span>
            <span className="control-key">F</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Menu
