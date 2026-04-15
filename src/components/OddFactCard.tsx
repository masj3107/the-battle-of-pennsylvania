import { Reveal } from "@/components/Reveal";
import { OddFact } from "@/types/rivalry";

type OddFactCardProps = {
  fact: OddFact;
};

export function OddFactCard({ fact }: OddFactCardProps) {
  const tone = fact.teamBias === "flyers" ? "border-ember/25" : fact.teamBias === "penguins" ? "border-gold/25" : "border-white/10";

  return (
    <Reveal className={`rounded-[1.75rem] border ${tone} bg-white/[0.04] p-6`}>
      <p className="text-xs uppercase tracking-[0.26em] text-steel">{fact.sourceLabel}</p>
      <h3 className="mt-4 font-display text-3xl text-bone">{fact.title}</h3>
      <p className="mt-4 text-sm leading-7 text-slate-300">{fact.factText}</p>
      <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-xs text-slate-400">
        <p>{fact.sourceDate}</p>
        {fact.editorialNote ? <p>{fact.editorialNote}</p> : null}
      </div>
    </Reveal>
  );
}
