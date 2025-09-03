export interface AABB {
  x: number
  y: number
  w: number
  h: number
}

export function intersects(a: AABB, b: AABB): boolean {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  )
}

export function containsPoint(a: AABB, px: number, py: number): boolean {
  return px >= a.x && px <= a.x + a.w && py >= a.y && py <= a.y + a.h
}

export function union(a: AABB, b: AABB): AABB {
  const minX = Math.min(a.x, b.x)
  const minY = Math.min(a.y, b.y)
  const maxX = Math.max(a.x + a.w, b.x + b.w)
  const maxY = Math.max(a.y + a.h, b.y + b.h)
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY }
}

export function expand(a: AABB, dx: number, dy: number): AABB {
  // Expand a by delta (can be negative)
  const nx = dx < 0 ? a.x + dx : a.x
  const ny = dy < 0 ? a.y + dy : a.y
  const nw = a.w + Math.abs(dx)
  const nh = a.h + Math.abs(dy)
  return { x: nx, y: ny, w: nw, h: nh }
}

export function resolveAxis(
  pos: number,
  size: number,
  vel: number,
  min: number,
  max: number
): { pos: number; vel: number; hitMin: boolean; hitMax: boolean } {
  let newPos = pos + vel
  let newVel = vel
  let hitMin = false
  let hitMax = false
  if (newPos < min) {
    newPos = min
    newVel = 0
    hitMin = true
  }
  if (newPos + size > max) {
    newPos = max - size
    newVel = 0
    hitMax = true
  }
  return { pos: newPos, vel: newVel, hitMin, hitMax }
}


