export interface StageData {
  size: { w: number; h: number }
  solids: Array<[number, number, number, number]>
  ladders: Array<[number, number, number]>
  ladderGates: Array<[number, number, number, number]>
  conveyors?: Array<{ x: number; y: number; w: number; speed: number; dir: 1 | -1 }>
  rivets?: Array<[number, number]>
  spawns: { hero: [number, number]; gorilla: [number, number]; oilDrum?: [number, number] }
  decor?: unknown
}

export interface CompiledStage {
  width: number
  height: number
  solids: { x: number; y: number; w: number; h: number }[]
  ladders: { x: number; y: number; h: number }[]
  ladderGates: { x: number; y: number; w: number; h: number; centerX: number }[]
  conveyors: Array<{ x: number; y: number; w: number; speed: number; dir: 1 | -1 }>
  rivets: Array<{ x: number; y: number }>
  spawns: { hero: { x: number; y: number }; gorilla: { x: number; y: number }; oilDrum?: { x: number; y: number } }
}

export async function loadStage(path: string): Promise<CompiledStage> {
  const data: StageData = await (await fetch(path)).json()
  return compileStage(data)
}

export function compileStage(data: StageData): CompiledStage {
  return {
    width: data.size.w,
    height: data.size.h,
    solids: data.solids.map(([x, y, w, h]) => ({ x, y, w, h })),
    ladders: data.ladders.map(([x, y, h]) => ({ x, y, h })),
    ladderGates: data.ladderGates.map(([x, y, w, h]) => ({ x, y, w, h, centerX: Math.round(x + w / 2) })),
    conveyors: (data.conveyors ?? []).map(c => ({ ...c })),
    rivets: (data.rivets ?? []).map(([x, y]) => ({ x, y })),
    spawns: {
      hero: { x: data.spawns.hero[0], y: data.spawns.hero[1] },
      gorilla: { x: data.spawns.gorilla[0], y: data.spawns.gorilla[1] },
      oilDrum: data.spawns.oilDrum ? { x: data.spawns.oilDrum[0], y: data.spawns.oilDrum[1] } : undefined
    }
  }
}


