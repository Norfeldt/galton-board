// Physics parameters optimized on 2025-07-05T17:37:09.685Z
// Configuration tested with statistical validation for normal distribution
// Best overall score: N/A

import Matter from 'matter-js'

// Enhanced Synthwave neon color palette for pins
export const synthBallColors = [
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

// Brighter synthwave colors specifically for pins/pegs
export const synthPinColors = [
  '#FF006E', // Hot Pink
  '#8338EC', // Electric Purple
  '#3A86FF', // Neon Blue
  '#00F5FF', // Cyan
  '#FB5607', // Orange-Red
  '#FFBE0B', // Neon Yellow
  '#FF006E', // Hot Pink (repeated for symmetry)
  '#C77DFF', // Light Purple
  '#7209B7', // Deep Purple
]

export const createWalls = (
  canvasWidth: number = 800,
  canvasHeight: number = 600
): Matter.Body[] => {
  return [
    // Bottom - positioned at canvas bottom with synthwave styling
    Matter.Bodies.rectangle(canvasWidth / 2, canvasHeight - 10, canvasWidth, 20, {
      isStatic: true,
      render: {
        fillStyle: 'rgba(0, 0, 0, 0.8)', // Transparent black to blend with canvas
        strokeStyle: 'rgba(255, 192, 255, 0.9)', // Bright pink almost white border
        lineWidth: 3,
      },
    }),
  ]
}

export const createSlider = (
  canvasWidth: number = 800,
  canvasHeight: number = 600,
  handleColor: string = '#FFBE0B', // Neon yellow as default
  initialPosition: number = 0 // Initial handle position
): {
  track: Matter.Body
  handle: Matter.Body
} => {
  const scale = canvasWidth / 800
  const boardMargin = 60 * scale
  const trackWidth = canvasWidth - 2 * boardMargin
  const trackHeight = 8 * scale // Thicker track
  const trackY = 40 * scale
  const trackX = canvasWidth / 2

  const handleWidth = 50 * scale // Larger handle for synthwave
  const handleHeight = 32 * scale
  const handleX = initialPosition || canvasWidth / 2

  // Create track with synthwave styling
  const track = Matter.Bodies.rectangle(trackX, trackY, trackWidth, trackHeight, {
    isStatic: true,
    render: {
      fillStyle: 'transparent', // We'll use a custom render for gradient
      strokeStyle: 'transparent',
      lineWidth: 0,
      // Store gradient info for custom rendering
      visible: true,
    },
    label: 'slider-track',
  })

  // Create handle with synthwave styling and glow effect
  const handle = Matter.Bodies.rectangle(handleX, trackY, handleWidth, handleHeight, {
    isStatic: true,
    render: {
      fillStyle: handleColor,
      strokeStyle: 'transparent', // No border
      lineWidth: 0, // No border width
    },
    label: 'slider-handle',
  })

  return { track, handle }
}

export const createPegs = (
  canvasWidth: number = 800,
  canvasHeight: number = 600
): {
  pegs: Matter.Body[]
  originalPositions: { x: number; y: number }[]
  rowInfo: number[]
} => {
  const pegs: Matter.Body[] = []
  const originalPositions: { x: number; y: number }[] = []
  const rowInfo: number[] = []
  const scale = canvasWidth / 800
  const pegRadius = 8 * scale // Reduced for better ball-to-peg ratio
  const startY = 120 * scale
  const rowSpacing = 25 * scale // Tighter vertical spacing for more rows
  const pegSpacing = 35 * scale // Tighter horizontal spacing
  const extendMargin = 100 * scale

  // Calculate how much space we need to leave for bins
  const binHeight = 140 * scale
  const binSpacing = 30 * scale // Space between pegs and bins
  const maxPegY = canvasHeight - binHeight - binSpacing
  const availableHeight = maxPegY - startY
  const maxRows = Math.floor(availableHeight / rowSpacing) + 1

  // Use brighter synthwave colors for pegs

  for (let row = 0; row < Math.min(16, maxRows); row++) {
    const isEvenRow = row % 2 === 0
    const offsetX = isEvenRow ? 0 : pegSpacing / 2

    // Calculate the center position for proper alignment with bins
    const numBins = 9
    const binWidth = canvasWidth / numBins
    const centerX = canvasWidth / 2

    // Extend pegs beyond canvas width for proper distribution
    const totalWidth = canvasWidth + 2 * extendMargin
    const pegsInRow = Math.floor(totalWidth / pegSpacing) + 2
    const pegGridWidth = (pegsInRow - 1) * pegSpacing
    const pegGridStartX = centerX - pegGridWidth / 2

    for (let col = 0; col < pegsInRow; col++) {
      const x = pegGridStartX + offsetX + col * pegSpacing
      const y = startY + row * rowSpacing

      // Create a horizontal rainbow gradient across each row
      // Map x position to color based on canvas width
      const normalizedX = x / canvasWidth
      
      // Use the same color mapping as the slider and balls
      const colorIndex = Math.floor(normalizedX * synthPinColors.length)
      const clampedIndex = Math.max(0, Math.min(synthPinColors.length - 1, colorIndex))
      const pegColor = synthPinColors[clampedIndex]

      const peg = Matter.Bodies.circle(x, y, pegRadius, {
        isStatic: true,
        render: {
          fillStyle: pegColor,
          strokeStyle: 'rgba(255, 255, 255, 0.3)', // Subtle white glow for depth
          lineWidth: 1.5 * scale,
        },
      })
      pegs.push(peg)
      originalPositions.push({ x, y })
      rowInfo.push(row)
    }
  }

  return { pegs, originalPositions, rowInfo }
}

export const createBins = (
  canvasWidth: number = 800,
  canvasHeight: number = 600
): Matter.Body[] => {
  const bins: Matter.Body[] = []
  const numBins = 9
  const binWidth = canvasWidth / numBins
  const scale = canvasWidth / 800
  const binHeight = 140 * scale
  const binY = canvasHeight - binHeight / 2 - 10
  const startX = 0

  // Create bin floors with synthwave rainbow colors
  for (let i = 0; i < numBins; i++) {
    const binX = startX + i * binWidth + binWidth / 2
    const binFloorY = canvasHeight - 10 - binHeight / 2

    // Create a colored floor for each bin (visual only, no collision)
    const binFloor = Matter.Bodies.rectangle(binX, binFloorY, binWidth - 4 * scale, binHeight, {
      isStatic: true,
      isSensor: true, // Make it a sensor so balls pass through
      render: {
        fillStyle: synthBallColors[i] + '20', // Semi-transparent synthwave color
        strokeStyle: synthBallColors[i] + '20', // Matching border with same transparency as fill
        lineWidth: 2 * scale,
      },
      label: `bin-floor-${i}`,
    })
    bins.push(binFloor)
  }

  // Create divider walls between bins
  for (let i = 0; i <= numBins; i++) {
    const binX = startX + i * binWidth

    const wall = Matter.Bodies.rectangle(binX, binY, 6 * scale, binHeight, {
      isStatic: true,
      render: {
        fillStyle: 'rgba(0, 0, 0, 0.8)', // Nearly opaque black dividers
        strokeStyle: 'rgba(255, 255, 255, 0.3)', // Subtle white glow
        lineWidth: 1 * scale,
      },
      label: `bin-wall-${i}`,
    })
    bins.push(wall)
  }

  return bins
}

export const createBall = (
  dropX: number,
  randomness: boolean,
  ballCollisions: boolean,
  scale: number = 1,
  color?: string
): Matter.Body => {
  const ballColor = color || synthBallColors[Math.floor(Math.random() * synthBallColors.length)]

  const ball = Matter.Bodies.circle(dropX, 50 * scale, 3 * scale, {
    // Much smaller balls for proper physics
    // Balls should be much smaller than pegs for good randomization
    restitution: randomness ? 0.6 : 0.7, // Higher bounce for better randomization
    friction: randomness ? 0.001 : 0.001, // Very low friction for clean bounces
    frictionAir: randomness ? 0.01 : 0.005,
    render: {
      fillStyle: ballColor,
      strokeStyle: 'transparent', // No border
      lineWidth: 0, // No border width
    },
  })

  if (!ballCollisions) {
    ball.collisionFilter = {
      category: 0x0002,
      mask: 0x0001,
    }
  }

  return ball
}

export const getBallColorFromPosition = (dropPosition: number, canvasWidth: number): string => {
  const binIndex = Math.floor((dropPosition / canvasWidth) * 9)
  const clampedIndex = Math.max(0, Math.min(8, binIndex))
  return synthBallColors[clampedIndex]
}
