import { Player, MatchRecord, CricketRecord, PlayerStats } from '../types/database';

export const EMPTY_STATS: PlayerStats = {
  matches: 0,
  innings: 0,
  runs: 0,
  highestScore: '-',
  average: 0,
  strikeRate: 0,
  centuries: 0,
  fifties: 0,
  fours: 0,
  sixes: 0,
  oversBowled: 0,
  wickets: 0,
  bestBowling: '-',
  bowlingAverage: 0,
  economy: 0,
  fiveWickets: 0,
  catches: 0,
  stumpings: 0
};

export interface ParsedPlayerBatting {
  playerName: string;
  playerId?: string;
  dismissal: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isNotOut: boolean;
}

export interface ParsedPlayerBowling {
  playerName: string;
  playerId?: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
}

export interface ParsedScorecard {
  matchId: string;
  matchDate: string;
  format: 'First Class' | 'One Day' | 'BT20';
  opponent: string;
  venue: string;
  pitchType: string;
  result: string;
  somnathRuns?: number;
  somnathWickets?: number;
  somnathOvers?: number;
  opponentRuns?: number;
  opponentWickets?: number;
  attendance?: number;
  gateReceipts?: number;
  battingPerformances: ParsedPlayerBatting[];
  bowlingPerformances: ParsedPlayerBowling[];
}

/**
 * Intelligent Battrick Match Scorecard / Summary Parser
 * Parses both raw HTML (matchinfofc.asp / matchinfo.asp) and plain-text copy-paste.
 */
export function parseBattrickScorecard(input: string): ParsedScorecard | null {
  if (!input || input.length < 50) return null;

  // 1. Match ID
  const idMatch = input.match(/matchID=(\d+)/i) || 
                  input.match(/v\s+[A-Za-z0-9\s]+\((\d{6,9})\)/i) || 
                  input.match(/Match\s*#?(\d{6,9})/i);
  const matchId = idMatch ? idMatch[1] : `M-${Date.now().toString().slice(-6)}`;

  // 2. Format
  let format: 'First Class' | 'One Day' | 'BT20' = 'First Class';
  if (/BT20|T20|Twenty20/i.test(input)) {
    format = 'BT20';
  } else if (/One Day|OD\s|50\s*over/i.test(input)) {
    format = 'One Day';
  } else if (/First Class|FC\s|3\s*day|three day/i.test(input)) {
    format = 'First Class';
  }

  // 3. Opponent & Venue
  let opponent = 'Opposition XI';
  const oppMatch = input.match(/Somnath Super Devs\s+v(?:s)?\s+([A-Za-z0-9\s]+?)(?:[<(]|\s+Date)/i) || 
                   input.match(/v\s+([A-Za-z0-9\s]+?)\s+\(/i);
  if (oppMatch) {
    opponent = oppMatch[1].trim();
  }

  const isHome = /Home|Prabhas Coastal Oval/i.test(input);
  const venue = isHome ? 'Home (Prabhas Coastal Oval)' : 'Away Grounds';

  // 4. Pitch
  let pitchType = 'Hard & Fast';
  if (/green/i.test(input)) pitchType = 'Green Seamer';
  else if (/dusty/i.test(input)) pitchType = 'Dry & Dusty';
  else if (/slow/i.test(input)) pitchType = 'Slow & Low';
  else if (/flat/i.test(input)) pitchType = 'Flat Highway';
  else if (/uneven/i.test(input)) pitchType = 'Uneven';

  // 5. Date
  const dateM = input.match(/Date[:\s]*<\/td>\s*<td[^>]*>(\d{1,2}\/\d{1,2}\/\d{4})/i) || 
                input.match(/(\d{4}-\d{2}-\d{2})/);
  const matchDate = dateM ? dateM[1] : new Date().toISOString().split('T')[0];

  // 6. Result
  let result = 'Match Concluded';
  const resM = input.match(/<strong>(Somnath Super Devs won[^<]+)<\/strong>/i) ||
               input.match(/<strong>([^<]+won by[^<]+)<\/strong>/i) ||
               input.match(/(Somnath Super Devs won by [^\n\.]+)/i);
  if (resM) {
    result = resM[1].replace(/&#187;/g, '').trim();
  }

  // 7. Batting Card Parsing
  const battingPerformances: ParsedPlayerBatting[] = [];
  const batRegex = /<a href="playerdetails\.asp\?playerID=(\d+)"[^>]*>([^<]+)<\/a><\/td>\s*<td[^>]*>([^<]*)<\/td>\s*<td[^>]*>([^<]*)<\/td>\s*<td[^>]*>(\d+)<\/td>\s*<td[^>]*>(\d+)<\/td>\s*<td[^>]*>(\d+)<\/td>\s*<td[^>]*>(\d+)<\/td>/gi;
  let batMatch;
  while ((batMatch = batRegex.exec(input)) !== null) {
    const isNotOut = /not\s*out/i.test(batMatch[3] + batMatch[4]);
    battingPerformances.push({
      playerId: batMatch[1],
      playerName: batMatch[2].trim(),
      dismissal: (batMatch[3] + ' ' + batMatch[4]).trim(),
      runs: parseInt(batMatch[5]),
      balls: parseInt(batMatch[6]),
      fours: parseInt(batMatch[7]),
      sixes: parseInt(batMatch[8]),
      isNotOut
    });
  }

  // Fallback plain-text batting parser (e.g. "I. Baboor b. Bowler 166 (182b 16x4 2x6)")
  if (battingPerformances.length === 0) {
    const lines = input.split('\n');
    for (const line of lines) {
      const lineM = line.match(/^([A-Za-z\.\s]+)\s+(not out|c\s+.*?|b\s+.*?|lbw\s+.*?|run out.*?)\s+(\d+)\s+(?:balls:?\s*(\d+)|\((\d+)b\s*(\d+)x4\s*(\d+)x6\))/i);
      if (lineM) {
        const isNotOut = /not out/i.test(lineM[2]);
        battingPerformances.push({
          playerName: lineM[1].trim(),
          dismissal: lineM[2].trim(),
          runs: parseInt(lineM[3]),
          balls: parseInt(lineM[4] || lineM[5] || '0'),
          fours: parseInt(lineM[6] || '0'),
          sixes: parseInt(lineM[7] || '0'),
          isNotOut
        });
      }
    }
  }

  // 8. Bowling Card Parsing
  const bowlingPerformances: ParsedPlayerBowling[] = [];
  const bowlRegex = /<a href="playerdetails\.asp\?playerID=(\d+)"[^>]*>([^<]+)<\/a>\s*<\/td>\s*<td>(\d+(?:\.\d+)?)<\/td>\s*<td[^>]*>(\d+)<\/td>\s*<td[^>]*>(\d+)<\/td>\s*<td[^>]*>(\d+)<\/td>/gi;
  let bowlMatch;
  while ((bowlMatch = bowlRegex.exec(input)) !== null) {
    bowlingPerformances.push({
      playerId: bowlMatch[1],
      playerName: bowlMatch[2].trim(),
      overs: parseFloat(bowlMatch[3]),
      maidens: parseInt(bowlMatch[4]),
      runs: parseInt(bowlMatch[5]),
      wickets: parseInt(bowlMatch[6])
    });
  }

  // Fallback plain-text bowling parser (e.g. "P. Rishi 10-2-35-3")
  if (bowlingPerformances.length === 0) {
    const lines = input.split('\n');
    for (const line of lines) {
      const bowlLineM = line.match(/^([A-Za-z\.\s]+)\s+(\d+(?:\.\d+)?)-(\d+)-(\d+)-(\d+)/);
      if (bowlLineM) {
        bowlingPerformances.push({
          playerName: bowlLineM[1].trim(),
          overs: parseFloat(bowlLineM[2]),
          maidens: parseInt(bowlLineM[3]),
          runs: parseInt(bowlLineM[4]),
          wickets: parseInt(bowlLineM[5])
        });
      }
    }
  }

  // 9. Match Attendance & Gate Receipts
  const attM = input.match(/Crowd[:\s]*<\/td>\s*<td[^>]*>([0-9,]+)/i) || 
               input.match(/Attendance[:\s]*([0-9,]+)/i);
  const attendance = attM ? parseInt(attM[1].replace(/,/g, '')) : undefined;

  const gateM = input.match(/Gate[:\s]*[£$]?([0-9,]+)/i) || 
                input.match(/Receipts[:\s]*[£$]?([0-9,]+)/i);
  const gateReceipts = gateM ? parseInt(gateM[1].replace(/,/g, '')) : undefined;

  // 10. Team Score
  const totalM = input.match(/Total\s*\(([^)]+)\)<\/td>\s*<td[^>]*>(\d+)<\/td>/i) ||
                 input.match(/Somnath Super Devs\s+(\d+)\/(\d+)/i) ||
                 input.match(/(\d+)\/(\d+)\s+dec/i);
  let somnathRuns: number | undefined;
  if (totalM) {
    somnathRuns = parseInt(totalM[2] || totalM[1]);
  }

  return {
    matchId,
    matchDate,
    format,
    opponent,
    venue,
    pitchType,
    result,
    somnathRuns,
    attendance,
    gateReceipts,
    battingPerformances,
    bowlingPerformances
  };
}

/**
 * Recomputes all player career statistics and clubhouse records dynamically
 * strictly from the verified matches array. If no matches exist, all stats remain 0.
 */
export function recalculateStatsFromMatches(
  matches: MatchRecord[],
  baseSquad: Player[]
): { updatedSquad: Player[]; updatedRecords: CricketRecord[] } {
  // Helper for tracking intermediate totals
  interface Accumulator {
    matchesPlayed: Set<string>;
    innings: number;
    outs: number;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    centuries: number;
    fifties: number;
    highestScoreVal: number;
    highestScoreStr: string;
    oversBowled: number;
    maidens: number;
    wickets: number;
    runsConceded: number;
    bestBowlingWkts: number;
    bestBowlingRuns: number;
    fiveWickets: number;
    catches: number;
    stumpings: number;
  }

  const createBlankAcc = (): Accumulator => ({
    matchesPlayed: new Set(),
    innings: 0,
    outs: 0,
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    centuries: 0,
    fifties: 0,
    highestScoreVal: 0,
    highestScoreStr: '-',
    oversBowled: 0,
    maidens: 0,
    wickets: 0,
    runsConceded: 0,
    bestBowlingWkts: 0,
    bestBowlingRuns: 999,
    fiveWickets: 0,
    catches: 0,
    stumpings: 0
  });

  const playerAccs = new Map<string, { FC: Accumulator; OD: Accumulator; T20: Accumulator }>();

  // Map squad players by both clean ID and normalized name
  const idToPlayer = new Map<string, Player>();
  const nameToId = new Map<string, string>();

  for (const p of baseSquad) {
    const cleanId = String(p.id).replace(/^BT-/, '').trim();
    idToPlayer.set(cleanId, p);
    nameToId.set(p.name.toLowerCase().trim(), cleanId);
    
    // Also match initials (e.g. "I. Baboor" -> "Issa Baboor")
    const parts = p.name.trim().split(' ');
    if (parts.length >= 2) {
      const initialName = `${parts[0][0]}. ${parts.slice(1).join(' ')}`.toLowerCase();
      nameToId.set(initialName, cleanId);
    }

    playerAccs.set(cleanId, {
      FC: createBlankAcc(),
      OD: createBlankAcc(),
      T20: createBlankAcc()
    });
  }

  // Records tracking
  let maxScore = 0;
  let maxScoreHolder = '';
  let maxScoreContext = '';
  let maxScoreDate = '';

  let bestBowlingWkts = 0;
  let bestBowlingRuns = 999;
  let bestBowlingHolder = '';
  let bestBowlingContext = '';
  let bestBowlingDate = '';

  let highestTeamTotal = 0;
  let highestTeamTotalContext = '';
  let highestTeamTotalDate = '';

  // Process all matches
  for (const match of matches) {
    const formatKey: 'FC' | 'OD' | 'T20' = 
      match.match_type === 'One Day' ? 'OD' : 
      match.match_type === 'BT20' ? 'T20' : 'FC';

    // Parse team total if summary present
    const totalMatch = match.scoreSummary?.match(/(\d+)\/(\d+)/) || match.scoreSummary?.match(/(\d+)\s+runs/i);
    if (totalMatch) {
      const runs = parseInt(totalMatch[1]);
      if (runs > highestTeamTotal) {
        highestTeamTotal = runs;
        highestTeamTotalContext = `${match.match_type} vs ${match.opponent_club}`;
        highestTeamTotalDate = match.match_date;
      }
    }

    const sc = match.scorecardData as ParsedScorecard | undefined;
    if (!sc) continue;

    if (sc.somnathRuns && sc.somnathRuns > highestTeamTotal) {
      highestTeamTotal = sc.somnathRuns;
      highestTeamTotalContext = `${sc.format} vs ${sc.opponent}`;
      highestTeamTotalDate = sc.matchDate;
    }

    // Process Batting
    for (const bat of sc.battingPerformances) {
      let pId = bat.playerId ? String(bat.playerId).replace(/^BT-/, '').trim() : undefined;
      if (!pId || !idToPlayer.has(pId)) {
        pId = nameToId.get(bat.playerName.toLowerCase().trim());
      }

      if (!pId || !playerAccs.has(pId)) continue;
      const acc = playerAccs.get(pId)![formatKey];
      acc.matchesPlayed.add(match.id);
      acc.innings += 1;
      acc.runs += bat.runs;
      acc.balls += bat.balls;
      acc.fours += bat.fours;
      acc.sixes += bat.sixes;

      if (!bat.isNotOut) {
        acc.outs += 1;
      }

      if (bat.runs >= 100) {
        acc.centuries += 1;
      } else if (bat.runs >= 50) {
        acc.fifties += 1;
      }

      const scoreStr = `${bat.runs}${bat.isNotOut ? '*' : ''}`;
      if (bat.runs > acc.highestScoreVal) {
        acc.highestScoreVal = bat.runs;
        acc.highestScoreStr = scoreStr;
      }

      if (bat.runs > maxScore) {
        maxScore = bat.runs;
        maxScoreHolder = idToPlayer.get(pId)!.name;
        maxScoreContext = `${scoreStr} in ${sc.format} vs ${sc.opponent}`;
        maxScoreDate = sc.matchDate;
      }
    }

    // Process Bowling
    for (const bowl of sc.bowlingPerformances) {
      let pId = bowl.playerId ? String(bowl.playerId).replace(/^BT-/, '').trim() : undefined;
      if (!pId || !idToPlayer.has(pId)) {
        pId = nameToId.get(bowl.playerName.toLowerCase().trim());
      }

      if (!pId || !playerAccs.has(pId)) continue;
      const acc = playerAccs.get(pId)![formatKey];
      acc.matchesPlayed.add(match.id);
      acc.oversBowled += bowl.overs;
      acc.maidens += bowl.maidens;
      acc.runsConceded += bowl.runs;
      acc.wickets += bowl.wickets;

      if (bowl.wickets >= 5) {
        acc.fiveWickets += 1;
      }

      const isBetter = bowl.wickets > acc.bestBowlingWkts || 
                       (bowl.wickets === acc.bestBowlingWkts && bowl.runs < acc.bestBowlingRuns);
      if (isBetter && bowl.wickets > 0) {
        acc.bestBowlingWkts = bowl.wickets;
        acc.bestBowlingRuns = bowl.runs;
      }

      const isClubRecord = bowl.wickets > bestBowlingWkts ||
                           (bowl.wickets === bestBowlingWkts && bowl.runs < bestBowlingRuns);
      if (isClubRecord && bowl.wickets > 0) {
        bestBowlingWkts = bowl.wickets;
        bestBowlingRuns = bowl.runs;
        bestBowlingHolder = idToPlayer.get(pId)!.name;
        bestBowlingContext = `${bowl.wickets}/${bowl.runs} in ${sc.format} vs ${sc.opponent}`;
        bestBowlingDate = sc.matchDate;
      }
    }
  }

  // Helper to convert accumulator into clean PlayerStats
  const accToStats = (acc: Accumulator): PlayerStats => {
    const matchesCount = acc.matchesPlayed.size;
    const average = acc.outs > 0 ? parseFloat((acc.runs / acc.outs).toFixed(2)) : acc.runs > 0 ? acc.runs : 0;
    const strikeRate = acc.balls > 0 ? parseFloat(((acc.runs / acc.balls) * 100).toFixed(2)) : 0;
    const bestBowling = acc.bestBowlingWkts > 0 ? `${acc.bestBowlingWkts}/${acc.bestBowlingRuns}` : '-';
    const bowlingAvg = acc.wickets > 0 ? parseFloat((acc.runsConceded / acc.wickets).toFixed(2)) : 0;
    const economy = acc.oversBowled > 0 ? parseFloat((acc.runsConceded / acc.oversBowled).toFixed(2)) : 0;

    return {
      matches: matchesCount,
      innings: acc.innings,
      runs: acc.runs,
      highestScore: acc.highestScoreStr,
      average,
      strikeRate,
      centuries: acc.centuries,
      fifties: acc.fifties,
      fours: acc.fours,
      sixes: acc.sixes,
      oversBowled: parseFloat(acc.oversBowled.toFixed(1)),
      wickets: acc.wickets,
      bestBowling,
      bowlingAverage: bowlingAvg,
      economy,
      fiveWickets: acc.fiveWickets,
      catches: acc.catches,
      stumpings: acc.stumpings
    };
  };

  // Compile updated players
  const updatedSquad: Player[] = baseSquad.map(player => {
    const cleanId = String(player.id).replace(/^BT-/, '').trim();
    const acc = playerAccs.get(cleanId);
    if (!acc) {
      return {
        ...player,
        statsFC: { ...EMPTY_STATS },
        statsOD: { ...EMPTY_STATS },
        statsT20: { ...EMPTY_STATS }
      };
    }

    return {
      ...player,
      statsFC: accToStats(acc.FC),
      statsOD: accToStats(acc.OD),
      statsT20: accToStats(acc.T20)
    };
  });

  // Compile clubhouse records
  const records: CricketRecord[] = [];

  if (maxScore > 0) {
    records.push({
      category: 'BATTING',
      recordName: 'Highest Individual Score',
      holder: maxScoreHolder,
      value: `${maxScore} Runs`,
      matchContext: maxScoreContext,
      date: maxScoreDate
    });
  }

  if (bestBowlingWkts > 0) {
    records.push({
      category: 'BOWLING',
      recordName: 'Best Bowling in an Innings',
      holder: bestBowlingHolder,
      value: `${bestBowlingWkts}/${bestBowlingRuns}`,
      matchContext: bestBowlingContext,
      date: bestBowlingDate
    });
  }

  if (highestTeamTotal > 0) {
    records.push({
      category: 'TEAM',
      recordName: 'Highest Team Total',
      holder: 'Somnath Super Devs',
      value: `${highestTeamTotal} Runs`,
      matchContext: highestTeamTotalContext,
      date: highestTeamTotalDate
    });
  }

  return {
    updatedSquad,
    updatedRecords: records
  };
}
