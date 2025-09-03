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

  const entity: Entity = createEntity({
    type: 'Barrel',
    transform: createTransform(x, y, 12, 12),
    update: () => {
      const t = entity.transform
      t.vx = direction * barrelCfg.speed
      // Gravity will be applied by physics/collision system integration later
      t.x += t.vx
      t.y += t.vy
    },
    onCollision: (nx) => {
      // Flip direction when hitting wall horizontally
      if (nx !== 0) direction = (nx > 0 ? 1 : -1) * -1 as 1 | -1
    }
  })

  return entity
}


