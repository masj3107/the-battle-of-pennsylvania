export type TeamId = "flyers" | "penguins";
export type OvertimeType = "REG" | "OT" | "SO";

export type TeamSummary = {
  id: TeamId;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  logo: string;
  winsInRivalry: number;
  goalsInRivalry: number;
  playoffSeriesWins: number;
  currentStreak: string;
};

export type Performer = {
  name: string;
  statLine: string;
};

export type LatestMeeting = {
  date: string;
  winnerTeamId: TeamId;
  homeTeamId: TeamId;
  awayTeamId: TeamId;
  score: string;
  overtimeType: OvertimeType;
  location: string;
  gameCenterUrl?: string;
  topPerformers: Performer[];
  notableMoment: string;
};

export type NextGame = {
  id: string;
  date: string;
  startTimeUTC?: string;
  homeTeamId: TeamId;
  awayTeamId: TeamId;
  location: string;
  gameCenterUrl?: string;
  gameType: "regular-season" | "playoffs";
  seriesStatus?: string;
  hypeNote?: string;
};

export type RecentMeeting = {
  id: string;
  date: string;
  homeTeamId: TeamId;
  awayTeamId: TeamId;
  homeScore: number;
  awayScore: number;
  winnerTeamId: TeamId;
  overtimeType: OvertimeType;
  location: string;
  gameCenterUrl?: string;
  topPerformers: Performer[];
  notableMoment: string;
};

export type ActiveStatus = "active-nhl" | "inactive";
export type CurrentRosterStatus = "current-roster" | "not-on-current-roster";
export type PlayerPosition = "C" | "LW" | "RW" | "D";

export type Player = {
  id: string;
  name: string;
  nhlPlayerId?: number;
  primaryTeamId: TeamId;
  activeStatus: ActiveStatus;
  currentRosterStatus: CurrentRosterStatus;
  playedForBothTeams: boolean;
  position: PlayerPosition;
  headshot: string;
  rivalryGames: number;
  goalsVsRival: number;
  assistsVsRival: number;
  pointsVsRival: number;
  pointsPerGameVsRival: number;
  gameWinningGoalsVsRival: number;
  hitsVsRival: number;
  penaltyMinutesVsRival: number;
  otGoalsVsRival: number;
  playoffGoalsVsRival: number;
  playoffPointsVsRival: number;
};

export type Goalie = {
  id: string;
  name: string;
  nhlPlayerId?: number;
  teamId: TeamId;
  activeStatus: ActiveStatus;
  playedForBothTeams: boolean;
  headshot?: string;
  rivalryGames: number;
  winsVsRival: number;
  savePctVsRival: number;
  gaaVsRival: number;
  shutoutsVsRival: number;
  mostSavesSingleGameVsRival: number;
};

export type OddFact = {
  id: string;
  title: string;
  factText: string;
  teamBias: TeamId | "neutral";
  sourceLabel: string;
  sourceDate: string;
  sourceUrl: string;
  editorialNote?: string;
};

export type FightClip = {
  id: string;
  title: string;
  date: string;
  eraLabel: string;
  summary: string;
  teamLean: TeamId | "neutral";
  combatants: string[];
  embedUrl: string;
  watchUrl: string;
  sourceLabel: string;
  sourceDate: string;
};

export type TimelineEvent = {
  id: string;
  year: string;
  title: string;
  body: string;
  image?: string;
  imageAlt?: string;
  type: "game" | "player" | "playoff" | "controversy" | "era";
  teamLean: TeamId | "neutral";
};

export type AppState = {
  playoffMode: boolean;
  lastBloodTeamId: TeamId;
  audioEnabled: boolean;
};

export type RivalryData = {
  appState: AppState;
  rivalryHook: string;
  playoffBannerMessage?: string;
  teams: TeamSummary[];
  latestMeeting: LatestMeeting;
  nextGame?: NextGame;
  recentMeetings: RecentMeeting[];
  activePlayerLeaders: Player[];
  allTimePlayerLeaders: Player[];
  goalieLeaders: Goalie[];
  crossoverPlayers: Player[];
  fightClips: FightClip[];
  oddFacts: OddFact[];
  timeline: TimelineEvent[];
};
