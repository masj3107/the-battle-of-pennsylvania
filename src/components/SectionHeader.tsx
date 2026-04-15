import { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export function SectionHeader({ eyebrow, title, description, action }: SectionHeaderProps) {
  return (
    <Reveal className="mb-10 flex items-end justify-between gap-6">
      <div className="max-w-3xl">
        <p className="mb-3 text-xs uppercase tracking-[0.45em] text-steel">{eyebrow}</p>
        <h2 className="font-display text-4xl leading-tight text-bone md:text-5xl">{title}</h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">{description}</p>
      </div>
      {action}
    </Reveal>
  );
}
