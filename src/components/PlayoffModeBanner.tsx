type PlayoffModeBannerProps = {
  active: boolean;
  message: string;
};

export function PlayoffModeBanner({ active, message }: PlayoffModeBannerProps) {
  if (!active) {
    return null;
  }

  return (
    <div className="rounded-full border border-rose-400/30 bg-rose-500/10 px-5 py-3 text-sm uppercase tracking-[0.24em] text-rose-100 shadow-[0_0_40px_rgba(244,63,94,0.15)]">
      Playoff Mode Live: {message}
    </div>
  );
}
