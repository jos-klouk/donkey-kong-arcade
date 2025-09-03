export type EntityId = number

export interface GridCellBuckets {
  entities: EntityId[]
}

export class Grid {
  private cellSize: number
  private map: Map<string, GridCellBuckets>

  constructor(cellSize: number = 16) {
    this.cellSize = cellSize
    this.map = new Map()
  }

  clear(): void {
    this.map.clear()
  }

  insert(id: EntityId, x: number, y: number, w: number, h: number): void {
    const minx = Math.floor(x / this.cellSize)
    const maxx = Math.floor((x + w) / this.cellSize)
    const miny = Math.floor(y / this.cellSize)
    const maxy = Math.floor((y + h) / this.cellSize)
    for (let cy = miny; cy <= maxy; cy++) {
      for (let cx = minx; cx <= maxx; cx++) {
        const key = this.key(cx, cy)
        const cell = this.map.get(key) ?? { entities: [] }
        cell.entities.push(id)
        this.map.set(key, cell)
      }
    }
  }

  query(x: number, y: number, w: number, h: number): EntityId[] {
    const result: EntityId[] = []
    const seen = new Set<EntityId>()
    const minx = Math.floor(x / this.cellSize)
    const maxx = Math.floor((x + w) / this.cellSize)
    const miny = Math.floor(y / this.cellSize)
    const maxy = Math.floor((y + h) / this.cellSize)
    for (let cy = miny; cy <= maxy; cy++) {
      for (let cx = minx; cx <= maxx; cx++) {
        const cell = this.map.get(this.key(cx, cy))
        if (!cell) continue
        for (const id of cell.entities) {
          if (!seen.has(id)) {
            seen.add(id)
            result.push(id)
          }
        }
      }
    }
    return result
  }

  private key(ix: number, iy: number): string {
    return ix + ',' + iy
  }
}


