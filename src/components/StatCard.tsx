import { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string | number;
  accent?: "flyers" | "penguins" | "neutral";
  detail?: string;
  children?: ReactNode;
};

const accentStyles = {
  flyers: "border-ember/40 shadow-glow",
  penguins: "border-gold/40 shadow-goldGlow",
  neutral: "border-white/10"
};

export function StatCard({ label, value, accent = "neutral", detail, children }: StatCardProps) {
  return (
    <div className={`rounded-[1.75rem] border bg-white/5 p-6 backdrop-blur ${accentStyles[accent]}`}>
      <p className="text-xs uppercase tracking-[0.35em] text-steel">{label}</p>
      <p className="mt-4 font-display text-4xl text-bone">{value}</p>
      {detail ? <p className="mt-2 text-sm text-slate-300">{detail}</p> : null}
      {children}
    </div>
  );
}
