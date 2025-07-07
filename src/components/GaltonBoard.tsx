import React, { useRef, useState, useCallback } from 'react'
import Matter from 'matter-js'
import { Card } from '@/components/ui/card'
import { useGaltonPhysics } from '@/hooks/useGaltonPhysics'
import { useResponsiveCanvas } from '@/hooks/useResponsiveCanvas'
import { GaltonControls } from './GaltonControls'
import { GaltonActions } from './GaltonActions'
import { createBall, getBallColorFromPosition, synthBallColors } from '@/utils/matterBodies'
import GaltonTitle from './GaltonTitle'

const GaltonBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [ballCount, setBallCount] = useState(0)
  const [binCounts, setBinCounts] = useState<number[]>(new Array(9).fill(0))
  const [temperature, setTemperature] = useState([0])
  const [randomness, setRandomness] = useState(true)
  const [dropPosition, setDropPosition] = useState(400) // Default center position, will be updated when canvas loads
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
    if (canvasWidth > 0) {
      setDropPosition(canvasWidth / 2)
    }
  }, [canvasWidth])

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

  const { engineRef, ballsRef, resetPegs } = useGaltonPhysics({
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

      // Use 100ms delay (2x speed) for 500 balls, 200ms for others
      const delay = count === 500 ? 100 : 200

      for (let i = 0; i < count; i++) {
        const timeoutId = setTimeout(() => dropBall(), i * delay)
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

    // Reset peg colors back to original
    resetPegs()

    console.log('Simulation reset!')
  }, [engineRef, ballsRef, canvasWidth, resetPegs])

  return (
    <div className="flex flex-col gap-8 py-8 min-h-screen">
      <GaltonTitle />

      {/* Main content area - responsive layout */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto w-full px-4">
        {/* Left column - Controls (hidden on mobile, shown on lg+) */}
        <div className="hidden lg:flex flex-col gap-8 justify-start">
          {/* Action buttons */}
          <GaltonActions
            onDropBall={dropBall}
            onDropMultipleBalls={dropMultipleBalls}
            onReset={resetSimulation}
          />

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

        {/* Right column - Galton Board */}
        <div className="flex flex-col items-center">
          {/* Mobile controls (shown on mobile, hidden on lg+) */}
          <div className="lg:hidden mb-8">
            <GaltonActions
              onDropBall={dropBall}
              onDropMultipleBalls={dropMultipleBalls}
              onReset={resetSimulation}
            />
          </div>

          {/* Canvas Container */}
          <div
            ref={containerRef}
            className="flex flex-col items-center relative w-full max-w-4xl mx-auto">
            <Card 
              className="p-0 overflow-hidden bg-gradient-to-br from-black/80 to-black/95 neon-panel shadow-neon-card"
              style={{
                border: '2px solid #00f0ff',
                boxShadow: '0 0 10px #00f0ff, 0 0 20px rgba(0, 240, 255, 0.4), inset 0 0 10px rgba(0, 0, 0, 0.8)'
              }}>
              <canvas
                ref={canvasRef}
                className="block canvas-neon-bg"
                width={canvasWidth}
                height={canvasHeight}
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto', 
                  background: 'transparent',
                  filter: 'drop-shadow(0 0 10px rgba(0, 245, 255, 0.2))'
                }}
              />

              {/* Bin labels */}
              <div
                className="flex w-full bg-black/60 backdrop-blur-sm border-t-2"
                style={{ 
                  maxWidth: `${canvasWidth}px`,
                  borderTopColor: '#FF69B4',
                  boxShadow: '0 -2px 20px rgba(255, 105, 180, 0.5), inset 0 2px 10px rgba(255, 255, 255, 0.2)'
                }}>
                {binCounts.map((count, index) => {
                  const isFlashing = flashingBins.has(index)
                  const bgColor = synthBallColors[index]

                  return (
                    <div
                      key={index}
                      className="flex-1 text-center font-black relative overflow-hidden transition-all duration-300 border-r border-white/10 last:border-r-0"
                      style={{
                        backgroundColor: isFlashing ? bgColor : `${bgColor}40`,
                        minHeight: `${50 * scale}px`,
                        boxShadow: isFlashing ? `0 0 30px ${bgColor}, inset 0 0 20px rgba(255,255,255,0.3)` : `inset 0 0 10px ${bgColor}`,
                      }}>
                      {/* Content */}
                      <div className="relative z-10 flex flex-col justify-center items-center h-full py-3">
                        <div
                          className="text-lg sm:text-2xl font-black transition-all duration-300"
                          style={{ 
                            color: bgColor,
                            textShadow: isFlashing ? `0 0 10px ${bgColor}, 0 0 20px ${bgColor}` : 'none'
                          }}>
                          {count}
                        </div>
                      </div>

                      {/* Enhanced glow effect */}
                      {isFlashing && (
                        <div
                          className="absolute inset-0 animate-pulse"
                          style={{
                            backgroundColor: `${bgColor}40`,
                          }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Histogram/Bar Chart */}
              <div
                className="w-full bg-black/40 backdrop-blur-sm mt-2 p-4 border border-white/10 rounded-lg"
                style={{ 
                  maxWidth: `${canvasWidth}px`,
                  backgroundImage: `
                    linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: `${100 / binCounts.length}% ${20 * scale}px`
                }}>
                <div
                  className="flex items-end border-b border-white/20"
                  style={{ height: `${120 * scale}px` }}>
                  {binCounts.map((count, index) => {
                    const maxCount = Math.max(...binCounts, 1)
                    const height = (count / maxCount) * 100 * scale
                    const bgColor = synthBallColors[index]

                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center justify-end border-r border-white/10 last:border-r-0">
                        <div
                          className="w-full transition-all duration-500 ease-out border border-white/20 rounded-t"
                          style={{
                            height: `${height}px`,
                            backgroundColor: bgColor,
                            marginBottom: '2px',
                            boxShadow: `0 0 20px ${bgColor}, inset 0 0 10px rgba(255,255,255,0.2)`,
                          }}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Position numbers */}
              <div
                className="flex w-full mt-4 p-2"
                style={{ maxWidth: `${canvasWidth}px` }}>
                {Array.from({ length: 9 }, (_, i) => (
                  <div key={i} className="flex-1 text-center">
                    <div className="text-sm sm:text-lg font-bold" style={{ color: '#00f0ff' }}>
                      {i}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total balls counter */}
              <div className="bg-black/60 backdrop-blur-sm p-4 border-t border-cyan-500/30 glass-strong">
                <div className="text-center">
                  <div 
                    className="text-2xl sm:text-3xl font-black uppercase tracking-wider neon-text-cyan animate-neon-pulse"
                    style={{ 
                      textShadow: '0 0 15px rgba(0, 245, 255, 0.8), 0 0 30px rgba(0, 245, 255, 0.5), 0 0 45px rgba(0, 245, 255, 0.3)'
                    }}>
                    Total Balls: {ballCount}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Mobile controls (shown on mobile, hidden on lg+) */}
          <div className="lg:hidden mt-8 w-full">
            <GaltonControls
              temperature={temperature}
              setTemperature={setTemperature}
              randomness={randomness}
              setRandomness={setRandomness}
              ballCollisions={ballCollisions}
              setBallCollisions={setBallCollisions}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default GaltonBoard
