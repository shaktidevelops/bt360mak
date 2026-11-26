import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Player, PlayerStats } from '../types/database';
import { Award, Sparkles, TrendingUp, BarChart3, UserCheck, Search, ChevronDown, Check } from 'lucide-react';
import { formatBowlingType, getBowlingTypeFullName, formatBattingHand, getBattingHandFullName } from '../lib/cricketFormatters';

interface PlayerProfileViewProps {
  squad: Player[];
  selectedPlayerId?: string;
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

import { EMPTY_STATS } from '../lib/matchStatsEngine';

function resolvePlayerStats(player: Player) {
  const fc = player.statsFC || EMPTY_STATS;
  const od = player.statsOD || EMPTY_STATS;
  const t20 = player.statsT20 || EMPTY_STATS;
  const u19 = player.statsU19 || EMPTY_STATS;
  const national = player.statsNational || EMPTY_STATS;
  const friendly = player.statsFriendly || EMPTY_STATS;

  // Compute Career Total row across all formats
  const totalMatches = fc.matches + od.matches + t20.matches + (u19.matches || 0) + (national.matches || 0) + (friendly.matches || 0);
  const totalInns = fc.innings + od.innings + t20.innings + (u19.innings || 0) + (national.innings || 0) + (friendly.innings || 0);
  const totalNotOuts = (fc.notOuts || 0) + (od.notOuts || 0) + (t20.notOuts || 0) + (u19.notOuts || 0) + (national.notOuts || 0) + (friendly.notOuts || 0);
  const totalRuns = fc.runs + od.runs + t20.runs + (u19.runs || 0) + (national.runs || 0) + (friendly.runs || 0);
  const totalOuts = Math.max(0, totalInns - totalNotOuts);
  const totalAverage = totalOuts > 0 ? parseFloat((totalRuns / totalOuts).toFixed(2)) : totalRuns > 0 ? totalRuns : 0;
  const totalBF = (fc.ballsFaced || 0) + (od.ballsFaced || 0) + (t20.ballsFaced || 0) + (u19.ballsFaced || 0) + (national.ballsFaced || 0) + (friendly.ballsFaced || 0);
  const totalSR = totalBF > 0 ? parseFloat(((totalRuns / totalBF) * 100).toFixed(2)) : 0;
  const total100s = fc.centuries + od.centuries + t20.centuries + (u19.centuries || 0) + (national.centuries || 0) + (friendly.centuries || 0);
  const total50s = fc.fifties + od.fifties + t20.fifties + (u19.fifties || 0) + (national.fifties || 0) + (friendly.fifties || 0);
  const total4s = fc.fours + od.fours + t20.fours + (u19.fours || 0) + (national.fours || 0) + (friendly.fours || 0);
  const total6s = fc.sixes + od.sixes + t20.sixes + (u19.sixes || 0) + (national.sixes || 0) + (friendly.sixes || 0);
  const totalCatches = fc.catches + od.catches + t20.catches + (u19.catches || 0) + (national.catches || 0) + (friendly.catches || 0);
  const totalStumpings = fc.stumpings + od.stumpings + t20.stumpings + (u19.stumpings || 0) + (national.stumpings || 0) + (friendly.stumpings || 0);

  // Highest score overall
  const scores = [fc.highestScore, od.highestScore, t20.highestScore, u19.highestScore, national.highestScore, friendly.highestScore].filter(s => s && s !== '-');
  let topHS = '-';
  let topHSVal = -1;
  scores.forEach(s => {
    const num = parseInt(s);
    if (!isNaN(num) && num > topHSVal) {
      topHSVal = num;
      topHS = s;
    }
  });

  // Bowling Totals
  const totalInnsBowled = (fc.inningsBowled || 0) + (od.inningsBowled || 0) + (t20.inningsBowled || 0) + (u19.inningsBowled || 0) + (national.inningsBowled || 0) + (friendly.inningsBowled || 0);
  const totalBallsBowled = (fc.ballsBowled || 0) + (od.ballsBowled || 0) + (t20.ballsBowled || 0) + (u19.ballsBowled || 0) + (national.ballsBowled || 0) + (friendly.ballsBowled || 0);
  const totalRunsConceded = (fc.runsConceded || 0) + (od.runsConceded || 0) + (t20.runsConceded || 0) + (u19.runsConceded || 0) + (national.runsConceded || 0) + (friendly.runsConceded || 0);
  const totalWickets = fc.wickets + od.wickets + t20.wickets + (u19.wickets || 0) + (national.wickets || 0) + (friendly.wickets || 0);
  const totalBowlAvg = totalWickets > 0 ? parseFloat((totalRunsConceded / totalWickets).toFixed(2)) : 0;
  const totalOvers = totalBallsBowled > 0 ? totalBallsBowled / 6 : 0;
  const totalEconomy = totalOvers > 0 ? parseFloat((totalRunsConceded / totalOvers).toFixed(2)) : 0;
  const totalBowlSR = totalWickets > 0 ? parseFloat((totalBallsBowled / totalWickets).toFixed(1)) : 0;
  const total4w = (fc.fourWickets || 0) + (od.fourWickets || 0) + (t20.fourWickets || 0) + (u19.fourWickets || 0) + (national.fourWickets || 0) + (friendly.fourWickets || 0);
  const total5w = (fc.fiveWickets || 0) + (od.fiveWickets || 0) + (t20.fiveWickets || 0) + (u19.fiveWickets || 0) + (national.fiveWickets || 0) + (friendly.fiveWickets || 0);
  const total10w = (fc.tenWickets || 0) + (od.tenWickets || 0) + (t20.tenWickets || 0) + (u19.tenWickets || 0) + (national.tenWickets || 0) + (friendly.tenWickets || 0);

  // Best bowling across formats
  const bbis = [fc.bestBowling, od.bestBowling, t20.bestBowling, u19.bestBowling, national.bestBowling, friendly.bestBowling].filter(b => b && b !== '-');
  let topBBI = '-';
  let topWkts = 0;
  let topRuns = 999;
  bbis.forEach(b => {
    const parts = b.split('/');
    if (parts.length === 2) {
      const w = parseInt(parts[0]);
      const r = parseInt(parts[1]);
      if (w > topWkts || (w === topWkts && r < topRuns)) {
        topWkts = w;
        topRuns = r;
        topBBI = b;
      }
    }
  });

  const total: PlayerStats = {
    matches: totalMatches,
    innings: totalInns,
    notOuts: totalNotOuts,
    runs: totalRuns,
    highestScore: topHS,
    average: totalAverage,
    ballsFaced: totalBF,
    strikeRate: totalSR,
    centuries: total100s,
    fifties: total50s,
    fours: total4s,
    sixes: total6s,
    catches: totalCatches,
    stumpings: totalStumpings,
    inningsBowled: totalInnsBowled,
    ballsBowled: totalBallsBowled,
    runsConceded: totalRunsConceded,
    oversBowled: parseFloat(totalOvers.toFixed(1)),
    wickets: totalWickets,
    bestBowling: topBBI,
    bestBowlingMatch: topBBI,
    bowlingAverage: totalBowlAvg,
    economy: totalEconomy,
    bowlingStrikeRate: totalBowlSR,
    fourWickets: total4w,
    fiveWickets: total5w,
    tenWickets: total10w
  };

  return { fc, od, t20, u19, national, friendly, total };
}

export const PlayerProfileView: React.FC<PlayerProfileViewProps> = ({ 
  squad, 
  selectedPlayerId
}) => {
  const [currentId, setCurrentId] = useState<string>(cleanId(selectedPlayerId) || cleanId(squad[0]?.id));
  
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

  const player = useMemo(() => {
    const targetClean = cleanId(currentId);
    return squad.find(p => cleanId(p.id) === targetClean) || squad[0] || {} as Player;
  }, [squad, currentId]);

  const stats = resolvePlayerStats(player);

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

  // Compute inline auto-complete text
  const inlineSuggestion = useMemo(() => {
    if (!inputValue.trim() || filteredSuggestions.length === 0) return '';
    const topMatch = filteredSuggestions[0];
    if (topMatch.name.toLowerCase().startsWith(inputValue.toLowerCase())) {
      return inputValue + topMatch.name.slice(inputValue.length);
    }
    return '';
  }, [inputValue, filteredSuggestions]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
        return;
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev + 1) % Math.max(1, filteredSuggestions.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev - 1 + filteredSuggestions.length) % Math.max(1, filteredSuggestions.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredSuggestions.length > 0) {
        const picked = filteredSuggestions[highlightedIndex] || filteredSuggestions[0];
        selectPlayer(picked);
      }
    } else if (e.key === 'Tab') {
      if (inlineSuggestion && inlineSuggestion.toLowerCase() !== inputValue.toLowerCase()) {
        e.preventDefault();
        const topMatch = filteredSuggestions[0];
        if (topMatch) selectPlayer(topMatch);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const selectPlayer = (p: Player) => {
    const targetClean = cleanId(p.id);
    setCurrentId(targetClean);
    setInputValue(p.name);
    setIsOpen(false);
  };

  const skillsList = [
    { label: 'Batting', value: player.batting, category: 'primary' },
    { label: 'Bowling', value: player.bowling, category: 'primary' },
    { label: 'Keeping', value: player.keeping, category: 'specialist' },
    { label: 'Fielding', value: player.fielding, category: 'specialist' },
    { label: 'Consistency', value: player.consistency, category: 'secondary' },
    { label: 'Concentration', value: player.concentration, category: 'secondary' },
    { label: 'Stamina', value: player.stamina, category: 'physical' },
    { label: 'Match Form', value: player.form, category: 'condition' },
    { label: 'Fatigue', value: player.fatigue, category: 'condition' },
    { label: 'Leadership', value: player.leadership, category: 'mental' },
    { label: 'Experience', value: player.experience, category: 'mental' },
  ];

  return (
    <div className="space-y-6">
      {/* ADVANCED COMBOBOX & PLAYER SELECTOR BAR */}
      <div className="sovereign-card p-4 rounded-2xl border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-700 whitespace-nowrap">
          <UserCheck className="w-4 h-4 text-emerald-600" />
          <span>Active Squad Dossier:</span>
        </div>

        {/* Advanced Combobox with auto-suggest, append, and arrow key navigation */}
        <div className="relative flex-1 max-w-md" ref={comboboxRef}>
          <div className="relative">
            {inlineSuggestion && isOpen && (
              <div className="absolute left-9 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none whitespace-pre">
                {inlineSuggestion}
              </div>
            )}
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              placeholder={`Search player (e.g. ${player.name})...`}
              value={inputValue || (isOpen ? '' : player.name)}
              onChange={(e) => {
                setInputValue(e.target.value);
                setIsOpen(true);
                setHighlightedIndex(0);
              }}
              onFocus={() => {
                setIsOpen(true);
                setHighlightedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-inner"
            />
            <button
              type="button"
              onClick={() => {
                setIsOpen(!isOpen);
                inputRef.current?.focus();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-800 transition-colors"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Autocomplete Dropdown List */}
          {isOpen && (
            <div className="absolute z-50 left-0 right-0 mt-1 max-h-72 overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-2xl divide-y divide-slate-100">
              <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-mono text-emerald-700 flex items-center justify-between border-b border-slate-200">
                <span>Select with Arrow Keys &bull; Enter to Confirm</span>
                <span>{filteredSuggestions.length} Matches</span>
              </div>
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((p, idx) => {
                  const isHighlighted = idx === highlightedIndex;
                  const isCurrent = cleanId(p.id) === cleanId(player.id);

                  return (
                    <div
                      key={p.id}
                      onClick={() => selectPlayer(p)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={`px-3.5 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                        isHighlighted 
                          ? 'bg-emerald-50 text-emerald-900 border-l-4 border-emerald-600' 
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1">
                          {p.name}
                          {p.is_wonderkid && <span title="17yo Wonderkid">⭐</span>}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-300">
                          ID: #{cleanId(p.id)}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {p.tactical_role}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-amber-700 font-bold">
                          BTI: {(p.bti ?? 0).toLocaleString()}
                        </span>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-3 text-xs text-slate-500 text-center">
                  No player found matching "{inputValue}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick-Access Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
          {squad.slice(0, 5).map((p) => {
            const isSelected = cleanId(p.id) === cleanId(player.id);
            return (
              <button
                key={p.id}
                onClick={() => selectPlayer(p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow font-black scale-105'
                    : 'bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <span>{p.name.split(' ')[0]}</span>
                {p.is_wonderkid && <span>⭐</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Dossier Card */}
      <div className={`p-6 rounded-2xl border shadow-xl relative overflow-hidden ${
        player.is_wonderkid ? 'sovereign-card-gold' : 'sovereign-card'
      }`}>
        {(() => {
          const isKeeper = player.tactical_role?.includes('Keeper') || (player.keeping && getSkillLevel(player.keeping) >= 7);
          const isBowler = player.tactical_role?.includes('Bowler') || player.tactical_role?.includes('Spinner') || (player.bowling && getSkillLevel(player.bowling) >= 7);
          const roleEmoji = isKeeper ? '🧤' : isBowler ? '🔴' : '🏏';

          return (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-black shadow-md border shrink-0 ${
                  player.is_wonderkid 
                    ? 'bg-gradient-to-br from-amber-400 to-amber-600 border-amber-300 text-black' 
                    : 'bg-gradient-to-br from-emerald-600 to-teal-700 border-emerald-400 text-white'
                }`}>
                  {roleEmoji}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ID: #{cleanId(player.id)}
                    </span>
                    {player.is_wonderkid && (
                      <span className="flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        <Sparkles className="w-3 h-3 text-amber-600" /> 17yo Academy Wonderkid
                      </span>
                    )}
                    <span className="text-xs text-emerald-700 font-semibold">
                      Somnath Super Devs &bull; Tamil Nadu, IND
                    </span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mt-1.5 tracking-tight">{player.name}</h2>
                  <div className="text-sm font-semibold text-slate-600 mt-0.5 flex items-center gap-2 flex-wrap">
                    <span className="text-emerald-700 font-bold">{player.tactical_role}</span>
                    <span>&bull;</span>
                    <span>Batting: <strong className="text-slate-800 font-mono">{formatBattingHand(player.batting_hand)}</strong> <span className="text-xs text-slate-500">({getBattingHandFullName(player.batting_hand)})</span></span>
                    <span>&bull;</span>
                    <span>Bowling: <strong className="text-cyan-800 font-mono px-1.5 py-0.5 rounded bg-cyan-100 border border-cyan-300 text-xs">{formatBowlingType(player.bowling_type)}</strong> <span className="text-xs text-slate-500">({getBowlingTypeFullName(player.bowling_type)})</span></span>
                  </div>
                </div>
              </div>

              {/* Key Metrics Quick Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-center shadow-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Age</span>
                  <div className="text-xl font-black text-slate-900">{player.age} Years</div>
                  <span className="text-[10px] text-emerald-700 font-medium">{player.age <= 18 ? 'Youth Trainee' : 'Senior'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Battrick Talent (BTI)</span>
                  <div className="text-xl font-black font-mono text-emerald-700">{(player.bti ?? 0).toLocaleString()}</div>
                  <span className="text-[10px] text-slate-500">Subskill: {player.subskill ?? 6.20}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Weekly Wage</span>
                  <div className="text-xl font-black font-mono text-slate-800">£{(player.wage ?? 0).toLocaleString()}</div>
                  <span className="text-[10px] text-slate-500">/ week</span>
                </div>
                <div className="min-w-0" title={`£${(player.market_value ?? 0).toLocaleString()}`}>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Market Value</span>
                  <div className="text-sm sm:text-base font-black font-mono text-amber-700 whitespace-nowrap">£{(player.market_value ?? 0).toLocaleString()}</div>
                  <span className="text-[10px] text-amber-600/80">Estimated</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Unique Club Milestones */}
        {player.uniqueRecords && player.uniqueRecords.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-700 mb-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Battrick Milestones & Unique Club Records</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {player.uniqueRecords.map((rec, i) => (
                <div key={i} className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
                  <span>🏆</span>
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
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Complete Battrick Technical & Physical Attributes (All 11 Skills)</span>
          </h3>
          <span className="text-xs font-mono text-emerald-700 font-bold">
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
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                      style={{ width: `${Math.min(100, (levelVal / 15) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Battrick Career Statistics & Records (FC, OD, T20, U19, National, Friendly) */}
      <div className="sovereign-card p-6 rounded-2xl border-slate-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <span>Official Battrick Career Statistics & Records</span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Comprehensive performance breakdown across all competition formats + U19, National & Friendlies
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono font-bold self-start sm:self-auto">
            All 6 Match Formats + Career Total
          </span>
        </div>

        {/* Batting Career Table */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <span>🏏</span>
              <span>BATTING & FIELDING</span>
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">
              6 Formats &bull; Career Aggregate
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Format</th>
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
                  { label: 'First Class (FC)', tag: 'FC', st: stats.fc },
                  { label: 'One Day (OD / List A)', tag: 'OD', st: stats.od },
                  { label: 'Twenty20 (BT20)', tag: 'T20', st: stats.t20 },
                  { label: 'Under-19 (U19)', tag: 'U19', st: stats.u19 },
                  { label: 'National Team', tag: 'NAT', st: stats.national },
                  { label: 'Friendly Matches', tag: 'FR', st: stats.friendly },
                  { label: 'Career Total', tag: 'ALL', st: stats.total, isTotal: true }
                ].map((row) => (
                  <tr 
                    key={row.tag} 
                    className={`transition-colors ${
                      row.isTotal 
                        ? 'bg-slate-50 hover:bg-slate-100/80 font-bold border-t-2 border-slate-300 text-slate-900' 
                        : 'hover:bg-emerald-50/50'
                    }`}
                  >
                    <td className={`py-2.5 px-3 font-sans ${row.isTotal ? 'font-black text-slate-900' : 'font-bold text-slate-900'}`}>
                      {row.label}
                    </td>
                    <td className="py-2.5 px-2 text-center text-slate-700">{row.st.matches}</td>
                    <td className="py-2.5 px-2 text-center text-slate-700">{row.st.innings}</td>
                    <td className="py-2.5 px-2 text-center text-slate-700">{row.st.notOuts ?? 0}</td>
                    <td className={`py-2.5 px-3 text-right font-black ${row.isTotal ? 'text-emerald-800' : 'text-emerald-700'}`}>
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

        {/* Bowling Career Table */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
              <span>⚡</span>
              <span>BOWLING</span>
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">
              6 Formats &bull; Career Aggregate
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Format</th>
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
                  { label: 'First Class (FC)', tag: 'FC', st: stats.fc },
                  { label: 'One Day (OD / List A)', tag: 'OD', st: stats.od },
                  { label: 'Twenty20 (BT20)', tag: 'T20', st: stats.t20 },
                  { label: 'Under-19 (U19)', tag: 'U19', st: stats.u19 },
                  { label: 'National Team', tag: 'NAT', st: stats.national },
                  { label: 'Friendly Matches', tag: 'FR', st: stats.friendly },
                  { label: 'Career Total', tag: 'ALL', st: stats.total, isTotal: true }
                ].map((row) => (
                  <tr 
                    key={row.tag} 
                    className={`transition-colors ${
                      row.isTotal 
                        ? 'bg-slate-50 hover:bg-slate-100/80 font-bold border-t-2 border-slate-300 text-slate-900' 
                        : 'hover:bg-emerald-50/50'
                    }`}
                  >
                    <td className={`py-2.5 px-3 font-sans ${row.isTotal ? 'font-black text-slate-900' : 'font-bold text-slate-900'}`}>
                      {row.label}
                    </td>
                    <td className="py-2.5 px-2 text-center text-slate-700">{row.st.matches}</td>
                    <td className="py-2.5 px-2 text-center text-slate-700">{row.st.inningsBowled ?? (row.st.oversBowled > 0 ? row.st.matches : 0)}</td>
                    <td className="py-2.5 px-2 text-right text-slate-700">{row.st.ballsBowled ?? Math.round(row.st.oversBowled * 6)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-700">{row.st.runsConceded ?? 0}</td>
                    <td className={`py-2.5 px-2 text-right font-black ${row.isTotal ? 'text-teal-800' : 'text-teal-700'}`}>
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
    </div>
  );
};
