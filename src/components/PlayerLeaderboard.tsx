"use client";

import { useMemo, useState } from "react";
import { PlayerRow } from "@/components/PlayerRow";
import { Reveal } from "@/components/Reveal";
import { Player, TeamId } from "@/types/rivalry";

type PlayerLeaderboardProps = {
  players: Player[];
  allowFilter?: boolean;
  title: string;
};

const filters: Array<{ label: string; value: TeamId | "all" }> = [
  { label: "All Active", value: "all" },
  { label: "Flyers", value: "flyers" },
  { label: "Penguins", value: "penguins" }
];

export function PlayerLeaderboard({ players, allowFilter = false, title }: PlayerLeaderboardProps) {
  const [filter, setFilter] = useState<TeamId | "all">("all");

  const rows = useMemo(() => {
    const pool = !allowFilter || filter === "all" ? players : players.filter((player) => player.primaryTeamId === filter);
    return [...pool].sort((a, b) => b.pointsVsRival - a.pointsVsRival || b.goalsVsRival - a.goalsVsRival);
  }, [allowFilter, filter, players]);

  return (
    <Reveal className="rounded-[2rem] border border-white/10 bg-black/30 p-6 backdrop-blur">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-3xl text-bone">{title}</h3>
          <p className="mt-2 text-sm text-slate-300">Production only against the rival, not full-season totals.</p>
        </div>
        {allowFilter ? (
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.26em] transition ${filter === item.value ? "bg-white text-ink" : "text-slate-300 hover:text-bone"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="mb-3 grid grid-cols-[56px_minmax(0,1.6fr)_repeat(6,minmax(64px,0.65fr))] gap-3 px-4 text-[11px] uppercase tracking-[0.24em] text-steel">
        <div>Rank</div>
        <div>Player</div>
        <div>GP</div>
        <div>G</div>
        <div>A</div>
        <div>PTS</div>
        <div>P/GP</div>
        <div>PO PTS</div>
      </div>
      <div className="space-y-3">
        {rows.map((player, index) => (
          <PlayerRow key={player.id} player={player} rank={index + 1} />
        ))}
      </div>
    </Reveal>
  );
}
