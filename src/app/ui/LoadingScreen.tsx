import React from 'react'

interface LoadingScreenProps {
  progress: number
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-title">DONKEY KONG</div>
        <div style={{ marginBottom: '1rem' }}>Loading Arcade Game</div>
        
        <div className="loading-progress">
          <div 
            className="loading-progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div style={{ fontSize: '0.8rem', color: '#666' }}>
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
