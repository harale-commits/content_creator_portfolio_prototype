"use client"

/* ---------------------------------------------------------------
   SECTION C — CAPABILITIES & CRAFT
   A pinned narrative path. Scroll drives an active index; the left
   descriptions and the right masked video clips swipe in perfect
   synchronisation.
   --------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion, AnimatePresence } from "framer-motion"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const SERVICES = [
  {
    no: "01",
    title: "Graphic Design",
    img: "/craft-design.png",
    tools: "Photoshop · Illustrator · InDesign",
    desc: "Editorial systems, brand identities and print-grade artwork engineered with typographic precision and an obsessive eye for grid and contrast.",
  },
  {
    no: "02",
    title: "Video Editing",
    img: "/craft-editing.png",
    tools: "Premiere Pro · DaVinci Resolve",
    desc: "Narrative-first cutting, rhythmic pacing and immaculate color grading that turns raw footage into emotionally charged sequences.",
  },
  {
    no: "03",
    title: "Motion Graphics",
    img: "/craft-motion.png",
    tools: "After Effects · Cinema 4D",
    desc: "Kinetic typography, fluid 3D forms and broadcast-ready animation that give brands a living, breathing visual language.",
  },
  {
    no: "04",
    title: "Cinematography",
    img: "/craft-cinema.png",
    tools: "RED · ARRI · Anamorphic Glass",
    desc: "On-set direction of photography — lighting, lensing and movement composed frame by frame to bend light into story.",
  },
]

export function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=300%",
        pin: ".craft-pin",
        scrub: true,
        onUpdate: (self) => {
          const idx = Math.min(
            SERVICES.length - 1,
            Math.floor(self.progress * SERVICES.length),
          )
          setActive(idx)
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-background">
      <div className="absolute inset-x-0 top-0 z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <span>Capabilities</span>
        <span>The Craft</span>
      </div>

      <div className="craft-pin flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-2">
          {/* LEFT — descriptions */}
          <div className="order-2 md:order-1">
            <div className="mb-8 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {String(active + 1).padStart(2, "0")} / 0{SERVICES.length}
            </div>
            <div className="relative h-[2px] w-full bg-border">
              <motion.div
                className="absolute left-0 top-0 h-full bg-foreground"
                animate={{ width: `${((active + 1) / SERVICES.length) * 100}%` }}
                transition={{ ease: [0.76, 0, 0.24, 1], duration: 0.6 }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                className="mt-10"
              >
                <h3 className="font-display text-5xl font-light leading-none tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                  {SERVICES[active].title}
                </h3>
                <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
                  {SERVICES[active].desc}
                </p>
                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/70">
                  {SERVICES[active].tools}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Index list */}
            <ul className="mt-12 hidden gap-6 font-mono text-[10px] uppercase tracking-[0.25em] md:flex">
              {SERVICES.map((s, i) => (
                <li
                  key={s.no}
                  className={
                    i === active ? "text-foreground" : "text-muted-foreground/50"
                  }
                >
                  {s.title}
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT — masked swiping clips */}
          <div className="order-1 aspect-[4/5] w-full overflow-hidden rounded-sm md:order-2">
            <div className="relative h-full w-full">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={active}
                  initial={{ clipPath: "inset(0% 0% 0% 100%)" }}
                  animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  exit={{ clipPath: "inset(0% 100% 0% 0%)" }}
                  transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={SERVICES[active].img || "/placeholder.svg"}
                    alt={`${SERVICES[active].title} craft clip`}
                    className="h-full w-full scale-105 object-cover"
                  />
                  <div className="absolute inset-0 bg-background/15" />
                  <div className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/80">
                    {SERVICES[active].no} — {SERVICES[active].title}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
