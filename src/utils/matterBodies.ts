import Matter from 'matter-js'

export const createWalls = (
  canvasWidth: number = 800,
  canvasHeight: number = 600
): Matter.Body[] => {
  return [
    // Left wall
    Matter.Bodies.rectangle(2, canvasHeight / 2, 4, canvasHeight, {
      isStatic: true,
      render: { fillStyle: '#ffffff' },
    }),
    // Right wall
    Matter.Bodies.rectangle(canvasWidth - 2, canvasHeight / 2, 4, canvasHeight, {
      isStatic: true,
      render: { fillStyle: '#ffffff' },
    }),
    // Bottom - positioned at canvas bottom
    Matter.Bodies.rectangle(canvasWidth / 2, canvasHeight - 10, canvasWidth, 20, {
      isStatic: true,
      render: { fillStyle: '#ffffff' },
    }),
  ]
}

export const createSlider = (
  canvasWidth: number = 800,
  canvasHeight: number = 600
): {
  track: Matter.Body
  handle: Matter.Body
} => {
  const scale = canvasWidth / 800
  const boardMargin = 60 * scale // Same margin as used for pegs
  const trackWidth = canvasWidth - 2 * boardMargin // Match the actual playable area
  const trackHeight = 6 * scale
  const trackY = 40 * scale
  const trackX = canvasWidth / 2

  const handleWidth = 44 * scale // Larger for better touch accessibility
  const handleHeight = 28 * scale
  const handleX = canvasWidth / 2 // Start in center

  // Create track
  const track = Matter.Bodies.rectangle(trackX, trackY, trackWidth, trackHeight, {
    isStatic: true,
    render: {
      fillStyle: '#e2e8f0',
      strokeStyle: '#cbd5e1',
      lineWidth: 2 * scale,
    },
    label: 'slider-track',
  })

  // Create handle
  const handle = Matter.Bodies.rectangle(handleX, trackY, handleWidth, handleHeight, {
    isStatic: true, // We'll control movement manually
    render: {
      fillStyle: '#3b82f6',
      strokeStyle: '#1e40af',
      lineWidth: 3 * scale,
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
} => {
  const pegs: Matter.Body[] = []
  const originalPositions: { x: number; y: number }[] = []
  const scale = canvasWidth / 800 // Scale factor based on original 800px width
  const pegRadius = 8 * scale
  const startY = 120 * scale
  const rowSpacing = 45 * scale
  const pegSpacing = 50 * scale
  const boardMargin = 60 * scale

  for (let row = 0; row < 7; row++) {
    const isEvenRow = row % 2 === 0
    const offsetX = isEvenRow ? 0 : pegSpacing / 2

    const availableWidth = canvasWidth - 2 * boardMargin
    const pegsInRow = Math.floor(availableWidth / pegSpacing) + 1

    for (let col = 0; col < pegsInRow; col++) {
      const x = boardMargin + offsetX + col * pegSpacing
      const y = startY + row * rowSpacing

      if (x < boardMargin || x > canvasWidth - boardMargin) continue

      const hue = 220 + row * 10 + col * 5
      const saturation = 70 + row * 2
      const lightness = 60 + col * 2

      const peg = Matter.Bodies.circle(x, y, pegRadius, {
        isStatic: true,
        render: {
          fillStyle: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
          strokeStyle: '#6366f1',
          lineWidth: 2 * scale,
        },
      })
      pegs.push(peg)
      originalPositions.push({ x, y })
    }
  }

  return { pegs, originalPositions }
}

export const createBins = (
  canvasWidth: number = 800,
  canvasHeight: number = 600
): Matter.Body[] => {
  const bins: Matter.Body[] = []
  const numBins = 9
  const binWidth = canvasWidth / numBins // Make bins fill entire width
  const scale = canvasWidth / 800
  const binHeight = 140 * scale // Scale the height
  const binY = canvasHeight - binHeight / 2 - 10 // Position relative to canvas height
  const startX = 0 // Start at the left edge

  // Create walls for 9 bins (10 walls total) spanning full width
  for (let i = 0; i <= numBins; i++) {
    const binX = startX + i * binWidth
    const hue = 200 + i * 20

    const wall = Matter.Bodies.rectangle(binX, binY, 3 * scale, binHeight, {
      isStatic: true,
      render: { fillStyle: `hsl(${hue}, 60%, 65%)` },
    })
    bins.push(wall)
  }

  return bins
}

export const createBall = (
  dropX: number,
  randomness: boolean,
  ballCollisions: boolean,
  scale: number = 1
): Matter.Body => {
  const ballColors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#f97316', '#06b6d4']
  const randomColor = ballColors[Math.floor(Math.random() * ballColors.length)]

  const ball = Matter.Bodies.circle(dropX, 50 * scale, 10 * scale, {
    restitution: randomness ? 0.7 : 0.8,
    friction: randomness ? 0.01 : 0.005,
    frictionAir: randomness ? 0.01 : 0.005,
    render: {
      fillStyle: randomColor,
      strokeStyle: '#ffffff',
      lineWidth: 2 * scale,
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
