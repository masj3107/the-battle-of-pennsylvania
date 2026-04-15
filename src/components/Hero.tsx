import Image from "next/image";
import { AudioToggle } from "@/components/AudioToggle";
import { LastBloodBadge } from "@/components/LastBloodBadge";
import { PlayoffModeBanner } from "@/components/PlayoffModeBanner";
import { Reveal } from "@/components/Reveal";
import { formatDisplayDate, formatTeamShortName, teamsById } from "@/lib/rivalry-data";
import { LatestMeeting, TeamId } from "@/types/rivalry";

type HeroProps = {
  lastBloodTeamId: TeamId;
  latestMeeting: LatestMeeting;
  rivalryHook: string;
  playoffMode: boolean;
  playoffBannerMessage: string;
};

export function Hero({ lastBloodTeamId, latestMeeting, rivalryHook, playoffMode, playoffBannerMessage }: HeroProps) {
  const flyers = teamsById.flyers;
  const penguins = teamsById.penguins;

  return (
    <section className={`relative overflow-hidden rounded-[2.5rem] border ${playoffMode ? "border-rose-400/30 shadow-[0_0_80px_rgba(244,63,94,0.08)]" : "border-white/10"} bg-hero-radial px-10 pb-14 pt-8 md:px-14 md:pb-20 md:pt-10`}>
      <div className="absolute inset-0 bg-haze opacity-70" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulseLine" />
      <div className="absolute left-[8%] top-20 h-56 w-56 rounded-full bg-ember/10 blur-3xl" />
      <div className="absolute right-[10%] top-16 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <PlayoffModeBanner active={playoffMode} message={playoffBannerMessage} />
          <AudioToggle defaultEnabled={false} />
        </div>
        <div className="mt-16 grid items-end gap-12 xl:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.42em] text-steel">A rivalry archive</p>
            <h1 className="mt-6 max-w-4xl font-display text-6xl leading-none text-bone md:text-8xl">The Battle of Pennsylvania</h1>
            <p className="mt-5 text-2xl italic text-slate-200">No love lost.</p>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">{rivalryHook}</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <LastBloodBadge teamId={lastBloodTeamId} />
              <div className="rounded-full border border-white/10 bg-black/25 px-5 py-3 text-sm text-slate-200">
                Latest meeting: {formatDisplayDate(latestMeeting.date)} / {latestMeeting.score}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="relative rounded-[2rem] border border-white/10 bg-black/25 p-8 backdrop-blur">
              <div className="absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-ember/70 via-white/30 to-gold/70" />
              <div className="grid grid-cols-[1fr_120px_1fr] items-center gap-6">
                <div className="relative h-44">
                  <Image src={flyers.logo} alt={flyers.name} fill className="object-contain object-left drop-shadow-[0_0_30px_rgba(243,107,33,0.25)]" sizes="240px" />
                </div>
                <div className="text-center">
                  <p className="font-display text-6xl text-bone">VS</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-400">State line pressure</p>
                </div>
                <div className="relative h-44">
                  <Image src={penguins.logo} alt={penguins.name} fill className="object-contain object-right drop-shadow-[0_0_30px_rgba(247,201,72,0.20)]" sizes="240px" />
                </div>
              </div>
              <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-steel">Latest meeting</p>
                <h2 className="mt-3 font-display text-4xl text-bone">
                  {formatTeamShortName(latestMeeting.awayTeamId)} {latestMeeting.score} {formatTeamShortName(latestMeeting.homeTeamId)}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">{latestMeeting.location}. {latestMeeting.notableMoment}</p>
                {latestMeeting.gameCenterUrl ? (
                  <a
                    href={latestMeeting.gameCenterUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs uppercase tracking-[0.26em] text-slate-100 transition hover:border-white/25 hover:bg-white/10"
                  >
                    Open On NHL.com
                  </a>
                ) : null}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
