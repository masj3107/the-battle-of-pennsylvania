import { Reveal } from "@/components/Reveal";
import { StatCard } from "@/components/StatCard";
import { getRivalrySnapshot } from "@/lib/rivalry-data";
import { TeamSummary } from "@/types/rivalry";

type RivalrySnapshotProps = {
  teams: TeamSummary[];
};

export function RivalrySnapshot({ teams }: RivalrySnapshotProps) {
  const snapshot = getRivalrySnapshot();
  const [flyers, penguins] = teams;

  return (
    <Reveal className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard label="All-time official meetings" value={snapshot.totalMeetings} detail="Regular season and playoff clashes combined." />
      <StatCard label="Flyers edge" value={`${flyers.winsInRivalry} wins`} accent="flyers" detail={`${flyers.goalsInRivalry} rivalry goals`} />
      <StatCard label="Penguins edge" value={`${penguins.winsInRivalry} wins`} accent="penguins" detail={`${penguins.goalsInRivalry} rivalry goals`} />
      <StatCard label="Pressure points" value={snapshot.currentWinStreak} detail={`Playoff series wins: PHI ${flyers.playoffSeriesWins} / PIT ${penguins.playoffSeriesWins}. Last meeting winner: ${snapshot.lastMeetingWinner}.`} />
    </Reveal>
  );
}
