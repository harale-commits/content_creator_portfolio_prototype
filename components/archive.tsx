"use client"

/* ---------------------------------------------------------------
   SECTION D — THE CINEMATIC ARCHIVE
   A vertical project index. On row hover a 16:9 preview pops into
   existence and anchors to the cursor, morphing between projects.
   --------------------------------------------------------------- */

import { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const PROJECTS = [
  { name: "Neon Requiem", cat: "Short Film", year: "2025", img: "/project-01.png" },
  { name: "Dust & Light", cat: "Commercial", year: "2024", img: "/project-02.png" },
  { name: "Portrait No.7", cat: "Editorial", year: "2024", img: "/project-03.png" },
  { name: "Midnight Drive", cat: "Automotive", year: "2023", img: "/project-04.png" },
  { name: "Submerge", cat: "Music Video", year: "2023", img: "/project-05.png" },
  { name: "Goldhour", cat: "Documentary", year: "2022", img: "/craft-cinema.png" },
]

export function Archive() {
  const [hovered, setHovered] = useState<number | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = (e: React.MouseEvent) => {
    if (!previewRef.current || !containerRef.current) return
    const bounds = containerRef.current.getBoundingClientRect()
    const x = e.clientX - bounds.left
    const y = e.clientY - bounds.top
    previewRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
  }

  return (
    <section className="relative bg-background py-24 md:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex items-end justify-between border-b border-border pb-6">
          <h2 className="font-display text-4xl font-light tracking-tight text-foreground sm:text-5xl">
            Selected Works
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            The Archive / {PROJECTS.length}
          </span>
        </div>

        {/* Column labels */}
        <div className="grid grid-cols-12 border-b border-border pb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <span className="col-span-6">Project</span>
          <span className="col-span-4">Category</span>
          <span className="col-span-2 text-right">Year</span>
        </div>

        <div
          ref={containerRef}
          onMouseMove={handleMove}
          className="relative"
        >
          {PROJECTS.map((p, i) => (
            <button
              key={p.name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="group grid w-full grid-cols-12 items-center border-b border-border py-6 text-left transition-colors md:py-8"
            >
              <span className="col-span-6 flex items-center gap-4">
                <span className="font-mono text-[10px] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-2xl font-light text-foreground transition-transform duration-500 ease-out group-hover:translate-x-3 sm:text-4xl md:text-5xl">
                  {p.name}
                </span>
              </span>
              <span className="col-span-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
                {p.cat}
              </span>
              <span className="col-span-2 text-right font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
                {p.year}
              </span>
            </button>
          ))}

          {/* Floating cursor-anchored preview */}
          <div
            ref={previewRef}
            className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block"
          >
            <AnimatePresence>
              {hovered !== null && (
                <motion.div
                  key={hovered}
                  initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 4 }}
                  transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                  className="aspect-video w-[26vw] max-w-md overflow-hidden rounded-sm shadow-2xl"
                >
                  <img
                    src={PROJECTS[hovered].img || "/placeholder.svg"}
                    alt={`${PROJECTS[hovered].name} preview`}
                    className="h-full w-full scale-110 object-cover"
                  />
                  <div className="absolute inset-0 bg-background/10" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
