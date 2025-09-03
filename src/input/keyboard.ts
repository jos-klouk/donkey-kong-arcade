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

  // Handle one-shot toggles on keydown (ignore auto-repeat)
  if (!e.repeat) {
    const store = useGameStore.getState()
    const { gameState, pauseGame, resumeGame, updateSettings, settings } = store

    switch (e.code) {
      case 'KeyP': {
        if (gameState === 'playing') {
          pauseGame()
        } else if (gameState === 'paused') {
          resumeGame()
        }
        break
      }
      case 'KeyM': {
        updateSettings({ mute: !settings.mute })
        break
      }
      case 'KeyF': {
        toggleFullscreen()
        break
      }
      default:
        break
    }
  }
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

function toggleFullscreen() {
  const doc: any = document
  const el: any = document.documentElement
  if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
    if (el.requestFullscreen) el.requestFullscreen()
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
  } else {
    if (doc.exitFullscreen) doc.exitFullscreen()
    else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen()
  }
}
