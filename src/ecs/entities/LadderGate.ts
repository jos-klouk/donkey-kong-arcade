import type { Entity } from '../types'
import { createEntity, createTransform } from '../entity'

export function createLadderGate(x: number, y: number, w: number, h: number): Entity {
  return createEntity({
    type: 'LadderGate', // treated as ladder gate in systems
    transform: createTransform(x, y, w, h),
    update: () => {}
  })
}


