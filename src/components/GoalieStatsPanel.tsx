import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { Goalie } from "@/types/rivalry";
import { formatTeamShortName } from "@/lib/rivalry-data";

type GoalieStatsPanelProps = {
  goalies: Goalie[];
};

export function GoalieStatsPanel({ goalies }: GoalieStatsPanelProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {goalies.map((goalie, index) => (
        <Reveal key={goalie.id} delay={index * 0.05} className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-center gap-4">
            {goalie.headshot ? (
              <div className="relative h-16 w-16 overflow-hidden rounded-full border border-white/10 bg-black/30">
                <Image src={goalie.headshot} alt={goalie.name} fill className="object-cover" sizes="64px" />
              </div>
            ) : null}
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-steel">{formatTeamShortName(goalie.teamId)}</p>
              <h3 className="mt-2 font-display text-3xl text-bone">{goalie.name}</h3>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-300">
            <div><span className="block text-xs uppercase tracking-[0.2em] text-steel">Wins</span>{goalie.winsVsRival}</div>
            <div><span className="block text-xs uppercase tracking-[0.2em] text-steel">SV%</span>{goalie.savePctVsRival.toFixed(3)}</div>
            <div><span className="block text-xs uppercase tracking-[0.2em] text-steel">GAA</span>{goalie.gaaVsRival.toFixed(2)}</div>
            <div><span className="block text-xs uppercase tracking-[0.2em] text-steel">Shutouts</span>{goalie.shutoutsVsRival}</div>
            <div className="col-span-2"><span className="block text-xs uppercase tracking-[0.2em] text-steel">Most Saves In One Game</span>{goalie.mostSavesSingleGameVsRival}</div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
