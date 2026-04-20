import { rivalryData } from "@/data/mock-rivalry";
import { Player, TeamId } from "@/types/rivalry";

export const teamsById = Object.fromEntries(rivalryData.teams.map((team) => [team.id, team])) as Record<TeamId, (typeof rivalryData.teams)[number]>;

export function getTeamName(teamId: TeamId) {
  return teamsById[teamId].name;
}

export function formatDisplayDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

export function formatDisplayDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function formatTeamShortName(teamId: TeamId) {
  return teamId === "flyers" ? "Philadelphia" : "Pittsburgh";
}

export function sortPlayersByRivalryPoints(players: Player[]) {
  return [...players].sort((a, b) => b.pointsVsRival - a.pointsVsRival || b.goalsVsRival - a.goalsVsRival);
}

export function getFilteredActivePlayers(filter: TeamId | "all") {
  const pool = rivalryData.activePlayerLeaders.filter((player) => player.activeStatus === "active-nhl");

  if (filter === "all") {
    return sortPlayersByRivalryPoints(pool);
  }

  return sortPlayersByRivalryPoints(pool.filter((player) => player.primaryTeamId === filter));
}

export function getAllTimePlayers() {
  return sortPlayersByRivalryPoints(rivalryData.allTimePlayerLeaders);
}

export function getRivalrySnapshot() {
  const [flyers, penguins] = rivalryData.teams;
  const totalMeetings = flyers.winsInRivalry + penguins.winsInRivalry;

  return {
    totalMeetings,
    lastMeetingWinner: rivalryData.latestMeeting.winnerTeamId,
    currentWinStreak:
      rivalryData.latestMeeting.winnerTeamId === "flyers"
        ? `${formatTeamShortName("flyers")} ${flyers.currentStreak}`
        : `${formatTeamShortName("penguins")} ${penguins.currentStreak}`
  };
}
