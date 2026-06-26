"use client"

/* ===============================================================
   BENDLIGHT — Cinematic Multimedia Portfolio
   Single-page, scroll-driven film sequence.
   Sections: A Preloader+Hero · B Reel Expansion · C Capabilities
            · D Archive · E Climax/Footer
   =============================================================== */

import { useEffect, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { CursorProvider } from "@/components/cursor"
import { Preloader } from "@/components/preloader"
import { Hero } from "@/components/hero"
import { ReelExpansion } from "@/components/reel-expansion"
import { Capabilities } from "@/components/capabilities"
import { Archive } from "@/components/archive"
import { ClimaxFooter } from "@/components/climax-footer"
import { AudioVisualizer } from "@/components/audio-visualizer"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Page() {
  const [loaded, setLoaded] = useState(false)

  // Lock scroll while the preloader runs
  useEffect(() => {
    document.body.style.overflow = loaded ? "" : "hidden"
  }, [loaded])

  // Recalculate pinned triggers once the layout is revealed
  useEffect(() => {
    if (!loaded) return
    const t = setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => clearTimeout(t)
  }, [loaded])

  return (
    <CursorProvider>
      <div className="grain relative bg-background">
        <Preloader onComplete={() => setLoaded(true)} />

        {/* Fixed top nav */}
        <header className="fixed inset-x-0 top-0 z-[65] mix-blend-difference">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
            <a
              href="#top"
              className="font-display text-lg font-light tracking-tight text-foreground"
            >
              Bendlight<span className="align-super text-[10px]">®</span>
            </a>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-foreground md:block">
              Multimedia · Cinematography
            </span>
            <a
              href="mailto:hello@bendlight.studio"
              className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground"
            >
              Get in touch
            </a>
          </nav>
        </header>

        <main id="top">
          <Hero start={loaded} />
          <ReelExpansion />
          <Capabilities />
          <Archive />
          <ClimaxFooter />
        </main>

        <AudioVisualizer />
      </div>
    </CursorProvider>
  )
}
