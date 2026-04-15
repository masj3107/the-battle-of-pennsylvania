import { Reveal } from "@/components/Reveal";
import { formatDisplayDate } from "@/lib/rivalry-data";
import { FightClip } from "@/types/rivalry";

type FightTapeSectionProps = {
  fights: FightClip[];
};

export function FightTapeSection({ fights }: FightTapeSectionProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      {fights.map((fight, index) => {
        const tone =
          fight.teamLean === "flyers"
            ? "border-ember/30 shadow-[0_30px_90px_rgba(243,107,33,0.12)]"
            : fight.teamLean === "penguins"
              ? "border-gold/30 shadow-[0_30px_90px_rgba(247,201,72,0.12)]"
              : "border-white/10 shadow-[0_30px_90px_rgba(255,255,255,0.06)]";

        return (
          <Reveal
            key={fight.id}
            delay={index * 0.08}
            className={`overflow-hidden rounded-[1.9rem] border ${tone} bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))]`}
          >
            <div className="border-b border-white/10 px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[11px] uppercase tracking-[0.34em] text-steel">{fight.eraLabel}</p>
                <p className="text-xs text-slate-400">{formatDisplayDate(fight.date)}</p>
              </div>
              <h3 className="mt-4 font-display text-3xl leading-tight text-bone">{fight.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{fight.summary}</p>
            </div>

            <div className="border-b border-white/10 bg-black/30 p-3">
              <div className="aspect-video overflow-hidden rounded-[1.25rem] border border-white/10 bg-black">
                <iframe
                  src={fight.embedUrl}
                  title={fight.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-steel">Main actors</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {fight.combatants.map((combatant) => (
                    <span
                      key={combatant}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-[0.12em] text-slate-200"
                    >
                      {combatant}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                <div className="text-xs text-slate-400">
                  <p>{fight.sourceLabel}</p>
                  <p className="mt-1">{fight.sourceDate}</p>
                </div>
                <a
                  href={fight.watchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-bone transition hover:border-white/30 hover:bg-white/10"
                >
                  Watch full clip
                </a>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
