"use client"

/* ---------------------------------------------------------------
   SECTION E — CLIMAX / FOOTER (Conversion)
   Massive full-screen type. On hover the words invert against a
   slow-moving blurred gradient. Minimalist agency footer grid.
   --------------------------------------------------------------- */

import { useRef } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { useCursor } from "./cursor"

const WORDS = ["LET'S", "CREATE A", "MASTERPIECE."]
const SOCIALS = [
  { label: "Vimeo", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Behance", href: "#" },
  { label: "Instagram", href: "#" },
]

export function ClimaxFooter() {
  const { setVariant } = useCursor()
  const rootRef = useRef<HTMLElement>(null)

  return (
    <footer
      ref={rootRef}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-background"
    >
      {/* Slow-moving blurred gradient overlay (subtle, single accent) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-1/4 z-0 opacity-40 blur-[120px]"
        style={{
          background:
            "radial-gradient(40% 40% at 30% 40%, rgba(120,120,120,0.5), transparent), radial-gradient(40% 40% at 70% 60%, rgba(70,70,70,0.5), transparent)",
        }}
        animate={{ x: ["-6%", "6%", "-6%"], y: ["4%", "-4%", "4%"] }}
        transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      {/* Headline */}
      <div className="relative z-10 flex flex-1 items-center px-6">
        <h2 className="mx-auto w-full max-w-7xl font-display text-[15vw] font-light leading-[0.86] tracking-[-0.03em] text-foreground lg:text-[12vw]">
          {WORDS.map((w, i) => (
            <span key={i} className="line-mask">
              <motion.span
                className="group inline-block cursor-default"
                whileHover="hover"
                onMouseEnter={() => setVariant("hover")}
                onMouseLeave={() => setVariant("default")}
              >
                {Array.from(w).map((ch, ci) => (
                  <motion.span
                    key={ci}
                    className="inline-block"
                    variants={{
                      hover: { y: [0, -14, 0], color: "#888888" },
                    }}
                    transition={{ duration: 0.5, delay: ci * 0.02, ease: [0.76, 0, 0.24, 1] }}
                  >
                    {ch === " " ? "\u00A0" : ch}
                  </motion.span>
                ))}
              </motion.span>
            </span>
          ))}
        </h2>
      </div>

      {/* CTA email */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        <a
          href="mailto:hello@bendlight.studio"
          onMouseEnter={() => setVariant("view")}
          onMouseLeave={() => setVariant("default")}
          className="group inline-flex items-center gap-3 border-b border-foreground/30 pb-2 text-2xl font-light text-foreground transition-colors hover:border-foreground sm:text-3xl"
        >
          hello@bendlight.studio
          <ArrowUpRight className="h-6 w-6 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </a>
      </div>

      {/* Footer data grid */}
      <div className="relative z-10 mx-auto mt-16 grid w-full max-w-7xl grid-cols-2 gap-8 border-t border-border px-6 py-8 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:grid-cols-4">
        <div className="flex flex-col gap-2">
          <span className="text-foreground/50">Studio</span>
          <span>Bendlight</span>
          <span>Los Angeles · Remote</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-foreground/50">Connect</span>
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              onMouseEnter={() => setVariant("view")}
              onMouseLeave={() => setVariant("default")}
              className="w-fit text-muted-foreground transition-colors hover:text-foreground"
            >
              {s.label}
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-foreground/50">Suite</span>
          <span>Adobe Creative Cloud</span>
          <span>DaVinci · C4D</span>
        </div>
        <div className="flex flex-col gap-2 md:text-right">
          <span className="text-foreground/50">Index</span>
          <span>© {new Date().getFullYear()} Bendlight</span>
          <span>All Rights Reserved</span>
        </div>
      </div>
    </footer>
  )
}
