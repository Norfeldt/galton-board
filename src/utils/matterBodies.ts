
import Matter from 'matter-js';

export const createWalls = (): Matter.Body[] => {
  return [
    // Left wall
    Matter.Bodies.rectangle(-10, 300, 20, 600, { 
      isStatic: true,
      render: { fillStyle: '#e2e8f0' }
    }),
    // Right wall
    Matter.Bodies.rectangle(810, 300, 20, 600, { 
      isStatic: true,
      render: { fillStyle: '#e2e8f0' }
    }),
    // Bottom - raised higher
    Matter.Bodies.rectangle(400, 580, 800, 20, { 
      isStatic: true,
      render: { fillStyle: '#e2e8f0' }
    })
  ];
};

export const createPegs = (): { pegs: Matter.Body[], originalPositions: {x: number, y: number}[] } => {
  const pegs: Matter.Body[] = [];
  const originalPositions: {x: number, y: number}[] = [];
  const pegRadius = 8;
  const startY = 120;
  const rowSpacing = 45;
  const pegSpacing = 50;
  const boardMargin = 60;

  for (let row = 0; row < 7; row++) {
    const isEvenRow = row % 2 === 0;
    const offsetX = isEvenRow ? 0 : pegSpacing / 2;
    
    const availableWidth = 800 - (2 * boardMargin);
    const pegsInRow = Math.floor(availableWidth / pegSpacing) + 1;
    
    for (let col = 0; col < pegsInRow; col++) {
      const x = boardMargin + offsetX + col * pegSpacing;
      const y = startY + row * rowSpacing;
      
      if (x < boardMargin || x > 800 - boardMargin) continue;
      
      const hue = 220 + (row * 10) + (col * 5);
      const saturation = 70 + (row * 2);
      const lightness = 60 + (col * 2);
      
      const peg = Matter.Bodies.circle(x, y, pegRadius, {
        isStatic: true,
        render: {
          fillStyle: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
          strokeStyle: '#6366f1',
          lineWidth: 2
        }
      });
      pegs.push(peg);
      originalPositions.push({ x, y });
    }
  }

  return { pegs, originalPositions };
};

export const createBins = (): Matter.Body[] => {
  const bins: Matter.Body[] = [];
  const binWidth = 80;
  const binHeight = 120;
  const binY = 520;
  
  for (let i = 0; i < 8; i++) {
    const binX = 80 + i * binWidth;
    const hue = 200 + (i * 20);
    
    const leftWall = Matter.Bodies.rectangle(binX, binY, 3, binHeight, {
      isStatic: true,
      render: { fillStyle: `hsl(${hue}, 60%, 65%)` }
    });
    bins.push(leftWall);
  }
  
  const lastBinWall = Matter.Bodies.rectangle(80 + 8 * binWidth, binY, 3, binHeight, {
    isStatic: true,
    render: { fillStyle: 'hsl(360, 60%, 65%)' }
  });
  bins.push(lastBinWall);

  return bins;
};

export const createBall = (dropX: number, randomness: boolean, ballCollisions: boolean): Matter.Body => {
  const ballColors = [
    '#f59e0b', '#ef4444', '#10b981', '#3b82f6', 
    '#8b5cf6', '#f97316', '#06b6d4'
  ];
  const randomColor = ballColors[Math.floor(Math.random() * ballColors.length)];

  const ball = Matter.Bodies.circle(
    dropX,
    50,
    10,
    {
      restitution: randomness ? 0.7 : 0.8,
      friction: randomness ? 0.01 : 0.005,
      frictionAir: randomness ? 0.01 : 0.005,
      render: {
        fillStyle: randomColor,
        strokeStyle: '#ffffff',
        lineWidth: 2
      }
    }
  );

  if (!ballCollisions) {
    ball.collisionFilter = {
      category: 0x0002,
      mask: 0x0001
    };
  }

  return ball;
};
