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
    <div className="flex gap-4">
      <Button
        onClick={onDropBall}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
        Drop Ball
      </Button>
      <Button
        onClick={() => onDropMultipleBalls(10)}
        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
        Drop 10 Balls
      </Button>
      <Button
        onClick={() => onDropMultipleBalls(50)}
        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
        Drop 50 Balls
      </Button>
      <Button
        onClick={() => onDropMultipleBalls(100)}
        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
        Drop 100 Balls
      </Button>
      <Button
        onClick={onReset}
        variant="outline"
        className="border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-800 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 bg-white/80 backdrop-blur-sm">
        Reset
      </Button>
    </div>
  )
}
