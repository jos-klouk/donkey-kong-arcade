import type { CompiledStage } from './loader'
import { createHero } from '../ecs/entities/Hero'
import type { Entity } from '../ecs/types'

export interface World {
  entities: Entity[]
  stage: CompiledStage | null
}

export function spawnStageEntities(world: World, stage: CompiledStage) {
  world.stage = stage
  world.entities.length = 0

  // Hero
  world.entities.push(createHero(stage.spawns.hero.x, stage.spawns.hero.y))

  // TODO: Gorilla, Platforms, Ladders, etc.
}


