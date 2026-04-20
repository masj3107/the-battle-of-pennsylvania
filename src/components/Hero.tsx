import Image from "next/image";
import { AudioToggle } from "@/components/AudioToggle";
import { LastBloodBadge } from "@/components/LastBloodBadge";
import { PlayoffModeBanner } from "@/components/PlayoffModeBanner";
import { Reveal } from "@/components/Reveal";
import { withBasePath } from "@/lib/assets";
import { formatDisplayDate, formatDisplayDateTime, formatTeamShortName, teamsById } from "@/lib/rivalry-data";
import { LatestMeeting, NextGame, TeamId } from "@/types/rivalry";

type HeroProps = {
  lastBloodTeamId: TeamId;
  latestMeeting: LatestMeeting;
  nextGame?: NextGame;
  rivalryHook: string;
  playoffMode: boolean;
  playoffBannerMessage: string;
};

export function Hero({ lastBloodTeamId, latestMeeting, nextGame, rivalryHook, playoffMode, playoffBannerMessage }: HeroProps) {
  const flyers = teamsById.flyers;
  const penguins = teamsById.penguins;
  const nextGameIsPlayoff = nextGame?.gameType === "playoffs";
  const playoffVisualMode = playoffMode || nextGameIsPlayoff;
  const nextGameLabel = nextGame?.startTimeUTC ? formatDisplayDateTime(nextGame.startTimeUTC) : formatDisplayDate(nextGame?.date ?? "");

  return (
    <section
      className={`relative overflow-hidden rounded-[2.5rem] border ${
        playoffVisualMode ? "border-rose-400/40 shadow-[0_0_120px_rgba(244,63,94,0.16)]" : "border-white/10"
      } px-10 pb-14 pt-8 md:px-14 md:pb-20 md:pt-10`}
    >
      <div
        className={`absolute inset-0 ${
          playoffVisualMode
            ? "bg-[radial-gradient(circle_at_50%_12%,rgba(255,255,255,0.18),transparent_24%),radial-gradient(circle_at_15%_24%,rgba(243,107,33,0.28),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(247,201,72,0.24),transparent_26%),radial-gradient(circle_at_50%_55%,rgba(244,63,94,0.16),transparent_35%),linear-gradient(180deg,#12070b_0%,#130912_38%,#090b10_100%)]"
            : "bg-hero-radial"
        }`}
      />
      <div className="absolute inset-0 bg-haze opacity-70" />
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${playoffVisualMode ? "via-rose-300/60" : "via-white/40"} to-transparent animate-pulseLine`} />
      <div className={`absolute left-[8%] top-20 h-56 w-56 rounded-full ${playoffVisualMode ? "bg-rose-500/15" : "bg-ember/10"} blur-3xl`} />
      <div className={`absolute right-[10%] top-16 h-56 w-56 rounded-full ${playoffVisualMode ? "bg-gold/15" : "bg-gold/10"} blur-3xl`} />
      {playoffVisualMode ? <div className="absolute inset-x-[12%] bottom-12 h-32 rounded-full bg-rose-500/10 blur-3xl" /> : null}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <PlayoffModeBanner active={playoffVisualMode} message={nextGameIsPlayoff ? nextGame?.seriesStatus ?? playoffBannerMessage : playoffBannerMessage} />
          <AudioToggle defaultEnabled={false} />
        </div>
        <div className="mt-16 grid items-end gap-12 xl:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div className="relative mb-10 overflow-hidden rounded-[1.9rem] border border-white/10 bg-black/30">
                <div className="relative aspect-[16/8.5]">
                  <Image
                    src={withBasePath("/images/hero/pennsylvania-line-brawl.jpg")}
                    alt="Flyers and Penguins players locked in a line brawl"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1280px) 48vw, 100vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.58))]" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-rose-100">Fight tape still</p>
                    <p className="mt-2 max-w-lg font-display text-3xl leading-tight text-bone">Pennsylvania line brawl</p>
                  </div>
                </div>
            </div>
            <p className={`text-sm uppercase tracking-[0.42em] ${playoffVisualMode ? "text-rose-200" : "text-steel"}`}>{playoffVisualMode ? "Rivalry maximized deluxe" : "A rivalry archive"}</p>
            <h1 className="mt-6 max-w-4xl font-display text-6xl leading-none text-bone md:text-8xl">The Battle of Pennsylvania</h1>
            <p className="mt-5 text-2xl italic text-slate-200">{playoffVisualMode ? "Playoff oxygen. Zero civility." : "No love lost."}</p>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">{rivalryHook}</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <LastBloodBadge teamId={lastBloodTeamId} />
              <div className="rounded-full border border-white/10 bg-black/25 px-5 py-3 text-sm text-slate-200">
                Latest meeting: {formatDisplayDate(latestMeeting.date)} / {latestMeeting.score}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className={`relative rounded-[2rem] border ${playoffVisualMode ? "border-rose-300/20 bg-black/35 shadow-[0_0_60px_rgba(244,63,94,0.08)]" : "border-white/10 bg-black/25"} p-8 backdrop-blur`}>
              <div className="absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-ember/70 via-white/30 to-gold/70" />
              <div className="grid grid-cols-[1fr_120px_1fr] items-center gap-6">
                <div className="relative h-44">
                  <Image src={withBasePath(flyers.logo)} alt={flyers.name} fill className="object-contain object-left drop-shadow-[0_0_30px_rgba(243,107,33,0.25)]" sizes="240px" />
                </div>
                <div className="text-center">
                  <p className="font-display text-6xl text-bone">VS</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-400">State line pressure</p>
                </div>
                <div className="relative h-44">
                  <Image src={withBasePath(penguins.logo)} alt={penguins.name} fill className="object-contain object-right drop-shadow-[0_0_30px_rgba(247,201,72,0.20)]" sizes="240px" />
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
              {nextGame ? (
                <div className={`mt-5 rounded-[1.5rem] border p-5 ${nextGameIsPlayoff ? "border-rose-300/30 bg-rose-500/10" : "border-amber-200/20 bg-amber-200/10"}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className={`text-xs uppercase tracking-[0.28em] ${nextGameIsPlayoff ? "text-rose-100" : "text-amber-50"}`}>
                      {nextGameIsPlayoff ? "Next playoff strike" : "Next game"}
                    </p>
                    {nextGame.seriesStatus ? (
                      <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.26em] ${nextGameIsPlayoff ? "bg-rose-200/15 text-rose-100" : "bg-black/25 text-slate-200"}`}>
                        {nextGame.seriesStatus}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-3 font-display text-3xl text-bone">
                    {formatTeamShortName(nextGame.awayTeamId)} at {formatTeamShortName(nextGame.homeTeamId)}
                  </h3>
                  <p className="mt-2 text-sm uppercase tracking-[0.22em] text-slate-200">{nextGameLabel}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-200">
                    {nextGame.location}. {nextGame.hypeNote ?? (nextGameIsPlayoff ? "The rivalry has crossed into elimination-weather theater." : "The state line is loading the next collision.")}
                  </p>
                  {nextGame.gameCenterUrl ? (
                    <a
                      href={nextGame.gameCenterUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`mt-5 inline-flex rounded-full border px-4 py-2 text-xs uppercase tracking-[0.26em] transition ${
                        nextGameIsPlayoff
                          ? "border-rose-200/25 bg-rose-200/10 text-rose-50 hover:border-rose-100/50 hover:bg-rose-200/20"
                          : "border-white/10 bg-black/35 text-slate-100 hover:border-white/25 hover:bg-white/10"
                      }`}
                    >
                      Track Next Game
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
