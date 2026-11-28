import { Player, MatchRecord, CricketRecord, PlayerStats, Club, StadiumTier } from '../types/database';

export const EMPTY_STATS: PlayerStats = {
  matches: 0,
  innings: 0,
  notOuts: 0,
  runs: 0,
  highestScore: '-',
  average: 0,
  ballsFaced: 0,
  strikeRate: 0,
  centuries: 0,
  fifties: 0,
  fours: 0,
  sixes: 0,
  catches: 0,
  stumpings: 0,
  inningsBowled: 0,
  ballsBowled: 0,
  runsConceded: 0,
  oversBowled: 0,
  wickets: 0,
  bestBowling: '-',
  bestBowlingMatch: '-',
  bowlingAverage: 0,
  economy: 0,
  bowlingStrikeRate: 0,
  fourWickets: 0,
  fiveWickets: 0,
  tenWickets: 0
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
  rawMatchDate?: string;
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
 * Normalizes any date string (DD/MM/YYYY, DD-MM-YYYY, or YYYY-MM-DD) to ISO format YYYY-MM-DD
 */
export function normalizeToIsoDate(dateStr: string): string {
  if (!dateStr) return '';
  const clean = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;
  const parts = clean.split(/[\/\-.]/);
  if (parts.length >= 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    let year = parts[2].trim().slice(0, 4);
    if (year.length === 2) year = '20' + year;
    return `${year}-${month}-${day}`;
  }
  return clean;
}

/**
 * Robust extraction of authentic original match date from uploaded Battrick HTML or plain text.
 * Strictly extracts the true match date from the code/text rather than falling back to today.
 */
export function extractBattrickDate(input: string): { isoDate: string; rawDate: string } {
  if (!input) return { isoDate: '', rawDate: '' };

  // 1. Table cell pattern with HTML tags: <td><b>Date:</b></td> <td>13/11/2026 04:30</td> or <td class="fieldcol">Date:</td> <td>10/11/2026</td>
  const tdMatch = input.match(/<td[^>]*>(?:<[^>]+>)*\s*Date:?\s*(?:<\/[^>]+>)*<\/td>\s*<td[^>]*>(?:<[^>]+>)*\s*([0-3]?\d[\/\-.][0-1]?\d[\/\-.]20\d{2}(?:\s+\d{1,2}:\d{2})?)/i);
  if (tdMatch) {
    const raw = tdMatch[1].trim();
    return { isoDate: normalizeToIsoDate(raw), rawDate: raw };
  }

  // 2. Generic Date: label in text or markup
  const textMatch = input.match(/Date[:\s]+(?:<[^>]+>)*\s*([0-3]?\d[\/\-.][0-1]?\d[\/\-.]20\d{2}(?:\s+\d{1,2}:\d{2})?)/i);
  if (textMatch) {
    const raw = textMatch[1].trim();
    return { isoDate: normalizeToIsoDate(raw), rawDate: raw };
  }

  // 3. Altcol spans from fixtures: <span class="altcol" title="Tuesday">10/11/2026 04:30
  const spanMatch = input.match(/<span[^>]*class=["']altcol["'][^>]*>\s*([0-3]?\d[\/\-.][0-1]?\d[\/\-.]20\d{2}(?:\s+\d{1,2}:\d{2})?)/i);
  if (spanMatch) {
    const raw = spanMatch[1].trim();
    return { isoDate: normalizeToIsoDate(raw), rawDate: raw };
  }

  // 4. ISO Date: 2026-11-10
  const isoMatch = input.match(/\b(20\d{2}-[0-1]\d-[0-3]\d)\b/);
  if (isoMatch) {
    const raw = isoMatch[1].trim();
    return { isoDate: raw, rawDate: raw };
  }

  // 5. Standalone date DD/MM/YYYY in the header portion (first 3000 chars)
  const headerSlice = input.slice(0, 3000);
  const standaloneMatch = headerSlice.match(/\b([0-3]?\d\/[0-1]?\d\/20\d{2})\b/);
  if (standaloneMatch) {
    const raw = standaloneMatch[1].trim();
    return { isoDate: normalizeToIsoDate(raw), rawDate: raw };
  }

  return { isoDate: '', rawDate: '' };
}

/**
 * Intelligent Battrick Match Scorecard / Summary Parser
 * Parses both raw HTML (matchinfofc.asp / matchinfo.asp) and plain-text copy-paste.
 */
export function parseBattrickScorecard(
  input: string,
  formatOverride?: 'First Class' | 'One Day' | 'BT20',
  targetClubId: string = ''
): ParsedScorecard | null {
  if (!input || input.length < 50) return null;

  // Strip top navigation menubar which contains all three leagues: "FC: VIII.17", "OD: V.62", "BT20: VII.241"
  const cleanContent = input
    .replace(/<ul\s+id=["']topmenu["'][\s\S]*?<\/ul>/gi, '')
    .replace(/<div\s+id=["']menubarwrapper["'][\s\S]*?<\/div>\s*<\/div>/gi, '')
    .replace(/<div\s+id=["']menubar["'][\s\S]*?<\/div>/gi, '');

  // 1. Match ID (matches across all Battrick URL parameters, inputs, and text patterns)
  const idMatch = cleanContent.match(/matchID=(\d+)/i) || 
                  cleanContent.match(/matchinfofc\.asp\?matchID=(\d+)/i) ||
                  cleanContent.match(/matchinfo\.asp\?matchID=(\d+)/i) ||
                  cleanContent.match(/matchcommsfc\.asp\?matchID=(\d+)/i) ||
                  cleanContent.match(/name=["']matchID["'][^>]*value=["'](\d+)["']/i) ||
                  cleanContent.match(/v\s+[A-Za-z0-9\s]+\((\d{6,9})\)/i) || 
                  cleanContent.match(/Match\s*#?(\d{6,9})/i);
  const matchId = idMatch ? idMatch[1] : `M-${Date.now().toString().slice(-6)}`;

  // 2. Batting Card Parsing (Matches playerdetails link by exact playerID)
  const battingPerformances: ParsedPlayerBatting[] = [];
  const batRegex = /<tr>\s*<td[^>]*>\s*<a[^>]*href=["'][^"']*playerdetails\.asp\?playerID=(\d+)["'][^>]*>\s*([^<]+)\s*<\/a>(?:\s*<\/a>)?\s*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>\s*(\d+)\s*<\/td>\s*<td[^>]*>\s*(\d+)\s*<\/td>\s*<td[^>]*>\s*(\d+)\s*<\/td>\s*<td[^>]*>\s*(\d+)\s*<\/td>/gi;
  let batMatch;
  while ((batMatch = batRegex.exec(cleanContent)) !== null) {
    const isNotOut = /not\s*out/i.test(batMatch[3] + batMatch[4]);
    battingPerformances.push({
      playerId: batMatch[1],
      playerName: batMatch[2].trim(),
      dismissal: (batMatch[3] + ' ' + batMatch[4]).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
      runs: parseInt(batMatch[5]),
      balls: parseInt(batMatch[6]),
      fours: parseInt(batMatch[7]),
      sixes: parseInt(batMatch[8]),
      isNotOut
    });
  }

  // Fallback plain-text batting parser (e.g. "I. Baboor b. Bowler 166 (182b 16x4 2x6)")
  if (battingPerformances.length === 0) {
    const lines = cleanContent.split('\n');
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

  // 3. Bowling Card Parsing (Matches playerdetails link by exact playerID)
  const bowlingPerformances: ParsedPlayerBowling[] = [];
  const bowlRegex = /<tr>\s*<td[^>]*>\s*<a[^>]*href=["'][^"']*playerdetails\.asp\?playerID=(\d+)["'][^>]*>\s*([^<]+)\s*<\/a>(?:\s*<\/a>)?\s*<\/td>\s*<td[^>]*>\s*(\d+(?:\.\d+)?)\s*<\/td>\s*<td[^>]*>\s*(\d+)\s*<\/td>\s*<td[^>]*>\s*(\d+)\s*<\/td>\s*<td[^>]*>\s*(\d+)\s*<\/td>/gi;
  let bowlMatch;
  while ((bowlMatch = bowlRegex.exec(cleanContent)) !== null) {
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
    const lines = cleanContent.split('\n');
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

  // 4. Match Format Detection (FC, OD, or BT20)
  let format: 'First Class' | 'One Day' | 'BT20' = 'First Class';

  if (formatOverride && ['First Class', 'One Day', 'BT20'].includes(formatOverride)) {
    format = formatOverride;
  } else {
    // Check First Class first
    const isFC = cleanContent.includes('matchinfofc.asp') ||
      /<body\s+id=["']matchinfofc["']/i.test(cleanContent) ||
      /FC\s*Match/i.test(cleanContent) ||
      /First\s*Class/i.test(cleanContent) ||
      /data-class=["']FC["']/i.test(cleanContent) ||
      /Second\s+Innings\s+of:/i.test(cleanContent) ||
      /matchcommsfc\.asp/i.test(cleanContent) ||
      /\b3-day\b|\bthree[- ]day\b/i.test(cleanContent) ||
      /Day\s+[123]\s+Commentary/i.test(cleanContent);

    if (isFC) {
      format = 'First Class';
    } else {
      // Check for bowler overs > 4.0 or innings overs > 20.0
      // In BT20, bowlers cannot bowl > 4 overs, and innings cannot exceed 20 overs.
      const hasBowlerOverFour = bowlingPerformances.some(b => b.overs > 4.0);
      const hasInningsOverTwenty = /Total\s*\((?:2[1-9]|[3-5][0-9])\.\d+\s*overs/i.test(cleanContent) || /50(?:\.0)?\s*overs/i.test(cleanContent);
      const isODExplicit = /data-class=["']OD(?:\s+Fr)?["']/i.test(cleanContent) ||
        /title=["'](?:OD\s+League|OD\s+Friendly)["']/i.test(cleanContent) ||
        /\bOD\s*Friendly\b/i.test(cleanContent) ||
        /\bOD\s*League\b/i.test(cleanContent) ||
        /\bOne\s*Day\b/i.test(cleanContent);

      const isBT20Explicit = /data-class=["']BT20["']/i.test(cleanContent) ||
        /title=["']BT20["']/i.test(cleanContent) ||
        /\bBT20\s*League\b/i.test(cleanContent) ||
        /\bBT20\s*Cup\b/i.test(cleanContent) ||
        /\bBT20\s*Friendly\b/i.test(cleanContent) ||
        /\bBT20\b/i.test(cleanContent) ||
        /\bTwenty20\b/i.test(cleanContent) ||
        /\bT20\b/i.test(cleanContent);

      if (hasBowlerOverFour || hasInningsOverTwenty || isODExplicit) {
        format = 'One Day';
      } else if (isBT20Explicit) {
        format = 'BT20';
      } else {
        // Default to One Day if overs > 20, else BT20
        format = 'One Day';
      }
    }
  }

  // 5. Opponent & Venue with ID-First Matching (impervious to team or ground name changes)
  let opponent = 'Opposition XI';
  let isHome = false;

  const cleanClubId = String(targetClubId).replace(/^BT-/, '').trim();
  const teamLinkMatches = [...cleanContent.matchAll(/<a[^>]*href=["'][^"']*clubdetails\.asp\?teamID=(\d+)["'][^>]*>([^<]+)<\/a>/gi)];

  if (teamLinkMatches.length >= 2) {
    const t1Id = teamLinkMatches[0][1].trim();
    const t1Name = teamLinkMatches[0][2].replace(/&#187;/g, '').trim();
    const t2Id = teamLinkMatches[1][1].trim();
    const t2Name = teamLinkMatches[1][2].replace(/&#187;/g, '').trim();

    if (t1Id === cleanClubId) {
      isHome = true;
      opponent = t2Name;
    } else if (t2Id === cleanClubId) {
      isHome = false;
      opponent = t1Name;
    } else {
      isHome = true;
      opponent = t2Name;
    }
  } else {
    // Fallback title regex
    const titleVsMatch = 
      cleanContent.match(/<h2[^>]*>([A-Za-z0-9\s\.\-_]+?)\s+v(?:s)?\s+([A-Za-z0-9\s\.\-_]+?)(?:\s*\(\d+\))?<\/h2>/i) ||
      cleanContent.match(/<div id="pagetitle">([^<]+?)\s+v(?:s)?\s+([^<]+?)(?:&#187;|<|\s+FC|\s+OD|\s+BT20)/i) ||
      cleanContent.match(/<title>Battrick\s*-\s*([A-Za-z0-9\s\.\-_]+?)\s+v(?:s)?\s+([A-Za-z0-9\s\.\-_]+?)<\/title>/i) ||
      cleanContent.match(/^([A-Za-z0-9\s\.\-_]+?)\s+v(?:s)?\s+([A-Za-z0-9\s\.\-_]+?)(?:\s*\(\d+\)|\s+Date)/im);

    if (titleVsMatch) {
      const t2 = titleVsMatch[2].replace(/\(\d+\)/, '').trim();
      opponent = t2;
      isHome = true;
    }
  }

  const groundMatch = 
    cleanContent.match(/Ground[:\s]*(?:<\/b>)?\s*<\/td>\s*<td[^>]*>\s*<a[^>]*href=["'][^"']*grounddetails\.asp\?groundID=(\d+)["'][^>]*>([^<]+)<\/a>/i) ||
    cleanContent.match(/Ground[:\s]*(?:<\/b>)?\s*<\/td>\s*<td[^>]*>\s*<a[^>]*>([^<]+)<\/a>/i) ||
    cleanContent.match(/Ground[:\s]*(?:<\/b>)?\s*<\/td>\s*<td[^>]*>([^<]+)<\/td>/i) ||
    cleanContent.match(/Ground[:\s]+([^\n\r<]+)/i);
  let groundName = groundMatch ? (groundMatch[2] || groundMatch[1]).trim() : '';
  const venue = isHome ? `Home (${groundName || 'Home Ground'})` : `Away (${groundName || 'Away Grounds'})`;

  // 6. Pitch
  let pitchType = 'Hard & Fast';
  if (/green/i.test(cleanContent)) pitchType = 'Green Seamer';
  else if (/dusty/i.test(cleanContent)) pitchType = 'Dry & Dusty';
  else if (/slow/i.test(cleanContent)) pitchType = 'Slow & Low';
  else if (/flat/i.test(cleanContent)) pitchType = 'Flat Highway';
  else if (/uneven/i.test(cleanContent)) pitchType = 'Uneven';

  // 7. Date - Authentic original date extracted strictly from uploaded code
  const { isoDate, rawDate } = extractBattrickDate(cleanContent);
  const matchDate = rawDate || isoDate || new Date().toISOString().split('T')[0];

  // 8. Result
  let result = 'Match Concluded';
  const resM = cleanContent.match(/<strong>([^<]+won by[^<]+)<\/strong>/i) ||
               cleanContent.match(/<strong>([^<]+won[^<]+)<\/strong>/i) ||
               cleanContent.match(/([^<\n\r]+won by[^\n\.\<]+)/i);
  if (resM) {
    result = resM[1].replace(/&#187;/g, '').trim();
  }

  // 9. Match Attendance & Gate Receipts
  const attM = cleanContent.match(/Crowd[:\s]*<\/td>\s*<td[^>]*>([0-9,]+)/i) || 
               cleanContent.match(/Attendance[:\s]*([0-9,]+)/i);
  const attendance = attM ? parseInt(attM[1].replace(/,/g, '')) : undefined;

  const gateM = cleanContent.match(/Gate[:\s]*[£$]?([0-9,]+)/i) || 
                cleanContent.match(/Receipts[:\s]*[£$]?([0-9,]+)/i);
  const gateReceipts = gateM ? parseInt(gateM[1].replace(/,/g, '')) : undefined;

  // 10. Team Score
  const totalM = cleanContent.match(/Total\s*\(([^)]+)\)<\/td>\s*<td[^>]*>(\d+)<\/td>/i) ||
                 cleanContent.match(/(\d+)\/(\d+)\s+dec/i);
  let somnathRuns: number | undefined;
  if (totalM) {
    somnathRuns = parseInt(totalM[2] || totalM[1]);
  }

  // CRITICAL: A genuine cricket match scorecard MUST have at least 1 authentic batsman or bowler performance.
  // If no player performances were extracted, this is NOT a scorecard (e.g. Pavilion, Squad, or Fixtures page).
  if (battingPerformances.length === 0 && bowlingPerformances.length === 0) {
    return null;
  }

  return {
    matchId,
    matchDate,
    rawMatchDate: rawDate,
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

export interface ParsedPavilion {
  clubUpdates: Partial<Club>;
  stadiumCapacity?: number;
  stadiumName?: string;
  bankBalance?: number;
  stadiumTiers?: StadiumTier[];
}

/**
 * Dedicated parser for Battrick's Pavilion / Club Headquarters page (default.asp / office.asp / club.asp)
 * Extracts Club Name, Club ID, Manager, Region, FC/OD/T20 Divisions, Ground, Capacity,
 * Bank Balance, Fan Members, Fan Mood, Sponsors, Morale, Youth Academy, and ITS Points.
 */
export function parseBattrickPavilion(input: string, fallbackClubId: string = ''): ParsedPavilion | null {
  if (!input || input.length < 30) return null;

  // Verify that this is genuine Pavilion / Club Office / Headquarters content
  const isPavilion = 
    input.includes('default.asp') ||
    input.includes('office.asp') ||
    input.includes('club.asp') ||
    input.includes('Pavilion') ||
    input.includes('Club Members:') ||
    input.includes('Youth Academy Condition') ||
    input.includes('Intensive Training Sessions') ||
    input.includes("Fan's Mood:") ||
    input.includes('Fan Club:') ||
    (input.includes('Manager:') && (input.includes('First Class:') || input.includes('One Day:') || input.includes('Ground:')));

  if (!isPavilion) return null;

  const clubUpdates: Partial<Club> = {};

  // 1. Club Name & ID
  const pageTitleMatch = input.match(/<div\s+id=["']pagetitle["'][^>]*>([^<]+?)(?:&#187;|&#8250;|>|\s+Pavilion|\s+Office|\s*$)/i);
  const h2Match = input.match(/<h2[^>]*>(?:Club:\s*)?([A-Za-z0-9\s\.\-_]+?)(?:\s*\((?:#)?(\d+)\))?<\/h2>/i);
  const clubTextMatch = input.match(/Club:\s*([A-Za-z0-9\s\.\-_]+?)(?:\s*\((?:#)?(\d+)\)|\s*#(\d+)|$)/im);
  const teamLinkMatch = input.match(/clubdetails\.asp\?teamID=(\d+)["'][^>]*>([^<]+)<\/a>/i);

  if (teamLinkMatch) {
    clubUpdates.id = teamLinkMatch[1].trim();
    clubUpdates.name = teamLinkMatch[2].replace(/&#187;/g, '').trim();
  } else if (pageTitleMatch && pageTitleMatch[1].trim() && !pageTitleMatch[1].toLowerCase().includes('battrick')) {
    clubUpdates.name = pageTitleMatch[1].trim();
  } else if (h2Match && h2Match[1].trim()) {
    clubUpdates.name = h2Match[1].trim();
    if (h2Match[2]) clubUpdates.id = h2Match[2].trim();
  } else if (clubTextMatch && clubTextMatch[1].trim()) {
    clubUpdates.name = clubTextMatch[1].trim();
    if (clubTextMatch[2] || clubTextMatch[3]) clubUpdates.id = (clubTextMatch[2] || clubTextMatch[3]).trim();
  }

  // Fallback ID search if not yet found
  if (!clubUpdates.id) {
    const idM = input.match(/teamID=(\d+)/i) || 
                input.match(/clubID=(\d+)/i) ||
                input.match(/\(#?(\d{4,8})\)/) ||
                input.match(/(?:Club\s+ID|Team\s+ID)[:\s]*#?(\d{4,8})/i);
    if (idM) clubUpdates.id = idM[1].trim();
  }

  // 2. Manager
  const mgrM = input.match(/Manager[:\s]*(?:<[^>]+>)*\s*([A-Za-z0-9\s\.\-_]+?)(?:<|\n|$)/i);
  if (mgrM) {
    const mgrClean = mgrM[1].replace(/<[^>]+>/g, '').trim();
    if (mgrClean && !mgrClean.toLowerCase().includes('unassigned')) clubUpdates.manager = mgrClean;
  }

  // 3. Country / Region
  const regM = input.match(/Region[:\s]*(?:<[^>]+>)*\s*([A-Za-z\s]+?)(?:<|\n|$)/i) ||
               input.match(/Country[:\s]*(?:<[^>]+>)*\s*([A-Za-z\s]+?)(?:<|\n|$)/i);
  if (regM) {
    const regClean = regM[1].replace(/<[^>]+>/g, '').trim();
    if (regClean) clubUpdates.region = regClean;
  }

  // 4. Leagues & Divisions
  const fcM = input.match(/First\s*Class[:\s]*(?:<[^>]+>)*\s*([IVXLCDM0-9.]+(?:\s*\([^)]+\))?)/i) ||
              input.match(/\bFC[:\s]*(?:<[^>]+>)*\s*([IVXLCDM0-9.]+)/i);
  if (fcM) clubUpdates.division_fc = fcM[1].trim();

  const odM = input.match(/One\s*Day[:\s]*(?:<[^>]+>)*\s*([IVXLCDM0-9.]+(?:\s*\([^)]+\))?)/i) ||
              input.match(/\bOD[:\s]*(?:<[^>]+>)*\s*([IVXLCDM0-9.]+)/i);
  if (odM) clubUpdates.division_od = odM[1].trim();

  const t20M = input.match(/(?:BT20|Twenty20|T20)[:\s]*(?:<[^>]+>)*\s*([IVXLCDM0-9.]+(?:\s*\([^)]+\))?)/i);
  if (t20M) clubUpdates.division_t20 = t20M[1].trim();

  // 5. Ground & Capacity
  const groundM = input.match(/Ground[:\s]*(?:<[^>]+>)*\s*<a[^>]*href=["'][^"']*grounddetails\.asp\?groundID=\d+["'][^>]*>([^<]+)<\/a>/i) ||
                  input.match(/Ground[:\s]*(?:<[^>]+>)*\s*<a[^>]*>([^<]+)<\/a>/i) ||
                  input.match(/Ground[:\s]*(?:<[^>]+>)*\s*([^<\n\r]+?)(?:<|\n|$)/i);
  let stadiumName: string | undefined;
  if (groundM) {
    stadiumName = groundM[1].replace(/<[^>]+>/g, '').trim();
    if (stadiumName) clubUpdates.stadium_name = stadiumName;
  }

  const capM = input.match(/Capacity[:\s]*(?:<[^>]+>)*\s*([0-9,]+)/i);
  let stadiumCapacity: number | undefined;
  if (capM) {
    stadiumCapacity = parseInt(capM[1].replace(/,/g, ''));
    clubUpdates.stadium_capacity = stadiumCapacity;
  }

  // 6. Treasury / Current Balance
  const balM = input.match(/(?:Current\s+)?Balance[:\s]*(?:<[^>]+>)*\s*[£$]?([0-9,]+)/i) ||
               input.match(/Treasury[:\s]*(?:<[^>]+>)*\s*[£$]?([0-9,]+)/i);
  let bankBalance: number | undefined;
  if (balM) {
    bankBalance = parseInt(balM[1].replace(/,/g, ''));
    clubUpdates.bank_balance = bankBalance;
  }

  // 7. Fan Club & Mood
  const fansM = input.match(/(?:Club\s+Members|Fan\s+Club)[:\s]*(?:<[^>]+>)*\s*([0-9,]+)/i) ||
                input.match(/Members[:\s]*(?:<[^>]+>)*\s*([0-9,]+)/i);
  if (fansM) {
    clubUpdates.fan_club_members = parseInt(fansM[1].replace(/,/g, ''));
  }

  const moodM = input.match(/Fan(?:'s|\s+Club)?\s*Mood[:\s]*(?:<[^>]+>)*\s*([A-Za-z\s]+?)(?:<|\n|$)/i);
  if (moodM) {
    const moodClean = moodM[1].replace(/<[^>]+>/g, '').trim();
    if (moodClean) clubUpdates.fan_mood = moodClean;
  }

  // 8. Sponsor Confidence
  const sponM = input.match(/Sponsors?[:\s]*(?:<[^>]+>)*\s*([A-Za-z\s]+?)(?:<|\n|$)/i);
  if (sponM) {
    const sponClean = sponM[1].replace(/<[^>]+>/g, '').trim();
    if (sponClean) clubUpdates.sponsor_confidence = sponClean;
  }

  // 9. Morale
  const moraleM = input.match(/(?:Team\s+)?Morale[:\s]*(?:<[^>]+>)*\s*([A-Za-z\s]+?)(?:<|\n|$)/i);
  if (moraleM) {
    const moraleClean = moraleM[1].replace(/<[^>]+>/g, '').trim();
    if (moraleClean) clubUpdates.morale = moraleClean;
  }

  // 10. Youth Academy
  const youthM = input.match(/Youth\s+Academy(?:\s+Condition)?[:\s]*(?:<[^>]+>)*\s*([A-Za-z\s]+?)(?:<|\n|$)/i);
  if (youthM) {
    const youthClean = youthM[1].replace(/<[^>]+>/g, '').trim();
    if (youthClean) clubUpdates.youth_academy_level = youthClean;
  }

  // 11. ITS Points
  const itsM = input.match(/Intensive\s+Training\s+Sessions[:\s]*(?:<[^>]+>)*\s*([0-9]+)/i) ||
               input.match(/\bITS[:\s]*(?:<[^>]+>)*\s*([0-9]+)/i);
  if (itsM) {
    clubUpdates.its_points = parseInt(itsM[1]);
  }

  // 12. Optional Stadium Tiers generation if capacity is found
  let stadiumTiers: StadiumTier[] | undefined;
  if (stadiumCapacity && stadiumCapacity > 0) {
    const cId = clubUpdates.id || fallbackClubId || 'Unassigned';
    stadiumTiers = [
      { id: 'st-1', club_id: cId, tier_name: 'Standing Room', current_seats: Math.round(stadiumCapacity * 0.5275), optimal_ratio: 0.5275, recommended_seats: Math.round(stadiumCapacity * 0.60), ticket_price: 5.00, expansion_cost_per_seat: 35.00 },
      { id: 'st-2', club_id: cId, tier_name: 'Uncovered Seats', current_seats: Math.round(stadiumCapacity * 0.3270), optimal_ratio: 0.3270, recommended_seats: Math.round(stadiumCapacity * 0.25), ticket_price: 8.00, expansion_cost_per_seat: 48.00 },
      { id: 'st-3', club_id: cId, tier_name: 'Covered Seats', current_seats: Math.round(stadiumCapacity * 0.1100), optimal_ratio: 0.1100, recommended_seats: Math.round(stadiumCapacity * 0.10), ticket_price: 14.00, expansion_cost_per_seat: 72.00 },
      { id: 'st-4', club_id: cId, tier_name: 'Members Seats', current_seats: Math.round(stadiumCapacity * 0.0355), optimal_ratio: 0.0355, recommended_seats: Math.round(stadiumCapacity * 0.05), ticket_price: 25.00, expansion_cost_per_seat: 120.00 }
    ];
  }

  return {
    clubUpdates,
    stadiumCapacity,
    stadiumName,
    bankBalance,
    stadiumTiers
  };
}

/**
 * Parses full fixtures list from battrick.org/nl/fixtures.asp
 */
export function parseBattrickFixtures(input: string, clubId: string = ''): MatchRecord[] {
  const matches: MatchRecord[] = [];
  if (!input.includes('fixtures') && !input.includes('Previous Matches') && !input.includes('Upcoming Matches')) {
    return matches;
  }

  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let match;
  while ((match = liRegex.exec(input)) !== null) {
    const liContent = match[1];
    const idM = liContent.match(/matchID=(\d+)/i);
    if (!idM) continue;
    const matchId = idM[1];

    const dateM = liContent.match(/<span[^>]*class=["']altcol["'][^>]*>\s*([0-3]?\d[\/\-.][0-1]?\d[\/\-.]20\d{2})/i);
    const originalDate = dateM ? dateM[1].trim() : '';
    const isoDate = normalizeToIsoDate(originalDate) || new Date().toISOString().split('T')[0];

    let matchType = 'First Class';
    if (/data-class=["']BT20["']|title=["']BT20["']/i.test(liContent)) {
      matchType = 'BT20';
    } else if (/data-class=["']OD(?:\s+Fr)?["']|title=["']OD/i.test(liContent)) {
      matchType = 'One Day';
    } else if (/data-class=["']FC["']|title=["']First Class["']/i.test(liContent)) {
      matchType = 'First Class';
    } else if (/BT20/i.test(liContent)) {
      matchType = 'BT20';
    } else if (/OD/i.test(liContent)) {
      matchType = 'One Day';
    }

    let opponent = 'Opposition XI';
    let isHome = false;
    const cleanClubId = String(clubId).replace(/^BT-/, '').trim();
    const teamLinks = [...liContent.matchAll(/<a[^>]*href=["'][^"']*clubdetails\.asp\?teamID=(\d+)["'][^>]*>([^<]+)<\/a>/gi)];

    if (teamLinks.length >= 2) {
      if (teamLinks[0][1] === cleanClubId) {
        opponent = teamLinks[1][2].trim();
        isHome = true;
      } else if (teamLinks[1][1] === cleanClubId) {
        opponent = teamLinks[0][2].trim();
        isHome = false;
      } else {
        opponent = teamLinks[1][2].trim();
      }
    } else {
      const teamsText = liContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      const vsM = teamsText.match(/([A-Za-z0-9\s]+?)\s+v(?:s)?\s+([A-Za-z0-9\s]+?)(?:\s+Won|\s+Lost|\s+Reporter|\s+Match|\s*$)/i);
      if (vsM) {
        if (vsM[1].toLowerCase().includes('somnath')) {
          opponent = vsM[2].trim();
          isHome = true;
        } else if (vsM[2].toLowerCase().includes('somnath')) {
          opponent = vsM[1].trim();
          isHome = false;
        } else {
          opponent = vsM[2].trim();
        }
      }
    }

    let result = 'Match Concluded';
    if (liContent.includes('class="won"')) result = isHome ? 'Home Team Won' : 'Away Team Won';
    else if (liContent.includes('class="lost"')) result = `${opponent} Won`;
    else if (liContent.includes('class="draw"')) result = 'Match Drawn';
    else if (liContent.includes('class="tied"')) result = 'Match Tied';

    matches.push({
      id: matchId,
      club_id: clubId,
      match_date: isoDate,
      match_type: matchType,
      opponent_club: opponent,
      venue: isHome ? 'Home Ground' : 'Away Grounds',
      pitch_type: 'Standard',
      result,
      status: 'completed',
      scoreSummary: `${matchType} fixture`,
      topPerformer: undefined
    });
  }

  return matches;
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
  type CricketFormatKey = 'FC' | 'OD' | 'T20' | 'U19' | 'National' | 'Friendly';

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
    inningsBowled: number;
    oversBowled: number;
    maidens: number;
    wickets: number;
    runsConceded: number;
    bestBowlingWkts: number;
    bestBowlingRuns: number;
    bestBowlingMatchWkts: number;
    bestBowlingMatchRuns: number;
    fourWickets: number;
    fiveWickets: number;
    tenWickets: number;
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
    inningsBowled: 0,
    oversBowled: 0,
    maidens: 0,
    wickets: 0,
    runsConceded: 0,
    bestBowlingWkts: 0,
    bestBowlingRuns: 999,
    bestBowlingMatchWkts: 0,
    bestBowlingMatchRuns: 999,
    fourWickets: 0,
    fiveWickets: 0,
    tenWickets: 0,
    catches: 0,
    stumpings: 0
  });

  const playerAccs = new Map<string, Record<CricketFormatKey, Accumulator>>();

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
      T20: createBlankAcc(),
      U19: createBlankAcc(),
      National: createBlankAcc(),
      Friendly: createBlankAcc()
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

  // Match format classifier supporting FC, OD, BT20, U19, National, Friendly
  const classifyMatchFormat = (m: MatchRecord): CricketFormatKey => {
    const t = (m.match_type || '').toLowerCase();
    const sc = m.scorecardData as ParsedScorecard | undefined;
    const opp = (m.opponent_club || '').toLowerCase();
    const venue = (m.venue || '').toLowerCase();

    if (t.includes('u19') || t.includes('under-19') || t.includes('youth') || opp.includes('u19')) {
      return 'U19';
    }
    if (t.includes('national') || t.includes('international') || t.includes('inter-continental') || t.includes('world cup') || t.includes('nat ')) {
      return 'National';
    }
    if (t.includes('friendly') || t.includes('fr ') || venue.includes('friendly') || (sc && sc.format && sc.format.toLowerCase().includes('friendly'))) {
      return 'Friendly';
    }
    if (t === 'one day' || t === 'od' || t.includes('list a')) {
      return 'OD';
    }
    if (t === 'bt20' || t === 't20' || t.includes('twenty20')) {
      return 'T20';
    }
    return 'FC';
  };

  // Process all matches
  for (const match of matches) {
    const formatKey = classifyMatchFormat(match);

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
      acc.inningsBowled += 1;
      acc.oversBowled += bowl.overs;
      acc.maidens += bowl.maidens;
      acc.runsConceded += bowl.runs;
      acc.wickets += bowl.wickets;

      if (bowl.wickets === 4) {
        acc.fourWickets += 1;
      } else if (bowl.wickets >= 5) {
        acc.fiveWickets += 1;
      }
      if (bowl.wickets >= 10) {
        acc.tenWickets += 1;
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
    const notOuts = Math.max(0, acc.innings - acc.outs);
    const average = acc.outs > 0 ? parseFloat((acc.runs / acc.outs).toFixed(2)) : acc.runs > 0 ? acc.runs : 0;
    const strikeRate = acc.balls > 0 ? parseFloat(((acc.runs / acc.balls) * 100).toFixed(2)) : 0;
    const bestBowling = acc.bestBowlingWkts > 0 ? `${acc.bestBowlingWkts}/${acc.bestBowlingRuns}` : '-';
    const bestBowlingMatch = acc.bestBowlingMatchWkts > 0 
      ? `${acc.bestBowlingMatchWkts}/${acc.bestBowlingMatchRuns}` 
      : bestBowling;
    const bowlingAvg = acc.wickets > 0 ? parseFloat((acc.runsConceded / acc.wickets).toFixed(2)) : 0;
    const wholeOvers = Math.floor(acc.oversBowled);
    const partialBalls = Math.round((acc.oversBowled - wholeOvers) * 10);
    const totalBalls = wholeOvers * 6 + partialBalls;
    const actualOvers = totalBalls > 0 ? totalBalls / 6 : 0;
    const economy = actualOvers > 0 ? parseFloat((acc.runsConceded / actualOvers).toFixed(2)) : 0;
    const bowlingStrikeRate = acc.wickets > 0 ? parseFloat((totalBalls / acc.wickets).toFixed(1)) : 0;

    return {
      matches: matchesCount,
      innings: acc.innings,
      notOuts,
      runs: acc.runs,
      highestScore: acc.highestScoreStr,
      average,
      ballsFaced: acc.balls,
      strikeRate,
      centuries: acc.centuries,
      fifties: acc.fifties,
      fours: acc.fours,
      sixes: acc.sixes,
      catches: acc.catches,
      stumpings: acc.stumpings,

      inningsBowled: acc.inningsBowled,
      ballsBowled: totalBalls,
      runsConceded: acc.runsConceded,
      oversBowled: parseFloat(acc.oversBowled.toFixed(1)),
      wickets: acc.wickets,
      bestBowling,
      bestBowlingMatch,
      bowlingAverage: bowlingAvg,
      economy,
      bowlingStrikeRate,
      fourWickets: acc.fourWickets,
      fiveWickets: acc.fiveWickets,
      tenWickets: acc.tenWickets
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
        statsT20: { ...EMPTY_STATS },
        statsU19: { ...EMPTY_STATS },
        statsNational: { ...EMPTY_STATS },
        statsFriendly: { ...EMPTY_STATS }
      };
    }

    return {
      ...player,
      statsFC: accToStats(acc.FC),
      statsOD: accToStats(acc.OD),
      statsT20: accToStats(acc.T20),
      statsU19: accToStats(acc.U19),
      statsNational: accToStats(acc.National),
      statsFriendly: accToStats(acc.Friendly)
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
      holder: 'Club XI',
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
