"use client"

/* ---------------------------------------------------------------
   SECTION A — INTRO PRELOADER
   Oversized monospace counter 00 -> 100, then an SVG/clip-path
   shutter morphs the overlay upward to reveal the hero.
   --------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const EASE = [0.76, 0, 0.24, 1] as const

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)
  const startedExit = useRef(false)

  useEffect(() => {
    let current = 0
    const tick = () => {
      // Ease the counter — fast then settle near the top
      const step = Math.max(1, Math.round((100 - current) / 14))
      current = Math.min(100, current + step)
      setCount(current)
      if (current < 100) {
        setTimeout(tick, 60)
      } else if (!startedExit.current) {
        startedExit.current = true
        setTimeout(() => setDone(true), 450)
      }
    }
    const t = setTimeout(tick, 350)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          {/* Technical readouts */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span>Bendlight Studio</span>
            <span className="hidden sm:inline">Loading Reel</span>
            <span>EST. MMXVI</span>
          </div>

          <div className="relative flex w-full flex-col items-center px-6">
            <span className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              Calibrating Lens
            </span>
            <div className="flex items-end justify-center overflow-hidden">
              <span className="font-display text-[28vw] font-light leading-[0.8] tracking-tight text-foreground sm:text-[22vw] md:text-[16vw]">
                {String(count).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0">
            <div
              className="h-px bg-foreground"
              style={{ width: `${count}%`, transition: "width 0.2s linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
