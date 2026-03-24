'use client'

import { useEffect, useRef } from 'react'

interface GameOfLifeBackgroundProps {
  color: string
  active?: boolean
  mobileLite?: boolean
  pauseWhenHidden?: boolean
}

export function GameOfLifeBackground({
  color,
  active = false,
  mobileLite = false,
  pauseWhenHidden = true,
}: GameOfLifeBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Cell size: 14px on mobile, 10px on desktop
    const cellSize = mobileLite ? 14 : 10
    // Frame interval: ~333ms on mobile, ~250ms on desktop
    const frameInterval = 1000 / (mobileLite ? 3 : 4)
    // Initial density of alive cells
    const density = mobileLite ? 0.08 : 0.12

    let cols = 0
    let rows = 0
    let current = new Uint8Array(0)
    let next = new Uint8Array(0)
    let animFrameId = 0
    let lastFrameTime = 0
    let stableFrameCount = 0

    const idx = (row: number, col: number) => row * cols + col

    const randomize = () => {
      for (let i = 0; i < current.length; i++) {
        current[i] = Math.random() < density ? 1 : 0
      }
      stableFrameCount = 0
    }

    const countNeighbors = (row: number, col: number) => {
      let count = 0
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue
          count += current[idx((row + dr + rows) % rows, (col + dc + cols) % cols)]
        }
      }
      return count
    }

    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const newCols = Math.ceil(w / cellSize)
      const newRows = Math.ceil(h / cellSize)

      if (newCols !== cols || newRows !== rows) {
        cols = newCols
        rows = newRows
        current = new Uint8Array(rows * cols)
        next = new Uint8Array(rows * cols)
        randomize()
      }
    }

    const step = (timestamp: number) => {
      animFrameId = window.requestAnimationFrame(step)

      // Pause when tab is hidden
      if (pauseWhenHidden && typeof document !== 'undefined' && document.hidden) return
      // Throttle to target frame interval
      if (timestamp - lastFrameTime < frameInterval) return
      lastFrameTime = timestamp

      // Conway's Game of Life update
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const neighbors = countNeighbors(r, c)
          const i = idx(r, c)
          next[i] = current[i] ? (neighbors === 2 || neighbors === 3 ? 1 : 0) : (neighbors === 3 ? 1 : 0)
        }
      }
      // Swap buffers
      const tmp = current
      current = next
      next = tmp

      // Re-randomize if population dies out or explodes (after 600 stable frames)
      if (++stableFrameCount >= 600) {
        let alive = 0
        for (let i = 0; i < current.length; i++) alive += current[i]
        if (alive < 0.02 * current.length || alive > 0.6 * current.length) {
          randomize()
        } else {
          stableFrameCount = 0
        }
      }

      // Draw
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = color
      ctx.globalAlpha = active ? 0.1 : 0.16

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (current[idx(r, c)]) {
            ctx.fillRect(c * cellSize, r * cellSize, cellSize - 1, cellSize - 1)
          }
        }
      }
    }

    resize()
    window.addEventListener('resize', resize)
    animFrameId = window.requestAnimationFrame(step)

    return () => {
      window.cancelAnimationFrame(animFrameId)
      window.removeEventListener('resize', resize)
    }
  }, [active, color, mobileLite, pauseWhenHidden])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    />
  )
}
