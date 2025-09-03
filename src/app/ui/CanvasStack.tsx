import React, { useEffect, useRef } from 'react'

const CanvasStack: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null)
  const entitiesCanvasRef = useRef<HTMLCanvasElement>(null)
  const hudCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Set up canvas dimensions and scaling
    const setupCanvases = () => {
      const baseWidth = 224
      const baseHeight = 256
      
      // Calculate integer scale factor
      const scaleX = Math.floor(window.innerWidth / baseWidth)
      const scaleY = Math.floor(window.innerHeight / baseHeight)
      const scale = Math.min(scaleX, scaleY, 4) // Max 4x scale
      
      const canvasWidth = baseWidth * scale
      const canvasHeight = baseHeight * scale
      
      // Set canvas dimensions
      const canvases = [backgroundCanvasRef.current, entitiesCanvasRef.current, hudCanvasRef.current]
      canvases.forEach(canvas => {
        if (canvas) {
          canvas.width = canvasWidth
          canvas.height = canvasHeight
          canvas.style.width = `${canvasWidth}px`
          canvas.style.height = `${canvasHeight}px`
          
          // Disable image smoothing for crisp pixels
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.imageSmoothingEnabled = false
          }
        }
      })
      
      // Center the canvas stack
      container.style.width = `${canvasWidth}px`
      container.style.height = `${canvasHeight}px`
    }

    setupCanvases()
    
    // Handle window resize
    const handleResize = () => {
      setupCanvases()
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div ref={containerRef} className="canvas-stack">
      <canvas 
        ref={backgroundCanvasRef}
        className="game-canvas"
        style={{ zIndex: 1 }}
      />
      <canvas 
        ref={entitiesCanvasRef}
        className="game-canvas"
        style={{ zIndex: 2 }}
      />
      <canvas 
        ref={hudCanvasRef}
        className="game-canvas"
        style={{ zIndex: 3 }}
      />
    </div>
  )
}

export default CanvasStack
