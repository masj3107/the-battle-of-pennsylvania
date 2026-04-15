"use client";

import { useEffect, useRef, useState } from "react";

type AudioToggleProps = {
  defaultEnabled?: boolean;
};

const AUDIO_SOURCE = "/audio/cinematic-western-placeholder.mp3";

export function AudioToggle({ defaultEnabled = false }: AudioToggleProps) {
  const [enabled, setEnabled] = useState(defaultEnabled);
  const [available, setAvailable] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(AUDIO_SOURCE);
    audio.loop = true;
    audio.volume = 0.22;
    audioRef.current = audio;

    const handleError = () => setAvailable(false);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.removeEventListener("error", handleError);
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current || !available) {
      return;
    }

    if (enabled) {
      void audioRef.current.play().catch(() => setEnabled(false));
    } else {
      audioRef.current.pause();
    }
  }, [enabled, available]);

  return (
    <button
      type="button"
      onClick={() => setEnabled((value) => !value)}
      className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-200 transition hover:border-white/25 hover:bg-white/10"
      aria-pressed={enabled}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${enabled ? "bg-emerald-400" : "bg-slate-500"}`} />
      {enabled ? "Audio On" : "Audio Off"}
      <span className="text-[10px] tracking-[0.24em] text-slate-400">{available ? "Muted By Default" : "Placeholder Track Missing"}</span>
    </button>
  );
}
