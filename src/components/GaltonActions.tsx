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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl">
      <Button
        onClick={onDropBall}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-sm sm:text-base">
        Drop 1x Ball
      </Button>
      <Button
        onClick={() => onDropMultipleBalls(10)}
        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-sm sm:text-base">
        Drop 10x Balls
      </Button>
      <Button
        onClick={() => onDropMultipleBalls(50)}
        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-sm sm:text-base">
        Drop 50x Balls
      </Button>
      <Button
        onClick={() => onDropMultipleBalls(100)}
        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-sm sm:text-base">
        Drop 100x Balls
      </Button>
      <Button
        onClick={onReset}
        variant="outline"
        className="border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-800 px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 bg-white/80 backdrop-blur-sm text-sm sm:text-base col-span-2 md:col-span-4">
        Reset
      </Button>
    </div>
  )
}
