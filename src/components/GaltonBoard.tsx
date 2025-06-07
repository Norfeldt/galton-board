import React, { useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';
import { Card } from '@/components/ui/card';
import { useGaltonPhysics } from '@/hooks/useGaltonPhysics';
import { GaltonControls } from './GaltonControls';
import { GaltonActions } from './GaltonActions';
import { createBall } from '@/utils/matterBodies';
const GaltonBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ballCount, setBallCount] = useState(0);
  const [binCounts, setBinCounts] = useState<number[]>(new Array(7).fill(0));
  const [temperature, setTemperature] = useState([0]);
  const [randomness, setRandomness] = useState(true);
  const [dropPosition, setDropPosition] = useState([400]);
  const [ballCollisions, setBallCollisions] = useState(true);
  const handleBinCountsUpdate = useCallback((counts: number[]) => {
    setBinCounts(counts);
  }, []);
  const {
    engineRef,
    ballsRef
  } = useGaltonPhysics({
    canvasRef,
    temperature: temperature[0],
    ballCollisions,
    onBinCountsUpdate: handleBinCountsUpdate
  });
  const dropBall = useCallback(() => {
    if (!engineRef.current) return;
    const ballDropX = dropPosition[0] + (randomness ? (Math.random() - 0.5) * 20 : 0);
    const ball = createBall(ballDropX, randomness, ballCollisions);
    ballsRef.current.push(ball);
    Matter.World.add(engineRef.current.world, ball);
    setBallCount(prev => prev + 1);
    console.log(`Ball ${ballCount + 1} dropped at position:`, ball.position, `Randomness: ${randomness}`);
  }, [engineRef, ballsRef, dropPosition, randomness, ballCollisions, ballCount]);
  const dropMultipleBalls = useCallback((count: number) => {
    for (let i = 0; i < count; i++) {
      setTimeout(() => dropBall(), i * 200);
    }
  }, [dropBall]);
  const resetSimulation = useCallback(() => {
    if (!engineRef.current) return;
    ballsRef.current.forEach(ball => {
      Matter.World.remove(engineRef.current!.world, ball);
    });
    ballsRef.current = [];
    setBallCount(0);
    setBinCounts(new Array(7).fill(0));
    console.log('Simulation reset!');
  }, [engineRef, ballsRef]);
  return <div className="flex flex-col items-center gap-8 p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Galton Board
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Watch colorful balls create a beautiful normal distribution as they cascade through the pegs
        </p>
      </div>

      <GaltonControls dropPosition={dropPosition} setDropPosition={setDropPosition} temperature={temperature} setTemperature={setTemperature} randomness={randomness} setRandomness={setRandomness} ballCollisions={ballCollisions} setBallCollisions={setBallCollisions} />

      <div className="relative">
        <canvas ref={canvasRef} className="border-0 rounded-2xl shadow-2xl bg-white" width={800} height={600} />
        
        {/* Bin labels with beautiful styling */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end h-32">
          <div className="flex gap-0 mb-4">
            {binCounts.map((count, index) => <div key={index} className="w-20 text-center text-sm font-semibold text-white bg-gradient-to-t from-slate-900/80 to-slate-700/80 backdrop-blur-sm p-2 first:rounded-bl-lg last:rounded-br-lg border-r border-white/20 last:border-r-0 px-0">
                {count}
              </div>)}
          </div>
        </div>
      </div>

      <GaltonActions onDropBall={dropBall} onDropMultipleBalls={dropMultipleBalls} onReset={resetSimulation} />

      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <div className="text-center">
          <p className="text-xl font-bold text-slate-700 mb-2">Total Balls: {ballCount}</p>
          <p className="text-sm text-slate-500">
            Distribution: {binCounts.join(' - ')}
          </p>
        </div>
      </Card>
    </div>;
};
export default GaltonBoard;