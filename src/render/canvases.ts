// Canvas rendering system initialization
import type { Entity } from '../ecs/types'

let entitiesCtx: CanvasRenderingContext2D | null = null

export async function initRenderer() {
  const eCanvas = document.getElementById('entities-canvas') as HTMLCanvasElement | null
  if (eCanvas) {
    entitiesCtx = eCanvas.getContext('2d')
  }
  console.log('Renderer initialized')
}

export function debugDraw(entities: Entity[]) {
  if (!entitiesCtx) return
  const ctx = entitiesCtx
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.save()
  ctx.fillStyle = '#222'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  for (const e of entities) {
    const { x, y, w, h } = e.transform
    switch (e.type) {
      case 'Platform':
        ctx.fillStyle = '#6C5CE7'
        ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h))
        break
      case 'Ladder':
        ctx.fillStyle = '#00B894'
        ctx.fillRect(Math.round(x), Math.round(y - h), 2, Math.round(h))
        ctx.fillRect(Math.round(x + w - 2), Math.round(y - h), 2, Math.round(h))
        break
      case 'LadderGate':
        ctx.fillStyle = '#55EFC4'
        ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h))
        break
      case 'Hero':
        ctx.fillStyle = '#FFEAA7'
        ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h))
        break
      case 'Barrel':
        ctx.fillStyle = '#E17055'
        ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h))
        break
      case 'Gorilla':
        ctx.fillStyle = '#D63031'
        ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h))
        break
      default:
        break
    }
  }

  ctx.restore()
}
