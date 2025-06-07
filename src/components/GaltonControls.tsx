import React from 'react'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Card } from '@/components/ui/card'

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
    <Card className="w-full max-w-6xl bg-white/90 backdrop-blur-sm shadow-2xl border-0 rounded-2xl p-4 sm:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* Temperature Control */}
        <div className="space-y-3">
          <Label className="text-base font-semibold text-slate-700">
            Temperature: {temperature[0].toFixed(1)}
          </Label>
          <Slider
            value={temperature}
            onValueChange={setTemperature}
            min={0}
            max={1}
            step={0.1}
            className="w-full [&_[role=slider]]:bg-slate-700 [&_[data-orientation=horizontal]]:bg-slate-400"
          />
          <p className="text-xs text-slate-500 leading-tight">
            Higher temperature makes pegs wiggle more, creating more randomness
          </p>
        </div>

        {/* Randomness Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold text-slate-700">Randomness</Label>
            <Switch checked={randomness} onCheckedChange={setRandomness} />
          </div>
          <p className="text-xs text-slate-500 leading-tight">
            {randomness
              ? 'Balls will bounce randomly'
              : 'Balls will follow the same predictable path'}
          </p>
        </div>

        {/* Ball Collisions Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold text-slate-700">Ball Collisions</Label>
            <Switch checked={ballCollisions} onCheckedChange={setBallCollisions} />
          </div>
          <p className="text-xs text-slate-500 leading-tight">
            {ballCollisions ? 'Balls can bounce off each other' : 'Balls pass through each other'}
          </p>
        </div>
      </div>
    </Card>
  )
}
