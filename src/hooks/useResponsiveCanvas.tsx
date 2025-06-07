import { useEffect, useState, useCallback } from 'react'

type CanvasDimensions = {
  width: number
  height: number
  scale: number
}

export const useResponsiveCanvas = (containerRef: React.RefObject<HTMLElement>) => {
  const [dimensions, setDimensions] = useState<CanvasDimensions>({
    width: 800,
    height: 600,
    scale: 1,
  })

  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return

    const containerWidth = containerRef.current.clientWidth
    const maxWidth = 800
    const maxHeight = 600

    // Use full container width with no padding
    const availableWidth = containerWidth // Use 100% of container width
    const scale = availableWidth / maxWidth // Scale to fit full width

    const scaledWidth = maxWidth * scale
    const scaledHeight = maxHeight * scale

    setDimensions({
      width: scaledWidth,
      height: scaledHeight,
      scale,
    })
  }, [containerRef])

  useEffect(() => {
    updateDimensions()

    const handleResize = () => {
      updateDimensions()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [updateDimensions])

  return dimensions
}
