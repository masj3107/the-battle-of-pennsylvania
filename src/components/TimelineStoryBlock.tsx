import { Reveal } from "@/components/Reveal";
import { TimelineEvent } from "@/types/rivalry";

type TimelineStoryBlockProps = {
  event: TimelineEvent;
};

export function TimelineStoryBlock({ event }: TimelineStoryBlockProps) {
  const lineTone = event.teamLean === "flyers" ? "bg-ember" : event.teamLean === "penguins" ? "bg-gold" : "bg-white/30";

  return (
    <Reveal className="grid grid-cols-[90px_1fr] gap-6">
      <div className="relative">
        <div className={`absolute left-4 top-10 h-[calc(100%+2rem)] w-px ${lineTone}`} />
        <div className="sticky top-24">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 font-display text-xl text-bone">{event.year}</span>
        </div>
      </div>
      <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-steel">{event.type}</p>
        <h3 className="mt-4 font-display text-4xl text-bone">{event.title}</h3>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">{event.body}</p>
      </article>
    </Reveal>
  );
}
