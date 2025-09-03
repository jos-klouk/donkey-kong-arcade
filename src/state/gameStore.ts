import { create } from 'zustand'

export type GameState = 'loading' | 'menu' | 'playing' | 'paused' | 'gameOver'

interface GameStore {
  // Game state
  gameState: GameState
  isLoading: boolean
  loadingProgress: number
  
  // Game data
  score: number
  topScore: number
  lives: number
  level: number
  bonus: number
  
  // Settings
  settings: {
    musicVolume: number
    sfxVolume: number
    mute: boolean
    keyMappings: Record<string, string>
    authenticQuirks: boolean
    crtEffect: boolean
    coyoteTime: boolean
    jumpBuffer: boolean
  }
  
  // Actions
  setGameState: (state: GameState) => void
  setLoading: (loading: boolean, progress?: number) => void
  updateScore: (points: number) => void
  loseLife: () => void
  gainLife: () => void
  nextLevel: () => void
  resetGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  returnToMenu: () => void
  updateSettings: (settings: Partial<GameStore['settings']>) => void
}

const defaultSettings = {
  musicVolume: 0.7,
  sfxVolume: 0.8,
  mute: false,
  keyMappings: {
    moveLeft: 'ArrowLeft',
    moveRight: 'ArrowRight',
    climbUp: 'ArrowUp',
    climbDown: 'ArrowDown',
    jump: 'Space',
    start: 'Enter',
    pause: 'KeyP',
    mute: 'KeyM',
    fullscreen: 'KeyF'
  },
  authenticQuirks: true,
  crtEffect: false,
  coyoteTime: false,
  jumpBuffer: false
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  gameState: 'loading',
  isLoading: true,
  loadingProgress: 0,
  score: 0,
  topScore: 0,
  lives: 3,
  level: 1,
  bonus: 0,
  settings: defaultSettings,
  
  // Actions
  setGameState: (state) => set({ gameState: state }),
  
  setLoading: (loading, progress = 0) => set({ 
    isLoading: loading, 
    loadingProgress: progress 
  }),
  
  updateScore: (points) => set((state) => {
    const newScore = state.score + points
    const newTopScore = Math.max(state.topScore, newScore)
    
    // Award extra life at 7,000 points
    if (newScore >= 7000 && state.score < 7000) {
      return { 
        score: newScore, 
        topScore: newTopScore,
        lives: state.lives + 1
      }
    }
    
    return { score: newScore, topScore: newTopScore }
  }),
  
  loseLife: () => set((state) => ({
    lives: Math.max(0, state.lives - 1),
    gameState: state.lives <= 1 ? 'gameOver' : 'playing'
  })),
  
  gainLife: () => set((state) => ({ lives: state.lives + 1 })),
  
  nextLevel: () => set((state) => ({ level: state.level + 1 })),
  
  resetGame: () => set({
    score: 0,
    lives: 3,
    level: 1,
    bonus: 0,
    gameState: 'playing'
  }),
  
  pauseGame: () => set({ gameState: 'paused' }),
  
  resumeGame: () => set({ gameState: 'playing' }),
  
  returnToMenu: () => set({ gameState: 'menu' }),
  
  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  }))
}))
