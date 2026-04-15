import { Reveal } from "@/components/Reveal";
import { formatDisplayDate, formatTeamShortName } from "@/lib/rivalry-data";
import { RecentMeeting } from "@/types/rivalry";

type RecentMeetingCardProps = {
  meeting: RecentMeeting;
};

export function RecentMeetingCard({ meeting }: RecentMeetingCardProps) {
  const homeShort = formatTeamShortName(meeting.homeTeamId);
  const awayShort = formatTeamShortName(meeting.awayTeamId);
  const winnerShort = formatTeamShortName(meeting.winnerTeamId);

  return (
    <Reveal className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-steel">{formatDisplayDate(meeting.date)}</p>
          <h3 className="mt-3 font-display text-3xl text-bone">
            {awayShort} {meeting.awayScore} - {meeting.homeScore} {homeShort}
          </h3>
          <p className="mt-2 text-sm text-slate-300">{meeting.location}</p>
        </div>
        <div className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-200">
          {winnerShort} won {meeting.overtimeType !== "REG" ? `in ${meeting.overtimeType}` : "in regulation"}
        </div>
      </div>
      <div className="mt-6 grid gap-3 text-sm text-slate-300">
        {meeting.topPerformers.map((performer) => (
          <div key={performer.name} className="flex items-center justify-between rounded-2xl bg-black/25 px-4 py-3">
            <span>{performer.name}</span>
            <span className="text-slate-100">{performer.statLine}</span>
          </div>
        ))}
      </div>
      <p className="mt-5 border-l border-white/15 pl-4 text-sm leading-7 text-slate-300">{meeting.notableMoment}</p>
    </Reveal>
  );
}
