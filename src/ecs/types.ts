export type EntityId = number

export interface Transform {
  x: number
  y: number
  vx: number
  vy: number
  w: number
  h: number
}

export type EntityType = 'Hero' | 'Gorilla' | 'Barrel' | 'Fireball' | 'Item' | 'Platform' | 'Ladder' | 'Rivet'

export interface Entity {
  id: EntityId
  type: EntityType
  transform: Transform
  update(dt: number): void
  onCollision?(normalX: number, normalY: number): void
}

export interface FiniteStateMachine<State extends string> {
  state: State
  enter?(state: State): void
  exit?(state: State): void
  update(dt: number): void
}


