import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const args = process.argv.slice(2);
const sourceArg = args.find((arg) => arg.startsWith("--source="));
const source = sourceArg?.split("=")[1] ?? "auto";

const root = process.cwd();
const sourceFile = path.join(root, "src", "data", "mock-source.json");
const registryFile = path.join(root, "src", "data", "verified-player-registry.json");
const outputFile = path.join(root, "src", "data", "rivalry.generated.json");
const teamsDir = path.join(root, "public", "images", "teams");
const TODAY = new Date();
const TEAM_IDS = ["PHI", "PIT"];
const OFFICIAL_HISTORY_START_YEAR = 2005;
const NHL_TEAM_META = {
  flyers: {
    abbrev: "PHI",
    lightLogo: "https://assets.nhle.com/logos/nhl/svg/PHI_light.svg",
    localLogo: "/images/teams/flyers-official.svg"
  },
  penguins: {
    abbrev: "PIT",
    lightLogo: "https://assets.nhle.com/logos/nhl/svg/PIT_light.svg",
    localLogo: "/images/teams/penguins-official.svg"
  }
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, payload) {
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function buildFromMock() {
  const data = readJson(sourceFile);

  return data;
}

function getSeasonForDate(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  return month >= 7 ? Number(`${year}${year + 1}`) : Number(`${year - 1}${year}`);
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "the-battle-of-pennsylvania-mvp"
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "the-battle-of-pennsylvania-mvp"
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return response.text();
}

function mapAbbrevToTeamId(abbrev) {
  return abbrev === "PHI" ? "flyers" : "penguins";
}

function toOvertimeType(lastPeriodType) {
  if (lastPeriodType === "OT") return "OT";
  if (lastPeriodType === "SO") return "SO";
  return "REG";
}

function isFinalGame(game) {
  return game.gameScheduleState === "OK" && ["OFF", "FINAL"].includes(game.gameState);
}

function isFlyersPenguinsGame(game) {
  return TEAM_IDS.includes(game.homeTeam?.abbrev) && TEAM_IDS.includes(game.awayTeam?.abbrev);
}

function formatPlayerName(player) {
  return `${player.firstName.default} ${player.lastName.default}`;
}

function toUiPosition(positionCode) {
  if (positionCode === "L") return "LW";
  if (positionCode === "R") return "RW";
  return positionCode;
}

async function downloadOfficialTeamLogos() {
  fs.mkdirSync(teamsDir, { recursive: true });

  await Promise.all(
    Object.entries(NHL_TEAM_META).map(async ([teamId, meta]) => {
      const svg = await fetchText(meta.lightLogo);
      const filename = teamId === "flyers" ? "flyers-official.svg" : "penguins-official.svg";
      fs.writeFileSync(path.join(teamsDir, filename), svg, "utf8");
    })
  );
}

async function fetchSeasonSchedule(season) {
  const data = await fetchJson(`https://api-web.nhle.com/v1/club-schedule-season/PHI/${season}`);
  return data.games.filter(isFlyersPenguinsGame);
}

async function fetchSeasonScheduleSafe(season) {
  try {
    return await fetchSeasonSchedule(season);
  } catch {
    return [];
  }
}

async function fetchGameBoxscore(gameId) {
  return fetchJson(`https://api-web.nhle.com/v1/gamecenter/${gameId}/boxscore`);
}

async function fetchStatsRows(endpoint, gameIds, sortProperty) {
  if (!gameIds.length) {
    return [];
  }

  const query = encodeURIComponent(`gameId in (${gameIds.join(",")})`);
  const sort = encodeURIComponent(JSON.stringify([{ property: sortProperty, direction: "DESC" }]));
  const url = `https://api.nhle.com/stats/rest/en/${endpoint}?isAggregate=false&isGame=true&start=0&limit=5000&sort=${sort}&cayenneExp=${query}`;
  const data = await fetchJson(url);
  return data.data ?? [];
}

function deriveMeetingNote(game, boxscore) {
  const winner = game.winningGoalScorer;
  const goalie = game.winningGoalie;
  const overtimeType = toOvertimeType(game.gameOutcome?.lastPeriodType);

  if (winner && overtimeType !== "REG") {
    return `${winner.firstInitial.default} ${winner.lastName.default} settled it in ${overtimeType}.`;
  }

  if (winner && goalie) {
    return `${winner.firstInitial.default} ${winner.lastName.default} supplied the winner behind ${goalie.firstInitial.default} ${goalie.lastName.default}.`;
  }

  if (boxscore?.summary?.gameInfo?.attendance) {
    return `Attendance: ${boxscore.summary.gameInfo.attendance}.`;
  }

  return "Official NHL schedule result.";
}

function getTopPerformers(boxscore, winnerAbbrev) {
  const side = boxscore.awayTeam.abbrev === winnerAbbrev ? "awayTeam" : "homeTeam";
  const skaters = [
    ...(boxscore.playerByGameStats?.[side]?.forwards ?? []),
    ...(boxscore.playerByGameStats?.[side]?.defense ?? [])
  ];

  const rankedSkaters = skaters
    .map((player) => ({
      name: player.name.default,
      statLine:
        player.goals > 0 || player.assists > 0
          ? `${player.goals} G, ${player.assists} A`
          : `${player.sog} shots, ${player.hits} hits`,
      score: player.points * 100 + player.goals * 10 + player.sog + player.hits
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(({ name, statLine }) => ({ name, statLine }));

  const goalie = boxscore.playerByGameStats?.[side]?.goalies?.[0];
  if (goalie && rankedSkaters.length < 2) {
    rankedSkaters.push({
      name: goalie.name.default,
      statLine: `${goalie.saves} saves`
    });
  }

  return rankedSkaters;
}

function fallbackHeadshotFromId(nhlPlayerId) {
  return nhlPlayerId ? `https://assets.nhle.com/mugs/nhl/latest/${nhlPlayerId}.png` : undefined;
}

function mergeRegistryData(basePlayers, registryEntries) {
  const registryByName = new Map(registryEntries.map((entry) => [entry.name, entry]));

  return basePlayers.map((player) => {
    const registryMatch = registryByName.get(player.name);
    if (!registryMatch) {
      return player;
    }

    return {
      ...player,
      nhlPlayerId: player.nhlPlayerId ?? registryMatch.nhlPlayerId,
      activeStatus: registryMatch.activeStatus ?? player.activeStatus,
      currentRosterStatus: registryMatch.currentRosterStatus ?? player.currentRosterStatus,
      headshot: fallbackHeadshotFromId(player.nhlPlayerId ?? registryMatch.nhlPlayerId) ?? player.headshot
    };
  });
}

function mergeRosterData(basePlayers, rosters) {
  const rosterEntries = [...rosters.flyers, ...rosters.penguins];
  const rosterById = new Map(rosterEntries.map((player) => [player.nhlPlayerId, player]));
  const rosterByName = new Map(rosterEntries.map((player) => [player.name, player]));

  return basePlayers.map((player) => {
    const rosterMatch = (player.nhlPlayerId ? rosterById.get(player.nhlPlayerId) : undefined) ?? rosterByName.get(player.name);
    if (!rosterMatch) {
      return {
        ...player,
        headshot: fallbackHeadshotFromId(player.nhlPlayerId) ?? player.headshot
      };
    }

    return {
      ...player,
      nhlPlayerId: player.nhlPlayerId ?? rosterMatch.nhlPlayerId,
      activeStatus: "active-nhl",
      currentRosterStatus: "current-roster",
      position: toUiPosition(rosterMatch.positionCode),
      headshot: rosterMatch.headshot ?? fallbackHeadshotFromId(player.nhlPlayerId) ?? player.headshot
    };
  });
}

function mergeGoalieData(baseGoalies, rosters) {
  const rosterEntries = [...rosters.flyers, ...rosters.penguins];
  const rosterById = new Map(rosterEntries.map((player) => [player.nhlPlayerId, player]));
  const rosterByName = new Map(rosterEntries.map((player) => [player.name, player]));

  return baseGoalies.map((goalie) => {
    const rosterMatch = (goalie.nhlPlayerId ? rosterById.get(goalie.nhlPlayerId) : undefined) ?? rosterByName.get(goalie.name);
    if (!rosterMatch) {
      return {
        ...goalie,
        headshot: fallbackHeadshotFromId(goalie.nhlPlayerId) ?? goalie.headshot
      };
    }

    return {
      ...goalie,
      nhlPlayerId: goalie.nhlPlayerId ?? rosterMatch.nhlPlayerId,
      activeStatus: "active-nhl",
      headshot: rosterMatch.headshot ?? fallbackHeadshotFromId(goalie.nhlPlayerId) ?? goalie.headshot
    };
  });
}

function mergeGoalieRegistryData(baseGoalies, registryEntries) {
  const registryByName = new Map(registryEntries.map((entry) => [entry.name, entry]));

  return baseGoalies.map((goalie) => {
    const registryMatch = registryByName.get(goalie.name);
    if (!registryMatch) {
      return goalie;
    }

    return {
      ...goalie,
      nhlPlayerId: goalie.nhlPlayerId ?? registryMatch.nhlPlayerId,
      activeStatus: registryMatch.activeStatus ?? goalie.activeStatus,
      headshot: fallbackHeadshotFromId(goalie.nhlPlayerId ?? registryMatch.nhlPlayerId) ?? goalie.headshot
    };
  });
}

function accumulateSkaterTotals(target, rows, { playoff = false, includeHits = false } = {}) {
  for (const row of rows) {
    const key = row.playerId ?? row.skaterFullName;
    const current = target.get(key) ?? {
      nhlPlayerId: row.playerId,
      name: row.skaterFullName,
      rivalryGames: 0,
      goalsVsRival: 0,
      assistsVsRival: 0,
      pointsVsRival: 0,
      gameWinningGoalsVsRival: 0,
      penaltyMinutesVsRival: 0,
      otGoalsVsRival: 0,
      hitsVsRival: 0,
      playoffGoalsVsRival: 0,
      playoffPointsVsRival: 0
    };

    if (includeHits) {
      current.hitsVsRival += row.hits ?? 0;
    } else if (playoff) {
      current.playoffGoalsVsRival += row.goals ?? 0;
      current.playoffPointsVsRival += row.points ?? 0;
    } else {
      current.rivalryGames += row.gamesPlayed ?? 0;
      current.goalsVsRival += row.goals ?? 0;
      current.assistsVsRival += row.assists ?? 0;
      current.pointsVsRival += row.points ?? 0;
      current.gameWinningGoalsVsRival += row.gameWinningGoals ?? 0;
      current.penaltyMinutesVsRival += row.penaltyMinutes ?? 0;
      current.otGoalsVsRival += row.otGoals ?? 0;
    }

    target.set(key, current);
  }
}

function accumulateGoalieTotals(target, rows) {
  for (const row of rows) {
    const key = row.playerId ?? row.goalieFullName;
    const current = target.get(key) ?? {
      nhlPlayerId: row.playerId,
      name: row.goalieFullName,
      rivalryGames: 0,
      winsVsRival: 0,
      shutoutsVsRival: 0,
      mostSavesSingleGameVsRival: 0,
      saves: 0,
      shotsAgainst: 0,
      goalsAgainst: 0,
      timeOnIce: 0
    };

    current.rivalryGames += row.gamesPlayed ?? 0;
    current.winsVsRival += row.wins ?? 0;
    current.shutoutsVsRival += row.shutouts ?? 0;
    current.saves += row.saves ?? 0;
    current.shotsAgainst += row.shotsAgainst ?? 0;
    current.goalsAgainst += row.goalsAgainst ?? 0;
    current.timeOnIce += row.timeOnIce ?? 0;
    current.mostSavesSingleGameVsRival = Math.max(current.mostSavesSingleGameVsRival, row.saves ?? 0);

    target.set(key, current);
  }
}

function finalizeSkaterTotals(target) {
  return new Map(
    [...target.entries()].map(([key, value]) => [
      key,
      {
        ...value,
        pointsPerGameVsRival: value.rivalryGames > 0 ? Number((value.pointsVsRival / value.rivalryGames).toFixed(2)) : 0
      }
    ])
  );
}

function finalizeGoalieTotals(target) {
  return new Map(
    [...target.entries()].map(([key, value]) => [
      key,
      {
        ...value,
        savePctVsRival: value.shotsAgainst > 0 ? Number((value.saves / value.shotsAgainst).toFixed(3)) : 0,
        gaaVsRival: value.timeOnIce > 0 ? Number(((value.goalsAgainst * 3600) / value.timeOnIce).toFixed(2)) : 0
      }
    ])
  );
}

function applyOfficialSkaterTotals(basePlayers, totals) {
  return basePlayers.map((player) => {
    const official = (player.nhlPlayerId ? totals.get(player.nhlPlayerId) : undefined) ?? totals.get(player.name);
    if (!official) {
      return player;
    }

    return {
      ...player,
      nhlPlayerId: player.nhlPlayerId ?? official.nhlPlayerId,
      headshot: fallbackHeadshotFromId(player.nhlPlayerId ?? official.nhlPlayerId) ?? player.headshot,
      rivalryGames: official.rivalryGames,
      goalsVsRival: official.goalsVsRival,
      assistsVsRival: official.assistsVsRival,
      pointsVsRival: official.pointsVsRival,
      pointsPerGameVsRival: official.pointsPerGameVsRival,
      gameWinningGoalsVsRival: official.gameWinningGoalsVsRival,
      hitsVsRival: official.hitsVsRival,
      penaltyMinutesVsRival: official.penaltyMinutesVsRival,
      otGoalsVsRival: official.otGoalsVsRival,
      playoffGoalsVsRival: official.playoffGoalsVsRival,
      playoffPointsVsRival: official.playoffPointsVsRival
    };
  });
}

function applyOfficialGoalieTotals(baseGoalies, totals) {
  return baseGoalies.map((goalie) => {
    const official = (goalie.nhlPlayerId ? totals.get(goalie.nhlPlayerId) : undefined) ?? totals.get(goalie.name);
    if (!official) {
      return goalie;
    }

    return {
      ...goalie,
      nhlPlayerId: goalie.nhlPlayerId ?? official.nhlPlayerId,
      headshot: fallbackHeadshotFromId(goalie.nhlPlayerId ?? official.nhlPlayerId) ?? goalie.headshot,
      rivalryGames: official.rivalryGames,
      winsVsRival: official.winsVsRival,
      savePctVsRival: official.savePctVsRival,
      gaaVsRival: official.gaaVsRival,
      shutoutsVsRival: official.shutoutsVsRival,
      mostSavesSingleGameVsRival: official.mostSavesSingleGameVsRival
    };
  });
}

function hydratePlayerHeadshots(players) {
  return players.map((player) => ({
    ...player,
    headshot: fallbackHeadshotFromId(player.nhlPlayerId) ?? player.headshot
  }));
}

function hydrateGoalieHeadshots(goalies) {
  return goalies.map((goalie) => ({
    ...goalie,
    headshot: fallbackHeadshotFromId(goalie.nhlPlayerId) ?? goalie.headshot
  }));
}

async function buildOfficialHistoricalSplits(currentSeason) {
  const seasonIds = [];
  const currentSeasonStartYear = Math.floor(currentSeason / 10000);
  for (let year = OFFICIAL_HISTORY_START_YEAR; year <= currentSeasonStartYear; year += 1) {
    seasonIds.push(Number(`${year}${year + 1}`));
  }

  const seasonGames = await Promise.all(
    seasonIds.map(async (seasonId) => {
      const games = (await fetchSeasonScheduleSafe(seasonId)).filter(isFinalGame);
      return { seasonId, games };
    })
  );

  const skaterTotals = new Map();
  const goalieTotals = new Map();

  for (const season of seasonGames) {
    if (!season.games.length) {
      continue;
    }

    const gameIds = season.games.map((game) => game.id);
    const playoffIds = season.games.filter((game) => game.gameType === 3).map((game) => game.id);

    const [skaterSummaryRows, skaterRealtimeRows, goalieSummaryRows, playoffSummaryRows] = await Promise.all([
      fetchStatsRows("skater/summary", gameIds, "points"),
      fetchStatsRows("skater/realtime", gameIds, "hits"),
      fetchStatsRows("goalie/summary", gameIds, "saves"),
      fetchStatsRows("skater/summary", playoffIds, "points")
    ]);

    accumulateSkaterTotals(skaterTotals, skaterSummaryRows);
    accumulateSkaterTotals(skaterTotals, skaterRealtimeRows, { includeHits: true });
    accumulateSkaterTotals(skaterTotals, playoffSummaryRows, { playoff: true });
    accumulateGoalieTotals(goalieTotals, goalieSummaryRows);
  }

  return {
    skaters: finalizeSkaterTotals(skaterTotals),
    goalies: finalizeGoalieTotals(goalieTotals)
  };
}

async function fetchRoster(teamAbbrev) {
  const data = await fetchJson(`https://api-web.nhle.com/v1/roster/${teamAbbrev}/current`);
  return [...(data.forwards ?? []), ...(data.defensemen ?? []), ...(data.goalies ?? [])].map((player) => ({
    nhlPlayerId: player.id,
    name: formatPlayerName(player),
    headshot: player.headshot,
    positionCode: player.positionCode
  }));
}

function currentSeriesLooksLive(games) {
  const playoffGames = games.filter((game) => game.gameType === 3);
  if (playoffGames.length === 0) {
    return false;
  }

  const now = TODAY.getTime();
  return playoffGames.some((game) => {
    const gameTime = new Date(game.gameDate).getTime();
    const dayDelta = Math.abs(now - gameTime) / (1000 * 60 * 60 * 24);
    return dayDelta <= 21;
  });
}

async function buildFromNhl() {
  const mock = buildFromMock();
  const registry = readJson(registryFile);
  const currentSeason = getSeasonForDate(TODAY);
  const seasons = [currentSeason, currentSeason - 10001];
  const schedules = (await Promise.all(seasons.map(fetchSeasonSchedule))).flat();
  const officialMeetings = schedules
    .filter(isFinalGame)
    .sort((a, b) => new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime());

  if (officialMeetings.length === 0) {
    throw new Error("No official Flyers-Penguins meetings found from NHL schedule endpoints.");
  }

  const recentMeetings = await Promise.all(
    officialMeetings.slice(0, 5).map(async (game) => {
      const boxscore = await fetchGameBoxscore(game.id);
      const winnerAbbrev = game.homeTeam.score > game.awayTeam.score ? game.homeTeam.abbrev : game.awayTeam.abbrev;
      return {
        id: String(game.id),
        date: game.gameDate,
        homeTeamId: mapAbbrevToTeamId(game.homeTeam.abbrev),
        awayTeamId: mapAbbrevToTeamId(game.awayTeam.abbrev),
        homeScore: game.homeTeam.score,
        awayScore: game.awayTeam.score,
        winnerTeamId: mapAbbrevToTeamId(winnerAbbrev),
        overtimeType: toOvertimeType(game.gameOutcome?.lastPeriodType),
        location: `${game.venue.default}, ${game.homeTeam.placeName.default}`,
        gameCenterUrl: `https://www.nhl.com${game.gameCenterLink}`,
        topPerformers: getTopPerformers(boxscore, winnerAbbrev),
        notableMoment: deriveMeetingNote(game, boxscore)
      };
    })
  );

  const latest = recentMeetings[0];
  const latestGame = officialMeetings[0];
  const rosters = {
    flyers: await fetchRoster("PHI"),
    penguins: await fetchRoster("PIT")
  };
  const historicalTotals = await buildOfficialHistoricalSplits(currentSeason);

  await downloadOfficialTeamLogos();

  const registryEnrichedActive = mergeRegistryData(mock.activePlayerLeaders, registry.skaters ?? []);
  const rosterEnrichedActive = mergeRosterData(registryEnrichedActive, rosters);
  const registryEnrichedAllTime = hydratePlayerHeadshots(mergeRegistryData(mock.allTimePlayerLeaders, registry.skaters ?? []));
  const registryEnrichedCrossovers = hydratePlayerHeadshots(mergeRegistryData(mock.crossoverPlayers, registry.skaters ?? []));
  const registryEnrichedGoalies = mergeGoalieRegistryData(mock.goalieLeaders, registry.goalies ?? []);
  const rosterEnrichedGoalies = mergeGoalieData(registryEnrichedGoalies, rosters);

  return {
    ...mock,
    appState: {
      ...mock.appState,
      playoffMode: currentSeriesLooksLive(schedules),
      lastBloodTeamId: latest.winnerTeamId
    },
    teams: mock.teams.map((team) => ({
      ...team,
      logo: NHL_TEAM_META[team.id].localLogo
    })),
    latestMeeting: {
      date: latest.date,
      winnerTeamId: latest.winnerTeamId,
      homeTeamId: latest.homeTeamId,
      awayTeamId: latest.awayTeamId,
      score: `${latest.awayScore}-${latest.homeScore}`,
      overtimeType: latest.overtimeType,
      location: latest.location,
      gameCenterUrl: latest.gameCenterUrl,
      topPerformers: latest.topPerformers,
      notableMoment: latest.notableMoment
    },
    recentMeetings,
    activePlayerLeaders: hydratePlayerHeadshots(applyOfficialSkaterTotals(rosterEnrichedActive, historicalTotals.skaters)),
    allTimePlayerLeaders: registryEnrichedAllTime,
    goalieLeaders: hydrateGoalieHeadshots(applyOfficialGoalieTotals(rosterEnrichedGoalies, historicalTotals.goalies)),
    crossoverPlayers: registryEnrichedCrossovers,
    rivalryHook:
      latestGame.gameType === 3
        ? "A postseason border war resets every shift."
        : "The rivalry survives every roster cycle because the temperature never really leaves."
  };
}

async function buildData() {
  if (source === "mock") {
    return buildFromMock();
  }

  if (source === "nhl") {
    return buildFromNhl();
  }

  if (source === "auto") {
    try {
      return await buildFromNhl();
    } catch (error) {
      console.warn(`Falling back to mock source: ${error.message}`);
      return buildFromMock();
    }
  }

  throw new Error(`Unsupported source "${source}". Use mock, nhl, or auto.`);
}

const generated = await buildData();
writeJson(outputFile, generated);
console.log(`Generated rivalry data from ${source} source.`);
