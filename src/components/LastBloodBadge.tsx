import { formatTeamShortName, teamsById } from "@/lib/rivalry-data";
import { TeamId } from "@/types/rivalry";

type LastBloodBadgeProps = {
  teamId: TeamId;
};

export function LastBloodBadge({ teamId }: LastBloodBadgeProps) {
  const team = teamsById[teamId];
  const accent = teamId === "flyers" ? "from-ember/30 to-emberSoft/10 text-emberSoft" : "from-gold/25 to-goldSoft/10 text-goldSoft";

  return (
    <div className={`inline-flex flex-col rounded-full border border-white/10 bg-gradient-to-r px-6 py-3 ${accent}`}>
      <span className="text-[10px] uppercase tracking-[0.4em] text-slate-300">Last Blood</span>
      <span className="mt-1 text-sm font-semibold uppercase tracking-[0.24em]">{formatTeamShortName(teamId)}</span>
    </div>
  );
}
