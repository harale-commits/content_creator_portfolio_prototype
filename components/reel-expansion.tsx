"use client"

/* ---------------------------------------------------------------
   SECTION B — REEL EXPANSION (The Hook)
   A pinned ScrollTrigger scales the 16:9 reel from a small frame
   to fill the entire viewport. Inside the bounds the cursor morphs
   into the "PLAY SHOWREEL" loop.
   --------------------------------------------------------------- */

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useCursor } from "./cursor"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function ReelExpansion() {
  const sectionRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const { setVariant } = useCursor()

  useEffect(() => {
    if (!sectionRef.current || !frameRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=140%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })
      tl.fromTo(
        frameRef.current,
        { width: "34vw", height: "19.125vw", borderRadius: 8 },
        {
          width: "100vw",
          height: "100vh",
          borderRadius: 0,
          ease: "power2.inOut",
        },
      )
      tl.to(labelRef.current, { opacity: 0, duration: 0.2 }, 0)
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[100svh] items-center justify-center overflow-hidden bg-background"
    >
      <div
        ref={frameRef}
        onMouseEnter={() => setVariant("reel")}
        onMouseLeave={() => setVariant("default")}
        className="relative flex items-center justify-center overflow-hidden"
        style={{ width: "34vw", height: "19.125vw" }}
      >
        {/* Looping silent reel frame (image stand-in, animated for motion) */}
        <img
          src="/reel-hero.png"
          alt="Cinematic showreel still of a neon-lit street at night"
          className="absolute inset-0 h-full w-full scale-110 object-cover"
        />
        <div className="absolute inset-0 bg-background/20" />

        <div
          ref={labelRef}
          className="relative z-10 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-foreground"
        >
          <p>2025 Showreel</p>
        </div>

        {/* Corner technical readouts */}
        <div className="absolute left-4 top-4 z-10 font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/70">
          REC ●
        </div>
        <div className="absolute right-4 top-4 z-10 font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/70">
          16:9 / 24fps
        </div>
        <div className="absolute bottom-4 left-4 z-10 font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/70">
          BENDLIGHT
        </div>
      </div>
    </section>
  )
}
