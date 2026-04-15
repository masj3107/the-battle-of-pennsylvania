export function FooterSources() {
  return (
    <footer className="rounded-[2rem] border border-white/10 bg-black/30 p-8 text-sm leading-7 text-slate-300">
      <h2 className="font-display text-3xl text-bone">Sources, Data Notes, Transparency</h2>
      <div className="mt-6 space-y-3">
        <p>Official rivalry stats are intended to come from NHL data in a later build pipeline.</p>
        <p>This MVP currently uses local mock data and editorial placeholder assets to prove the product structure.</p>
        <p>Local team marks and player portraits are development assets and can be swapped for licensed official files without changing the component layer.</p>
        <p>Odd facts and documentary notes are curated editorial blocks and may not reflect live updates.</p>
        <p>Future integration should precompute static JSON for GitHub Pages, recalculate Last Blood automatically, and only enable playoff mode for a current Flyers-Penguins postseason series.</p>
      </div>
    </footer>
  );
}
