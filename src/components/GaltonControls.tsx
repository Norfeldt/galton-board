
import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

interface GaltonControlsProps {
  dropPosition: number[];
  setDropPosition: (value: number[]) => void;
  temperature: number[];
  setTemperature: (value: number[]) => void;
  randomness: boolean;
  setRandomness: (value: boolean) => void;
  ballCollisions: boolean;
  setBallCollisions: (value: boolean) => void;
}

export const GaltonControls: React.FC<GaltonControlsProps> = ({
  dropPosition,
  setDropPosition,
  temperature,
  setTemperature,
  randomness,
  setRandomness,
  ballCollisions,
  setBallCollisions
}) => {
  return (
    <>
      {/* Drop Position Control */}
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
    </>
  );
};
