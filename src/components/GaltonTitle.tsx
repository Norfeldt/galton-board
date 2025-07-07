import React from 'react'

type GaltonTitleProps = {
  className?: string
}

const GaltonTitle: React.FC<GaltonTitleProps> = ({ className = '' }) => {
  return (
    <div className={`text-center mx-auto w-full py-12 ${className}`}>
      <div className="relative inline-block">
        <div
          className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-widest relative z-10 leading-[0.9]"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #00f0ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
            fontFamily: '"JetBrains Mono", monospace',
            fontWeight: '900',
            margin: 0,
            padding: 0,
          }}>
          <div>NORFELDT'S</div>
          <div>GALTON BOARD</div>
        </div>
        <div
          className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-widest absolute inset-0 z-0 leading-[0.9]"
          style={{
            color: '#00f0ff',
            textShadow: '0 0 15px rgba(0, 120, 255, 0.6), 0 0 30px rgba(0, 120, 255, 0.4), 0 0 45px rgba(0, 120, 255, 0.2)',
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
