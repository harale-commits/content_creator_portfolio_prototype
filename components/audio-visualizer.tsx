"use client"

/* ---------------------------------------------------------------
   AUDIO — minimalist wave visualizer toggle (Section C)
   Synthesises a low ambient soundscape + UI click ticks via the
   Web Audio API so no external media is required.
   --------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react"

export function AudioVisualizer() {
  const [on, setOn] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)
  const nodesRef = useRef<{ osc: OscillatorNode; gain: GainNode }[]>([])

  const ensureContext = () => {
    if (!ctxRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      ctxRef.current = new AC()
    }
    return ctxRef.current
  }

  const toggle = () => {
    const ctx = ensureContext()
    if (ctx.state === "suspended") ctx.resume()

    if (!on) {
      // Build a soft low ambient drone from two detuned oscillators
      const master = ctx.createGain()
      master.gain.value = 0
      master.connect(ctx.destination)
      master.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1.2)

      ;[55, 82.5].forEach((freq) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = "sine"
        osc.frequency.value = freq
        gain.gain.value = 0.5
        osc.connect(gain)
        gain.connect(master)
        osc.start()
        nodesRef.current.push({ osc, gain })
      })
      // store master for teardown via gain node trick
      nodesRef.current.push({
        osc: null as unknown as OscillatorNode,
        gain: master,
      })
    } else {
      const ctx2 = ctxRef.current
      if (ctx2) {
        nodesRef.current.forEach(({ osc, gain }) => {
          gain.gain.cancelScheduledValues(ctx2.currentTime)
          gain.gain.linearRampToValueAtTime(0, ctx2.currentTime + 0.4)
          if (osc) osc.stop(ctx2.currentTime + 0.5)
        })
        nodesRef.current = []
      }
    }
    setOn(!on)
  }

  useEffect(() => {
    return () => {
      nodesRef.current.forEach(({ osc }) => osc && osc.stop())
      ctxRef.current?.close()
    }
  }, [])

  return (
    <button
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Mute ambient sound" : "Play ambient sound"}
      className="fixed bottom-6 right-6 z-[80] flex items-center gap-3 rounded-full border border-border bg-background/60 px-4 py-3 font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
    >
      <span className="flex h-4 items-end gap-[2px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="w-[2px] bg-foreground"
            style={{
              height: on ? undefined : "3px",
              animation: on
                ? `eq 0.9s ease-in-out ${i * 0.12}s infinite alternate`
                : "none",
            }}
          />
        ))}
      </span>
      {on ? "Sound On" : "Sound Off"}
      <style jsx>{`
        @keyframes eq {
          0% {
            height: 3px;
          }
          100% {
            height: 16px;
          }
        }
      `}</style>
    </button>
  )
}
