import React, { useRef, useState, useCallback } from 'react'
import Matter from 'matter-js'
import { Card } from '@/components/ui/card'
import { useGaltonPhysics } from '@/hooks/useGaltonPhysics'
import { useResponsiveCanvas } from '@/hooks/useResponsiveCanvas'
import { GaltonControls } from './GaltonControls'
import { GaltonActions } from './GaltonActions'
import { createBall, getBallColorFromPosition, brutalBallColors } from '@/utils/matterBodies'

const GaltonBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [ballCount, setBallCount] = useState(0)
  const [binCounts, setBinCounts] = useState<number[]>(new Array(9).fill(0))
  const [temperature, setTemperature] = useState([0])
  const [randomness, setRandomness] = useState(true)
  const [dropPosition, setDropPosition] = useState(0) // Will be set to canvas center when canvas loads
  const [ballCollisions, setBallCollisions] = useState(false)
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
    const ballColor = getBallColorFromPosition(dropPosition, canvasWidth)
    const ball = createBall(ballDropX, randomness, ballCollisions, scale, ballColor)
    ballsRef.current.push(ball)
    Matter.World.add(engineRef.current.world, ball)
    setBallCount((prev) => prev + 1)
    console.log(
      `Ball ${ballCount + 1} dropped at position:`,
      ball.position,
      `Randomness: ${randomness}`
    )
  }, [engineRef, ballsRef, dropPosition, randomness, ballCollisions, ballCount, scale, canvasWidth])

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
    <div className="flex flex-col items-center gap-8 py-8 px-4 min-h-screen">
      {/* Title */}
      <div className="text-center bg-white brutal-border-thick brutal-shadow-xl p-6">
        <h1 className="text-4xl sm:text-6xl font-black text-black uppercase tracking-wider">
          GALTON BOARD
        </h1>
      </div>

      {/* Action buttons */}
      <GaltonActions
        onDropBall={dropBall}
        onDropMultipleBalls={dropMultipleBalls}
        onReset={resetSimulation}
      />

      {/* Canvas Container */}
      <div ref={containerRef} className="flex flex-col items-center relative w-full mx-auto">
        <canvas
          ref={canvasRef}
          className="brutal-border-thick brutal-shadow-xl bg-white block"
          width={canvasWidth}
          height={canvasHeight}
          style={{ maxWidth: '100%', height: 'auto' }}
        />

        {/* Bin labels with neubrutalism styling */}
        <div
          className="flex w-full brutal-border-thick brutal-shadow-xl -mt-1"
          style={{ maxWidth: `${canvasWidth}px` }}>
          {binCounts.map((count, index) => {
            const isFlashing = flashingBins.has(index)
            const bgColor = brutalBallColors[index]

            return (
              <div
                key={index}
                className="flex-1 text-center font-black text-black relative overflow-hidden transition-all duration-200 border-r-4 border-black last:border-r-0"
                style={{
                  backgroundColor: isFlashing ? '#FFFFFF' : bgColor,
                  minHeight: `${50 * scale}px`,
                }}>
                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center h-full py-3">
                  <div className="text-lg sm:text-2xl font-black text-black">{count}</div>
                </div>

                {/* Flash effect */}
                {isFlashing && <div className="absolute inset-0 bg-white animate-pulse"></div>}
              </div>
            )
          })}
        </div>

        {/* Bar chart below bin labels */}
        <div
          className="w-full bg-white brutal-border-thick brutal-shadow-xl pt-6"
          style={{ maxWidth: `${canvasWidth}px` }}>
          <div
            className="flex items-end border-b-4 border-black"
            style={{ height: `${120 * scale}px` }}>
            {binCounts.map((count, index) => {
              const maxCount = Math.max(...binCounts, 1)
              const height = (count / maxCount) * 100 * scale
              const bgColor = brutalBallColors[index]

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center justify-end border-r-4 border-black last:border-r-0">
                  <div
                    className="w-full transition-all duration-300 ease-out brutal-border"
                    style={{
                      height: `${height}px`,
                      backgroundColor: bgColor,
                      marginBottom: '4px',
                    }}
                  />
                </div>
              )
            })}
          </div>

          {/* Bin labels for chart */}
          <div className="flex mt-4 pb-4">
            {binCounts.map((_, index) => (
              <div
                key={index}
                className="flex-1 text-center text-lg font-black text-black uppercase">
                {index}
              </div>
            ))}
          </div>

          {/* Total balls counter */}
          <div className="text-center pb-6 mx-4 mb-4 p-4">
            <p className="text-2xl font-black text-black uppercase tracking-wider">
              TOTAL BALLS: {ballCount}
            </p>
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
