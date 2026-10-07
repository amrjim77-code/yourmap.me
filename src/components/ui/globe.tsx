"use client"

import createGlobe, { COBEOptions } from "cobe"
import { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

const GLOBE_CONFIG: COBEOptions = {
  width: 1000,
  height: 1000,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [251 / 255, 100 / 255, 21 / 255],
  glowColor: [1, 1, 1],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
}

// Persistent rotation position across re-renders and theme switches
let persistentPhi = 0

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string
  config?: COBEOptions
}) {
  let width = 0
  const configRef = useRef(config)
  configRef.current = config

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<any>(null)
  const pointerInteractionMovement = useRef(0)
  const [r, setR] = useState(0)

  const updatePointerInteraction = (value: any) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX: any) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      setR(delta / 200)
    }
  }

  const onRender = useCallback(
    (state: Record<string, any>) => {
      if (!pointerInteracting.current) persistentPhi += 0.004
      state.phi = persistentPhi + r
      const currentWidth = width || (canvasRef.current?.offsetWidth || 500)
      state.width = currentWidth * 2
      state.height = currentWidth * 2

      // Dynamically update marker color and uniforms in real-time when theme changes
      if (configRef.current) {
        if (configRef.current.markerColor) {
          state.markerColor = configRef.current.markerColor
        }
        if (configRef.current.glowColor) {
          state.glowColor = configRef.current.glowColor
        }
        if (configRef.current.baseColor) {
          state.baseColor = configRef.current.baseColor
        }
        if (configRef.current.dark !== undefined) {
          state.dark = configRef.current.dark
        }
        if (configRef.current.diffuse !== undefined) {
          state.diffuse = configRef.current.diffuse
        }
      }
    },
    [r],
  )

  const onResize = () => {
    if (canvasRef.current) {
      width = canvasRef.current.offsetWidth
    }
  }

  useEffect(() => {
    window.addEventListener("resize", onResize)
    onResize()

    if (!canvasRef.current) return

    const initialWidth = canvasRef.current.offsetWidth || 500
    width = initialWidth

    const globe = createGlobe(canvasRef.current, {
      ...config,
      width: initialWidth * 2,
      height: initialWidth * 2,
      onRender,
    })

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1"
      }
    })
    return () => {
      window.removeEventListener("resize", onResize)
      globe.destroy()
    }
  }, [])

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-square w-full",
        className,
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]",
        )}
        ref={canvasRef}
        onPointerDown={(e) =>
          updatePointerInteraction(
            e.clientX - pointerInteractionMovement.current,
          )
        }
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  )
}
export default Globe
