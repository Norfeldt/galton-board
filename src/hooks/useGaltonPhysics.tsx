import { useEffect, useRef, useCallback } from 'react'
import Matter from 'matter-js'
import {
  createWalls,
  createPegs,
  createBins,
  createSlider,
  getBallColorFromPosition,
} from '@/utils/matterBodies'

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
  const pegRowInfo = useRef<number[]>([]) // Store which row each peg belongs to
  const sliderHandleRef = useRef<Matter.Body>()
  const sliderTrackRef = useRef<Matter.Body>()
  const mouseRef = useRef<Matter.Mouse>()
  const mouseConstraintRef = useRef<Matter.MouseConstraint>()
  const animationFrameRef = useRef<number>()
  const isDraggingSlider = useRef<boolean>(false)
  const temperatureRef = useRef<number>(temperature)

  // Effect to sync slider handle position with dropPosition state
  useEffect(() => {
    if (!sliderHandleRef.current) return

    const handle = sliderHandleRef.current
    const currentY = handle.position.y

    // Update handle position to match the dropPosition
    Matter.Body.setPosition(handle, { x: dropPosition, y: currentY })

    // Update handle color based on position
    const newColor = getBallColorFromPosition(dropPosition, canvasWidth)
    if (handle.render) {
      handle.render.fillStyle = newColor
    }
  }, [dropPosition, canvasWidth])

  useEffect(() => {
    if (!canvasRef.current) return

    // Create engine
    const engine = Matter.Engine.create()
    engine.world.gravity.y = 1
    engineRef.current = engine

    // Create renderer with responsive dimensions and enhanced styling
    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: canvasWidth,
        height: canvasHeight,
        background: 'transparent',
        wireframes: false,
        showAngleIndicator: false,
        showVelocity: false,
        showDebug: false,
        // Add CSS filter effects via canvas context
        pixelRatio: window.devicePixelRatio || 1, // Better rendering on high DPI screens
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
    const { pegs, originalPositions, rowInfo } = createPegs(canvasWidth, canvasHeight)
    const bins = createBins(canvasWidth, canvasHeight)
    const initialDropPosition = dropPosition || canvasWidth / 2
    const initialColor = getBallColorFromPosition(initialDropPosition, canvasWidth)
    const { track, handle } = createSlider(
      canvasWidth,
      canvasHeight,
      initialColor,
      initialDropPosition
    )

    pegsRef.current = pegs
    pegOriginalPositions.current = originalPositions
    pegRowInfo.current = rowInfo
    sliderTrackRef.current = track
    sliderHandleRef.current = handle

    // Debug: Check the actual row distribution
    const maxActualRow = Math.max(...rowInfo)
    const minActualRow = Math.min(...rowInfo)
    console.log(`Actual peg rows: ${minActualRow} to ${maxActualRow} (total: ${maxActualRow - minActualRow + 1} rows)`)
    console.log(`Total pegs created: ${pegs.length}`)
    
    // Count pegs per row
    const rowCounts = rowInfo.reduce((acc, row) => {
      acc[row] = (acc[row] || 0) + 1
      return acc
    }, {} as Record<number, number>)
    console.log('Pegs per row:', rowCounts)

    // Add all bodies to world (order matters for rendering)
    // Add track first, then other bodies, then handle last so it renders on top
    Matter.World.add(engine.world, [track, ...walls, ...pegs, ...bins, mouseConstraint, handle])

    // Start the engine and renderer
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)
    Matter.Render.run(render)

    // Custom rendering for gradient slider track
    Matter.Events.on(render, 'afterRender', () => {
      const context = render.canvas.getContext('2d')
      if (!context || !sliderTrackRef.current) return

      const track = sliderTrackRef.current
      const trackBounds = track.bounds
      
      // Create rainbow gradient
      const gradient = context.createLinearGradient(
        trackBounds.min.x,
        trackBounds.min.y,
        trackBounds.max.x,
        trackBounds.min.y
      )
      
      // Add synthwave colors to gradient
      const colors = [
        '#FF0080', // Electric Hot Pink
        '#9932FF', // Electric Purple
        '#00BFFF', // Electric Blue
        '#00FFFF', // Electric Cyan
        '#FF4500', // Electric Orange
        '#FFD700', // Electric Gold
        '#FF1493', // Deep Pink
        '#DA70D6', // Electric Orchid
        '#8A2BE2', // Electric Violet
      ]
      
      colors.forEach((color, index) => {
        gradient.addColorStop(index / (colors.length - 1), color)
      })
      
      // Draw gradient track
      context.save()
      context.fillStyle = gradient
      context.beginPath()
      context.roundRect(
        trackBounds.min.x,
        trackBounds.min.y,
        trackBounds.max.x - trackBounds.min.x,
        trackBounds.max.y - trackBounds.min.y,
        4 * scale
      )
      context.fill()
      context.restore()
      
      // Redraw handle on top with enhanced styling
      if (sliderHandleRef.current) {
        const handle = sliderHandleRef.current
        const handleBounds = handle.bounds
        
        context.save()
        // Add glow effect
        context.shadowColor = handle.render.fillStyle
        context.shadowBlur = 15 * scale
        context.shadowOffsetX = 0
        context.shadowOffsetY = 0
        
        // Draw handle without border
        context.fillStyle = handle.render.fillStyle
        context.beginPath()
        context.roundRect(
          handleBounds.min.x,
          handleBounds.min.y,
          handleBounds.max.x - handleBounds.min.x,
          handleBounds.max.y - handleBounds.min.y,
          8 * scale
        )
        context.fill()
        context.restore()
      }
    })

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

      // Update handle color based on new position
      const newColor = getBallColorFromPosition(dropPosition, canvasWidth)
      if (handle.render) {
        handle.render.fillStyle = newColor
      }

      onDropPositionChange(dropPosition)
    })

    Matter.Events.on(mouseConstraint, 'mouseup', () => {
      isDraggingSlider.current = false
    })

    // Animation loop for peg wiggling
    const animate = () => {
      const currentTemp = temperatureRef.current
      const time = Date.now() * 0.005
      const totalRows = 16 // Total number of peg rows
      const actualMaxRow = Math.max(...pegRowInfo.current)
      const actualTotalRows = actualMaxRow + 1 // Convert from 0-indexed to count
      const activeRows = Math.floor(currentTemp * 16) // Temperature affects bottom rows first (always use 16 for consistency)

      // Debug logging to understand the threshold behavior
      if (currentTemp >= 0.24 && currentTemp <= 0.26) {
        console.log(`Temperature: ${currentTemp.toFixed(4)}, activeRows: ${activeRows}, actualTotalRows: ${actualTotalRows}, currentTemp * actualTotalRows: ${(currentTemp * actualTotalRows).toFixed(4)}`)
      }

      pegsRef.current.forEach((peg, index) => {
        const originalPos = pegOriginalPositions.current[index]

        // Get the row this peg belongs to (0 = top row, 6 = bottom row)
        const pegRow = pegRowInfo.current[index]

        // Check if this row should be active (counting from bottom)
        const rowFromBottom = actualTotalRows - 1 - pegRow
        const shouldWiggle = rowFromBottom < activeRows

        let wiggleAmount = 0
        if (shouldWiggle) {
          wiggleAmount = 15 * scale // Full wiggle intensity for active rows
        }

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

    // Collision detection for bin counting only
    // Note: Removed peg touching visual effects since they don't work well with the current setup

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
  }, [canvasRef, onBinCountsUpdate, onDropPositionChange, canvasWidth, canvasHeight, scale])

  // Update temperature ref when temperature changes
  useEffect(() => {
    temperatureRef.current = temperature
  }, [temperature])

  // Separate effect for ball collision settings that doesn't recreate the engine
  useEffect(() => {
    if (!engineRef.current) return

    // Update collision filters for existing balls when ballCollisions changes
    ballsRef.current.forEach((ball) => {
      if (!ballCollisions) {
        ball.collisionFilter = {
          category: 0x0002,
          mask: 0x0001,
        }
      } else {
        // Reset to default collision filter
        ball.collisionFilter = {
          category: 0x0001,
          mask: 0xffffffff,
        }
      }
    })
  }, [ballCollisions])

  const resetPegs = useCallback(() => {
    // Since we removed custom properties for simplicity,
    // pegs already maintain their original colors
    // This function is kept for compatibility but does nothing
  }, [scale])

  return {
    engineRef,
    ballsRef,
    pegsRef,
    pegOriginalPositions,
    sliderHandleRef,
    resetPegs,
  }
}
