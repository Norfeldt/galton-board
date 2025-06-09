import Matter from 'matter-js'

// Shared neubrutalism color palette
export const brutalBallColors = [
  '#FF0000', // Red
  '#FF8000', // Orange
  '#FFFF00', // Yellow
  '#00FF00', // Green
  '#00FFFF', // Cyan
  '#4DA6FF', // Light Blue
  '#B366FF', // Light Purple
  '#FF0080', // Pink
  '#FF00FF', // Magenta
]

export const createWalls = (
  canvasWidth: number = 800,
  canvasHeight: number = 600
): Matter.Body[] => {
  return [
    // Bottom - positioned at canvas bottom with brutal styling
    Matter.Bodies.rectangle(canvasWidth / 2, canvasHeight - 10, canvasWidth, 20, {
      isStatic: true,
      render: {
        fillStyle: '#000000', // Black walls for neubrutalism
        strokeStyle: '#ffffff',
        lineWidth: 3,
      },
    }),
  ]
}

export const createSlider = (
  canvasWidth: number = 800,
  canvasHeight: number = 600,
  handleColor: string = '#FFFF00' // Brutal yellow as default
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

  const handleWidth = 50 * scale // Larger handle for neubrutalism
  const handleHeight = 32 * scale
  const handleX = canvasWidth / 2

  // Create track with brutal styling
  const track = Matter.Bodies.rectangle(trackX, trackY, trackWidth, trackHeight, {
    isStatic: true,
    render: {
      fillStyle: '#ffffff', // White track
      strokeStyle: '#000000', // Black border
      lineWidth: 4 * scale, // Thick border
    },
    label: 'slider-track',
  })

  // Create handle with brutal styling
  const handle = Matter.Bodies.rectangle(handleX, trackY, handleWidth, handleHeight, {
    isStatic: true,
    render: {
      fillStyle: handleColor,
      strokeStyle: '#000000', // Black border
      lineWidth: 4 * scale, // Thick border
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
  const pegRadius = 10 * scale // Larger pegs for neubrutalism
  const startY = 120 * scale
  const rowSpacing = 45 * scale
  const pegSpacing = 50 * scale
  const extendMargin = 100 * scale

  // Use shared neubrutalism color palette for pegs

  for (let row = 0; row < 7; row++) {
    const isEvenRow = row % 2 === 0
    const offsetX = isEvenRow ? 0 : pegSpacing / 2
    const totalWidth = canvasWidth + 2 * extendMargin
    const pegsInRow = Math.floor(totalWidth / pegSpacing) + 2

    for (let col = 0; col < pegsInRow; col++) {
      const x = -extendMargin + offsetX + col * pegSpacing
      const y = startY + row * rowSpacing

      // Use brutal colors with alternating pattern
      const colorIndex = (row + col) % brutalBallColors.length
      const pegColor = brutalBallColors[colorIndex]

      const peg = Matter.Bodies.circle(x, y, pegRadius, {
        isStatic: true,
        render: {
          fillStyle: pegColor,
          strokeStyle: '#000000', // Black outline
          lineWidth: 3 * scale, // Thick border
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

  // Create walls for 9 bins with brutal styling
  for (let i = 0; i <= numBins; i++) {
    const binX = startX + i * binWidth

    const wall = Matter.Bodies.rectangle(binX, binY, 5 * scale, binHeight, {
      isStatic: true,
      render: {
        fillStyle: '#000000', // Black walls
        strokeStyle: '#000000', // Black outline
        lineWidth: 2 * scale,
      },
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
  const ballColor = color || brutalBallColors[Math.floor(Math.random() * brutalBallColors.length)]

  const ball = Matter.Bodies.circle(dropX, 50 * scale, 12 * scale, {
    // Larger balls
    restitution: randomness ? 0.7 : 0.8,
    friction: randomness ? 0.01 : 0.005,
    frictionAir: randomness ? 0.01 : 0.005,
    render: {
      fillStyle: ballColor,
      strokeStyle: '#000000', // Black outline
      lineWidth: 3 * scale, // Thick border
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

// Helper function to get ball color based on drop position
export const getBallColorFromPosition = (dropPosition: number, canvasWidth: number): string => {
  const scale = canvasWidth / 800
  const boardMargin = 60 * scale
  const trackWidth = canvasWidth - 2 * boardMargin
  const trackLeft = boardMargin

  // Calculate normalized position (0 to 1) across the track
  const normalizedPosition = Math.max(0, Math.min(1, (dropPosition - trackLeft) / trackWidth))

  // Map to color index
  const colorIndex = Math.floor(normalizedPosition * brutalBallColors.length)
  const boundedIndex = Math.min(colorIndex, brutalBallColors.length - 1)

  return brutalBallColors[boundedIndex]
}
