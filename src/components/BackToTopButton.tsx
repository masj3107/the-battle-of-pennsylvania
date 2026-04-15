"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const Comp = reduceMotion ? "div" : motion.div;

  return (
    <Comp
      initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
      animate={reduceMotion ? undefined : { opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })}
        className={`rounded-full border border-white/10 bg-black/55 px-5 py-3 text-xs uppercase tracking-[0.28em] text-slate-100 backdrop-blur transition ${visible ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        Back To Top
      </button>
    </Comp>
  );
}
