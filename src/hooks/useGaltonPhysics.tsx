import { useEffect, useRef } from 'react'
import Matter from 'matter-js'
import { createWalls, createPegs, createBins } from '@/utils/matterBodies'

interface UseGaltonPhysicsProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  temperature: number
  ballCollisions: boolean
  onBinCountsUpdate: (counts: number[]) => void
}

export const useGaltonPhysics = ({
  canvasRef,
  temperature,
  ballCollisions,
  onBinCountsUpdate,
}: UseGaltonPhysicsProps) => {
  const engineRef = useRef<Matter.Engine>()
  const renderRef = useRef<Matter.Render>()
  const ballsRef = useRef<Matter.Body[]>([])
  const pegsRef = useRef<Matter.Body[]>([])
  const pegOriginalPositions = useRef<{ x: number; y: number }[]>([])
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    if (!canvasRef.current) return

    // Create engine
    const engine = Matter.Engine.create()
    engine.world.gravity.y = 1
    engineRef.current = engine

    // Create renderer with white theme
    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        background: '#ffffff',
        wireframes: false,
        showAngleIndicator: false,
        showVelocity: false,
        showDebug: false,
      },
    })
    renderRef.current = render

    // Create world bodies
    const walls = createWalls()
    const { pegs, originalPositions } = createPegs()
    const bins = createBins()

    pegsRef.current = pegs
    pegOriginalPositions.current = originalPositions

    // Add all bodies to world
    Matter.World.add(engine.world, [...walls, ...pegs, ...bins])

    // Start the engine and renderer
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)
    Matter.Render.run(render)

    // Animation loop for peg wiggling
    const animate = () => {
      const currentTemp = temperature
      const time = Date.now() * 0.005

      pegsRef.current.forEach((peg, index) => {
        const originalPos = pegOriginalPositions.current[index]
        const wiggleAmount = currentTemp * 15

        const wiggleX = Math.sin(time + index * 0.5) * wiggleAmount
        const wiggleY = Math.cos(time * 0.7 + index * 0.3) * wiggleAmount * 0.3

        Matter.Body.setPosition(peg, {
          x: originalPos.x + wiggleX,
          y: originalPos.y + wiggleY,
        })
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Collision detection for counting balls in bins
    Matter.Events.on(engine, 'afterUpdate', () => {
      const newBinCounts = new Array(9).fill(0)
      const canvasWidth = 800
      const numBins = 9
      const binWidth = canvasWidth / numBins // Match the bin width calculation
      const startX = 0 // Bins start at left edge

      ballsRef.current.forEach((ball) => {
        if (ball.position.y > 440) {
          const binIndex = Math.floor((ball.position.x - startX) / binWidth)
          if (binIndex >= 0 && binIndex < 9) {
            newBinCounts[binIndex]++
          }
        }
      })

      onBinCountsUpdate(newBinCounts)
    })

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      Matter.Runner.stop(runner)
      Matter.Render.stop(render)
      Matter.Engine.clear(engine)
    }
  }, [temperature, ballCollisions, canvasRef, onBinCountsUpdate])

  return {
    engineRef,
    ballsRef,
    pegsRef,
    pegOriginalPositions,
  }
}
