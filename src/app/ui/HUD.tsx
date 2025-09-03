import React from 'react'
import { useGameStore } from '../../state/gameStore'

const HUD: React.FC = () => {
  const { score, topScore, lives, level, bonus } = useGameStore()

  const getLevelName = (levelNum: number) => {
    const levelNames = ['25m', '50m', '75m', '100m']
    return levelNames[(levelNum - 1) % 4] || '25m'
  }

  return (
    <div className="hud-overlay">
      <div className="hud-score">
        <div>SCORE {score.toString().padStart(6, '0')}</div>
        <div>TOP {topScore.toString().padStart(6, '0')}</div>
      </div>
      
      <div className="hud-lives">
        <div>LIVES: {lives}</div>
      </div>
      
      <div className="hud-level">
        <div>LEVEL: {getLevelName(level)}</div>
      </div>
      
      <div className="hud-bonus">
        <div className="hud-bonus-fill" style={{ width: `${bonus}%` }} />
      </div>
    </div>
  )
}

export default HUD
