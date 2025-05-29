
import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const GaltonBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine>();
  const renderRef = useRef<Matter.Render>();
  const ballsRef = useRef<Matter.Body[]>([]);
  const pegsRef = useRef<Matter.Body[]>([]);
  const pegOriginalPositions = useRef<{x: number, y: number}[]>([]);
  const animationFrameRef = useRef<number>();
  
  const [ballCount, setBallCount] = useState(0);
  const [binCounts, setBinCounts] = useState<number[]>(new Array(7).fill(0));
  const [temperature, setTemperature] = useState([0]);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create engine
    const engine = Matter.Engine.create();
    engine.world.gravity.y = 1;
    engineRef.current = engine;

    // Create renderer
    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        background: '#1a1a2e',
        wireframes: false,
        showAngleIndicator: false,
        showVelocity: false,
        showDebug: false,
      }
    });
    renderRef.current = render;

    // Create walls
    const walls = [
      // Left wall
      Matter.Bodies.rectangle(-10, 300, 20, 600, { 
        isStatic: true,
        render: { fillStyle: '#ffffff' }
      }),
      // Right wall
      Matter.Bodies.rectangle(810, 300, 20, 600, { 
        isStatic: true,
        render: { fillStyle: '#ffffff' }
      }),
      // Bottom
      Matter.Bodies.rectangle(400, 610, 800, 20, { 
        isStatic: true,
        render: { fillStyle: '#ffffff' }
      })
    ];

    // Create pegs in triangular pattern
    const pegs: Matter.Body[] = [];
    const originalPositions: {x: number, y: number}[] = [];
    const pegRadius = 8;
    const startY = 150;
    const rowSpacing = 50;
    const pegSpacing = 80;

    for (let row = 0; row < 8; row++) {
      const pegsInRow = row + 2;
      const rowWidth = (pegsInRow - 1) * pegSpacing;
      const startX = 400 - rowWidth / 2;

      for (let col = 0; col < pegsInRow; col++) {
        const x = startX + col * pegSpacing;
        const y = startY + row * rowSpacing;
        
        const peg = Matter.Bodies.circle(x, y, pegRadius, {
          isStatic: true,
          render: {
            fillStyle: '#ff6b6b',
            strokeStyle: '#ffffff',
            lineWidth: 2
          }
        });
        pegs.push(peg);
        originalPositions.push({ x, y });
      }
    }

    pegsRef.current = pegs;
    pegOriginalPositions.current = originalPositions;

    // Create bins at the bottom
    const bins: Matter.Body[] = [];
    const binWidth = 80;
    const binHeight = 100;
    const binY = 520;
    
    for (let i = 0; i < 8; i++) {
      const binX = 80 + i * binWidth;
      // Left wall of bin
      const leftWall = Matter.Bodies.rectangle(binX, binY, 3, binHeight, {
        isStatic: true,
        render: { fillStyle: '#4ecdc4' }
      });
      bins.push(leftWall);
    }
    
    // Right wall of last bin
    const lastBinWall = Matter.Bodies.rectangle(80 + 8 * binWidth, binY, 3, binHeight, {
      isStatic: true,
      render: { fillStyle: '#4ecdc4' }
    });
    bins.push(lastBinWall);

    // Add all bodies to world
    Matter.World.add(engine.world, [...walls, ...pegs, ...bins]);

    // Start the engine and renderer
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    // Animation loop for peg wiggling
    const animate = () => {
      const currentTemp = temperature[0];
      const time = Date.now() * 0.005; // Time for oscillation
      
      pegsRef.current.forEach((peg, index) => {
        const originalPos = pegOriginalPositions.current[index];
        const wiggleAmount = currentTemp * 15; // Max wiggle distance based on temperature
        
        // Create smooth oscillation with slight randomness
        const wiggleX = Math.sin(time + index * 0.5) * wiggleAmount;
        const wiggleY = Math.cos(time * 0.7 + index * 0.3) * wiggleAmount * 0.3;
        
        Matter.Body.setPosition(peg, {
          x: originalPos.x + wiggleX,
          y: originalPos.y + wiggleY
        });
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Collision detection for counting balls in bins
    Matter.Events.on(engine, 'afterUpdate', () => {
      const newBinCounts = new Array(7).fill(0);
      
      ballsRef.current.forEach(ball => {
        if (ball.position.y > 470) { // If ball is in bin area
          const binIndex = Math.floor((ball.position.x - 80) / 80);
          if (binIndex >= 0 && binIndex < 7) {
            newBinCounts[binIndex]++;
          }
        }
      });
      
      setBinCounts(newBinCounts);
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      Matter.Runner.stop(runner);
      Matter.Render.stop(render);
      Matter.Engine.clear(engine);
    };
  }, [temperature]);

  const dropBall = () => {
    if (!engineRef.current) return;

    const ball = Matter.Bodies.circle(
      400 + (Math.random() - 0.5) * 20, // Small random offset
      50,
      10,
      {
        restitution: 0.7,
        friction: 0.01,
        frictionAir: 0.01,
        render: {
          fillStyle: '#ffe66d',
          strokeStyle: '#ffffff',
          lineWidth: 2
        }
      }
    );

    ballsRef.current.push(ball);
    Matter.World.add(engineRef.current.world, ball);
    setBallCount(prev => prev + 1);

    console.log(`Ball ${ballCount + 1} dropped at position:`, ball.position);
  };

  const dropMultipleBalls = () => {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => dropBall(), i * 200);
    }
  };

  const resetSimulation = () => {
    if (!engineRef.current) return;

    ballsRef.current.forEach(ball => {
      Matter.World.remove(engineRef.current!.world, ball);
    });
    
    ballsRef.current = [];
    setBallCount(0);
    setBinCounts(new Array(7).fill(0));
    
    console.log('Simulation reset!');
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Galton Board</h1>
        <p className="text-gray-600">Watch balls create a normal distribution as they fall through pegs</p>
      </div>

      {/* Temperature Control */}
      <Card className="p-4 w-80">
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Temperature: {temperature[0].toFixed(1)}
          </Label>
          <Slider
            value={temperature}
            onValueChange={setTemperature}
            min={0}
            max={1}
            step={0.1}
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            Higher temperature makes pegs wiggle more, creating more randomness
          </p>
        </div>
      </Card>

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border-2 border-gray-300 rounded-lg shadow-lg bg-gray-900"
          width={800}
          height={600}
        />
        
        {/* Bin labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
          <div className="flex gap-0">
            {binCounts.map((count, index) => (
              <div
                key={index}
                className="w-20 text-center text-sm font-medium text-white bg-black bg-opacity-50 p-1"
              >
                {count}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button onClick={dropBall} className="bg-blue-600 hover:bg-blue-700">
          Drop Ball
        </Button>
        <Button onClick={dropMultipleBalls} className="bg-purple-600 hover:bg-purple-700">
          Drop 10 Balls
        </Button>
        <Button onClick={resetSimulation} variant="outline">
          Reset
        </Button>
      </div>

      <Card className="p-4">
        <div className="text-center">
          <p className="text-lg font-semibold">Total Balls: {ballCount}</p>
          <p className="text-sm text-gray-600 mt-1">
            Distribution: {binCounts.join(' - ')}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default GaltonBoard;
