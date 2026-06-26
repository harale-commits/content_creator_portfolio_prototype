"use client"

/* ---------------------------------------------------------------
   CUSTOM AMBIENT CURSOR
   Replaces the native cursor with a tracking dot that morphs into
   a rotating "PLAY SHOWREEL" loop when inside the reel bounds.
   --------------------------------------------------------------- */

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { motion, AnimatePresence } from "framer-motion"

type CursorVariant = "default" | "reel" | "view" | "hover"

type CursorContextValue = {
  setVariant: (v: CursorVariant) => void
}

const CursorContext = createContext<CursorContextValue>({
  setVariant: () => {},
})

export const useCursor = () => useContext(CursorContext)

export function CursorProvider({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<CursorVariant>("default")
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Only enable the custom cursor on fine pointer devices
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)")
    if (!mq.matches) return
    setEnabled(true)
    document.documentElement.classList.add("cursor-none-desktop")

    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX
      pos.current.y = e.clientY
    }
    window.addEventListener("mousemove", onMove)

    let raf = 0
    const render = () => {
      // Dot follows instantly, ring eases behind for an ambient lag
      ring.current.x += (pos.current.x - ring.current.x) * 0.18
      ring.current.y += (pos.current.y - ring.current.y) * 0.18
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove("cursor-none-desktop")
    }
  }, [])

  const isReel = variant === "reel"

  return (
    <CursorContext.Provider value={{ setVariant }}>
      {children}

      {enabled && (
        <>
          {/* Small precise dot */}
          <div
            ref={dotRef}
            className="pointer-events-none fixed left-0 top-0 z-[70] hidden md:block"
          >
            <motion.div
              className="rounded-full bg-foreground"
              animate={{
                width: variant === "default" ? 6 : 4,
                height: variant === "default" ? 6 : 4,
                opacity: isReel ? 0 : 1,
              }}
              transition={{ duration: 0.25 }}
            />
          </div>

          {/* Ambient lagging ring / showreel loop */}
          <div
            ref={ringRef}
            className="pointer-events-none fixed left-0 top-0 z-[69] hidden md:block"
          >
            <motion.div
              className="relative flex items-center justify-center rounded-full"
              animate={{
                width: isReel ? 132 : variant === "view" ? 88 : 38,
                height: isReel ? 132 : variant === "view" ? 88 : 38,
                backgroundColor: isReel
                  ? "rgba(255,255,255,1)"
                  : "rgba(255,255,255,0)",
                borderColor: isReel
                  ? "rgba(255,255,255,0)"
                  : "rgba(255,255,255,0.4)",
              }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              style={{ borderWidth: 1, borderStyle: "solid" }}
            >
              <AnimatePresence>
                {isReel && (
                  <motion.span
                    key="play"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {/* Rotating circular text */}
                    <motion.svg
                      viewBox="0 0 100 100"
                      className="absolute h-full w-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                        duration: 8,
                      }}
                    >
                      <defs>
                        <path
                          id="circlePath"
                          d="M 50,50 m -34,0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0"
                        />
                      </defs>
                      <text className="fill-background font-mono text-[9px] uppercase tracking-[0.32em]">
                        <textPath href="#circlePath" startOffset="0%">
                          Play Showreel · Play Showreel ·
                        </textPath>
                      </text>
                    </motion.svg>
                    <span className="font-mono text-[10px] text-background">
                      ▶
                    </span>
                  </motion.span>
                )}
                {variant === "view" && (
                  <motion.span
                    key="view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-mono text-[9px] uppercase tracking-[0.2em] text-foreground"
                  >
                    View
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </CursorContext.Provider>
  )
}
