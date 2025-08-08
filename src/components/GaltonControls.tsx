import React from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

interface GaltonControlsProps {
  temperature: number[]
  setTemperature: (value: number[]) => void
  randomness: boolean
  setRandomness: (value: boolean) => void
  ballCollisions: boolean
  setBallCollisions: (value: boolean) => void
}

export const GaltonControls: React.FC<GaltonControlsProps> = ({
  temperature,
  setTemperature,
  randomness,
  setRandomness,
  ballCollisions,
  setBallCollisions,
}) => {
  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle 
          className="text-xl sm:text-2xl font-black uppercase tracking-wider text-cyan-400"
          style={{ textShadow: '0 0 10px #0080ff, 0 0 20px #0060cc, 0 0 30px #004099, 0 0 40px #003366' }}
        >
          Controls
        </CardTitle>
      </CardHeader>
      <div className="p-3 sm:p-6 space-y-2 sm:space-y-4">
        {/* Temperature Control Tile */}
        <div className="control-tile p-2.5 sm:p-6 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
            <div className="flex-1">
              <Label 
                className="text-base sm:text-lg font-bold uppercase tracking-wide block text-cyan-400"
                style={{ textShadow: '0 0 8px #0891b2, 0 0 16px #0e7490, 0 0 24px #155e75' }}
              >
                Temperature
              </Label>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 justify-center sm:justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newValue = Math.max(0, temperature[0] - 1/16)
                  setTemperature([Number(newValue.toFixed(4))])
                }}
                disabled={temperature[0] <= 0}
                className="w-8 h-8 sm:w-12 sm:h-12 p-0 bg-black/50 border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/20 hover:border-cyan-400 hover:text-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 text-lg sm:text-2xl font-bold"
              >
                -
              </Button>
              <div className="min-w-[4rem] sm:min-w-[6rem] text-center">
                <span className="text-base sm:text-xl font-mono text-cyan-400 font-bold">
                  {(Math.round(temperature[0] * 16) / 16).toFixed(4)}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newValue = Math.min(1, temperature[0] + 1/16)
                  setTemperature([Number(newValue.toFixed(4))])
                }}
                disabled={temperature[0] >= 1}
                className="w-8 h-8 sm:w-12 sm:h-12 p-0 bg-black/50 border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/20 hover:border-cyan-400 hover:text-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 text-lg sm:text-2xl font-bold"
              >
                +
              </Button>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-cyan-400 font-medium leading-tight">
            Higher temperature makes more pegs wiggle, creating more randomness
          </p>
        </div>

        {/* Randomness Control Tile */}
        <div className="control-tile p-2.5 sm:p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <Label 
                className="text-base sm:text-lg font-bold uppercase tracking-wide block text-purple-400"
                style={{ textShadow: '0 0 8px #7c3aed, 0 0 16px #6d28d9, 0 0 24px #5b21b6' }}
              >
                Randomness
              </Label>
            </div>
            <div>
              <Switch checked={randomness} onCheckedChange={setRandomness} activeColor="#7c3aed" secondaryColor="#a78bfa" />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-purple-400 font-medium leading-tight">
            {randomness
              ? 'Balls will bounce randomly'
              : 'Balls will follow the same predictable path'}
          </p>
        </div>

        {/* Ball Collisions Control Tile */}
        <div className="control-tile p-2.5 sm:p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <Label 
                className="text-base sm:text-lg font-bold uppercase tracking-wide block text-pink-400"
                style={{ textShadow: '0 0 8px #ec4899, 0 0 16px #db2777, 0 0 24px #be185d' }}
              >
                Ball Collisions
              </Label>
            </div>
            <div>
              <Switch checked={ballCollisions} onCheckedChange={setBallCollisions} activeColor="#ec4899" secondaryColor="#f9a8d4" />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-pink-400 font-medium leading-tight">
            {ballCollisions ? 'Balls can bounce off each other' : 'Balls pass through each other'}
          </p>
        </div>
      </div>
    </Card>
  )
}
