import type { Entity } from '../types'
import { createEntity, createTransform } from '../entity'

interface BarrelConfig {
  speed: number
}

const DefaultBarrelConfig: BarrelConfig = {
  speed: 0.7
}

export function createBarrel(x: number, y: number, dir: 1 | -1 = 1, cfg: Partial<BarrelConfig> = {}): Entity {
  const barrelCfg = { ...DefaultBarrelConfig, ...cfg }
  let direction: 1 | -1 = dir
  let lastGrounded = false

  const entity: Entity = createEntity({
    type: 'Barrel',
    transform: createTransform(x, y, 12, 12),
    update: () => {
      const t = entity.transform
      // Apply gravity when not grounded
      if (!t.grounded) {
        t.vy += 0.35
      }
      // Roll along platforms
      t.vx = direction * barrelCfg.speed
      t.x += t.vx
      t.y += t.vy
      // Edge drop: if was grounded and now not grounded right after moving horizontally, allow fall
      if (lastGrounded && !t.grounded) {
        // Keep horizontal speed, gravity will pull down
      }
      lastGrounded = !!t.grounded
    },
    onCollision: (nx) => {
      // Flip direction when hitting wall horizontally
      if (nx !== 0) direction = (nx > 0 ? 1 : -1) * -1 as 1 | -1
    }
  })

  return entity
}


