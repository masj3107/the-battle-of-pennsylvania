"use client";

import Image from "next/image";
import { useState } from "react";

type FightTapeVideoProps = {
  title: string;
  embedUrl: string;
  watchUrl: string;
};

function getYouTubeVideoId(url: string) {
  const match = url.match(/\/embed\/([^?]+)/);
  return match?.[1] ?? null;
}

export function FightTapeVideo({ title, embedUrl, watchUrl }: FightTapeVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoId = getYouTubeVideoId(embedUrl);
  const thumbnailUrl = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;
  const canInlineEmbed = Boolean(videoId && embedUrl);

  if (isLoaded && canInlineEmbed) {
    return (
      <iframe
        src={embedUrl}
        title={title}
        className="h-full w-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  return (
    <div className="relative h-full w-full">
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={`${title} video thumbnail`}
          fill
          className="object-cover"
          sizes="(min-width: 1280px) 30vw, 100vw"
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(243,107,33,0.35),transparent_55%),linear-gradient(180deg,#151821,#050608)]" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-steel">Fight tape preview</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-100">
            Load the YouTube player only when you want to watch the clip.
          </p>
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          {canInlineEmbed ? (
            <button
              type="button"
              onClick={() => setIsLoaded(true)}
              className="rounded-full border border-white/20 bg-bone px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-obsidian transition hover:bg-white"
            >
              Load clip
            </button>
          ) : null}
          <a
            href={watchUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/20 bg-black/35 px-4 py-2 text-xs uppercase tracking-[0.22em] text-bone transition hover:border-white/35 hover:bg-black/50"
          >
            {canInlineEmbed ? "Open on YouTube" : "Open short clip"}
          </a>
        </div>
      </div>
    </div>
  );
}
