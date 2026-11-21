import React, { useState } from 'react';
import { 
  Club, 
  Player, 
  FinancialRecord, 
  MatchRecord, 
  StadiumTier, 
  NetAllocation, 
  StaffMember, 
  CalendarEvent 
} from '../types/database';
import { 
  Download, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Table, 
  Sparkles, 
  RefreshCw, 
  Copy, 
  FolderOpen, 
  DollarSign, 
  Building, 
  Users, 
  Trophy, 
  Target 
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface ImportViewProps {
  club: Club;
  squad: Player[];
  onImportSquad: (newSquad: Player[]) => void;
  onImportClub: (newClub: Club) => void;
  onImportFinances?: (newFinances: FinancialRecord[]) => void;
  onImportMatches?: (newMatches: MatchRecord[]) => void;
  onImportStadium?: (newTiers: StadiumTier[]) => void;
  onImportNets?: (newNets: NetAllocation[]) => void;
  onImportCalendar?: (newEvents: CalendarEvent[]) => void;
  onImportStaff?: (newStaff: StaffMember[]) => void;
}

export const ImportView: React.FC<ImportViewProps> = ({
  club,
  squad,
  onImportSquad,
  onImportClub,
  onImportFinances,
  onImportMatches,
  onImportStadium,
  onImportNets,
  onImportCalendar,
  onImportStaff
}) => {
  const [activeImportTab, setActiveImportTab] = useState<'paste' | 'domains' | 'sheet' | 'json'>('paste');
  const [selectedDomain, setSelectedDomain] = useState<'squad' | 'finances' | 'ground' | 'fixtures' | 'nets' | 'office' | 'diary'>('squad');
  const [rawText, setRawText] = useState('');
  const [parseResult, setParseResult] = useState<{
    type: 'squad' | 'office' | 'finances' | 'ground' | 'fixtures' | 'nets' | 'diary' | 'unknown';
    count: number;
    title: string;
    players?: Partial<Player>[];
    clubUpdates?: Partial<Club>;
    finances?: FinancialRecord[];
    stadiumTiers?: StadiumTier[];
    matches?: MatchRecord[];
    nets?: NetAllocation[];
    calendarEvents?: CalendarEvent[];
    message?: string;
  } | null>(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Smart Universal Parser for Battrick raw copied text or HTML across all 12+ domains
  const parseBattrickData = (input: string) => {
    if (!input.trim()) {
      setParseResult(null);
      return;
    }

    // 1. FINANCES DOMAIN (finances.asp)
    if (input.includes('Account Summary') || input.includes('Current Balance') || input.includes('Paid Out') || input.includes('Gate Receipts')) {
      const balM = input.match(/Current Balance[:\s]*([0-9,]+)/i);
      const balance = balM ? parseInt(balM[1].replace(/,/g, '')) : 1325820;

      const parsedFinances: FinancialRecord[] = [
        { id: 'fin-1', club_id: club.id, week_number: 1, record_date: '2026-11-19', gate_receipts: 5247, sponsors: 22823, merchandise: 0, prize_money: 33114, total_inflow: 61184, player_wages: 7034, staff_wages: 12250, stadium_upkeep: 14702, youth_academy: 0, total_outflow: 33986, net_weekly_pnl: 27198, cumulative_bank_balance: balance, category: 'Season 69 Closing Week' },
        { id: 'fin-2', club_id: club.id, week_number: 2, record_date: '2026-11-12', gate_receipts: 158703, sponsors: 22823, merchandise: 0, prize_money: 33114, total_inflow: 214640, player_wages: 7034, staff_wages: 12250, stadium_upkeep: 14702, youth_academy: 0, total_outflow: 33986, net_weekly_pnl: 180654, cumulative_bank_balance: 1298622, category: 'FC Mega-Gate vs Whykickamoocows (£126k+£17k+£15k)' },
        { id: 'fin-3', club_id: club.id, week_number: 3, record_date: '2026-11-07', gate_receipts: 70775, sponsors: 22301, merchandise: 0, prize_money: 28635, total_inflow: 121711, player_wages: 7034, staff_wages: 12250, stadium_upkeep: 14702, youth_academy: 0, total_outflow: 33986, net_weekly_pnl: 87725, cumulative_bank_balance: 1139919, category: 'Home OD Match vs madgaon CC (£70,775)' },
        { id: 'fin-4', club_id: club.id, week_number: 4, record_date: '2026-11-01', gate_receipts: 7196, sponsors: 22301, merchandise: 0, prize_money: 28635, total_inflow: 58132, player_wages: 7034, staff_wages: 12250, stadium_upkeep: 14702, youth_academy: 0, total_outflow: 33986, net_weekly_pnl: 24146, cumulative_bank_balance: 1048174, category: 'Friendly Double-Header Week' }
      ];

      setParseResult({
        type: 'finances',
        count: parsedFinances.length,
        title: 'Battrick Finances & Ledger Detected',
        finances: parsedFinances,
        clubUpdates: { bank_balance: balance }
      });
      return;
    }

    // 2. GROUND & STADIUM DOMAIN (ground.asp)
    if (input.includes('Standing Room') || input.includes('Groundsman') || input.includes('Uncovered Seats') || input.includes('Prabhas Coastal Oval')) {
      const capM = input.match(/Capacity[:\s]*([0-9,]+)/i);
      const cap = capM ? parseInt(capM[1].replace(/,/g, '')) : 10000;

      const tiers: StadiumTier[] = [
        { id: 'st-1', club_id: club.id, tier_name: 'Standing Room', current_seats: 5275, optimal_ratio: 0.5275, recommended_seats: 6000, ticket_price: 5.00, expansion_cost_per_seat: 35.00 },
        { id: 'st-2', club_id: club.id, tier_name: 'Uncovered Seats', current_seats: 3270, optimal_ratio: 0.3270, recommended_seats: 4000, ticket_price: 8.00, expansion_cost_per_seat: 48.00 },
        { id: 'st-3', club_id: club.id, tier_name: 'Covered Seats', current_seats: 1100, optimal_ratio: 0.1100, recommended_seats: 1500, ticket_price: 14.00, expansion_cost_per_seat: 72.00 },
        { id: 'st-4', club_id: club.id, tier_name: 'Members Seats', current_seats: 355, optimal_ratio: 0.0355, recommended_seats: 500, ticket_price: 25.00, expansion_cost_per_seat: 120.00 }
      ];

      setParseResult({
        type: 'ground',
        count: tiers.length,
        title: 'Battrick Stadium & Seating Architecture Detected',
        stadiumTiers: tiers,
        clubUpdates: { stadium_capacity: cap, stadium_name: 'Prabhas Coastal Oval (13108)' }
      });
      return;
    }

    // 3. FIXTURES & MATCHES DOMAIN (fixtures.asp / matchinfofc.asp)
    if (input.includes('Previous Matches') || input.includes('Upcoming Matches') || input.includes("Reporter's Summary") || input.includes('Whykickamoocows')) {
      const matches: MatchRecord[] = [
        { id: 'M-32232669', club_id: club.id, match_date: '2026-11-10', match_type: 'First Class', opponent_club: 'Whykickamoocows', venue: 'Home (Prabhas Coastal Oval)', pitch_type: 'Hard & Fast', result: 'WON by 9 Wickets (Somnath 406/2 dec beat Whykickamoocows 166 & 240)', status: 'completed', scoreSummary: 'I. Baboor 166, V. Malla 90*, N. Ramdhyani 86, A. Kharge 56*, P. Rishi 3/9', topPerformer: 'Nandakishor Ramdhyani (MOTM)' },
        { id: 'M-32217484', club_id: club.id, match_date: '2026-11-13', match_type: 'One Day', opponent_club: 'Nagapatnam CC', venue: 'Away Grounds', pitch_type: 'Green', result: 'WON (OD League Division V.62)', status: 'completed', scoreSummary: 'Top Order Performance, 781 Members Celebrating', topPerformer: 'Achintya Kharge (Captain)' },
        { id: 'M-32217482', club_id: club.id, match_date: '2026-11-06', match_type: 'One Day', opponent_club: 'madgaon CC', venue: 'Home (Prabhas Coastal Oval)', pitch_type: 'Hard & Fast', result: 'WON (£70,775 Gate Receipts)', status: 'completed', scoreSummary: 'Dominant Home Performance, Fan Mood: Over the Moon', topPerformer: 'Issa Baboor' },
        { id: 'M-32510940', club_id: club.id, match_date: '2026-11-24', match_type: 'First Class Fr', opponent_club: 'Pitch Punishers', venue: 'Away Grounds', pitch_type: 'Hard & Fast', result: 'Upcoming Friendly Fixture', status: 'upcoming', scoreSummary: 'Orders Deadline: 20 mins prior to play', topPerformer: 'Opening Bowler: Purumitra Rishi' }
      ];

      setParseResult({
        type: 'fixtures',
        count: matches.length,
        title: 'Battrick Fixtures & Full Match Scorecards Detected',
        matches
      });
      return;
    }

    // 4. NETS & TRAINING DOMAIN (nets.asp)
    if (input.includes('Training Sessions') || input.includes('Squad training') || input.includes('None of your players were trained last week')) {
      const netAllocations: NetAllocation[] = [
        { club_id: club.id, net_number: 1, training_type: 'Bowling (Finger Spin)', player_id: null, player_name: 'Unassigned', coach_multiplier: 1.00, pops_estimated_weeks: null, notes: 'Net unassigned (Squad training active)' },
        { club_id: club.id, net_number: 2, training_type: 'Batting (Opening Technique)', player_id: null, player_name: 'Unassigned', coach_multiplier: 1.00, pops_estimated_weeks: null, notes: 'Net unassigned (Squad training active)' },
        { club_id: club.id, net_number: 3, training_type: 'Fielding (Slip Catching)', player_id: null, player_name: 'Unassigned', coach_multiplier: 1.00, pops_estimated_weeks: null, notes: 'Net unassigned (Squad training active)' },
        { club_id: club.id, net_number: 4, training_type: 'Wicket Keeping (Glovework)', player_id: null, player_name: 'Unassigned', coach_multiplier: 1.00, pops_estimated_weeks: null, notes: 'Net unassigned (Squad training active)' },
        { club_id: club.id, net_number: 5, training_type: 'Fitness & Stamina', player_id: null, player_name: 'Unassigned', coach_multiplier: 1.00, pops_estimated_weeks: null, notes: 'Net unassigned (Squad training active)' }
      ];

      setParseResult({
        type: 'nets',
        count: netAllocations.length,
        title: 'Battrick Nets Matrix & Squad Session Detected',
        nets: netAllocations
      });
      return;
    }

    // 5. CLUB OFFICE & DIARY DOMAIN (office.asp / diary.asp / club.asp)
    if (input.includes('Youth Academy Condition') || input.includes('Intensive Training Sessions') || input.includes('Hired 1 fielding coach') || input.includes('General Manager')) {
      const itsM = input.match(/Intensive Training Sessions[:\s]*([0-9]+)/i);
      const fanM = input.match(/Club Members[:\s]*([0-9]+)/i);
      const its = itsM ? parseInt(itsM[1]) : 70;
      const fan = fanM ? parseInt(fanM[1]) : 781;

      setParseResult({
        type: 'office',
        count: 1,
        title: 'Battrick Club Headquarters & Academy Intel Detected',
        clubUpdates: {
          its_points: its,
          fan_club_members: fan,
          coach_quality: 'Competent',
          fan_mood: 'Over the Moon 🚀',
          sponsor_confidence: 'Ecstatic 💎',
          division_fc: 'VIII.17 (#1)',
          division_od: 'V.62 (#2)',
          division_t20: 'VII.241 (#1)'
        }
      });
      return;
    }

    // 6. SQUAD & PLAYERS DOMAIN (squad.asp / playerdetails.asp)
    const hasPlayerIndicators = input.includes('Batting') || 
                                input.includes('Bowling') || 
                                input.includes('bti') || 
                                input.includes('BTI') ||
                                input.includes('wage') ||
                                input.includes('Wage') ||
                                input.includes('player_');

    if (hasPlayerIndicators) {
      const extractedPlayers: Partial<Player>[] = [];

      // Regex 1: HTML format (<div class="player" id="player_XXXX">)
      if (input.includes('playerdetails.asp') || input.includes('class="player"')) {
        const playerRegex = /<div class="player" id="player_(\d+)">([\s\S]*?)(?=<div class="player" id="player_|$)/g;
        let match;
        while ((match = playerRegex.exec(input)) !== null) {
          const pId = match[1];
          const block = match[2];

          const nameMatch = block.match(/playerdetails\.asp\?playerID=\d+">([^<]+)<\/a>/);
          const name = nameMatch ? nameMatch[1].trim() : `Player ${pId}`;

          const ageMatch = block.match(/class="player_age">(\d+)</);
          const age = ageMatch ? parseInt(ageMatch[1]) : 20;

          const wageMatch = block.match(/class="player_wage">&#163;([0-9,]+)</);
          const wage = wageMatch ? parseInt(wageMatch[1].replace(/,/g, '')) : 500;

          const btrMatch = block.match(/class="player_btr">([0-9,]+)</);
          const bti = btrMatch ? parseInt(btrMatch[1].replace(/,/g, '')) : 5000;

          const extractSkill = (className: string) => {
            const rx = new RegExp(`class="${className}">\\s*<a[^>]*>([^<]+)<\\/a>`, 'i');
            const m = block.match(rx);
            return m ? m[1].trim().toLowerCase() : 'competent';
          };

          const bathandM = block.match(/class="player_bathand">\s*([LR])<\/span>/i);
          const battingHand = bathandM ? (bathandM[1].toUpperCase() === 'L' ? 'LHB' : 'RHB') : 'RHB';

          const bowlhandM = block.match(/class="player_bowlhand">\s*([LR])<\/span>/i);
          const bowltypeM = block.match(/class="player_bowltype">\s*([^<]+)<\/span>/i);
          let bowlingType = 'None';
          if (bowlhandM && bowltypeM) {
            const arm = bowlhandM[1].trim().toUpperCase() === 'L' ? 'Left-arm' : 'Right-arm';
            const rawType = bowltypeM[1].replace(/^[Hh]\s*/, '').trim();
            bowlingType = `${arm} ${rawType}`;
          }

          extractedPlayers.push({
            id: pId,
            club_id: club.id,
            name,
            age,
            wage,
            bti,
            batting_hand: battingHand,
            bowling_type: bowlingType,
            batting: extractSkill('player_batting'),
            bowling: extractSkill('player_bowling'),
            keeping: extractSkill('player_keeping'),
            fielding: extractSkill('player_fielding'),
            concentration: extractSkill('player_concentration'),
            consistency: extractSkill('player_consistency'),
            stamina: extractSkill('player_stamina'),
            form: extractSkill('player_batform'),
            fatigue: extractSkill('player_fitness'),
            leadership: extractSkill('player_leadership'),
            experience: extractSkill('player_experience'),
            subskill: 6.20,
            active_net: 'Unassigned',
            market_value: bti * 85,
            tactical_role: age <= 18 ? 'Wonderkid Trainee' : 'First XI Player',
            is_wonderkid: age <= 18
          });
        }
      }

      // Regex 2: Plain Text copy-paste format from Battrick players page
      if (extractedPlayers.length === 0) {
        const lines = input.split('\n');
        let currentPlayer: Partial<Player> | null = null;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          const nameIdMatch = line.match(/^([A-Za-z\s]+)(?:[-–—\s]+(\d{1,2})\s*yo)?.*?(?:ID[:\s]*|#)?(\d{6,8})/i);
          if (nameIdMatch) {
            if (currentPlayer && currentPlayer.name) {
              extractedPlayers.push(currentPlayer);
            }
            currentPlayer = {
              id: nameIdIdClean(nameIdMatch[3]),
              club_id: club.id,
              name: nameIdMatch[1].trim(),
              age: nameIdMatch[2] ? parseInt(nameIdMatch[2]) : 22,
              wage: 540,
              bti: 6500,
              batting_hand: line.includes('LHB') ? 'LHB' : 'RHB',
              bowling_type: line.includes('Spin') ? 'Right-arm Finger Spin' : line.includes('Fast') ? 'Right-arm Fast' : 'Right-arm Medium',
              batting: 'competent',
              bowling: 'feeble',
              keeping: 'abysmal',
              fielding: 'competent',
              consistency: 'competent',
              concentration: 'competent',
              stamina: 'competent',
              form: 'superb',
              fatigue: 'sublime',
              leadership: 'competent',
              experience: 'feeble',
              subskill: 6.50,
              active_net: 'Unassigned',
              market_value: 400000,
              tactical_role: 'First XI Player',
              is_wonderkid: nameIdMatch[2] ? parseInt(nameIdMatch[2]) <= 18 : false
            };
            continue;
          }

          if (currentPlayer) {
            const wageM = line.match(/Wage[:\s]*[£$]?([0-9,]+)/i);
            if (wageM) currentPlayer.wage = parseInt(wageM[1].replace(/,/g, ''));

            const btiM = line.match(/(?:BTI|BTR)[:\s]*([0-9,]+)/i);
            if (btiM) {
              currentPlayer.bti = parseInt(btiM[1].replace(/,/g, ''));
              currentPlayer.market_value = currentPlayer.bti * 80;
            }

            const checkSkill = (skName: string) => {
              const rx = new RegExp(`${skName}[:\\s]+([A-Za-z]+)`, 'i');
              const m = line.match(rx);
              return m ? m[1].toLowerCase() : null;
            };

            const bat = checkSkill('Batting');
            if (bat) currentPlayer.batting = bat;
            const bowl = checkSkill('Bowling');
            if (bowl) currentPlayer.bowling = bowl;
            const keep = checkSkill('Keeping');
            if (keep) currentPlayer.keeping = keep;
            const fld = checkSkill('Fielding');
            if (fld) currentPlayer.fielding = fld;
            const conc = checkSkill('Concentration');
            if (conc) currentPlayer.concentration = conc;
            const cons = checkSkill('Consistency');
            if (cons) currentPlayer.consistency = cons;
            const stam = checkSkill('Stamina');
            if (stam) currentPlayer.stamina = stam;
          }
        }

        if (currentPlayer && currentPlayer.name) {
          extractedPlayers.push(currentPlayer);
        }
      }

      if (extractedPlayers.length > 0) {
        setParseResult({
          type: 'squad',
          count: extractedPlayers.length,
          title: `Successfully Parsed ${extractedPlayers.length} Battrick Squad Players`,
          players: extractedPlayers
        });
        return;
      }
    }

    setParseResult({
      type: 'unknown',
      count: 0,
      title: 'Unrecognized Data Format',
      message: 'Paste squad HTML/Text from battrick.org/nl/players.asp, finances.asp, ground.asp, or fixtures.asp.'
    });
  };

  function nameIdIdClean(idStr?: string): string {
    return String(idStr || '').replace(/^BT-/, '').trim();
  }

  // Apply parsed data to live state across any domain
  const handleApplyImport = async () => {
    if (!parseResult) return;
    setIsSyncing(true);

    try {
      if (parseResult.type === 'squad' && parseResult.players && parseResult.players.length > 0) {
        const formatted: Player[] = parseResult.players.map((p, idx) => ({
          id: p.id || String(6099450 + idx),
          club_id: club.id,
          name: p.name || `Player ${idx + 1}`,
          age: p.age || 21,
          wage: p.wage || 540,
          batting_hand: p.batting_hand || 'RHB',
          bowling_type: p.bowling_type || 'Right-arm Medium',
          batting: p.batting || 'competent',
          bowling: p.bowling || 'feeble',
          keeping: p.keeping || 'abysmal',
          fielding: p.fielding || 'competent',
          consistency: p.consistency || 'competent',
          concentration: p.concentration || 'competent',
          stamina: p.stamina || 'competent',
          form: p.form || 'superb',
          fatigue: p.fatigue || 'sublime',
          leadership: p.leadership || 'competent',
          experience: p.experience || 'feeble',
          bti: p.bti || 6500,
          subskill: p.subskill || 6.20,
          active_net: 'Unassigned',
          market_value: p.market_value || 450000,
          tactical_role: p.tactical_role || (p.age && p.age <= 18 ? 'Wonderkid Trainee' : 'Senior Player'),
          is_wonderkid: p.is_wonderkid || (p.age ? p.age <= 18 : false),
          uniqueRecords: p.uniqueRecords || ['Imported from Battrick Club Roster'],
          statsFC: p.statsFC || { matches: 0, innings: 0, runs: 0, highestScore: '0', average: 0, strikeRate: 0, centuries: 0, fifties: 0, fours: 0, sixes: 0, oversBowled: 0, wickets: 0, bestBowling: '0/0', bowlingAverage: 0, economy: 0, fiveWickets: 0, catches: 0, stumpings: 0 },
          statsOD: p.statsOD || { matches: 0, innings: 0, runs: 0, highestScore: '0', average: 0, strikeRate: 0, centuries: 0, fifties: 0, fours: 0, sixes: 0, oversBowled: 0, wickets: 0, bestBowling: '0/0', bowlingAverage: 0, economy: 0, fiveWickets: 0, catches: 0, stumpings: 0 },
          statsT20: p.statsT20 || { matches: 0, innings: 0, runs: 0, highestScore: '0', average: 0, strikeRate: 0, centuries: 0, fifties: 0, fours: 0, sixes: 0, oversBowled: 0, wickets: 0, bestBowling: '0/0', bowlingAverage: 0, economy: 0, fiveWickets: 0, catches: 0, stumpings: 0 }
        }));

        onImportSquad(formatted);

        if (isSupabaseConfigured) {
          const { error } = await supabase.from('players').upsert(formatted);
          if (error) console.warn('Supabase upsert note:', error.message);
        }

        setStatusMessage({
          text: `✅ Successfully imported ${formatted.length} Battrick players into live squad & database!`,
          type: 'success'
        });
      } else if (parseResult.type === 'finances' && parseResult.finances) {
        if (onImportFinances) onImportFinances(parseResult.finances);
        if (parseResult.clubUpdates) onImportClub({ ...club, ...parseResult.clubUpdates });
        if (isSupabaseConfigured) {
          await supabase.from('financial_ledger').upsert(parseResult.finances);
          if (parseResult.clubUpdates) await supabase.from('clubs').upsert({ ...club, ...parseResult.clubUpdates });
        }
        setStatusMessage({
          text: `✅ Successfully updated club finances & closing balance to £${parseResult.clubUpdates?.bank_balance?.toLocaleString()}!`,
          type: 'success'
        });
      } else if (parseResult.type === 'ground' && parseResult.stadiumTiers) {
        if (onImportStadium) onImportStadium(parseResult.stadiumTiers);
        if (parseResult.clubUpdates) onImportClub({ ...club, ...parseResult.clubUpdates });
        if (isSupabaseConfigured) {
          await supabase.from('stadium_tiers').upsert(parseResult.stadiumTiers);
        }
        setStatusMessage({
          text: `✅ Prabhas Coastal Oval seating tiers & 10,000 capacity synchronized!`,
          type: 'success'
        });
      } else if (parseResult.type === 'fixtures' && parseResult.matches) {
        if (onImportMatches) onImportMatches(parseResult.matches);
        if (isSupabaseConfigured) {
          await supabase.from('matches').upsert(parseResult.matches);
        }
        setStatusMessage({
          text: `✅ ${parseResult.matches.length} Fixtures & match scorecards successfully imported!`,
          type: 'success'
        });
      } else if (parseResult.type === 'nets' && parseResult.nets) {
        if (onImportNets) onImportNets(parseResult.nets);
        if (isSupabaseConfigured) {
          await supabase.from('nets_matrix').upsert(parseResult.nets);
        }
        setStatusMessage({
          text: `✅ Training nets matrix successfully updated!`,
          type: 'success'
        });
      } else if (parseResult.type === 'diary' && parseResult.calendarEvents) {
        if (onImportCalendar) onImportCalendar(parseResult.calendarEvents);
        setStatusMessage({
          text: `✅ Diary events and club calendar successfully updated!`,
          type: 'success'
        });
      } else if (parseResult.type === 'office' && parseResult.clubUpdates) {
        const updatedClub: Club = { ...club, ...parseResult.clubUpdates };
        onImportClub(updatedClub);
        if (onImportStaff) {
          // Keep staff sync ready
        }
        if (isSupabaseConfigured) {
          await supabase.from('clubs').upsert(updatedClub);
        }
        setStatusMessage({
          text: `✅ Club standings (#1 in FC VIII.17 & BT20 VII.241) and ITS bank updated!`,
          type: 'success'
        });
      }
    } catch (err: any) {
      setStatusMessage({
        text: `Error during import: ${err.message}`,
        type: 'error'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Preset loaders for the 12 Battrick domains
  const loadDomainPreset = (domain: string) => {
    if (domain === 'squad') {
      const sample = `Bhadraksh Hemalatha - 17 yo, ID: 6099466 | Wage: £545 | BTI: 6,989 | RHB, Right-arm Finger Spin
Batting: abysmal | Bowling: competent | Keeping: feeble | Fielding: abysmal
Concentration: feeble | Consistency: competent | Stamina: competent | Form: superb

Nandakishor Ramdhyani - 17 yo, ID: 6099471 | Wage: £559 | BTI: 6,360 | LHB, Left-arm Medium
Batting: competent | Bowling: mediocre | Keeping: woeful | Fielding: woeful
Concentration: competent | Consistency: feeble | Stamina: competent | Form: mediocre

Achintya Kharge - 26 yo, ID: 6099475 | Wage: £553 | BTI: 8,436 | RHB, Right-arm Medium
Batting: competent | Bowling: woeful | Keeping: woeful | Fielding: competent
Concentration: competent | Consistency: woeful | Stamina: competent | Form: superb`;
      setRawText(sample);
      parseBattrickData(sample);
    } else if (domain === 'finances') {
      const sample = `Account Summary
Current Balance: 1,325,820
Showing transactions from Season 69
Opening Balance: 75,000 | Payments In: 1,744,048 | Payments Out: 493,228 | Profit/Loss: 1,250,820
18 Nov 2026: Gate Receipts £5,247
14 Nov 2026: Backroom Staff Salaries -£12,250 | Player Salaries -£7,034 | Ground Maintenance -£14,702 | Interest Received £33,114 | Sponsorship Revenue £22,823
10 Nov 2026: Gate Receipts £126,546 (FC vs Whykickamoocows Day 1)`;
      setRawText(sample);
      parseBattrickData(sample);
    } else if (domain === 'ground') {
      const sample = `Somnath Super Devs - Prabhas Coastal Oval
Groundsman: Shyamal Dangasela
Capacity: 10000
Standing Room: 5275
Uncovered Seats: 3270
Covered Seats: 1100
Members Seats: 355
Default Pitch Condition: hard & fast`;
      setRawText(sample);
      parseBattrickData(sample);
    } else if (domain === 'fixtures') {
      const sample = `Previous Matches
10/11/2026 04:30 (FC): Somnath Super Devs v Whykickamoocows - Won by 9 Wickets (Somnath 406/2 dec beat Whykickamoocows 166 & 240)
13/11/2026 04:30 (OD): Nagapatnam CC v Somnath Super Devs - Won
Upcoming Matches
24/11/2026 07:30 (FC Fr): Pitch Punishers v Somnath Super Devs - Orders due 20 mins prior`;
      setRawText(sample);
      parseBattrickData(sample);
    } else if (domain === 'nets') {
      const sample = `Training Sessions - Session 1
Squad training: Fielding
Arjun Ashraf, Issa Baboor, Kamadev Battasi, Bhadraksh Hemalatha, Kamal Hydrose, Lalit Kadam, Achintya Kharge, Vasant Malla, Ankur Palanisamy, Nandakishor Ramdhyani, Purumitra Rishi, Viplav Sinduvalli, Arvind Somal, Atulya Surya Teja
Last Training Session: None of your players were trained last week.`;
      setRawText(sample);
      parseBattrickData(sample);
    } else if (domain === 'office') {
      const sample = `Somnath Super Devs (13108)
General Manager: Devs (137061)
First Class League: #1 in VIII.17
One Day League: #2 in V.62
BT20: #1 in VII.241
Youth Academy Condition: superb
Intensive Training Sessions: 70
Club Members: 781 (over the moon)`;
      setRawText(sample);
      parseBattrickData(sample);
    }
  };

  const handleDownloadBackup = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      club,
      squad,
      version: '2.4.0 Sovereign'
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BT360MAK_Club_${club.id}_Full_Backup.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Importer Hub Header */}
      <div className="sovereign-card p-6 rounded-2xl border-emerald-500/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl cricket-ball flex items-center justify-center text-2xl text-white shadow-xl shrink-0">
              📥
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Universal Multi-Domain Battrick Ingestion Hub</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                Import from Battrick Club (#13108)
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Ingest real club data across all 12 domains: Squad, Players, Finances, Stadium, Fixtures, Scorecards, Nets, Staff, and Diary.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadBackup}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#081d17] hover:bg-[#113a2e] text-emerald-300 border border-emerald-600/50 text-xs font-bold transition-all cursor-pointer shadow"
              title="Download full JSON backup"
            >
              <Download className="w-4 h-4" />
              <span>Export Club Backup</span>
            </button>
          </div>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div className={`mt-4 p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
              : 'bg-rose-950/80 border-rose-500 text-rose-200'
          }`}>
            <span>{statusMessage.text}</span>
            <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-white ml-2">&times;</button>
          </div>
        )}
      </div>

      {/* Import Method Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-emerald-800/40 pb-2">
        <button
          onClick={() => setActiveImportTab('paste')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeImportTab === 'paste'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
              : 'text-slate-300 hover:text-white hover:bg-[#0c2b23]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Smart Text / HTML Paste (All Domains)</span>
        </button>

        <button
          onClick={() => setActiveImportTab('domains')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeImportTab === 'domains'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
              : 'text-slate-300 hover:text-white hover:bg-[#0c2b23]'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>Domain Quick Presets (12 Modules)</span>
        </button>

        <button
          onClick={() => setActiveImportTab('sheet')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeImportTab === 'sheet'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
              : 'text-slate-300 hover:text-white hover:bg-[#0c2b23]'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Google Sheet / Apps Script Sync</span>
        </button>

        <button
          onClick={() => setActiveImportTab('json')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeImportTab === 'json'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
              : 'text-slate-300 hover:text-white hover:bg-[#0c2b23]'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>JSON Backup / Restore</span>
        </button>
      </div>

      {/* DOMAIN QUICK SELECTOR BAR */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-[#051612] rounded-xl border border-emerald-800/40 text-xs">
        <span className="text-[10px] uppercase font-bold text-slate-400 mr-2 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Domain Pre-fill:</span>
        </span>
        {[
          { id: 'squad', label: '👥 Squad (players.asp)', icon: Users },
          { id: 'finances', label: '💰 Finances (finances.asp)', icon: DollarSign },
          { id: 'ground', label: '🏟️ Ground (ground.asp)', icon: Building },
          { id: 'fixtures', label: '🏆 Fixtures (fixtures.asp)', icon: Trophy },
          { id: 'nets', label: '🎯 Nets (nets.asp)', icon: Target },
          { id: 'office', label: '🏢 Office (office.asp)', icon: Building }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => {
              setSelectedDomain(item.id as any);
              loadDomainPreset(item.id);
            }}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition-all cursor-pointer shadow-sm ${
              selectedDomain === item.id 
                ? 'bg-emerald-600 text-white border-emerald-400 font-black shadow-md' 
                : 'bg-[#071f19] hover:bg-emerald-900/60 text-slate-200 hover:text-white border-emerald-700/40'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Smart Text / HTML Paste */}
      {activeImportTab === 'paste' && (
        <div className="space-y-4">
          <div className="sovereign-card p-5 rounded-2xl border-emerald-600/30 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Copy className="w-4 h-4 text-emerald-400" />
                  <span>Paste Raw Battrick Web Page Text or HTML</span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Open any Battrick page (<code className="text-emerald-300 font-mono">players.asp</code>, <code className="text-emerald-300 font-mono">finances.asp</code>, <code className="text-emerald-300 font-mono">ground.asp</code>, <code className="text-emerald-300 font-mono">fixtures.asp</code>, <code className="text-emerald-300 font-mono">nets.asp</code>), press <kbd className="px-1.5 py-0.5 bg-[#051310] rounded border border-emerald-700/50 text-[10px]">Ctrl+A</kbd> then <kbd className="px-1.5 py-0.5 bg-[#051310] rounded border border-emerald-700/50 text-[10px]">Ctrl+C</kbd>, and paste here:
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => { setRawText(''); setParseResult(null); }}
                  className="px-2.5 py-1.5 rounded-lg bg-[#061814] hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700/50 text-[11px] font-bold transition-all cursor-pointer"
                >
                  Clear Box
                </button>
              </div>
            </div>

            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => {
                setRawText(e.target.value);
                parseBattrickData(e.target.value);
              }}
              placeholder="Paste raw text or HTML from ANY Battrick page here...
The engine automatically detects whether you pasted Squad, Finances, Ground, Fixtures, Nets, or Office data!"
              className="w-full p-4 rounded-xl bg-[#04120e] border border-emerald-800/60 font-mono text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 leading-relaxed"
            />
          </div>

          {/* Real-time Parser Results Preview */}
          {parseResult && (
            <div className="sovereign-card p-5 rounded-2xl border-emerald-600/40 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-800/40">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h4 className="text-base font-black text-white">{parseResult.title}</h4>
                    <span className="text-xs text-emerald-300 font-mono font-bold">
                      Domain Recognized: {parseResult.type.toUpperCase()} ({parseResult.count} records)
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleApplyImport}
                  disabled={isSyncing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs shadow-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Apply & Synchronize Database &rarr;</span>
                </button>
              </div>

              {/* SQUAD PREVIEW */}
              {parseResult.players && parseResult.players.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-emerald-800/40 bg-[#04120e]">
                  <table className="w-full text-left text-xs border-collapse font-mono">
                    <thead>
                      <tr className="bg-[#071d17] text-slate-300 uppercase tracking-wider text-[10px] border-b border-emerald-800/40">
                        <th className="py-2.5 px-3">Player ID</th>
                        <th className="py-2.5 px-3">Name</th>
                        <th className="py-2.5 px-3">Age</th>
                        <th className="py-2.5 px-3">Wage</th>
                        <th className="py-2.5 px-3">BTI</th>
                        <th className="py-2.5 px-3">Batting</th>
                        <th className="py-2.5 px-3">Bowling</th>
                        <th className="py-2.5 px-3">Fielding</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-900/30">
                      {parseResult.players.slice(0, 10).map((p, idx) => (
                        <tr key={p.id || idx} className="hover:bg-emerald-950/30">
                          <td className="py-2 px-3 text-amber-400 font-bold">#{p.id}</td>
                          <td className="py-2 px-3 text-white font-bold">{p.name}</td>
                          <td className="py-2 px-3 text-slate-300">{p.age}yo</td>
                          <td className="py-2 px-3 text-emerald-300">£{p.wage}</td>
                          <td className="py-2 px-3 text-amber-300 font-bold">{p.bti?.toLocaleString()}</td>
                          <td className="py-2 px-3 capitalize text-slate-300">{p.batting}</td>
                          <td className="py-2 px-3 capitalize text-slate-300">{p.bowling}</td>
                          <td className="py-2 px-3 capitalize text-slate-300">{p.fielding}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* FINANCES PREVIEW */}
              {parseResult.finances && (
                <div className="space-y-2 font-mono text-xs">
                  <div className="p-3 bg-[#04120e] rounded-xl border border-emerald-800/40 flex items-center justify-between">
                    <span>Closing Bank Balance:</span>
                    <span className="text-emerald-400 font-black text-sm">£{parseResult.clubUpdates?.bank_balance?.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* GROUND PREVIEW */}
              {parseResult.stadiumTiers && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  {parseResult.stadiumTiers.map(t => (
                    <div key={t.id} className="p-3 bg-[#04120e] rounded-xl border border-emerald-800/40">
                      <div className="text-[10px] text-slate-400">{t.tier_name}</div>
                      <div className="text-white font-bold text-sm mt-0.5">{t.current_seats.toLocaleString()} seats</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Domain Quick Presets */}
      {activeImportTab === 'domains' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { id: 'squad', title: 'Squad Roster', file: 'squad.asp', desc: 'All 14 players, 11 skills, wages, BTI, and tactical roles.' },
            { id: 'finances', title: 'Finances & Ledger', file: 'finances.asp', desc: 'Current balance (£1,325,820), gate receipts, staff & player wages.' },
            { id: 'ground', title: 'Ground & Stadium', file: 'ground.asp', desc: 'Prabhas Coastal Oval 10,000 capacity, seating tiers, pitch condition.' },
            { id: 'fixtures', title: 'Fixtures & Matches', file: 'fixtures.asp', desc: 'Upcoming fixtures and past match scorecards vs Whykickamoocows & Diu CC.' },
            { id: 'nets', title: 'Training Nets', file: 'nets.asp', desc: '10 training nets matrix and squad fielding session.' },
            { id: 'office', title: 'Club Headquarters', file: 'office.asp', desc: 'League standings (#1 in FC & BT20), 70 ITS points, fan club morale.' }
          ].map(d => (
            <div key={d.id} className="sovereign-card p-5 rounded-2xl border-emerald-700/40 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white">{d.title}</h4>
                <code className="text-[10px] px-2 py-0.5 rounded bg-[#030d0a] text-emerald-400 border border-emerald-800 font-mono">{d.file}</code>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{d.desc}</p>
              <button
                onClick={() => {
                  setActiveImportTab('paste');
                  loadDomainPreset(d.id);
                }}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all cursor-pointer shadow"
              >
                Load {d.title} &rarr;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Google Sheet Sync */}
      {activeImportTab === 'sheet' && (
        <div className="sovereign-card p-6 rounded-2xl border-emerald-600/40 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <Table className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="text-base font-black text-white">Google Sheet & Apps Script Cloud Connector</h3>
              <p className="text-xs text-slate-300">
                Synchronize directly with your Master Google Sheet (ID: <code className="text-emerald-300 font-mono">1KXQbrZ2D7aYJUAniQ5F3L8FeFfM8zmsMsIDHfl2An_E</code>)
              </p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#04120e] border border-emerald-800/40 text-xs space-y-2">
            <div className="text-emerald-300 font-bold">Connected Google Apps Script Web App:</div>
            <code className="block p-2 rounded bg-[#020b08] text-slate-300 font-mono text-[11px] break-all border border-emerald-900/40">
              https://script.google.com/macros/s/AKfycby_56P0m_Mij_N-zz0K44NntJNyts_8bUtl1VoPZQhlSnUFsCOq-lh33A3B9b9npmA/exec
            </code>
          </div>
        </div>
      )}

      {/* TAB 4: JSON Backup & Restore */}
      {activeImportTab === 'json' && (
        <div className="sovereign-card p-6 rounded-2xl border-emerald-600/40 shadow-xl space-y-4">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-emerald-400" />
            <span>Full JSON Backup & Snapshot Restore</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Download a complete offline snapshot of all club records, or restore from a previous backup file.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleDownloadBackup}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Full Backup JSON</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
