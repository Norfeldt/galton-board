import { useEffect, useRef } from 'react'
import Matter from 'matter-js'
import { createWalls, createPegs, createBins, createSlider } from '@/utils/matterBodies'

interface UseGaltonPhysicsProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  temperature: number
  ballCollisions: boolean
  onBinCountsUpdate: (counts: number[]) => void
  onDropPositionChange: (position: number) => void
  dropPosition: number
  canvasWidth: number
  canvasHeight: number
  scale: number
}

export const useGaltonPhysics = ({
  canvasRef,
  temperature,
  ballCollisions,
  onBinCountsUpdate,
  onDropPositionChange,
  dropPosition,
  canvasWidth,
  canvasHeight,
  scale,
}: UseGaltonPhysicsProps) => {
  const engineRef = useRef<Matter.Engine>()
  const renderRef = useRef<Matter.Render>()
  const ballsRef = useRef<Matter.Body[]>([])
  const pegsRef = useRef<Matter.Body[]>([])
  const pegOriginalPositions = useRef<{ x: number; y: number }[]>([])
  const sliderHandleRef = useRef<Matter.Body>()
  const sliderTrackRef = useRef<Matter.Body>()
  const mouseRef = useRef<Matter.Mouse>()
  const mouseConstraintRef = useRef<Matter.MouseConstraint>()
  const animationFrameRef = useRef<number>()
  const isDraggingSlider = useRef<boolean>(false)

  // Effect to sync slider handle position with dropPosition state
  useEffect(() => {
    if (!sliderHandleRef.current || dropPosition === 0) return

    const handle = sliderHandleRef.current
    const currentY = handle.position.y

    // Update handle position to match the dropPosition
    Matter.Body.setPosition(handle, { x: dropPosition, y: currentY })
  }, [dropPosition])

  useEffect(() => {
    if (!canvasRef.current) return

    // Create engine
    const engine = Matter.Engine.create()
    engine.world.gravity.y = 1
    engineRef.current = engine

    // Create renderer with responsive dimensions
    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: canvasWidth,
        height: canvasHeight,
        background: '#ffffff',
        wireframes: false,
        showAngleIndicator: false,
        showVelocity: false,
        showDebug: false,
      },
    })
    renderRef.current = render

    // Create mouse and mouse constraint for slider interaction
    const mouse = Matter.Mouse.create(canvasRef.current)
    mouseRef.current = mouse

    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    })
    mouseConstraintRef.current = mouseConstraint

    // Create world bodies with scaling
    const walls = createWalls(canvasWidth, canvasHeight)
    const { pegs, originalPositions } = createPegs(canvasWidth, canvasHeight)
    const bins = createBins(canvasWidth, canvasHeight)
    const { track, handle } = createSlider(canvasWidth, canvasHeight)

    pegsRef.current = pegs
    pegOriginalPositions.current = originalPositions
    sliderTrackRef.current = track
    sliderHandleRef.current = handle

    // Add all bodies to world
    Matter.World.add(engine.world, [...walls, ...pegs, ...bins, track, handle, mouseConstraint])

    // Start the engine and renderer
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)
    Matter.Render.run(render)

    // Handle slider dragging
    Matter.Events.on(mouseConstraint, 'mousedown', (event) => {
      const mousePosition = event.mouse.position
      const handle = sliderHandleRef.current
      if (!handle) return

      // Check if mouse is over slider handle
      const bounds = handle.bounds
      if (
        mousePosition.x >= bounds.min.x &&
        mousePosition.x <= bounds.max.x &&
        mousePosition.y >= bounds.min.y &&
        mousePosition.y <= bounds.max.y
      ) {
        isDraggingSlider.current = true
      }
    })

    Matter.Events.on(mouseConstraint, 'mousemove', (event) => {
      if (!isDraggingSlider.current || !sliderHandleRef.current || !sliderTrackRef.current) return

      const mouseX = event.mouse.position.x
      const track = sliderTrackRef.current
      const handle = sliderHandleRef.current

      // Calculate track bounds to match the peg area
      const scale = canvasWidth / 800
      const boardMargin = 60 * scale
      const trackWidth = canvasWidth - 2 * boardMargin
      const trackLeft = boardMargin
      const trackRight = canvasWidth - boardMargin

      // Constrain handle position to track bounds
      const constrainedX = Math.max(trackLeft, Math.min(trackRight, mouseX))

      // Update handle position
      Matter.Body.setPosition(handle, { x: constrainedX, y: handle.position.y })

      // Update drop position based on handle position (map to actual playable area)
      const normalizedPosition = (constrainedX - trackLeft) / trackWidth
      const dropPosition = trackLeft + normalizedPosition * trackWidth
      onDropPositionChange(dropPosition)
    })

    Matter.Events.on(mouseConstraint, 'mouseup', () => {
      isDraggingSlider.current = false
    })

    // Animation loop for peg wiggling
    const animate = () => {
      const currentTemp = temperature
      const time = Date.now() * 0.005

      pegsRef.current.forEach((peg, index) => {
        const originalPos = pegOriginalPositions.current[index]
        const wiggleAmount = currentTemp * 15 * scale

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

    // Collision detection for counting balls in bins (with responsive dimensions)
    Matter.Events.on(engine, 'afterUpdate', () => {
      const newBinCounts = new Array(9).fill(0)
      const numBins = 9
      const binWidth = canvasWidth / numBins
      const startX = 0
      const binDetectionY = canvasHeight * 0.73 // Approximately where bins are located

      ballsRef.current.forEach((ball) => {
        if (ball.position.y > binDetectionY) {
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
  }, [
    temperature,
    ballCollisions,
    canvasRef,
    onBinCountsUpdate,
    onDropPositionChange,
    canvasWidth,
    canvasHeight,
    scale,
  ])

  return {
    engineRef,
    ballsRef,
    pegsRef,
    pegOriginalPositions,
    sliderHandleRef,
  }
}
