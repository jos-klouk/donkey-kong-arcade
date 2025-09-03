import type { Entity, EntityId, Transform } from './types'

let nextId: EntityId = 1

export function createEntity<T extends Omit<Entity, 'id'>>(
  base: T
): Entity {
  const id = nextId++
  return { id, ...base }
}

export function createTransform(x: number, y: number, w: number, h: number): Transform {
  return { x, y, w, h, vx: 0, vy: 0 }
}


