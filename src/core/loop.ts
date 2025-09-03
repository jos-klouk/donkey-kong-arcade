// Game loop and initialization
import { useGameStore } from '../state/gameStore'
import type { Entity } from '../ecs/types'
import type { CompiledStage } from '../level/loader'
import { compileStage } from '../level/loader'
import { spawnStageEntities } from '../level/spawners'
import { debugDraw } from '../render/canvases'
import { resolveAABBCollision } from '../physics/collide'
import { intersects as aabbIntersects } from '../physics/aabb'
import { setSeed, next as rngNext } from './rng'
import { isDown } from '../input/keyboard'
import stage25mData from '../level/stages/stage25m.json'

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
  const barrels = world.entities.filter(e => e.type === 'Barrel')
  const ladderGates = world.entities.filter(e => e.type === 'LadderGate')
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

  // Hero ladder attach/detach using ladder gates
  const hero = world.entities.find(e => e.type === 'Hero') as any
  if (hero) {
    let onGate = false
    for (const g of ladderGates) {
      if (
        aabbIntersects(
          { x: hero.transform.x, y: hero.transform.y, w: hero.transform.w, h: hero.transform.h },
          { x: g.transform.x, y: g.transform.y, w: g.transform.w, h: g.transform.h }
        )
      ) {
        onGate = true
        break
      }
    }
    hero.setOnLadderGate?.(onGate)
    // Attach/detach based on input and gate presence
    if (onGate && (isDown('ArrowUp') || isDown('ArrowDown'))) {
      hero.setClimbing?.(true)
      hero.transform.vx = 0
    } else if (!isDown('ArrowUp') && !isDown('ArrowDown')) {
      // Require key release at top/bottom (simplified)
      hero.setClimbing?.(false)
    }
    hero.setOnGround?.(!!hero.transform.grounded)
  }

  // Hero death on barrel contact (simple AABB overlap)
  // Hero deaths
  const heroForDeath = world.entities.find(e => e.type === 'Hero')
  if (heroForDeath) {
    for (const b of barrels) {
        if (aabbIntersects(
          { x: heroForDeath.transform.x, y: heroForDeath.transform.y, w: heroForDeath.transform.w, h: heroForDeath.transform.h },
          { x: b.transform.x, y: b.transform.y, w: b.transform.w, h: b.transform.h }
        )) {
        onHeroDeath()
        break
      }
    }
  }

  // Simple stage clear: reach a y threshold near gorilla platform top
  if (heroForDeath && heroForDeath.transform.y < 36) {
    onStageClear()
  }
}

function render(alpha: number) {
  // Rendering with interpolation goes here
  // This will be implemented with the canvas rendering system
  debugDraw(world.entities)
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
    // Seed RNG for determinism
    setSeed(0xC0FFEE)
    const stage = compileStage(stage25mData as any)
    spawnStageEntities(world, stage)
    
    store.setLoading(false)
    store.setGameState('menu')
    // Start the main loop so render/debug draw runs
    startLoop()
    
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

function onHeroDeath() {
  const store = useGameStore.getState()
  store.loseLife()
  // Simple respawn: reset world entities for now
  if (world.stage) spawnStageEntities(world, world.stage)
}

function onStageClear() {
  const store = useGameStore.getState()
  store.nextLevel()
  // For now, respawn the same stage and reset entities
  if (world.stage) spawnStageEntities(world, world.stage)
}
