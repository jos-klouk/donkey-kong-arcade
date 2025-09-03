// Game loop and initialization
import { useGameStore } from '../state/gameStore'

const STEP = 1000 / 60 // 60 FPS fixed timestep
let accumulator = 0
let lastTime = performance.now()
let isRunning = false

export function startLoop() {
  if (isRunning) return
  
  isRunning = true
  lastTime = performance.now()
  
  function frame(now: number = performance.now()) {
    if (!isRunning) return
    
    accumulator += now - lastTime
    lastTime = now
    
    // Run fixed timestep updates
    while (accumulator >= STEP) {
      update(STEP / 1000)
      accumulator -= STEP
    }
    
    // Render with interpolation
    const alpha = accumulator / STEP
    render(alpha)
    
    requestAnimationFrame(frame)
  }
  
  requestAnimationFrame(frame)
}

export function stopLoop() {
  isRunning = false
}

function update(deltaTime: number) {
  // Game logic updates go here
  // This will be implemented with the game engine
}

function render(alpha: number) {
  // Rendering with interpolation goes here
  // This will be implemented with the canvas rendering system
}

export async function boot() {
  try {
    // Simulate asset loading
    const store = useGameStore.getState()
    
    for (let i = 0; i <= 100; i += 10) {
      store.setLoading(true, i)
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    // Initialize game systems
    await initializeGameSystems()
    
    store.setLoading(false)
    store.setGameState('menu')
    
  } catch (error) {
    console.error('Failed to boot game:', error)
    useGameStore.getState().setLoading(false)
  }
}

async function initializeGameSystems() {
  // Initialize input system
  const { initKeyboard } = await import('../input/keyboard')
  initKeyboard()
  
  // Initialize audio system
  const { initAudio } = await import('../audio/audio')
  await initAudio()
  
  // Initialize rendering system
  const { initRenderer } = await import('../render/canvases')
  await initRenderer()
  
  console.log('Game systems initialized')
}
