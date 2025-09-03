// Game loop and initialization
import { useGameStore } from '../state/gameStore'
import type { Entity } from '../ecs/types'
import type { CompiledStage } from '../level/loader'
import { loadStage } from '../level/loader'
import { spawnStageEntities } from '../level/spawners'
import { resolveAABBCollision } from '../physics/collide'

const STEP = 1000 / 60 // 60 FPS fixed timestep
let accumulator = 0
let lastTime = performance.now()
let isRunning = false

// World state (very lightweight placeholder)
const world: { entities: Entity[]; stage: CompiledStage | null } = {
  entities: [],
  stage: null
}

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
  // Update entities
  for (const e of world.entities) e.update(deltaTime)

  // Very simple collision pass: resolve Hero/Barrel against platforms
  if (!world.stage) return
  const solidEntities = world.entities.filter(e => e.type === 'Platform')
  const dynamicEntities = world.entities.filter(e => e.type === 'Hero' || e.type === 'Barrel')
  for (const dyn of dynamicEntities) {
    let grounded = false
    for (const solid of solidEntities) {
      const beforeY = dyn.transform.y
      const res = resolveAABBCollision(
        { x: dyn.transform.x, y: dyn.transform.y, w: dyn.transform.w, h: dyn.transform.h },
        { x: solid.transform.x, y: solid.transform.y, w: solid.transform.w, h: solid.transform.h }
      )
      if (res.collided) {
        // Apply correction back to transform
        if (res.normalX !== 0) dyn.transform.x = Math.round(dyn.transform.x)
        if (res.normalY !== 0) dyn.transform.y = Math.round(dyn.transform.y)
        if (res.normalY === -1 && dyn.transform.y <= beforeY) grounded = true
        if (dyn.onCollision) dyn.onCollision(res.normalX, res.normalY)
      }
    }
    dyn.transform.grounded = grounded
    if (grounded && dyn.transform.vy > 0) dyn.transform.vy = 0
  }
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

    // Load initial stage (25m) and spawn entities
    const stage = await loadStage('/src/level/stages/stage25m.json')
    spawnStageEntities(world, stage)
    
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
