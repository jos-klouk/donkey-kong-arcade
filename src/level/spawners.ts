import type { CompiledStage } from './loader'
import { createHero } from '../ecs/entities/Hero'
import { createGorilla } from '../ecs/entities/Gorilla'
import { createBarrel } from '../ecs/entities/Barrel'
import { createPlatform } from '../ecs/entities/Platform'
import { createLadder } from '../ecs/entities/Ladder'
import { createLadderGate } from '../ecs/entities/LadderGate'
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

  // Gorilla
  world.entities.push(createGorilla(stage.spawns.gorilla.x, stage.spawns.gorilla.y))

  // Platforms (solids)
  for (const s of stage.solids) {
    world.entities.push(createPlatform(s.x, s.y, s.w, s.h))
  }

  // Ladders
  for (const l of stage.ladders) {
    world.entities.push(createLadder(l.x, l.y, l.h))
  }

  // Ladder gates
  for (const g of stage.ladderGates) {
    world.entities.push(createLadderGate(g.x, g.y, g.w, g.h))
  }

  // One starter barrel
  world.entities.push(createBarrel(stage.spawns.gorilla.x, stage.spawns.gorilla.y + 8, -1))
}


