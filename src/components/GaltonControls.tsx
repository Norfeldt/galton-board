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
        <CardTitle className="text-2xl font-black uppercase tracking-wider text-white">
          Controls
        </CardTitle>
      </CardHeader>
      <div className="p-6 space-y-4">
        {/* Temperature Control Tile */}
        <div className="control-tile p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <Label className="text-lg font-bold uppercase tracking-wide block text-cyan-400">
                Temperature
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newValue = Math.max(0, temperature[0] - 1/16)
                  setTemperature([Number(newValue.toFixed(4))])
                }}
                disabled={temperature[0] <= 0}
                className="w-12 h-12 p-0 bg-black/50 border border-pink-500/50 text-pink-400 hover:bg-pink-500/20 hover:border-pink-500 hover:text-pink-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 text-2xl font-bold"
              >
                -
              </Button>
              <div className="min-w-[6rem] text-center">
                <span className="text-xl font-mono text-cyan-400 font-bold">
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
                className="w-12 h-12 p-0 bg-black/50 border border-pink-500/50 text-pink-400 hover:bg-pink-500/20 hover:border-pink-500 hover:text-pink-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 text-2xl font-bold"
              >
                +
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-300 font-medium leading-tight">
            Higher temperature makes more pegs wiggle, creating more randomness
          </p>
        </div>

        {/* Randomness Control Tile */}
        <div className="control-tile p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <Label className="text-lg font-bold uppercase tracking-wide block text-purple-400">
                Randomness
              </Label>
            </div>
            <div>
              <Switch checked={randomness} onCheckedChange={setRandomness} />
            </div>
          </div>
          <p className="text-sm text-gray-300 font-medium leading-tight">
            {randomness
              ? 'Balls will bounce randomly'
              : 'Balls will follow the same predictable path'}
          </p>
        </div>

        {/* Ball Collisions Control Tile */}
        <div className="control-tile p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <Label className="text-lg font-bold uppercase tracking-wide block text-pink-400">
                Ball Collisions
              </Label>
            </div>
            <div>
              <Switch checked={ballCollisions} onCheckedChange={setBallCollisions} />
            </div>
          </div>
          <p className="text-sm text-gray-300 font-medium leading-tight">
            {ballCollisions ? 'Balls can bounce off each other' : 'Balls pass through each other'}
          </p>
        </div>
      </div>
    </Card>
  )
}
