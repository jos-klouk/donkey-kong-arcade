import type { Entity } from '../types'
import { createEntity, createTransform } from '../entity'

export function createGorilla(x: number, y: number): Entity {
  return createEntity({
    type: 'Gorilla',
    transform: createTransform(x, y, 16, 16),
    update: () => {}
  })
}


