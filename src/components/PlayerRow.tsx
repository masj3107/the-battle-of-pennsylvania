import Image from "next/image";
import { DualTeamBadge } from "@/components/DualTeamBadge";
import { formatTeamShortName } from "@/lib/rivalry-data";
import { Player } from "@/types/rivalry";

type PlayerRowProps = {
  player: Player;
  rank: number;
};

export function PlayerRow({ player, rank }: PlayerRowProps) {
  return (
    <div className="grid grid-cols-[56px_minmax(0,1.6fr)_repeat(6,minmax(64px,0.65fr))] items-center gap-3 rounded-[1.5rem] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/[0.07]">
      <div className="text-center font-display text-2xl text-white/90">{rank}</div>
      <div className="flex items-center gap-3">
        <div className="relative h-11 w-11 overflow-hidden rounded-full border border-white/10 bg-black/30">
          <Image src={player.headshot} alt={player.name} fill className="object-cover" sizes="44px" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-bone">{player.name}</p>
            {player.playedForBothTeams ? <DualTeamBadge /> : null}
          </div>
          <p className="text-xs uppercase tracking-[0.22em] text-steel">
            {formatTeamShortName(player.primaryTeamId)} / {player.position}
          </p>
        </div>
      </div>
      <div>{player.rivalryGames}</div>
      <div>{player.goalsVsRival}</div>
      <div>{player.assistsVsRival}</div>
      <div className="font-semibold text-bone">{player.pointsVsRival}</div>
      <div>{player.pointsPerGameVsRival.toFixed(2)}</div>
      <div>{player.playoffPointsVsRival}</div>
    </div>
  );
}
