import type { AABB } from './aabb'
import { intersects } from './aabb'

export interface CollisionResult {
  collided: boolean
  normalX: number
  normalY: number
}

export function resolveAABBCollision(mover: AABB, solid: AABB): CollisionResult {
  if (!intersects(mover, solid)) {
    return { collided: false, normalX: 0, normalY: 0 }
  }

  // Compute overlap depths on both axes
  const moverCenterX = mover.x + mover.w * 0.5
  const moverCenterY = mover.y + mover.h * 0.5
  const solidCenterX = solid.x + solid.w * 0.5
  const solidCenterY = solid.y + solid.h * 0.5

  const dx = moverCenterX - solidCenterX
  const px = (mover.w * 0.5 + solid.w * 0.5) - Math.abs(dx)
  const dy = moverCenterY - solidCenterY
  const py = (mover.h * 0.5 + solid.h * 0.5) - Math.abs(dy)

  if (px < py) {
    // Resolve along X
    if (dx > 0) {
      mover.x += px
      return { collided: true, normalX: 1, normalY: 0 }
    } else {
      mover.x -= px
      return { collided: true, normalX: -1, normalY: 0 }
    }
  } else {
    // Resolve along Y
    if (dy > 0) {
      mover.y += py
      return { collided: true, normalX: 0, normalY: 1 }
    } else {
      mover.y -= py
      return { collided: true, normalX: 0, normalY: -1 }
    }
  }
}


