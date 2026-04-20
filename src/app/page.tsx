import Image from "next/image";
import { BackToTopButton } from "@/components/BackToTopButton";
import { FightTapeSection } from "@/components/FightTapeSection";
import { FooterSources } from "@/components/FooterSources";
import { GoalieStatsPanel } from "@/components/GoalieStatsPanel";
import { Hero } from "@/components/Hero";
import { OddFactCard } from "@/components/OddFactCard";
import { PlayerLeaderboard } from "@/components/PlayerLeaderboard";
import { RecentMeetingCard } from "@/components/RecentMeetingCard";
import { Reveal } from "@/components/Reveal";
import { RivalrySnapshot } from "@/components/RivalrySnapshot";
import { SectionHeader } from "@/components/SectionHeader";
import { TimelineStoryBlock } from "@/components/TimelineStoryBlock";
import { rivalryData } from "@/data/mock-rivalry";
import { withBasePath } from "@/lib/assets";
import { formatTeamShortName } from "@/lib/rivalry-data";

export default function HomePage() {
  return (
    <main className="relative pb-24">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-28 px-6 py-6 md:px-10 lg:px-12">
        <Hero
          lastBloodTeamId={rivalryData.appState.lastBloodTeamId}
          latestMeeting={rivalryData.latestMeeting}
          nextGame={rivalryData.nextGame}
          rivalryHook={rivalryData.rivalryHook}
          playoffMode={rivalryData.appState.playoffMode}
          playoffBannerMessage={rivalryData.playoffBannerMessage ?? ""}
        />

        <section id="snapshot">
          <SectionHeader
            eyebrow="Current rivalry snapshot"
            title="The numbers still carry impact."
            description="An all-time read on the matchup: total meetings, total goals, playoff edges, and the side holding the most recent cut."
          />
          <RivalrySnapshot teams={rivalryData.teams} />
        </section>

        <section id="recent-meetings">
          <SectionHeader
            eyebrow="Recent meetings"
            title="Five most recent collisions."
            description="Only official meetings. Each card isolates the finish, the leverage point, and the player who bent the night."
          />
          <div className="grid gap-5 xl:grid-cols-2">
            {rivalryData.recentMeetings.map((meeting) => (
              <RecentMeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        </section>

        <section id="active-leaders">
          <SectionHeader
            eyebrow="Active player leaders vs rival"
            title="Production with memory attached."
            description="Active players ranked only by what they have done against the other side. Cross-state defectors are marked accordingly."
            action={
              <div className="max-w-sm rounded-[1.25rem] border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-xs leading-6 text-emerald-100">
                Official-live: current rivalry splits are aggregated from NHL schedule and stats endpoints.
                Archive-only fields still use limited fallback where official long-horizon coverage is not yet modeled.
              </div>
            }
          />
          <PlayerLeaderboard players={rivalryData.activePlayerLeaders} allowFilter title="Top 10 active rivalry scorers" />
        </section>

        <section id="all-time-leaders">
          <SectionHeader
            eyebrow="All-time player leaders"
            title="The archive keeps its own hierarchy."
            description="The biggest rivalry resumes are not season summaries. They are repeated proof under the same pressure."
          />
          <PlayerLeaderboard players={rivalryData.allTimePlayerLeaders} title="Top 10 all-time rivalry performers" />
        </section>

        <section id="goalies">
          <SectionHeader
            eyebrow="Goalie rivalry stats"
            title="Some nights were decided by refusal."
            description="Wins, save rate, goals against, shutouts, and the single-game save loads that changed the emotional reading of a game."
            action={
              <div className="max-w-sm rounded-[1.25rem] border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-xs leading-6 text-sky-100">
                Official-live: goalie rivalry lines are built from NHL game IDs plus NHL stats REST summaries.
                Historical rows without complete official coverage remain editorial fallback.
              </div>
            }
          />
          <GoalieStatsPanel goalies={rivalryData.goalieLeaders} />
        </section>

        <section id="crossovers">
          <SectionHeader
            eyebrow="Players who played for both teams"
            title="Crossing this line is never clean."
            description="This section stays compact on purpose. The taboo matters more than the list length. These players carry both histories into the same frame."
          />
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
            {rivalryData.crossoverPlayers.map((player, index) => (
              <Reveal key={player.id} delay={index * 0.06} className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
                <div className="relative h-56 overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/10 to-transparent">
                  <Image src={withBasePath(player.headshot)} alt={player.name} fill className="object-cover" sizes="280px" />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.28em] text-steel">{formatTeamShortName(player.primaryTeamId)}</p>
                <h3 className="mt-3 font-display text-3xl text-bone">{player.name}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {player.pointsVsRival} rivalry points, {player.rivalryGames} rivalry games, permanent suspicion from both directions.
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="fight-tape">
          <SectionHeader
            eyebrow="Fight tape"
            title="When the rivalry stopped pretending to be civil."
            description="Three clips that explain why this matchup still carries bruised memory. Not clean hockey. Not quiet hockey. Just Pennsylvania grievance with gloves on the ice."
            action={
              <div className="max-w-sm rounded-[1.25rem] border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-xs leading-6 text-amber-50">
                Embedded clips open inline. Each card also keeps a direct watch link if you want the full-screen version on YouTube.
              </div>
            }
          />
          <FightTapeSection fights={rivalryData.fightClips} />
        </section>

        <section id="odd-facts">
          <SectionHeader
            eyebrow="Legendary odd facts"
            title="Lore, outliers, and unstable nights."
            description="Some cards are stat-rooted. Some are historical. All are written to preserve the feeling of the matchup without taking sides."
          />
          <div className="grid gap-5 xl:grid-cols-2">
            {rivalryData.oddFacts.map((fact) => (
              <OddFactCard key={fact.id} fact={fact} />
            ))}
          </div>
        </section>

        <section id="timeline">
          <SectionHeader
            eyebrow="Rivalry timeline"
            title="A mini-documentary in vertical form."
            description="Built as a long scroll rather than a gallery. Era shifts, stars, playoff chaos, and the recurring certainty that the state line keeps the memory hot."
          />
          <div className="space-y-10">
            {rivalryData.timeline.map((event) => (
              <TimelineStoryBlock key={event.id} event={event} />
            ))}
          </div>
        </section>

        <section id="sources">
          <SectionHeader
            eyebrow="Transparency"
            title="What is official later, and mocked now."
            description="This MVP is structured for future NHL-backed recalculation, while keeping editorial notes visibly separated from official statistical intent."
          />
          <FooterSources />
        </section>
      </div>
      <BackToTopButton />
    </main>
  );
}
