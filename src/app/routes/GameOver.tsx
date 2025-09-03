import React, { useState, useEffect } from 'react'
import { useGameStore } from '../../state/gameStore'

const GameOver: React.FC = () => {
  const { score, topScore, returnToMenu, updateScore } = useGameStore()
  const [initials, setInitials] = useState(['', '', ''])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isNewHighScore, setIsNewHighScore] = useState(false)

  useEffect(() => {
    setIsNewHighScore(score > topScore)
  }, [score, topScore])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isNewHighScore && initials.some(initial => initial === '')) {
        return // Don't submit until all initials are entered
      }
      handleSubmit()
    } else if (e.key === 'Backspace') {
      if (initials[currentIndex] === '') {
        // Move to previous letter
        setCurrentIndex(Math.max(0, currentIndex - 1))
      } else {
        // Clear current letter
        setInitials(prev => {
          const newInitials = [...prev]
          newInitials[currentIndex] = ''
          return newInitials
        })
      }
    } else if (e.key.length === 1 && e.key.match(/[A-Za-z]/)) {
      // Add letter
      setInitials(prev => {
        const newInitials = [...prev]
        newInitials[currentIndex] = e.key.toUpperCase()
        return newInitials
      })
      setCurrentIndex(Math.min(2, currentIndex + 1))
    }
  }

  const handleSubmit = () => {
    if (isNewHighScore) {
      // Save high score (this would integrate with persistence layer)
      console.log('New high score:', initials.join(''), score)
    }
    returnToMenu()
  }

  return (
    <div className="game-over-overlay">
      <div className="game-over-content">
        <div className="game-over-title">GAME OVER</div>
        
        <div className="final-score">
          FINAL SCORE: {score.toString().padStart(6, '0')}
        </div>
        
        {isNewHighScore && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ color: '#ff6b35', marginBottom: '0.5rem' }}>
              NEW HIGH SCORE!
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              Enter your initials:
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              {initials.map((initial, index) => (
                <input
                  key={index}
                  type="text"
                  value={initial}
                  maxLength={1}
                  className="initials-input"
                  style={{
                    backgroundColor: index === currentIndex ? '#555' : '#333'
                  }}
                  readOnly
                />
              ))}
            </div>
          </div>
        )}
        
        <div style={{ marginBottom: '1rem' }}>
          TOP SCORE: {topScore.toString().padStart(6, '0')}
        </div>
        
        <button 
          className="menu-button primary"
          onClick={handleSubmit}
          onKeyDown={handleKeyPress}
          autoFocus
        >
          {isNewHighScore ? 'SUBMIT' : 'CONTINUE'}
        </button>
      </div>
    </div>
  )
}

export default GameOver
