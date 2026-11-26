import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Player, PlayerStats, MatchRecord } from '../types/database';
import { 
  Award, 
  TrendingUp, 
  BarChart3, 
  UserCheck, 
  Search, 
  ChevronDown, 
  Check, 
  Trophy, 
  Shield, 
  Flame, 
  Target,
  Sparkles
} from 'lucide-react';
import { formatBowlingType, getBowlingTypeFullName, formatBattingHand, getBattingHandFullName } from '../lib/cricketFormatters';
import { ParsedScorecard } from '../lib/matchStatsEngine';

interface PlayerProfileViewProps {
  squad: Player[];
  selectedPlayerId?: string;
  matches?: MatchRecord[];
  onNavigateToImport?: () => void;
}

const skillValueMap: Record<string, number> = {
  nonexistent: 1, worthless: 2, abysmal: 3, woeful: 4, feeble: 5,
  mediocre: 6, competent: 7, respectable: 8, proficient: 9, strong: 10,
  superb: 11, quality: 12, remarkable: 13, wonderful: 14, exceptional: 15, sensational: 16
};

function getSkillLevel(skillName?: string): number {
  if (!skillName) return 5;
  return skillValueMap[skillName.toLowerCase()] || 5;
}

function getSkillBadgeColor(level: number): string {
  if (level >= 13) return 'bg-purple-100 text-purple-900 border-purple-400 font-bold';
  if (level >= 11) return 'bg-emerald-100 text-emerald-900 border-emerald-500 font-bold';
  if (level >= 9) return 'bg-teal-100 text-teal-900 border-teal-400 font-semibold';
  if (level >= 7) return 'bg-cyan-100 text-cyan-900 border-cyan-400 font-semibold';
  if (level >= 5) return 'bg-amber-100 text-amber-900 border-amber-400 font-medium';
  return 'bg-slate-100 text-slate-700 border-slate-300 font-normal';
}

function cleanId(id?: string): string {
  return String(id || '').replace(/^BT-/, '').trim();
}

/**
 * Formats ISO/Battrick date string into standard ESPNcricinfo format: 23-Nov-2026
 */
function formatCricinfoDate(dateStr?: string): string {
  if (!dateStr) return '-';
  const clean = dateStr.trim();
  const parts = clean.split(/[-/.]/);
  if (parts.length >= 3) {
    let day = parts[0];
    let month = parts[1];
    let year = parts[2].slice(0, 4);
    // If YYYY-MM-DD
    if (parts[0].length === 4) {
      year = parts[0];
      month = parts[1];
      day = parts[2];
    }
    const monthIdx = parseInt(month, 10) - 1;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthNames[monthIdx] || month;
    const cleanDay = String(parseInt(day, 10)).padStart(2, '0');
    return `${cleanDay}-${monthName}-${year}`;
  }
  return dateStr;
}

/**
 * Computes individual player career statistics grouped by Season 69 vs Career Total across formats
 */
function computePlayerCompetitionStats(
  player: Player,
  matches: MatchRecord[] | undefined,
  competition: 'domestic' | 'friendly'
) {
  const isSeason69 = (dateStr: string) => {
    if (!dateStr) return false;
    const clean = dateStr.trim();
    const parts = clean.split(/[-/.]/);
    let iso = clean;
    if (parts.length >= 3) {
      if (parts[2].length === 4) {
        // DD/MM/YYYY
        iso = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      } else if (parts[0].length === 4) {
        // YYYY-MM-DD
        iso = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
      }
    }
    return iso >= '2026-08-01';
  };

  const createAcc = () => ({
    matches: new Set<string>(),
    innings: 0,
    notOuts: 0,
    runs: 0,
    highestScoreVal: -1,
    highestScoreStr: '-',
    ballsFaced: 0,
    centuries: 0,
    fifties: 0,
    fours: 0,
    sixes: 0,
    catches: 0,
    stumpings: 0,
    inningsBowled: 0,
    ballsBowled: 0,
    runsConceded: 0,
    wickets: 0,
    bestBowlingWkts: 0,
    bestBowlingRuns: 999,
    bestBowlingStr: '-',
    bestBowlingMatchWkts: 0,
    bestBowlingMatchRuns: 999,
    bestBowlingMatchStr: '-',
    fourWickets: 0,
    fiveWickets: 0,
    tenWickets: 0
  });

  const fc_season = createAcc();
  const fc_career = createAcc();
  const od_season = createAcc();
  const od_career = createAcc();
  const t20_season = createAcc();
  const t20_career = createAcc();

  if (matches && matches.length > 0 && player?.id) {
    const cleanPId = cleanId(player.id);
    const pName = (player.name || '').toLowerCase().trim();

    for (const m of matches) {
      const typeLower = (m.match_type || '').toLowerCase();
      const oppLower = (m.opponent_club || '').toLowerCase();
      const sc = m.scorecardData as ParsedScorecard | undefined;
      const fmtLower = (sc?.format || '').toLowerCase();

      // Filter between Domestic and Friendly
      const isMatchFriendly = typeLower.includes('friendly') || oppLower.includes('friendly') || fmtLower.includes('friendly');
      if (competition === 'domestic' && isMatchFriendly) continue;
      if (competition === 'friendly' && !isMatchFriendly) continue;

      // Determine match format
      const isFC = typeLower.includes('first class') || typeLower === 'fc' || fmtLower.includes('first class');
      const isOD = typeLower.includes('one day') || typeLower === 'od' || typeLower.includes('list a') || fmtLower.includes('one day');
      const isT20 = typeLower.includes('bt20') || typeLower === 't20' || typeLower.includes('twenty20') || fmtLower.includes('bt20') || fmtLower.includes('twenty20');

      if (!isFC && !isOD && !isT20) continue;

      const inSeason69 = isSeason69(sc?.matchDate || m.match_date || '');

      const accCareer = isFC ? fc_career : isOD ? od_career : t20_career;
      const accSeason = isFC ? fc_season : isOD ? od_season : t20_season;

      // Player Batting
      const batPerfs = (sc?.battingPerformances || []).filter(b =>
        (b.playerId && cleanId(b.playerId) === cleanPId) ||
        (b.playerName && b.playerName.toLowerCase().trim() === pName)
      );

      // Player Bowling
      const bowlPerfs = (sc?.bowlingPerformances || []).filter(b =>
        (b.playerId && cleanId(b.playerId) === cleanPId) ||
        (b.playerName && b.playerName.toLowerCase().trim() === pName)
      );

      if (batPerfs.length === 0 && bowlPerfs.length === 0) continue;

      const applyMatch = (target: ReturnType<typeof createAcc>) => {
        target.matches.add(m.id);

        let matchWkts = 0;
        let matchRunsConceded = 0;

        for (const bat of batPerfs) {
          target.innings += 1;
          target.runs += bat.runs;
          target.ballsFaced += bat.balls;
          target.fours += bat.fours;
          target.sixes += bat.sixes;

          if (bat.isNotOut) {
            target.notOuts += 1;
          }
          if (bat.runs >= 100) target.centuries += 1;
          else if (bat.runs >= 50) target.fifties += 1;

          if (bat.runs > target.highestScoreVal) {
            target.highestScoreVal = bat.runs;
            target.highestScoreStr = `${bat.runs}${bat.isNotOut ? '*' : ''}`;
          }
        }

        for (const bowl of bowlPerfs) {
          target.inningsBowled += 1;
          const balls = Math.round(bowl.overs * 6);
          target.ballsBowled += balls;
          target.runsConceded += bowl.runs;
          target.wickets += bowl.wickets;
          matchWkts += bowl.wickets;
          matchRunsConceded += bowl.runs;

          if (bowl.wickets === 4) target.fourWickets += 1;
          else if (bowl.wickets >= 5) target.fiveWickets += 1;

          if (bowl.wickets > target.bestBowlingWkts || (bowl.wickets === target.bestBowlingWkts && bowl.runs < target.bestBowlingRuns)) {
            if (bowl.wickets > 0) {
              target.bestBowlingWkts = bowl.wickets;
              target.bestBowlingRuns = bowl.runs;
              target.bestBowlingStr = `${bowl.wickets}/${bowl.runs}`;
            }
          }
        }

        if (matchWkts >= 10) target.tenWickets += 1;
        if (matchWkts > target.bestBowlingMatchWkts || (matchWkts === target.bestBowlingMatchWkts && matchRunsConceded < target.bestBowlingMatchRuns)) {
          if (matchWkts > 0) {
            target.bestBowlingMatchWkts = matchWkts;
            target.bestBowlingMatchRuns = matchRunsConceded;
            target.bestBowlingMatchStr = `${matchWkts}/${matchRunsConceded}`;
          }
        }
      };

      applyMatch(accCareer);
      if (inSeason69) {
        applyMatch(accSeason);
      }
    }
  }

  const formatStats = (acc: ReturnType<typeof createAcc>, fallback?: PlayerStats): PlayerStats => {
    if (acc.matches.size === 0 && fallback && fallback.matches > 0) {
      return fallback;
    }

    const outs = Math.max(0, acc.innings - acc.notOuts);
    const ave = outs > 0 ? parseFloat((acc.runs / outs).toFixed(2)) : acc.runs > 0 ? acc.runs : 0;
    const sr = acc.ballsFaced > 0 ? parseFloat(((acc.runs / acc.ballsFaced) * 100).toFixed(2)) : 0;
    const overs = acc.ballsBowled > 0 ? acc.ballsBowled / 6 : 0;
    const econ = overs > 0 ? parseFloat((acc.runsConceded / overs).toFixed(2)) : 0;
    const bowlAvg = acc.wickets > 0 ? parseFloat((acc.runsConceded / acc.wickets).toFixed(2)) : 0;
    const bowlSr = acc.wickets > 0 ? parseFloat((acc.ballsBowled / acc.wickets).toFixed(1)) : 0;

    return {
      matches: acc.matches.size,
      innings: acc.innings,
      notOuts: acc.notOuts,
      runs: acc.runs,
      highestScore: acc.highestScoreStr,
      average: ave,
      ballsFaced: acc.ballsFaced,
      strikeRate: sr,
      centuries: acc.centuries,
      fifties: acc.fifties,
      fours: acc.fours,
      sixes: acc.sixes,
      catches: acc.catches,
      stumpings: acc.stumpings,
      inningsBowled: acc.inningsBowled,
      ballsBowled: acc.ballsBowled,
      runsConceded: acc.runsConceded,
      oversBowled: parseFloat(overs.toFixed(1)),
      wickets: acc.wickets,
      bestBowling: acc.bestBowlingStr,
      bestBowlingMatch: acc.bestBowlingMatchStr !== '-' ? acc.bestBowlingMatchStr : acc.bestBowlingStr,
      bowlingAverage: bowlAvg,
      economy: econ,
      bowlingStrikeRate: bowlSr,
      fourWickets: acc.fourWickets,
      fiveWickets: acc.fiveWickets,
      tenWickets: acc.tenWickets
    };
  };

  // Career fallbacks from player's pre-populated stats if matches array is empty
  const fcFallback = competition === 'domestic' ? player?.statsFC : player?.statsFriendly;
  const odFallback = competition === 'domestic' ? player?.statsOD : undefined;
  const t20Fallback = competition === 'domestic' ? player?.statsT20 : undefined;

  return {
    fc_season: formatStats(fc_season),
    fc_career: formatStats(fc_career, fcFallback),
    od_season: formatStats(od_season),
    od_career: formatStats(od_career, odFallback),
    t20_season: formatStats(t20_season),
    t20_career: formatStats(t20_career, t20Fallback)
  };
}

export const PlayerProfileView: React.FC<PlayerProfileViewProps> = ({ 
  squad, 
  selectedPlayerId,
  matches,
  onNavigateToImport
}) => {
  const [currentId, setCurrentId] = useState<string>(cleanId(selectedPlayerId) || cleanId(squad[0]?.id));
  const [competitionTab, setCompetitionTab] = useState<'domestic' | 'friendly'>('domestic');
  
  // Advanced Combobox state
  const [inputValue, setInputValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const comboboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever selectedPlayerId changes externally
  useEffect(() => {
    if (selectedPlayerId) {
      setCurrentId(cleanId(selectedPlayerId));
    }
  }, [selectedPlayerId]);

  // Click outside to close combobox
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 100% Fresh Slate Empty State
  if (!squad || squad.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto my-12">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <UserCheck className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Database is 100% Clean & Ready</h3>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          No players in database yet. Ingest your Battrick squad (<code>squad.asp</code>) or match scorecards via Import Hub or the 1-Click Browser Button.
        </p>
        {onNavigateToImport && (
          <button
            onClick={onNavigateToImport}
            className="mt-6 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open Import Hub</span>
          </button>
        )}
      </div>
    );
  }

  const player = useMemo(() => {
    const targetClean = cleanId(currentId);
    return squad.find(p => cleanId(p.id) === targetClean) || squad[0] || ({} as Player);
  }, [squad, currentId]);

  // Compute Domestic / Friendly stats
  const formatStats = useMemo(() => {
    return computePlayerCompetitionStats(player, matches, competitionTab);
  }, [player, matches, competitionTab]);

  // Filter squad based on combobox input
  const filteredSuggestions = useMemo(() => {
    if (!inputValue.trim()) return squad;
    const term = inputValue.toLowerCase().trim();
    return squad.filter(p => 
      p.name.toLowerCase().includes(term) ||
      cleanId(p.id).includes(term) ||
      p.tactical_role?.toLowerCase().includes(term)
    );
  }, [squad, inputValue]);

  // Inline auto-complete suggestion text
  const inlineSuggestion = useMemo(() => {
    if (!inputValue.trim() || filteredSuggestions.length === 0) return '';
    const topMatch = filteredSuggestions[0];
    if (topMatch.name.toLowerCase().startsWith(inputValue.toLowerCase())) {
      return inputValue + topMatch.name.slice(inputValue.length);
    }
    return '';
  }, [inputValue, filteredSuggestions]);

  // Handle combobox keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setHighlightedIndex(prev => Math.min(prev + 1, filteredSuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsOpen(true);
      setHighlightedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && filteredSuggestions[highlightedIndex]) {
        const selected = filteredSuggestions[highlightedIndex];
        setCurrentId(cleanId(selected.id));
        setInputValue(selected.name);
        setIsOpen(false);
      }
    } else if (e.key === 'Tab') {
      if (inlineSuggestion && inlineSuggestion.toLowerCase() !== inputValue.toLowerCase()) {
        e.preventDefault();
        setInputValue(inlineSuggestion);
        if (filteredSuggestions[0]) {
          setCurrentId(cleanId(filteredSuggestions[0].id));
        }
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelectPlayer = (selected: Player) => {
    setCurrentId(cleanId(selected.id));
    setInputValue(selected.name);
    setIsOpen(false);
  };

  // Recent Matches of this player (Exact match with ESPNcricinfo user reference image)
  const playerRecentMatches = useMemo(() => {
    if (!matches || matches.length === 0 || !player?.id) return [];
    const cleanPId = cleanId(player.id);
    const pName = (player.name || '').toLowerCase().trim();

    const result: Array<{
      id: string;
      matchTitle: string;
      batScore: string;
      bowlFigures: string;
      date: string;
      ground: string;
      format: string;
      timestamp: number;
    }> = [];

    for (const m of matches) {
      const sc = m.scorecardData as ParsedScorecard | undefined;
      if (!sc) continue;

      const batPerfs = (sc.battingPerformances || []).filter(b =>
        (b.playerId && cleanId(b.playerId) === cleanPId) ||
        (b.playerName && b.playerName.toLowerCase().trim() === pName)
      );

      const bowlPerfs = (sc.bowlingPerformances || []).filter(b =>
        (b.playerId && cleanId(b.playerId) === cleanPId) ||
        (b.playerName && b.playerName.toLowerCase().trim() === pName)
      );

      if (batPerfs.length === 0 && bowlPerfs.length === 0) continue;

      // Batting score formatting (multi-innings support: e.g. "100" or "0 & 115" or "30 & 29" or "DNB")
      let batScore = 'DNB';
      if (batPerfs.length === 1) {
        batScore = `${batPerfs[0].runs}${batPerfs[0].isNotOut ? '*' : ''}`;
      } else if (batPerfs.length >= 2) {
        batScore = `${batPerfs[0].runs}${batPerfs[0].isNotOut ? '*' : ''} & ${batPerfs[1].runs}${batPerfs[1].isNotOut ? '*' : ''}`;
      }

      // Bowling figures formatting (multi-innings support: e.g. "1/15 & 7/31" or "3/42" or "-")
      let bowlFigures = '-';
      if (bowlPerfs.length === 1) {
        bowlFigures = `${bowlPerfs[0].wickets}/${bowlPerfs[0].runs}`;
      } else if (bowlPerfs.length >= 2) {
        bowlFigures = `${bowlPerfs[0].wickets}/${bowlPerfs[0].runs} & ${bowlPerfs[1].wickets}/${bowlPerfs[1].runs}`;
      }

      // Date formatting: DD-Mon-YYYY (e.g. 23-Nov-2026)
      const rawDate = sc.matchDate || m.match_date || '';
      const dateFormatted = formatCricinfoDate(rawDate);
      const timestamp = new Date(rawDate).getTime() || 0;

      // Opponent & Match Title
      const opp = sc.opponent || m.opponent_club || 'Opposition';
      const matchTitle = `Somnath Super Devs vs ${opp}`;

      // Ground (Bold column e.g. Centurion, Prabhas Coastal Oval)
      let ground = 'Prabhas Coastal Oval';
      if (sc.venue) {
        const venueMatch = sc.venue.match(/\(([^)]+)\)/);
        if (venueMatch) ground = venueMatch[1];
        else ground = sc.venue.replace(/Home\s*|Away\s*/g, '').trim() || 'Prabhas Coastal Oval';
      }

      // Format column (e.g. Test # 2648 or FC # 32510940, List A # 1245, T20 # 312)
      const fmt = m.match_type || sc.format || 'FC';
      const cleanFmt = fmt.includes('First Class') ? 'FC' : fmt.includes('One Day') ? 'List A' : fmt.includes('BT20') ? 'T20' : fmt;
      const formatCode = `${cleanFmt} #${m.id || sc.matchId || ''}`;

      result.push({
        id: m.id,
        matchTitle,
        batScore,
        bowlFigures,
        date: dateFormatted,
        ground,
        format: formatCode,
        timestamp
      });
    }

    // Sort descending by date (newest first)
    return result.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
  }, [matches, player]);

  const skillsList = [
    { label: 'Batting', value: player.batting },
    { label: 'Bowling', value: player.bowling },
    { label: 'Keeping', value: player.keeping },
    { label: 'Fielding', value: player.fielding },
    { label: 'Consistency', value: player.consistency },
    { label: 'Concentration', value: player.concentration },
    { label: 'Stamina', value: player.stamina },
    { label: 'Form', value: player.form },
    { label: 'Fatigue', value: player.fatigue },
    { label: 'Experience', value: player.experience },
    { label: 'Leadership', value: player.leadership },
  ];

  return (
    <div className="space-y-6">
      {/* Search Header Bar with Autocomplete Combobox */}
      <div className="sovereign-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border-slate-200 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-base shadow-xs">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">Player Profile & Dossier</h1>
            <p className="text-xs text-slate-500 font-medium">
              Official Battrick technical attributes, career statistics, and match log
            </p>
          </div>
        </div>

        {/* Enhanced Player Search & Select Combobox */}
        <div className="relative w-full sm:w-80" ref={comboboxRef}>
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            
            {inlineSuggestion && isOpen && (
              <div className="absolute left-9 right-8 py-2 text-xs font-medium text-slate-300 pointer-events-none overflow-hidden whitespace-nowrap">
                {inlineSuggestion}
              </div>
            )}

            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setIsOpen(true);
                setHighlightedIndex(0);
              }}
              onFocus={() => {
                setIsOpen(true);
                if (!inputValue) setInputValue(player.name || '');
              }}
              onKeyDown={handleKeyDown}
              placeholder={player.name ? `${player.name} (#${cleanId(player.id)})` : 'Search by name or ID...'}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-xs"
            />

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {isOpen && filteredSuggestions.length > 0 && (
            <div className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl py-1 text-xs">
              {filteredSuggestions.map((p, idx) => {
                const isSelected = cleanId(p.id) === cleanId(player.id);
                const isHighlighted = idx === highlightedIndex;
                return (
                  <div
                    key={p.id}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onClick={() => handleSelectPlayer(p)}
                    className={`px-3 py-2 flex items-center justify-between cursor-pointer transition-colors ${
                      isHighlighted ? 'bg-emerald-50 text-emerald-950 font-bold' : isSelected ? 'bg-slate-50 font-semibold text-slate-900' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[11px] text-slate-400">#{cleanId(p.id)}</span>
                      <span className="truncate">{p.name}</span>
                      <span className="text-[10px] text-slate-400">({p.tactical_role})</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Hero Dossier Card */}
      <div className="sovereign-card p-6 rounded-2xl border-slate-200 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-900 flex items-center justify-center text-white text-2xl font-black shadow-md shrink-0">
              {player.name ? player.name.charAt(0) : 'P'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-300">
                  #{cleanId(player.id)}
                </span>
                {player.is_wonderkid && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-bold border border-purple-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Wonderkid Potential</span>
                  </span>
                )}
                <span className="text-xs text-emerald-800 font-semibold">
                  Somnath Super Devs &bull; Tamil Nadu, IND
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1.5 tracking-tight">{player.name}</h2>
              <div className="text-sm font-semibold text-slate-600 mt-0.5 flex items-center gap-2 flex-wrap">
                <span className="text-emerald-800 font-bold">{player.tactical_role}</span>
                <span>&bull;</span>
                <span>Batting: <strong className="text-slate-800 font-mono">{formatBattingHand(player.batting_hand)}</strong> <span className="text-xs text-slate-500">({getBattingHandFullName(player.batting_hand)})</span></span>
                <span>&bull;</span>
                <span>Bowling: <strong className="text-cyan-900 font-mono px-1.5 py-0.5 rounded bg-cyan-50 border border-cyan-300 text-xs">{formatBowlingType(player.bowling_type)}</strong> <span className="text-xs text-slate-500">({getBowlingTypeFullName(player.bowling_type)})</span></span>
              </div>
            </div>
          </div>

          {/* Key Metrics Quick Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-center shadow-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Age</span>
              <div className="text-xl font-black text-slate-900">{player.age} Yrs</div>
              <span className="text-[10px] text-emerald-800 font-medium">{player.age <= 18 ? 'Youth Trainee' : 'Senior'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Talent (BTI)</span>
              <div className="text-xl font-black font-mono text-emerald-800">{(player.bti ?? 0).toLocaleString()}</div>
              <span className="text-[10px] text-slate-500">Subskill: {player.subskill ?? 6.20}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Wage</span>
              <div className="text-xl font-black font-mono text-slate-800">£{(player.wage ?? 0).toLocaleString()}</div>
              <span className="text-[10px] text-slate-500">/ week</span>
            </div>
            <div className="min-w-0" title={`£${(player.market_value ?? 0).toLocaleString()}`}>
              <span className="text-[10px] uppercase font-bold text-slate-500">Market Value</span>
              <div className="text-sm sm:text-base font-black font-mono text-amber-800 whitespace-nowrap">£{(player.market_value ?? 0).toLocaleString()}</div>
              <span className="text-[10px] text-amber-700/80">Estimated</span>
            </div>
          </div>
        </div>

        {/* Unique Club Milestones */}
        {player.uniqueRecords && player.uniqueRecords.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-800 mb-2">
              <Award className="w-4 h-4 text-amber-700" />
              <span>Battrick Milestones & Club Records</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {player.uniqueRecords.map((rec, i) => (
                <div key={i} className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
                  <Trophy className="w-3.5 h-3.5 text-amber-700" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Complete Skills Dossier Matrix (All 11 Skills Visible) */}
      <div className="sovereign-card p-6 rounded-2xl border-slate-200 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-800" />
            <span>Battrick Technical & Physical Attributes (All 11 Skills)</span>
          </h3>
          <span className="text-xs font-mono text-emerald-800 font-bold">
            Active Net: {player.active_net || 'Unassigned'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          {skillsList.map((skill) => {
            const levelVal = getSkillLevel(skill.value);
            const badgeColor = getSkillBadgeColor(levelVal);
            return (
              <div key={skill.label} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{skill.label}</span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">Lvl {levelVal}/15</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold capitalize border ${badgeColor}`}>
                    {skill.value || 'None'}
                  </span>
                  <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full"
                      style={{ width: `${Math.min(100, (levelVal / 15) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CAREER STATISTICS SECTION: DOMESTIC & FRIENDLY TABS */}
      <div className="sovereign-card p-6 rounded-2xl border-slate-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-800" />
              <span>Career Statistics (ESPNcricinfo Specification)</span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Comprehensive breakdown for First Class, List A, and T20 with Season & Career rows
            </p>
          </div>

          {/* TWO COMPETITION TABS: DOMESTIC & FRIENDLY */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setCompetitionTab('domestic')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                competitionTab === 'domestic'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Domestic Matches</span>
            </button>
            <button
              onClick={() => setCompetitionTab('friendly')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                competitionTab === 'friendly'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Friendly Matches</span>
            </button>
          </div>
        </div>

        {/* BATTING & FIELDING TABLE (15 Columns) */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-emerald-700" />
              <span>BATTING & FIELDING &bull; {competitionTab === 'domestic' ? 'DOMESTIC' : 'FRIENDLY'}</span>
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">
              Season 69 &bull; Career Total
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Format</th>
                  <th className="py-2.5 px-3">Span</th>
                  <th className="py-2.5 px-2 text-center">Mat</th>
                  <th className="py-2.5 px-2 text-center">Inns</th>
                  <th className="py-2.5 px-2 text-center">NO</th>
                  <th className="py-2.5 px-3 text-right">Runs</th>
                  <th className="py-2.5 px-3 text-center">HS</th>
                  <th className="py-2.5 px-3 text-right">Ave</th>
                  <th className="py-2.5 px-2 text-right">BF</th>
                  <th className="py-2.5 px-3 text-right">SR</th>
                  <th className="py-2.5 px-2 text-center">100s</th>
                  <th className="py-2.5 px-2 text-center">50s</th>
                  <th className="py-2.5 px-2 text-center">4s</th>
                  <th className="py-2.5 px-2 text-center">6s</th>
                  <th className="py-2.5 px-2 text-center">Ct</th>
                  <th className="py-2.5 px-2 text-center">St</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {[
                  { format: 'First Class', span: 'Season 69', st: formatStats.fc_season, isSeason: true },
                  { format: 'First Class', span: 'Career', st: formatStats.fc_career },
                  { format: 'List A', span: 'Season 69', st: formatStats.od_season, isSeason: true },
                  { format: 'List A', span: 'Career', st: formatStats.od_career },
                  { format: 'T20', span: 'Season 69', st: formatStats.t20_season, isSeason: true },
                  { format: 'T20', span: 'Career', st: formatStats.t20_career }
                ].map((row, idx) => (
                  <tr 
                    key={idx} 
                    className={`transition-colors ${
                      row.isSeason 
                        ? 'bg-slate-50/60 hover:bg-slate-100/70' 
                        : 'bg-white hover:bg-emerald-50/40'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-sans font-bold text-slate-900">
                      {row.format}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-600 font-semibold text-[11px]">
                      {row.span}
                    </td>
                    <td className="py-2.5 px-2 text-center text-slate-700">{row.st.matches}</td>
                    <td className="py-2.5 px-2 text-center text-slate-700">{row.st.innings}</td>
                    <td className="py-2.5 px-2 text-center text-slate-700">{row.st.notOuts ?? 0}</td>
                    <td className="py-2.5 px-3 text-right font-black text-slate-900">
                      {row.st.runs}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-800">{row.st.highestScore || '-'}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-amber-800">
                      {row.st.average > 0 ? row.st.average.toFixed(2) : (row.st.innings > 0 ? '0.00' : '-')}
                    </td>
                    <td className="py-2.5 px-2 text-right text-slate-700">{row.st.ballsFaced ?? 0}</td>
                    <td className="py-2.5 px-3 text-right text-slate-700">
                      {row.st.strikeRate > 0 ? row.st.strikeRate.toFixed(2) : '-'}
                    </td>
                    <td className="py-2.5 px-2 text-center text-amber-700 font-bold">{row.st.centuries}</td>
                    <td className="py-2.5 px-2 text-center text-slate-700">{row.st.fifties}</td>
                    <td className="py-2.5 px-2 text-center text-slate-700">{row.st.fours}</td>
                    <td className="py-2.5 px-2 text-center text-slate-700">{row.st.sixes}</td>
                    <td className="py-2.5 px-2 text-center text-slate-700">{row.st.catches}</td>
                    <td className="py-2.5 px-2 text-center text-slate-700">{row.st.stumpings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BOWLING TABLE (14 Columns) */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-teal-700" />
              <span>BOWLING &bull; {competitionTab === 'domestic' ? 'DOMESTIC' : 'FRIENDLY'}</span>
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">
              Season 69 &bull; Career Total
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Format</th>
                  <th className="py-2.5 px-3">Span</th>
                  <th className="py-2.5 px-2 text-center">Mat</th>
                  <th className="py-2.5 px-2 text-center">Inns</th>
                  <th className="py-2.5 px-2 text-right">Balls</th>
                  <th className="py-2.5 px-3 text-right">Runs</th>
                  <th className="py-2.5 px-2 text-right">Wkts</th>
                  <th className="py-2.5 px-3 text-center">BBI</th>
                  <th className="py-2.5 px-3 text-center">BBM</th>
                  <th className="py-2.5 px-3 text-right">Ave</th>
                  <th className="py-2.5 px-3 text-right">Econ</th>
                  <th className="py-2.5 px-2 text-right">SR</th>
                  <th className="py-2.5 px-2 text-center">4w</th>
                  <th className="py-2.5 px-2 text-center">5w</th>
                  <th className="py-2.5 px-2 text-center">10w</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {[
                  { format: 'First Class', span: 'Season 69', st: formatStats.fc_season, isSeason: true },
                  { format: 'First Class', span: 'Career', st: formatStats.fc_career },
                  { format: 'List A', span: 'Season 69', st: formatStats.od_season, isSeason: true },
                  { format: 'List A', span: 'Career', st: formatStats.od_career },
                  { format: 'T20', span: 'Season 69', st: formatStats.t20_season, isSeason: true },
                  { format: 'T20', span: 'Career', st: formatStats.t20_career }
                ].map((row, idx) => (
                  <tr 
                    key={idx} 
                    className={`transition-colors ${
                      row.isSeason 
                        ? 'bg-slate-50/60 hover:bg-slate-100/70' 
                        : 'bg-white hover:bg-teal-50/40'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-sans font-bold text-slate-900">
                      {row.format}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-600 font-semibold text-[11px]">
                      {row.span}
                    </td>
                    <td className="py-2.5 px-2 text-center text-slate-700">{row.st.matches}</td>
                    <td className="py-2.5 px-2 text-center text-slate-700">{row.st.inningsBowled ?? (row.st.oversBowled > 0 ? row.st.matches : 0)}</td>
                    <td className="py-2.5 px-2 text-right text-slate-700">{row.st.ballsBowled ?? Math.round(row.st.oversBowled * 6)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-700">{row.st.runsConceded ?? 0}</td>
                    <td className="py-2.5 px-2 text-right font-black text-teal-800">
                      {row.st.wickets}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-800">{row.st.bestBowling || '-'}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-700">{row.st.bestBowlingMatch || row.st.bestBowling || '-'}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-amber-800">
                      {row.st.bowlingAverage > 0 ? row.st.bowlingAverage.toFixed(2) : (row.st.wickets > 0 ? '0.00' : '-')}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-700">
                      {row.st.economy > 0 ? row.st.economy.toFixed(2) : '-'}
                    </td>
                    <td className="py-2.5 px-2 text-right text-slate-700">
                      {(row.st.bowlingStrikeRate && row.st.bowlingStrikeRate > 0) ? row.st.bowlingStrikeRate.toFixed(1) : '-'}
                    </td>
                    <td className="py-2.5 px-2 text-center text-slate-700">{row.st.fourWickets ?? 0}</td>
                    <td className="py-2.5 px-2 text-center text-amber-700 font-bold">{row.st.fiveWickets ?? 0}</td>
                    <td className="py-2.5 px-2 text-center text-teal-700 font-bold">{row.st.tenWickets ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RECENT MATCHES OF {PLAYER.NAME} (Exact match with ESPNcricinfo user reference image) */}
      <div className="sovereign-card p-6 rounded-2xl border-slate-200 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="text-base font-black text-slate-900 tracking-tight">
            Recent Matches of {player.name}
          </h3>
          <span className="text-xs font-mono font-bold text-slate-500">
            {playerRecentMatches.length} Recorded Match Appearances
          </span>
        </div>

        {playerRecentMatches.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-xs leading-relaxed">
            No recent matches recorded for this player yet. Upload match scorecards via Import Hub or the 1-Click Browser Button to populate live match form and bowling figures.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
                  <th className="py-3 px-4">Match</th>
                  <th className="py-3 px-3 text-center">Bat</th>
                  <th className="py-3 px-3 text-center">Bowl</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Ground</th>
                  <th className="py-3 px-4 text-right">Format</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {playerRecentMatches.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-sans font-bold text-slate-900 hover:text-emerald-800 underline cursor-pointer">
                      {m.matchTitle}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900">
                      {m.batScore}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700">
                      {m.bowlFigures}
                    </td>
                    <td className="py-3 px-3 text-slate-600 text-[11px]">
                      {m.date}
                    </td>
                    <td className="py-3 px-3 font-sans font-bold text-slate-900">
                      {m.ground}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600 text-[11px]">
                      {m.format}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
