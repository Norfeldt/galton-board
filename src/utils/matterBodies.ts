import Matter from 'matter-js'

export const createWalls = (): Matter.Body[] => {
  return [
    // Left wall
    Matter.Bodies.rectangle(2, 300, 4, 600, {
      isStatic: true,
      render: { fillStyle: '#ffffff' },
    }),
    // Right wall
    Matter.Bodies.rectangle(798, 300, 4, 600, {
      isStatic: true,
      render: { fillStyle: '#ffffff' },
    }),
    // Bottom - positioned at canvas bottom
    Matter.Bodies.rectangle(400, 590, 800, 20, {
      isStatic: true,
      render: { fillStyle: '#ffffff' },
    }),
  ]
}

export const createPegs = (): {
  pegs: Matter.Body[]
  originalPositions: { x: number; y: number }[]
} => {
  const pegs: Matter.Body[] = []
  const originalPositions: { x: number; y: number }[] = []
  const pegRadius = 8
  const startY = 120
  const rowSpacing = 45
  const pegSpacing = 50
  const boardMargin = 60

  for (let row = 0; row < 7; row++) {
    const isEvenRow = row % 2 === 0
    const offsetX = isEvenRow ? 0 : pegSpacing / 2

    const availableWidth = 800 - 2 * boardMargin
    const pegsInRow = Math.floor(availableWidth / pegSpacing) + 1

    for (let col = 0; col < pegsInRow; col++) {
      const x = boardMargin + offsetX + col * pegSpacing
      const y = startY + row * rowSpacing

      if (x < boardMargin || x > 800 - boardMargin) continue

      const hue = 220 + row * 10 + col * 5
      const saturation = 70 + row * 2
      const lightness = 60 + col * 2

      const peg = Matter.Bodies.circle(x, y, pegRadius, {
        isStatic: true,
        render: {
          fillStyle: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
          strokeStyle: '#6366f1',
          lineWidth: 2,
        },
      })
      pegs.push(peg)
      originalPositions.push({ x, y })
    }
  }

  return { pegs, originalPositions }
}

export const createBins = (): Matter.Body[] => {
  const bins: Matter.Body[] = []
  const canvasWidth = 800
  const numBins = 9
  const binWidth = canvasWidth / numBins // Make bins fill entire width
  const binHeight = 140 // Full height walls to properly separate bins
  const binY = 520 // Position to go all the way down
  const startX = 0 // Start at the left edge

  // Create walls for 9 bins (10 walls total) spanning full width
  for (let i = 0; i <= numBins; i++) {
    const binX = startX + i * binWidth
    const hue = 200 + i * 20

    const wall = Matter.Bodies.rectangle(binX, binY, 3, binHeight, {
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
  ballCollisions: boolean
): Matter.Body => {
  const ballColors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#f97316', '#06b6d4']
  const randomColor = ballColors[Math.floor(Math.random() * ballColors.length)]

  const ball = Matter.Bodies.circle(dropX, 50, 10, {
    restitution: randomness ? 0.7 : 0.8,
    friction: randomness ? 0.01 : 0.005,
    frictionAir: randomness ? 0.01 : 0.005,
    render: {
      fillStyle: randomColor,
      strokeStyle: '#ffffff',
      lineWidth: 2,
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
