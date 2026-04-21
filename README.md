# The Battle of Pennsylvania

A static-export-friendly Next.js MVP for a cinematic Flyers vs Penguins rivalry archive.

## Stack

- Next.js
- React
- Tailwind CSS
- Framer Motion

## Run locally

```bash
npm install
npm run dev
```

## Build for static export

```bash
npm run build
```

The static output is generated into `out/` because `next.config.mjs` uses `output: "export"`.

## GitHub Pages notes

Set `NEXT_PUBLIC_BASE_PATH` when publishing under a repository path.

Example:

```bash
NEXT_PUBLIC_BASE_PATH=/the-battle-of-pennsylvania npm run build
```

## Mock data and future NHL integration

The app reads generated content from `src/data/rivalry.generated.json`.

The editable mock source for the precompute pipeline lives in `src/data/mock-source.json`.
Verified non-current active player IDs live in `src/data/verified-player-registry.json`.

Generate it manually with:

```bash
npm run data:build
```

An automated GitHub Actions workflow also refreshes `src/data/rivalry.generated.json` on a daily schedule and deploys GitHub Pages whenever the generated data changes.

To swap in NHL-backed data later:

1. Replace the mock adapter inside `scripts/generate-rivalry-data.mjs` with an NHL API ingestion step.
2. Continue writing the exact same `RivalryData` shape into `src/data/rivalry.generated.json`.
3. Recalculate `lastBloodTeamId`, playoff mode, recent meetings, and leaderboard slices during the precompute step.
4. Keep editorial odd facts separate from official data so transparency remains explicit.

## Official data sources in use

- `api-web.nhle.com/v1` for schedules, rosters, gamecenter links, and official SVG team marks
- `api.nhle.com/stats/rest/en` for rivalry-only skater and goalie split aggregation over official rivalry game IDs

The generator currently uses official historical aggregation for the active-player and goalie rivalry sections, while longer-horizon archive sections still retain mock/editorial fallback where official coverage is incomplete or intentionally not yet modeled.

## Assets

- Team marks are local development placeholders and should be replaced with licensed official assets when available.
- Player portraits are local editorial placeholders and should be replaced with licensed assets when available.
- Audio is wired for a future royalty-free track but remains muted by default.
