import type { Entity } from '../types'
import { createEntity, createTransform } from '../entity'

export function createPlatform(x: number, y: number, w: number, h: number): Entity {
  return createEntity({
    type: 'Platform',
    transform: createTransform(x, y, w, h),
    update: () => {}
  })
}


