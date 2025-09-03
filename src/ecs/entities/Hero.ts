import type { Entity } from '../types'
import { createEntity, createTransform } from '../entity'
import { isDown } from '../../input/keyboard'

type HeroState = 'idle' | 'run' | 'jump' | 'fall' | 'climb' | 'hammer' | 'dead'

interface HeroConfig {
  runSpeed: number
  jumpVelocity: number
  gravity: number
  ladderSpeed: number
}

const DefaultHeroConfig: HeroConfig = {
  runSpeed: 0.9,
  jumpVelocity: -6.0,
  gravity: 0.35,
  ladderSpeed: 0.6
}

export function createHero(x: number, y: number, config: Partial<HeroConfig> = {}): Entity {
  const cfg = { ...DefaultHeroConfig, ...config }

  let state: HeroState = 'idle'
  let onGround = false
  let climbing = false

  const entity: Entity = createEntity({
    type: 'Hero',
    transform: createTransform(x, y, 12, 16),
    update: (dt: number) => {
      const t = entity.transform

      // Input
      const left = isDown('ArrowLeft', 'KeyA')
      const right = isDown('ArrowRight', 'KeyD')
      const up = isDown('ArrowUp')
      const down = isDown('ArrowDown')
      const jump = isDown('Space', 'KeyZ')

      // Horizontal movement (disabled while climbing)
      if (!climbing) {
        if (left === right) {
          t.vx = 0
        } else if (left) {
          t.vx = -cfg.runSpeed
        } else if (right) {
          t.vx = cfg.runSpeed
        }
      } else {
        t.vx = 0
      }

      // Vertical/climb logic (placeholder; proper ladder attach elsewhere)
      if (climbing) {
        if (up === down) t.vy = 0
        else if (up) t.vy = -cfg.ladderSpeed
        else if (down) t.vy = cfg.ladderSpeed
      } else {
        // Gravity
        t.vy += cfg.gravity
        // Jump
        if (jump && onGround) {
          t.vy = cfg.jumpVelocity
          onGround = false
          state = 'jump'
        }
      }

      // Integrate (collision will correct)
      t.x += t.vx
      t.y += t.vy

      // State evaluation (simplified)
      if (climbing) {
        state = 'climb'
      } else if (!onGround && t.vy > 0) {
        state = 'fall'
      } else if (t.vx !== 0) {
        state = 'run'
      } else if (onGround) {
        state = 'idle'
      }
    }
  })

  return entity
}


