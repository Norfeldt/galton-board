import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border-2 border-neon-pink transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-neon-pink/30 data-[state=unchecked]:bg-black',
      className
    )}
    {...props}
    ref={ref}>
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-6 w-6 rounded-full bg-neon-pink shadow-lg ring-0 transition-all duration-300 data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-1 border-2 border-neon-pink'
      )}
      style={{
        boxShadow: '0 2px 8px rgba(255, 0, 110, 0.3), 0 0 0 1px rgba(255, 0, 110, 0.2)',
      }}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
