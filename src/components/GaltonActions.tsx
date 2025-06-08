import React from 'react'
import { Button } from '@/components/ui/button'

interface GaltonActionsProps {
  onDropBall: () => void
  onDropMultipleBalls: (count: number) => void
  onReset: () => void
}

export const GaltonActions: React.FC<GaltonActionsProps> = ({
  onDropBall,
  onDropMultipleBalls,
  onReset,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl p-4">
      <Button
        onClick={onDropBall}
        className="bg-brutal-blue hover:bg-brutal-blue text-black font-bold py-4 px-6 brutal-border brutal-shadow hover:brutal-shadow-lg transition-all duration-200 hover:translate-x-1 hover:translate-y-1 text-lg uppercase tracking-wide">
        1 Ball
      </Button>
      <Button
        onClick={() => onDropMultipleBalls(10)}
        className="bg-brutal-purple hover:bg-brutal-purple text-white font-bold py-4 px-6 brutal-border brutal-shadow hover:brutal-shadow-lg transition-all duration-200 hover:translate-x-1 hover:translate-y-1 text-lg uppercase tracking-wide">
        10 Balls
      </Button>
      <Button
        onClick={() => onDropMultipleBalls(50)}
        className="bg-brutal-green hover:bg-brutal-green text-black font-bold py-4 px-6 brutal-border brutal-shadow hover:brutal-shadow-lg transition-all duration-200 hover:translate-x-1 hover:translate-y-1 text-lg uppercase tracking-wide">
        50 Balls
      </Button>
      <Button
        onClick={() => onDropMultipleBalls(100)}
        className="bg-brutal-orange hover:bg-brutal-orange text-black font-bold py-4 px-6 brutal-border brutal-shadow hover:brutal-shadow-lg transition-all duration-200 hover:translate-x-1 hover:translate-y-1 text-lg uppercase tracking-wide">
        100 Balls
      </Button>
      <Button
        onClick={onReset}
        className="bg-white hover:bg-white text-black font-bold py-4 px-6 brutal-border brutal-shadow-lg hover:brutal-shadow-xl transition-all duration-200 hover:translate-x-2 hover:translate-y-2 text-lg uppercase tracking-wide col-span-2 md:col-span-4">
        RESET
      </Button>
    </div>
  )
}
