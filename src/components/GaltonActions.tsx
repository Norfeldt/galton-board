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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
      <Button
        onClick={onDropBall}
        className="bg-green-500/20 hover:bg-green-500/40 text-green-400 border-2 border-green-400 font-bold py-4 px-6 rounded-sm transition-all duration-300 text-lg uppercase tracking-wide backdrop-blur-sm hover:text-neon-glow shadow-[0_0_20px_rgba(74,222,128,0.3)]">
        1 Ball
      </Button>
      <Button
        onClick={() => onDropMultipleBalls(10)}
        className="bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 border-2 border-yellow-300 font-bold py-4 px-6 rounded-sm transition-all duration-300 text-lg uppercase tracking-wide backdrop-blur-sm hover:text-neon-glow shadow-[0_0_20px_rgba(253,224,71,0.3)]">
        10 Balls
      </Button>
      <Button
        onClick={() => onDropMultipleBalls(100)}
        className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border-2 border-red-400 font-bold py-4 px-6 rounded-sm transition-all duration-300 text-lg uppercase tracking-wide backdrop-blur-sm hover:text-neon-glow shadow-[0_0_20px_rgba(248,113,113,0.3)]">
        100 Balls
      </Button>
      <Button
        onClick={() => onDropMultipleBalls(500)}
        className="bg-purple-500/20 hover:bg-purple-500/40 text-purple-400 border-2 border-purple-400 font-bold py-4 px-6 rounded-sm transition-all duration-300 text-lg uppercase tracking-wide backdrop-blur-sm hover:text-neon-glow shadow-[0_0_20px_rgba(196,181,253,0.3)]">
        500 Balls
      </Button>
      <Button
        onClick={onReset}
        className="bg-sky-500/20 hover:bg-sky-500/40 text-sky-400 border-2 border-sky-400 font-bold py-4 px-6 rounded-sm transition-all duration-300 text-lg uppercase tracking-wide col-span-2 md:col-span-4 backdrop-blur-sm hover:text-neon-glow shadow-[0_0_20px_rgba(56,189,248,0.3)]">
        RESET
      </Button>
    </div>
  )
}
