import React, { useRef, useState, useCallback } from 'react'
import Matter from 'matter-js'
import { Card } from '@/components/ui/card'
import { useGaltonPhysics } from '@/hooks/useGaltonPhysics'
import { GaltonControls } from './GaltonControls'
import { GaltonActions } from './GaltonActions'
import { createBall } from '@/utils/matterBodies'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/lib/utils'

const GaltonBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ballCount, setBallCount] = useState(0)
  const [binCounts, setBinCounts] = useState<number[]>(new Array(9).fill(0))
  const [temperature, setTemperature] = useState([0])
  const [randomness, setRandomness] = useState(true)
  const [dropPosition, setDropPosition] = useState([400])
  const [ballCollisions, setBallCollisions] = useState(true)
  const [flashingBins, setFlashingBins] = useState<Set<number>>(new Set())
  const previousBinCountsRef = useRef<number[]>(new Array(9).fill(0))
  const pendingDropsRef = useRef<NodeJS.Timeout[]>([])

  const handleBinCountsUpdate = useCallback((counts: number[]) => {
    const previousCounts = previousBinCountsRef.current
    const newFlashingBins = new Set<number>()

    // Check which bins have increased
    counts.forEach((count, index) => {
      if (count > previousCounts[index]) {
        newFlashingBins.add(index)
      }
    })

    if (newFlashingBins.size > 0) {
      setFlashingBins(newFlashingBins)
      // Clear the flashing state after animation completes
      setTimeout(() => {
        setFlashingBins(new Set())
      }, 600) // Match animation duration
    }

    previousBinCountsRef.current = [...counts]
    setBinCounts(counts)
  }, [])

  const { engineRef, ballsRef } = useGaltonPhysics({
    canvasRef,
    temperature: temperature[0],
    ballCollisions,
    onBinCountsUpdate: handleBinCountsUpdate,
  })

  const dropBall = useCallback(() => {
    if (!engineRef.current) return

    const ballDropX = dropPosition[0] + (randomness ? (Math.random() - 0.5) * 20 : 0)
    const ball = createBall(ballDropX, randomness, ballCollisions)
    ballsRef.current.push(ball)
    Matter.World.add(engineRef.current.world, ball)
    setBallCount((prev) => prev + 1)
    console.log(
      `Ball ${ballCount + 1} dropped at position:`,
      ball.position,
      `Randomness: ${randomness}`
    )
  }, [engineRef, ballsRef, dropPosition, randomness, ballCollisions, ballCount])

  const dropMultipleBalls = useCallback(
    (count: number) => {
      // Clear any existing pending drops first
      pendingDropsRef.current.forEach((timeoutId) => clearTimeout(timeoutId))
      pendingDropsRef.current = []

      for (let i = 0; i < count; i++) {
        const timeoutId = setTimeout(() => dropBall(), i * 200)
        pendingDropsRef.current.push(timeoutId)
      }
    },
    [dropBall]
  )

  const resetSimulation = useCallback(() => {
    if (!engineRef.current) return

    // Cancel all pending ball drops
    pendingDropsRef.current.forEach((timeoutId) => clearTimeout(timeoutId))
    pendingDropsRef.current = []

    ballsRef.current.forEach((ball) => {
      Matter.World.remove(engineRef.current!.world, ball)
    })
    ballsRef.current = []
    setBallCount(0)
    setBinCounts(new Array(9).fill(0))
    setDropPosition([400]) // Reset slider to center position
    console.log('Simulation reset!')
  }, [engineRef, ballsRef])

  return (
    <div className="flex flex-col items-center gap-6 p-8 px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Galton Board
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Watch colorful balls create a beautiful normal distribution as they cascade through the
          pegs
        </p>
      </div>

      {/* Action buttons */}
      <GaltonActions
        onDropBall={dropBall}
        onDropMultipleBalls={dropMultipleBalls}
        onReset={resetSimulation}
      />

      {/* Canvas */}
      <div className="flex flex-col items-center relative bg-white rounded-2xl">
        {/* Drop Position Slider - absolute positioned at top */}
        <div className="absolute top-4 z-20" style={{ left: '100px', width: '600px' }}>
          <SliderPrimitive.Root
            value={dropPosition}
            onValueChange={setDropPosition}
            min={100}
            max={700}
            step={10}
            className="relative flex w-full touch-none select-none items-center">
            <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-200"></SliderPrimitive.Track>
            <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-2 border-slate-400 bg-white shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
          </SliderPrimitive.Root>
        </div>

        {/* Total balls counter - absolute positioned below slider */}
        <div className="absolute top-52 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20">
            <p className="text-lg font-bold text-slate-700">Total Balls: {ballCount}</p>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          className="border-0 rounded-t-2xl shadow-2xl bg-white"
          width={800}
          height={600}
        />

        {/* Bin labels with beautiful styling - seamlessly connected */}
        <div className="flex w-full max-w-[800px] shadow-2xl -mt-1">
          {binCounts.map((count, index) => {
            const isFirst = index === 0
            const isLast = index === binCounts.length - 1
            const hue = 220 + index * 15
            const intensity = 60
            const isFlashing = flashingBins.has(index)

            return (
              <div
                key={index}
                className="flex-1 text-center font-bold text-white relative overflow-hidden transition-all duration-200"
                style={{
                  background: isFlashing
                    ? `linear-gradient(to top, hsl(${hue}, 80%, ${
                        intensity + 20
                      }%), hsl(${hue}, 90%, ${intensity + 30}%))`
                    : `linear-gradient(to top, hsl(${hue}, 60%, ${intensity}%), hsl(${hue}, 70%, ${
                        intensity + 10
                      }%))`,
                  borderRight: isLast ? 'none' : '1px solid rgba(255,255,255,0.3)',
                  minHeight: '40px',
                }}>
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center h-full py-2">
                  <div className="text-lg font-extrabold drop-shadow-lg">{count}</div>
                </div>

                {/* Pinball-style flash effect */}
                {isFlashing && (
                  <div
                    className="absolute inset-0 animate-ping opacity-75"
                    style={{
                      background: `radial-gradient(circle, hsl(${hue}, 100%, 85%) 0%, hsl(${hue}, 90%, 70%) 50%, transparent 100%)`,
                    }}></div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bar chart below bin labels */}
        <div className="w-full max-w-[800px] bg-white/80 backdrop-blur-sm rounded-b-2xl shadow-2xl pt-4">
          <div className="flex items-end h-20 border-b border-slate-00">
            {binCounts.map((count, index) => {
              const hue = 220 + index * 15
              const intensity = 60
              const maxCount = Math.max(...binCounts, 1)
              const height = (count / maxCount) * 80 // Max height of 80px

              return (
                <div key={index} className="flex-1 flex flex-col items-center justify-end">
                  <div
                    className="w-full transition-all duration-300 ease-out"
                    style={{
                      height: `${height}px`,
                      background: `linear-gradient(to top, hsl(${hue}, 60%, ${intensity}%), hsl(${hue}, 70%, ${
                        intensity + 10
                      }%))`,
                    }}
                  />
                </div>
              )
            })}
          </div>
          {/* Bin labels for chart */}
          <div className="flex mt-2 pb-4">
            {binCounts.map((_, index) => (
              <div key={index} className="flex-1 text-center text-xs text-slate-500 font-medium">
                {index}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <GaltonControls
        temperature={temperature}
        setTemperature={setTemperature}
        randomness={randomness}
        setRandomness={setRandomness}
        ballCollisions={ballCollisions}
        setBallCollisions={setBallCollisions}
      />
    </div>
  )
}

export default GaltonBoard
