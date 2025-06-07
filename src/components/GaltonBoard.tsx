import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

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
  const [randomness, setRandomness] = useState(true);
  const [dropPosition, setDropPosition] = useState([400]); // Center position by default
  const [ballCollisions, setBallCollisions] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create engine
    const engine = Matter.Engine.create();
    engine.world.gravity.y = 1;
    engineRef.current = engine;

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
      }
    });
    renderRef.current = render;

    // Create walls with subtle gray color
    const walls = [
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

    // Create pegs spanning full width with staggered rows
    const pegs: Matter.Body[] = [];
    const originalPositions: {x: number, y: number}[] = [];
    const pegRadius = 8;
    const startY = 120;
    const rowSpacing = 45;
    const pegSpacing = 50; // Closer spacing for more pegs
    const boardMargin = 60; // Margin from edges

    for (let row = 0; row < 7; row++) {
      const isEvenRow = row % 2 === 0;
      const offsetX = isEvenRow ? 0 : pegSpacing / 2; // Stagger every other row
      
      // Calculate how many pegs fit across the width
      const availableWidth = 800 - (2 * boardMargin);
      const pegsInRow = Math.floor(availableWidth / pegSpacing) + 1;
      
      for (let col = 0; col < pegsInRow; col++) {
        const x = boardMargin + offsetX + col * pegSpacing;
        const y = startY + row * rowSpacing;
        
        // Skip if peg would be outside bounds
        if (x < boardMargin || x > 800 - boardMargin) continue;
        
        // Create gradient effect with different shades of blue/purple
        const hue = 220 + (row * 10) + (col * 5); // Blue to purple gradient
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

    pegsRef.current = pegs;
    pegOriginalPositions.current = originalPositions;

    // Create bins at the bottom with beautiful colors - walls extend to bottom
    const bins: Matter.Body[] = [];
    const binWidth = 80;
    const binHeight = 120; // Extended height to reach bottom
    const binY = 520; // Moved down to extend to bottom
    
    for (let i = 0; i < 8; i++) {
      const binX = 80 + i * binWidth;
      // Create gradient colors for bins
      const hue = 200 + (i * 20); // Cyan to blue gradient
      
      // Left wall of bin
      const leftWall = Matter.Bodies.rectangle(binX, binY, 3, binHeight, {
        isStatic: true,
        render: { fillStyle: `hsl(${hue}, 60%, 65%)` }
      });
      bins.push(leftWall);
    }
    
    // Right wall of last bin
    const lastBinWall = Matter.Bodies.rectangle(80 + 8 * binWidth, binY, 3, binHeight, {
      isStatic: true,
      render: { fillStyle: 'hsl(360, 60%, 65%)' }
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

    // Collision detection for counting balls in bins - updated for new bin position
    Matter.Events.on(engine, 'afterUpdate', () => {
      const newBinCounts = new Array(7).fill(0);
      
      ballsRef.current.forEach(ball => {
        if (ball.position.y > 440) { // Updated threshold for new bin position
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
  }, [temperature, ballCollisions]);

  const dropBall = () => {
    if (!engineRef.current) return;

    // Create balls with beautiful gradient colors
    const ballColors = [
      '#f59e0b', // Amber
      '#ef4444', // Red
      '#10b981', // Emerald
      '#3b82f6', // Blue
      '#8b5cf6', // Violet
      '#f97316', // Orange
      '#06b6d4', // Cyan
    ];
    const randomColor = ballColors[Math.floor(Math.random() * ballColors.length)];

    const ballDropX = dropPosition[0] + (randomness ? (Math.random() - 0.5) * 20 : 0);
    
    const ball = Matter.Bodies.circle(
      ballDropX, // Use slider position
      50,
      10,
      {
        restitution: randomness ? 0.7 : 0.8, // More consistent bouncing when randomness is off
        friction: randomness ? 0.01 : 0.005, // Less friction for more predictable paths
        frictionAir: randomness ? 0.01 : 0.005,
        render: {
          fillStyle: randomColor,
          strokeStyle: '#ffffff',
          lineWidth: 2
        }
      }
    );

    // Set collision filtering based on ballCollisions setting
    if (!ballCollisions) {
      ball.collisionFilter = {
        category: 0x0002,
        mask: 0x0001 // Only collide with pegs and walls (category 0x0001), not other balls (0x0002)
      };
    }

    ballsRef.current.push(ball);
    Matter.World.add(engineRef.current.world, ball);
    setBallCount(prev => prev + 1);

    console.log(`Ball ${ballCount + 1} dropped at position:`, ball.position, `Randomness: ${randomness}`);
  };

  const dropMultipleBalls = (count: number) => {
    for (let i = 0; i < count; i++) {
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
    <div className="flex flex-col items-center gap-8 p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Galton Board
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Watch colorful balls create a beautiful normal distribution as they cascade through the pegs
        </p>
      </div>

      {/* Drop Position Control - moved to top */}
      <Card className="p-6 w-96 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <div className="space-y-4">
          <Label className="text-base font-semibold text-slate-700">
            Drop Position
          </Label>
          <Slider
            value={dropPosition}
            onValueChange={setDropPosition}
            min={100}
            max={700}
            step={10}
            className="w-full"
          />
          <p className="text-sm text-slate-500">
            Control where balls are dropped from left to right
          </p>
        </div>
      </Card>

      <div className="flex gap-6">
        {/* Temperature Control */}
        <Card className="p-6 w-96 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="space-y-4">
            <Label className="text-base font-semibold text-slate-700">
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
            <p className="text-sm text-slate-500">
              Higher temperature makes pegs wiggle more, creating more randomness
            </p>
          </div>
        </Card>

        {/* Randomness Control */}
        <Card className="p-6 w-96 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold text-slate-700">
                Randomness
              </Label>
              <Switch 
                checked={randomness} 
                onCheckedChange={setRandomness}
              />
            </div>
            <p className="text-sm text-slate-500">
              {randomness ? 'Balls will bounce randomly' : 'Balls will follow the same predictable path'}
            </p>
          </div>
        </Card>
      </div>

      {/* Ball Collisions Control */}
      <Card className="p-6 w-96 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold text-slate-700">
              Ball Collisions
            </Label>
            <Switch 
              checked={ballCollisions} 
              onCheckedChange={setBallCollisions}
            />
          </div>
          <p className="text-sm text-slate-500">
            {ballCollisions ? 'Balls can bounce off each other' : 'Balls pass through each other'}
          </p>
        </div>
      </Card>

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border-0 rounded-2xl shadow-2xl bg-white"
          width={800}
          height={600}
        />
        
        {/* Bin labels with beautiful styling - properly aligned */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end h-32">
          <div className="flex gap-0 mb-4">
            {binCounts.map((count, index) => (
              <div
                key={index}
                className="w-20 text-center text-sm font-semibold text-white bg-gradient-to-t from-slate-900/80 to-slate-700/80 backdrop-blur-sm p-2 first:rounded-bl-lg last:rounded-br-lg border-r border-white/20 last:border-r-0"
              >
                {count}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button 
          onClick={dropBall} 
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          Drop Ball
        </Button>
        <Button 
          onClick={() => dropMultipleBalls(10)} 
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          Drop 10 Balls
        </Button>
        <Button 
          onClick={() => dropMultipleBalls(50)} 
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          Drop 50 Balls
        </Button>
        <Button 
          onClick={() => dropMultipleBalls(100)} 
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          Drop 100 Balls
        </Button>
        <Button 
          onClick={resetSimulation} 
          variant="outline"
          className="border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-800 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 bg-white/80 backdrop-blur-sm"
        >
          Reset
        </Button>
      </div>

      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <div className="text-center">
          <p className="text-xl font-bold text-slate-700 mb-2">Total Balls: {ballCount}</p>
          <p className="text-sm text-slate-500">
            Distribution: {binCounts.join(' - ')}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default GaltonBoard;
