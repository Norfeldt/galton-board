import React from 'react'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
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
    <>
      <CardHeader>
        <CardTitle>Controls</CardTitle>
      </CardHeader>
      <Card className="w-full max-w-6xl bg-white p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Temperature Control */}
          <div className="space-y-4 p-4 bg-brutal-yellow brutal-border">
            <Label className="text-xl font-bold text-black uppercase tracking-wide">
              Temperature: {temperature[0].toFixed(2)}
            </Label>
            <Slider
              value={temperature}
              onValueChange={setTemperature}
              min={0}
              max={1}
              step={1 / 7 + 0.01}
              className="w-full [&_[role=slider]]:bg-black [&_[role=slider]]:border-2 [&_[role=slider]]:border-black [&_[role=slider]]:w-6 [&_[role=slider]]:h-6 [&_[data-orientation=horizontal]]:bg-white [&_[data-orientation=horizontal]]:border-2 [&_[data-orientation=horizontal]]:border-black [&_[data-orientation=horizontal]]:h-4"
            />
            <p className="text-sm text-black font-bold leading-tight uppercase">
              Higher temperature makes more pegs wiggle, creating more randomness
            </p>
          </div>

          {/* Randomness Control */}
          <div className="space-y-4 p-4 bg-brutal-green brutal-border">
            <div className="flex items-center justify-between">
              <Label className="text-xl font-bold text-black uppercase tracking-wide">
                Randomness
              </Label>
              <Switch
                checked={randomness}
                onCheckedChange={setRandomness}
                className="data-[state=checked]:bg-black data-[state=unchecked]:bg-white border-2 border-black"
              />
            </div>
            <p className="text-sm text-black font-bold leading-tight uppercase">
              {randomness
                ? 'Balls will bounce randomly'
                : 'Balls will follow the same predictable path'}
            </p>
          </div>

          {/* Ball Collisions Control */}
          <div className="space-y-4 p-4 bg-brutal-blue brutal-border">
            <div className="flex items-center justify-between">
              <Label className="text-xl font-bold text-black uppercase tracking-wide">
                Ball Collisions
              </Label>
              <Switch
                checked={ballCollisions}
                onCheckedChange={setBallCollisions}
                className="data-[state=checked]:bg-black data-[state=unchecked]:bg-white border-2 border-black"
              />
            </div>
            <p className="text-sm text-black font-bold leading-tight uppercase">
              {ballCollisions ? 'Balls can bounce off each other' : 'Balls pass through each other'}
            </p>
          </div>
        </div>
      </Card>
    </>
  )
}
