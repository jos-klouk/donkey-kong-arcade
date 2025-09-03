import type { Entity } from '../types'
import { createEntity, createTransform } from '../entity'

export function createLadder(x: number, y: number, h: number): Entity {
  return createEntity({
    type: 'Ladder',
    transform: createTransform(x, y, 8, h),
    update: () => {}
  })
}


