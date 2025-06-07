import React, { useRef, useState, useCallback } from 'react'
import Matter from 'matter-js'
import { Card } from '@/components/ui/card'
import { useGaltonPhysics } from '@/hooks/useGaltonPhysics'
import { useResponsiveCanvas } from '@/hooks/useResponsiveCanvas'
import { GaltonControls } from './GaltonControls'
import { GaltonActions } from './GaltonActions'
import { createBall } from '@/utils/matterBodies'

const GaltonBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [ballCount, setBallCount] = useState(0)
  const [binCounts, setBinCounts] = useState<number[]>(new Array(9).fill(0))
  const [temperature, setTemperature] = useState([0])
  const [randomness, setRandomness] = useState(true)
  const [dropPosition, setDropPosition] = useState(0) // Will be set to canvas center when canvas loads
  const [ballCollisions, setBallCollisions] = useState(true)
  const [flashingBins, setFlashingBins] = useState<Set<number>>(new Set())
  const previousBinCountsRef = useRef<number[]>(new Array(9).fill(0))
  const pendingDropsRef = useRef<NodeJS.Timeout[]>([])

  // Get responsive canvas dimensions
  const { width: canvasWidth, height: canvasHeight, scale } = useResponsiveCanvas(containerRef)

  const handleDropPositionChange = useCallback((position: number) => {
    setDropPosition(position)
  }, [])

  // Set initial drop position to canvas center when canvas dimensions are available
  React.useEffect(() => {
    if (canvasWidth > 0 && dropPosition === 0) {
      setDropPosition(canvasWidth / 2)
    }
  }, [canvasWidth, dropPosition])

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
    onDropPositionChange: handleDropPositionChange,
    dropPosition,
    canvasWidth,
    canvasHeight,
    scale,
  })

  const dropBall = useCallback(() => {
    if (!engineRef.current || dropPosition === 0) return

    // Use drop position directly since it's already in canvas coordinates
    const ballDropX = dropPosition + (randomness ? (Math.random() - 0.5) * 20 * scale : 0)
    const ball = createBall(ballDropX, randomness, ballCollisions, scale)
    ballsRef.current.push(ball)
    Matter.World.add(engineRef.current.world, ball)
    setBallCount((prev) => prev + 1)
    console.log(
      `Ball ${ballCount + 1} dropped at position:`,
      ball.position,
      `Randomness: ${randomness}`
    )
  }, [engineRef, ballsRef, dropPosition, randomness, ballCollisions, ballCount, scale])

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
    setDropPosition(canvasWidth / 2) // Reset slider to center of canvas
    console.log('Simulation reset!')
  }, [engineRef, ballsRef, canvasWidth])

  return (
    <div className="flex flex-col items-center gap-6 py-4 px-2 sm:py-8 sm:px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Galton Board
        </h1>
        <p className="text-sm sm:text-lg text-slate-600 max-w-2xl px-4">
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

      {/* Canvas Container */}
      <div ref={containerRef} className="flex flex-col items-center relative w-full mx-auto">
        {/* Physics-based slider is now rendered within the Matter.js canvas */}

        {/* Total balls counter - responsive positioning */}
        <div
          className="absolute z-10"
          style={{
            top: `${canvasHeight * 0.15}px`,
            left: '50%',
            transform: 'translateX(-50%)',
          }}>
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20">
            <p className="text-sm sm:text-lg font-bold text-slate-700">Total Balls: {ballCount}</p>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          className="border-0 rounded-t-2xl shadow-2xl bg-white block"
          width={canvasWidth}
          height={canvasHeight}
          style={{ maxWidth: '100%', height: 'auto' }}
        />

        {/* Bin labels with beautiful styling - seamlessly connected */}
        <div className="flex w-full shadow-2xl -mt-1" style={{ maxWidth: `${canvasWidth}px` }}>
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
                  minHeight: `${40 * scale}px`,
                }}>
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center h-full py-2">
                  <div className="text-xs sm:text-lg font-extrabold drop-shadow-lg">{count}</div>
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
        <div
          className="w-full bg-white/80 backdrop-blur-sm rounded-b-2xl shadow-2xl pt-4"
          style={{ maxWidth: `${canvasWidth}px` }}>
          <div
            className="flex items-end border-b border-slate-00"
            style={{ height: `${80 * scale}px` }}>
            {binCounts.map((count, index) => {
              const hue = 220 + index * 15
              const intensity = 60
              const maxCount = Math.max(...binCounts, 1)
              const height = (count / maxCount) * 80 * scale // Scale the max height

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
