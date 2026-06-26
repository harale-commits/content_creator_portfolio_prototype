"use client"

/* ---------------------------------------------------------------
   SECTION A — HERO
   - GSAP staggered character reveal (sliding up into masks)
   - Horizontal typography track moving inverse to scroll depth
   --------------------------------------------------------------- */

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const EASE = "cubic-bezier(0.76,0,0.24,1)"
const HEADLINE = ["WE DON'T CAPTURE", "REALITY. WE BEND IT."]

export function Hero({ start }: { start: boolean }) {
  const rootRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  // Character reveal once the preloader finishes
  useEffect(() => {
    if (!start || !rootRef.current) return
    const ctx = gsap.context(() => {
      const chars = rootRef.current!.querySelectorAll<HTMLElement>(".char")
      gsap.set(chars, { yPercent: 120 })
      gsap.to(chars, {
        yPercent: 0,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.025,
        delay: 0.15,
      })
      gsap.from(".hero-meta", {
        opacity: 0,
        y: 16,
        duration: 1,
        delay: 1,
        stagger: 0.1,
      })
    }, rootRef)
    return () => ctx.revert()
  }, [start])

  // Inverse-scrolling horizontal typography track
  useEffect(() => {
    if (!trackRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(trackRef.current, {
        xPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pb-10 pt-28"
    >
      {/* Inverse horizontal type track */}
      <div className="pointer-events-none absolute left-0 top-[14%] w-full select-none">
        <div
          ref={trackRef}
          className="whitespace-nowrap font-display text-[20vw] font-light leading-none text-foreground/[0.05]"
        >
          CINEMATOGRAPHY · MOTION · DESIGN · CINEMATOGRAPHY · MOTION · DESIGN ·
        </div>
      </div>

      {/* Headline */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6">
        <h1 className="font-display text-[12vw] font-light leading-[0.92] tracking-[-0.02em] text-foreground sm:text-[10vw] lg:text-[7.5vw]">
          {HEADLINE.map((line, li) => (
            <span key={li} className="line-mask">
              {Array.from(line).map((ch, ci) => (
                <span
                  key={ci}
                  className="char inline-block will-transform"
                  style={{ transition: `transform 1s ${EASE}` }}
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </span>
          ))}
        </h1>
      </div>

      {/* Meta row */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-2 gap-6 px-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:grid-cols-4">
        <p className="hero-meta">[ 01 ] Graphic Design</p>
        <p className="hero-meta">[ 02 ] Video Editing</p>
        <p className="hero-meta">[ 03 ] Motion Graphics</p>
        <p className="hero-meta text-right md:text-left">[ 04 ] Cinematography</p>
      </div>

      {/* Scroll indicator */}
      <div className="hero-meta absolute bottom-6 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <span className="inline-block animate-pulse">↓ Scroll to enter</span>
      </div>
    </section>
  )
}
