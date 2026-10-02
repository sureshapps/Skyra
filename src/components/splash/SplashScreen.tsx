"use client";

import { useEffect, useState } from "react";
import { SPLASH_PATH } from "./splash-path";

const DRAW_MS = 2600;
const HOLD_MS = 300;
const FADE_MS = 500;

export function SplashScreen() {
  const [phase, setPhase] = useState<"draw" | "fade" | "done">("draw");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const drawMs = reduce ? 400 : DRAW_MS;
    const t1 = setTimeout(() => setPhase("fade"), drawMs + HOLD_MS);
    const t2 = setTimeout(() => setPhase("done"), drawMs + HOLD_MS + FADE_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      className="splash-root"
      data-phase={phase}
      style={{ ["--splash-draw" as string]: `${DRAW_MS}ms`, ["--splash-fade" as string]: `${FADE_MS}ms` }}
    >
      <svg
        className="splash-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1072 1072"
      >
        <path
          className="splash-stroke"
          pathLength={1}
          fill="none"
          stroke="#c0c0c0"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          d={SPLASH_PATH}
        />
      </svg>
      <style>{`
        .splash-root{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:#070b12;opacity:1;transition:opacity var(--splash-fade) ease;pointer-events:all}
        .splash-root[data-phase="fade"]{opacity:0;pointer-events:none}
        .splash-svg{width:min(70vw,340px);height:min(70vw,340px)}
        .splash-stroke{stroke-dasharray:1;stroke-dashoffset:1;animation:splash-draw var(--splash-draw) cubic-bezier(.45,.05,.35,1) .1s forwards}
        @keyframes splash-draw{to{stroke-dashoffset:0}}
        @media (prefers-reduced-motion:reduce){.splash-stroke{animation-duration:.4s}}
      `}</style>
    </div>
  );
}
