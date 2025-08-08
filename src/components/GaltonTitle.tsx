import React from 'react'
import TextGradient from './TextGradient'

type GaltonTitleProps = {
  className?: string
}

const GaltonTitle: React.FC<GaltonTitleProps> = ({ className = '' }) => {
  return (
    <div className={`text-center mx-auto w-full py-4 sm:py-8 lg:py-12 ${className}`}>
      <div className="relative inline-block">
        <div
          className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-widest relative z-10 leading-[0.9]"
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontWeight: '900',
            margin: 0,
            padding: 0,
          }}>
          <div>
            <TextGradient>NORFELDT'S</TextGradient>
          </div>
          <div>
            <TextGradient>GALTON BOARD</TextGradient>
          </div>
        </div>
        <div
          className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-widest absolute inset-0 z-0 leading-[0.9]"
          style={{
            color: '#0080ff',
            textShadow: '0 0 10px #0080ff, 0 0 20px #0060cc, 0 0 30px #004099, 0 0 40px #003366',
            fontFamily: '"JetBrains Mono", monospace',
            fontWeight: '900',
            margin: 0,
            padding: 0,
          }}>
          <div>NORFELDT'S</div>
          <div>GALTON BOARD</div>
        </div>
      </div>
    </div>
  )
}

export default GaltonTitle
