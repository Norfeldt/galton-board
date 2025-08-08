import React from 'react'

type TextGradientProps = {
  children: React.ReactNode
  className?: string
  gradientFrom?: string
  gradientTo?: string
}

const TextGradient: React.FC<TextGradientProps> = ({ 
  children, 
  className = '',
  gradientFrom = '#ffffff',
  gradientTo = '#00f0ff'
}) => {
  return (
    <span 
      className={`inline-block ${className}`}
      style={{
        background: `linear-gradient(to top, ${gradientTo} 0%, ${gradientFrom} 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        color: 'transparent',
        lineHeight: 'inherit',
      }}>
      {children}
    </span>
  )
}

export default TextGradient