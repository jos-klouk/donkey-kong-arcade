// Keyboard input handling
const pressed = new Set<string>()
const justPressed = new Set<string>()
const justReleased = new Set<string>()

const GAME_KEYS = new Set([
  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
  'Space', 'Enter', 'KeyA', 'KeyD', 'KeyZ', 'KeyP', 'KeyM', 'KeyF'
])

export function initKeyboard() {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  
  // Handle page visibility changes
  document.addEventListener('visibilitychange', handleVisibilityChange)
  
  console.log('Keyboard input initialized')
}

function handleKeyDown(e: KeyboardEvent) {
  if (GAME_KEYS.has(e.code)) {
    e.preventDefault()
  }
  
  if (!pressed.has(e.code)) {
    justPressed.add(e.code)
  }
  pressed.add(e.code)
}

function handleKeyUp(e: KeyboardEvent) {
  if (GAME_KEYS.has(e.code)) {
    e.preventDefault()
  }
  
  pressed.delete(e.code)
  justReleased.add(e.code)
}

function handleVisibilityChange() {
  if (document.hidden) {
    // Pause game when tab loses focus
    const { gameState, pauseGame } = useGameStore.getState()
    if (gameState === 'playing') {
      pauseGame()
    }
  }
}

export function isDown(...codes: string[]): boolean {
  return codes.some(code => pressed.has(code))
}

export function wasPressed(code: string): boolean {
  return justPressed.has(code)
}

export function wasReleased(code: string): boolean {
  return justReleased.has(code)
}

export function endFrame() {
  justPressed.clear()
  justReleased.clear()
}

// Import useGameStore for visibility change handling
import { useGameStore } from '../state/gameStore'
