import {
  Player,
  PlayerStats,
  CalendarEvent,
  TrainingLog,
  NetAllocation,
  FinancialRecord
} from '../types/database';
import { EMPTY_STATS } from './matchStatsEngine';

const SKILL_LEVELS = [
  'worthless', 'abysmal', 'woeful', 'feeble', 'mediocre', 'competent',
  'respectable', 'proficient', 'strong', 'superb', 'quality', 'remarkable',
  'wonderful', 'exceptional', 'sensational', 'exquisite', 'masterful',
  'miraculous', 'phenomenal', 'elite'
];

function extractSkillWord(text: string, label: string): string | undefined {
  const rx = new RegExp(`${label}[:\\s]+(?:<[^>]+>\\s*)*(${SKILL_LEVELS.join('|')})`, 'i');
  const m = text.match(rx);
  return m ? m[1].toLowerCase() : undefined;
}

/**
 * Parses a Battrick Player Details page (playerdetails.asp) — HTML or copied plain text.
 * Extracts core attributes, all 11 skills, and career statistics if present.
 */
export function parseBattrickPlayerDetails(
  input: string,
  clubId: string,
  existingSquad: Player[] = []
): Partial<Player> | null {
  const clean = input.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&#163;|&pound;/g, '£').replace(/\s+/g, ' ');

  const idMatch = input.match(/playerID=(\d+)/i) || clean.match(/\bID[:\s#]*(\d{5,8})\b/i) || clean.match(/\((\d{5,8})\)/);
  const pId = idMatch ? idMatch[1] : undefined;

  // Name extraction from <title> or <h1>/<h2> or first line
  let name = '';
  const titleM = input.match(/<h[12][^>]*>([^<]+)<\/h[12]>/i) || input.match(/playerdetails\.asp\?playerID=\d+[^>]*>([^<]+)<\/a>/i);
  if (titleM && !/battrick|player details/i.test(titleM[1])) {
    name = titleM[1].replace(/\(\d+\)/, '').trim();
  }
  if (!name) {
    const lineM = clean.match(/^([A-Z][a-zA-Z'-]+(?:\s+[A-Z][a-zA-Z'-]+){1,3})\s*(?:-|–|\(|Age|\d+\s*yo)/);
    if (lineM) name = lineM[1].trim();
  }

  const existing = existingSquad.find(p => (pId && p.id === pId) || (name && p.name.toLowerCase() === name.toLowerCase()));
  const finalId = pId || existing?.id;
  const finalName = name || existing?.name;

  if (!finalId && !finalName) return null;

  const ageM = clean.match(/(?:Age|aged?)[:\s]*(\d{2})/i) || clean.match(/(\d{2})\s*(?:yo|years?\s*old)/i);
  const wageM = clean.match(/Wage[:\s]*£?\s*([0-9,]+)/i);
  const btiM = clean.match(/(?:BTI|BTR)[:\s]*([0-9,]+)/i);

  const batHandM = clean.match(/(Right|Left)[-\s]*hand(?:ed)?\s*batsman/i) || clean.match(/\b(RHB|LHB)\b/i);
  const bowlTypeM = clean.match(/((?:Right|Left)[-\s]*arm\s*(?:Fast|Fast Medium|Medium|Finger Spin|Wrist Spin|Slow)(?:\s*(?:Off|Leg)\s*Spin)?)/i);

  const batting = extractSkillWord(input, 'Batting') || existing?.batting || 'mediocre';
  const bowling = extractSkillWord(input, 'Bowling') || existing?.bowling || 'mediocre';
  const keeping = extractSkillWord(input, 'Wicket\\s*Keeping|Keeping') || existing?.keeping || 'worthless';
  const fielding = extractSkillWord(input, 'Fielding') || existing?.fielding || 'mediocre';
  const concentration = extractSkillWord(input, 'Concentration') || existing?.concentration || 'mediocre';
  const consistency = extractSkillWord(input, 'Consistency') || existing?.consistency || 'mediocre';
  const stamina = extractSkillWord(input, 'Stamina') || existing?.stamina || 'competent';
  const form = extractSkillWord(input, 'Form') || existing?.form || 'proficient';
  const leadership = extractSkillWord(input, 'Leadership') || existing?.leadership || 'worthless';
  const experience = extractSkillWord(input, 'Experience') || existing?.experience || 'worthless';
  const fatigueM = clean.match(/Fatigue[:\s]*([a-zA-Z]+)/i);

  const age = ageM ? parseInt(ageM[1]) : (existing?.age ?? 20);
  const wage = wageM ? parseInt(wageM[1].replace(/,/g, '')) : (existing?.wage ?? 500);
  const bti = btiM ? parseInt(btiM[1].replace(/,/g, '')) : (existing?.bti ?? 5000);

  // Parse career stats table rows if present (First Class, One Day, BT20, Friendly)
  const parseFormatRow = (labelRx: RegExp, fallback?: PlayerStats): PlayerStats => {
    const m = clean.match(new RegExp(`${labelRx.source}\\s+(\\d+)\\s+(\\d+)\\s+(\\d+)\\s+(\\d+)\\s+(\\d+\\*?)\\s+([0-9.]+)\\s+(\\d+)\\s+(\\d+)`, 'i'));
    if (!m) return fallback ? { ...fallback } : { ...EMPTY_STATS };
    return {
      ...(fallback || EMPTY_STATS),
      matches: parseInt(m[1]) || 0,
      innings: parseInt(m[2]) || 0,
      notOuts: parseInt(m[3]) || 0,
      runs: parseInt(m[4]) || 0,
      highestScore: m[5] || '-',
      average: parseFloat(m[6]) || 0,
      centuries: parseInt(m[7]) || 0,
      fifties: parseInt(m[8]) || 0
    };
  };

  const statsFC = parseFormatRow(/First\s*Class|FC/, existing?.statsFC);
  const statsOD = parseFormatRow(/One\s*Day|OD|List\s*A/, existing?.statsOD);
  const statsT20 = parseFormatRow(/BT20|T20/, existing?.statsT20);
  const statsFriendly = parseFormatRow(/Friendly/, existing?.statsFriendly);

  return {
    ...(existing || {}),
    id: finalId || `P-${Date.now().toString().slice(-6)}`,
    club_id: clubId,
    name: finalName || `Player ${finalId}`,
    age,
    wage,
    bti,
    batting_hand: batHandM ? (batHandM[1].toUpperCase().startsWith('L') ? 'Left hand batsman' : 'Right hand batsman') : (existing?.batting_hand || 'Right hand batsman'),
    bowling_type: bowlTypeM ? bowlTypeM[1].trim() : (existing?.bowling_type || 'Right arm medium'),
    batting,
    bowling,
    keeping,
    fielding,
    concentration,
    consistency,
    stamina,
    form,
    fatigue: fatigueM ? fatigueM[1].toLowerCase() : (existing?.fatigue || 'energised'),
    leadership,
    experience,
    subskill: existing?.subskill ?? 0,
    active_net: existing?.active_net ?? 'Unassigned',
    market_value: existing?.market_value ?? Math.round(bti * 18),
    tactical_role: existing?.tactical_role ?? 'Squad Member',
    is_wonderkid: age <= 19,
    uniqueRecords: existing?.uniqueRecords ?? [],
    statsFC,
    statsOD,
    statsT20,
    statsFriendly
  };
}

/**
 * Parses Battrick Club Diary (diary.asp) into CalendarEvents and TrainingLogs.
 */
export function parseBattrickDiary(
  input: string,
  clubId: string
): { events: CalendarEvent[]; trainingLogs: TrainingLog[] } {
  const cleanText = input
    .replace(/<\/tr>|<\/div>|<\/li>|<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#163;|&pound;/g, '£');

  const lines = cleanText.split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter(l => l.length > 8);
  const events: CalendarEvent[] = [];
  const trainingLogs: TrainingLog[] = [];

  const dateLineRx = /^(\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})(?:\s+\d{2}:\d{2})?[:\s-]*(.+)$/;

  lines.forEach((line, idx) => {
    const m = line.match(dateLineRx);
    const dateStr = m ? m[1] : new Date().toISOString().split('T')[0];
    const body = m ? m[2].trim() : line;

    // Skip navigation/header noise
    if (/^(home|office|squad|fixtures|finances|ground|nets|diary|calendar|logout|battrick)/i.test(body)) return;
    if (!m && !/(popped|training|match|won|lost|drawn|sponsor|youth|transfer|promoted|signed|stadium|upgraded)/i.test(body)) return;

    const lower = body.toLowerCase();

    // Detect training pop
    const popMatch = body.match(/([A-Z][a-zA-Z\s'-]+?)\s+(?:has\s+)?popped\s+(?:in\s+)?([a-zA-Z\s]+?)\s+(?:from\s+([a-zA-Z]+)\s+)?to\s+([a-zA-Z]+)/i);
    if (popMatch) {
      trainingLogs.push({
        id: `diary-pop-${Date.now()}-${idx}`,
        club_id: clubId,
        player_id: '',
        player_name: popMatch[1].trim(),
        log_date: dateStr,
        skill_trained: popMatch[2].trim(),
        previous_level: popMatch[3] ? popMatch[3].toLowerCase() : 'previous',
        new_level: popMatch[4].toLowerCase(),
        subskill: 0,
        weeks_taken: 1,
        coach_quality: 'Club Coach',
        pop_confirmed: true
      });
    }

    let type: CalendarEvent['type'] = 'SPONSOR_PAYMENT';
    let importance: CalendarEvent['importance'] = 'NORMAL';

    if (lower.includes('first class') || lower.includes('fc ')) {
      type = 'MATCH_FC';
      importance = 'HIGH';
    } else if (lower.includes('one day') || lower.includes('od ')) {
      type = 'MATCH_OD';
      importance = 'HIGH';
    } else if (lower.includes('bt20') || lower.includes('t20')) {
      type = 'MATCH_T20';
      importance = 'HIGH';
    } else if (lower.includes('popped') || lower.includes('training')) {
      type = 'TRAINING_POP';
      importance = 'CRITICAL';
    } else if (lower.includes('youth') || lower.includes('academy') || lower.includes('pull')) {
      type = 'YOUTH_DRAFT';
      importance = 'HIGH';
    } else if (lower.includes('finance') || lower.includes('gate') || lower.includes('wage') || lower.includes('£')) {
      type = 'FINANCE_UPDATE';
    }

    events.push({
      id: `diary-${idx}-${dateStr.replace(/[^a-zA-Z0-9]/g, '')}`,
      date: dateStr,
      dayOfWeek: 'Diary',
      time: '00:00',
      type,
      title: body.length > 60 ? body.slice(0, 57) + '...' : body,
      details: body,
      importance
    });
  });

  return { events, trainingLogs };
}

/**
 * Parses Battrick Calendar / Upcoming Schedule (calendar.asp / fixtures.asp) into CalendarEvents.
 */
export function parseBattrickCalendar(input: string): CalendarEvent[] {
  const cleanText = input
    .replace(/<\/tr>|<\/div>|<\/li>|<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ');

  const lines = cleanText.split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter(l => l.length > 6);
  const events: CalendarEvent[] = [];

  lines.forEach((line, idx) => {
    const dateM = line.match(/(\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}\s+[A-Za-z]{3,9}(?:\s+\d{4})?)/);
    const timeM = line.match(/(\d{2}:\d{2})/);
    const dayM = line.match(/\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/i);

    if (!dateM && !dayM) return;
    if (/^(home|office|squad|calendar|diary|battrick)/i.test(line)) return;

    const lower = line.toLowerCase();
    let type: CalendarEvent['type'] = 'MATCH_OD';
    let importance: CalendarEvent['importance'] = 'NORMAL';

    if (lower.includes('first class') || lower.includes('fc')) {
      type = 'MATCH_FC';
      importance = 'HIGH';
    } else if (lower.includes('bt20') || lower.includes('t20')) {
      type = 'MATCH_T20';
      importance = 'HIGH';
    } else if (lower.includes('training') || lower.includes('pop')) {
      type = 'TRAINING_POP';
      importance = 'CRITICAL';
    } else if (lower.includes('finance') || lower.includes('economy') || lower.includes('wage')) {
      type = 'FINANCE_UPDATE';
    } else if (lower.includes('youth')) {
      type = 'YOUTH_DRAFT';
      importance = 'HIGH';
    } else if (!lower.includes('vs') && !lower.includes(' v ') && !lower.includes('friendly') && !lower.includes('cup') && !lower.includes('one day')) {
      return;
    }

    events.push({
      id: `cal-${idx}-${(dateM?.[1] || dayM?.[1] || idx).toString().replace(/[^a-zA-Z0-9]/g, '')}`,
      date: dateM ? dateM[1] : (dayM ? dayM[1] : 'Upcoming'),
      dayOfWeek: dayM ? dayM[1] : 'Scheduled',
      time: timeM ? timeM[1] : '05:00',
      type,
      title: line.length > 65 ? line.slice(0, 62) + '...' : line,
      details: line,
      importance
    });
  });

  return events;
}

/**
 * Parses Battrick Nets / Training page (nets.asp) into NetAllocations.
 */
export function parseBattrickNets(
  input: string,
  clubId: string,
  existingSquad: Player[] = []
): NetAllocation[] {
  const cleanText = input
    .replace(/<\/tr>|<\/div>|<\/li>|<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ');

  const lines = cleanText.split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const nets: NetAllocation[] = [];

  // Look for explicit "Net 1: Player Name - Batting" or "1. Batting - Player Name" patterns
  const netLineRx = /Net\s*#?(\d{1,2})\s*[:\-|]?\s*(.+)/i;

  lines.forEach(line => {
    const m = line.match(netLineRx);
    if (!m) return;
    const netNum = parseInt(m[1]);
    if (netNum < 1 || netNum > 10) return;

    const rest = m[2].trim();
    const isUnassigned = /unassigned|none|empty/i.test(rest);

    const skillM = rest.match(/(Batting|Bowling|Wicket\s*Keeping|Keeping|Fielding|Stamina|Fitness|Concentration|Consistency)/i);
    const trainingType = skillM ? skillM[1] : 'General Training';

    let matchedPlayer: Player | undefined;
    if (!isUnassigned) {
      matchedPlayer = existingSquad.find(p =>
        rest.toLowerCase().includes(p.name.toLowerCase()) ||
        (p.id && rest.includes(p.id))
      );
    }

    const playerNameGuess = matchedPlayer?.name || (isUnassigned ? 'Unassigned' : rest.split(/[-|(:]/)[0].trim() || 'Assigned Player');

    if (!nets.some(n => n.net_number === netNum)) {
      nets.push({
        club_id: clubId,
        net_number: netNum,
        training_type: trainingType,
        player_id: matchedPlayer?.id || null,
        player_name: playerNameGuess,
        coach_multiplier: 1.0,
        pops_estimated_weeks: null,
        notes: rest
      });
    }
  });

  // Also detect player-centric net rows if no "Net X" prefix was found
  if (nets.length === 0) {
    let idx = 1;
    for (const p of existingSquad) {
      const pRx = new RegExp(`${p.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\\n]{0,80}(Batting|Bowling|Keeping|Fielding|Stamina|Fitness)`, 'i');
      const m = cleanText.match(pRx);
      if (m && idx <= 10) {
        nets.push({
          club_id: clubId,
          net_number: idx++,
          training_type: m[1],
          player_id: p.id,
          player_name: p.name,
          coach_multiplier: 1.0,
          pops_estimated_weeks: null,
          notes: `${p.name} assigned to ${m[1]} net`
        });
      }
    }
  }

  // Ensure at least standard 5-10 slots if page was detected as nets.asp with unassigned status
  if (nets.length === 0) {
    for (let i = 1; i <= 5; i++) {
      nets.push({
        club_id: clubId,
        net_number: i,
        training_type: ['Batting', 'Bowling', 'Fielding', 'Wicket Keeping', 'Stamina'][i - 1],
        player_id: null,
        player_name: 'Unassigned',
        coach_multiplier: 1.0,
        pops_estimated_weeks: null,
        notes: 'Net unassigned'
      });
    }
  }

  return nets.sort((a, b) => a.net_number - b.net_number);
}

/**
 * Parses Battrick Finances page (finances.asp) without hardcoded dummy data.
 */
export function parseBattrickFinances(input: string, clubId: string): { finances: FinancialRecord[]; bankBalance?: number } {
  const clean = input.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&#163;|&pound;/g, '£').replace(/\s+/g, ' ');

  const parseNum = (rx: RegExp): number => {
    const m = clean.match(rx);
    return m ? parseInt(m[1].replace(/,/g, ''), 10) || 0 : 0;
  };

  const bankBalance = parseNum(/(?:Current\s*Balance|Closing\s*Balance|Cash\s*Balance)[:\s]*£?\s*(-?[0-9,]+)/i);
  const gateReceipts = parseNum(/Gate\s*Receipts[:\s]*£?\s*([0-9,]+)/i);
  const sponsors = parseNum(/Sponsors(?:hip)?[:\s]*£?\s*([0-9,]+)/i);
  const merchandise = parseNum(/Merchandise[:\s]*£?\s*([0-9,]+)/i);
  const prizeMoney = parseNum(/Prize\s*Money[:\s]*£?\s*([0-9,]+)/i);
  const playerWages = parseNum(/Player\s*(?:Salaries|Wages)[:\s]*-?£?\s*([0-9,]+)/i);
  const staffWages = parseNum(/(?:Backroom\s*)?Staff\s*(?:Salaries|Wages)[:\s]*-?£?\s*([0-9,]+)/i);
  const stadiumUpkeep = parseNum(/(?:Ground\s*Maintenance|Stadium\s*Upkeep)[:\s]*-?£?\s*([0-9,]+)/i);
  const youthAcademy = parseNum(/(?:Youth\s*Academy|ITS)[:\s]*-?£?\s*([0-9,]+)/i);

  const paymentsIn = parseNum(/Payments\s*In[:\s]*£?\s*([0-9,]+)/i);
  const paymentsOut = parseNum(/Payments\s*Out[:\s]*£?\s*([0-9,]+)/i);

  const totalInflow = (gateReceipts + sponsors + merchandise + prizeMoney) || paymentsIn;
  const totalOutflow = (playerWages + staffWages + stadiumUpkeep + youthAcademy) || paymentsOut;
  const netPnl = totalInflow - totalOutflow;

  const record: FinancialRecord = {
    id: `fin-${Date.now()}`,
    club_id: clubId,
    week_number: 1,
    record_date: new Date().toISOString().split('T')[0],
    gate_receipts: gateReceipts,
    sponsors,
    merchandise,
    prize_money: prizeMoney,
    total_inflow: totalInflow,
    player_wages: playerWages,
    staff_wages: staffWages,
    stadium_upkeep: stadiumUpkeep,
    youth_academy: youthAcademy,
    total_outflow: totalOutflow,
    net_weekly_pnl: netPnl,
    cumulative_bank_balance: bankBalance,
    category: 'Imported Battrick Financial Statement'
  };

  return {
    finances: [record],
    bankBalance: bankBalance || undefined
  };
}
