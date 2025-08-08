import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  activeColor?: string
  secondaryColor?: string
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, activeColor = '#ff00ff', secondaryColor = '#00ffff', ...props }, ref) => {
  // Convert hex to RGB for dynamic opacity
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '255, 0, 255'
  }

  const activeColorRgb = hexToRgb(activeColor)

  return (
    <SwitchPrimitives.Root
      className={cn(
        'peer inline-flex h-10 w-20 shrink-0 cursor-pointer items-center rounded-none relative overflow-hidden transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 switch-custom-glow',
        // Unchecked state
        'bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#333]',
        // Checked state
        'data-[state=checked]:bg-gradient-to-b data-[state=checked]:from-[#2a1a2a] data-[state=checked]:to-[#1a0a1a]',
        className
      )}
      style={{
        '--switch-active-color': activeColor,
        '--switch-secondary-color': secondaryColor,
        '--switch-glow-effect': `0 0 20px rgba(${activeColorRgb}, 0.6), 0 0 40px rgba(${activeColorRgb}, 0.4)`,
        // Isometric 3D effect with multiple layers
        boxShadow: `
          /* Outer frame depth */
          inset 0 2px 4px rgba(255, 255, 255, 0.1),
          inset 0 -2px 4px rgba(0, 0, 0, 0.8),
          /* Side shadows for 3D effect */
          -4px 0 8px rgba(0, 0, 0, 0.5),
          4px 0 8px rgba(0, 0, 0, 0.5),
          /* Bottom shadow */
          0 4px 8px rgba(0, 0, 0, 0.6)
        `,
        transform: 'perspective(500px) rotateX(10deg)',
      } as React.CSSProperties}
      {...props}
      ref={ref}>
    {/* Grid pattern overlay */}
    <div
      className="absolute inset-0 opacity-20 pointer-events-none"
      style={{
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 0, 255, 0.3) 2px,
            rgba(255, 0, 255, 0.3) 3px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 255, 0.3) 2px,
            rgba(0, 255, 255, 0.3) 3px
          )
        `,
      }}
    />
    
    {/* Track indicator lights */}
    <div className="switch-indicator-left absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all duration-300 bg-[#666]" />
    <div className="switch-indicator-right absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all duration-300 bg-[#666]" />
    
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-8 w-8 relative transition-all duration-300',
        'translate-x-1 data-[state=checked]:translate-x-10'
      )}
    >
      {/* Main thumb body with layered 3D effect */}
      <div
        className="absolute inset-0"
        style={{
          // Base layer - dark metallic
          background: 'linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 40%, #1a1a1a 60%, #0a0a0a 100%)',
          borderRadius: '2px',
          border: '1px solid #555',
        }}
      />
      
      {/* Top bevel layer */}
      <div
        className="absolute inset-x-0 top-0 h-1/3"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
          borderRadius: '2px 2px 0 0',
        }}
      />
      
      {/* Side grooves for grip */}
      <div className="absolute inset-y-2 left-1 w-0.5 bg-black/50" />
      <div className="absolute inset-y-2 left-2.5 w-0.5 bg-black/50" />
      <div className="absolute inset-y-2 right-1 w-0.5 bg-black/50" />
      <div className="absolute inset-y-2 right-2.5 w-0.5 bg-black/50" />
      
      {/* Center LED indicator */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-4 transition-all duration-300"
        style={{
          background: 'linear-gradient(180deg, #222 0%, #111 100%)',
          boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.8)',
        }}
      />
      
      {/* 3D shadow effect */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: '2px',
          boxShadow: `
            /* Top highlight */
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            /* Bottom shadow */
            inset 0 -1px 0 rgba(0, 0, 0, 0.8),
            /* External depth */
            0 2px 4px rgba(0, 0, 0, 0.8),
            0 4px 8px rgba(0, 0, 0, 0.6)
          `,
        }}
      />
    </SwitchPrimitives.Thumb>
  </SwitchPrimitives.Root>
  )
})
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }