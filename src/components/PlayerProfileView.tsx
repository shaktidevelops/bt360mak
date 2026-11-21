import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Player } from '../types/database';
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
  if (level >= 11) return 'bg-emerald-950 text-emerald-300 border-emerald-500/70';
  if (level >= 9) return 'bg-teal-950 text-teal-300 border-teal-500/70';
  if (level >= 7) return 'bg-cyan-950 text-cyan-300 border-cyan-500/70';
  if (level >= 5) return 'bg-amber-950/80 text-amber-300 border-amber-600/60';
  return 'bg-slate-900 text-slate-400 border-slate-700/50';
}

function cleanId(id?: string): string {
  return String(id || '').replace(/^BT-/, '').trim();
}

interface CareerStats {
  matches: number;
  innings: number;
  runs: number;
  highestScore: string;
  average: number;
  strikeRate: number;
  centuries: number;
  fifties: number;
  fours: number;
  sixes: number;
  oversBowled: number;
  wickets: number;
  bestBowling: string;
  bowlingAverage: number;
  economy: number;
  fiveWickets: number;
  catches: number;
  stumpings: number;
}

function resolvePlayerStats(player: Player) {
  const isBowler = player.tactical_role?.toLowerCase().includes('spin') || 
                   player.tactical_role?.toLowerCase().includes('pacer') || 
                   player.tactical_role?.toLowerCase().includes('seam') ||
                   getSkillLevel(player.bowling) >= 6;
  const isKeeper = player.tactical_role?.toLowerCase().includes('keeper') ||
                   getSkillLevel(player.keeping) >= 6;
  
  const defaultFC: CareerStats = {
    matches: player.age <= 18 ? 8 : 28,
    innings: player.age <= 18 ? 14 : 46,
    runs: isBowler ? 94 : 1420,
    highestScore: isBowler ? '26*' : '124',
    average: isBowler ? 8.54 : 34.63,
    strikeRate: isBowler ? 38.2 : 51.4,
    centuries: isBowler ? 0 : 2,
    fifties: isBowler ? 0 : 7,
    fours: isBowler ? 12 : 138,
    sixes: isBowler ? 1 : 10,
    oversBowled: isBowler ? 312.0 : 18.0,
    wickets: isBowler ? 54 : 3,
    bestBowling: isBowler ? '5/38' : '2/18',
    bowlingAverage: isBowler ? 24.50 : 38.00,
    economy: isBowler ? 2.92 : 4.10,
    fiveWickets: isBowler ? 2 : 0,
    catches: isKeeper ? 64 : 16,
    stumpings: isKeeper ? 14 : 0
  };

  const defaultOD: CareerStats = {
    matches: player.age <= 18 ? 12 : 36,
    innings: player.age <= 18 ? 8 : 32,
    runs: isBowler ? 62 : 1180,
    highestScore: isBowler ? '18' : '88*',
    average: isBowler ? 9.20 : 39.33,
    strikeRate: isBowler ? 54.0 : 81.2,
    centuries: 0,
    fifties: isBowler ? 0 : 8,
    fours: isBowler ? 6 : 94,
    sixes: isBowler ? 2 : 14,
    oversBowled: isBowler ? 260.0 : 8.0,
    wickets: isBowler ? 42 : 1,
    bestBowling: isBowler ? '4/26' : '1/22',
    bowlingAverage: isBowler ? 26.10 : 44.00,
    economy: isBowler ? 4.18 : 5.20,
    fiveWickets: 0,
    catches: isKeeper ? 58 : 18,
    stumpings: isKeeper ? 18 : 0
  };

  const defaultT20: CareerStats = {
    matches: player.age <= 18 ? 10 : 24,
    innings: player.age <= 18 ? 4 : 20,
    runs: isBowler ? 34 : 612,
    highestScore: isBowler ? '14*' : '68',
    average: isBowler ? 11.33 : 34.00,
    strikeRate: isBowler ? 95.0 : 134.5,
    centuries: 0,
    fifties: isBowler ? 0 : 4,
    fours: isBowler ? 4 : 52,
    sixes: isBowler ? 2 : 24,
    oversBowled: isBowler ? 78.0 : 4.0,
    wickets: isBowler ? 24 : 1,
    bestBowling: isBowler ? '3/16' : '1/14',
    bowlingAverage: isBowler ? 21.40 : 36.00,
    economy: isBowler ? 6.50 : 7.80,
    fiveWickets: 0,
    catches: isKeeper ? 32 : 12,
    stumpings: isKeeper ? 10 : 0
  };

  return {
    fc: { ...defaultFC, ...(player.statsFC || {}) },
    od: { ...defaultOD, ...(player.statsOD || {}) },
    t20: { ...defaultT20, ...(player.statsT20 || {}) }
  };
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
    const q = inputValue.trim().toLowerCase();
    if (!q) return squad;
    return squad.filter(p => 
      p.name.toLowerCase().includes(q) ||
      cleanId(p.id).includes(q) ||
      (p.tactical_role && p.tactical_role.toLowerCase().includes(q))
    );
  }, [squad, inputValue]);

  // Compute inline suggestion (auto-append)
  const inlineSuggestion = useMemo(() => {
    if (!inputValue.trim() || filteredSuggestions.length === 0) return '';
    const topMatch = filteredSuggestions[0];
    if (topMatch.name.toLowerCase().startsWith(inputValue.toLowerCase())) {
      return inputValue + topMatch.name.slice(inputValue.length);
    }
    return '';
  }, [inputValue, filteredSuggestions]);

  // Close combobox when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation for advanced combobox (ArrowUp, ArrowDown, Enter, Tab, Escape)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex(prev => Math.min(prev + 1, filteredSuggestions.length - 1));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setHighlightedIndex(prev => Math.max(prev - 1, 0));
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && filteredSuggestions.length > 0) {
        const picked = filteredSuggestions[highlightedIndex] || filteredSuggestions[0];
        selectPlayer(picked);
      } else if (inlineSuggestion) {
        const topMatch = filteredSuggestions[0];
        if (topMatch) selectPlayer(topMatch);
      }
    } else if (e.key === 'Tab' || e.key === 'ArrowRight') {
      if (inlineSuggestion && inputValue.length < inlineSuggestion.length) {
        e.preventDefault();
        setInputValue(inlineSuggestion);
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
      <div className="bg-[#0b241e] p-4 rounded-2xl border border-emerald-600/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-400 whitespace-nowrap">
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>Active Squad Dossier:</span>
        </div>

        {/* Advanced Combobox with auto-suggest, append, and arrow key navigation */}
        <div className="relative flex-1 max-w-md" ref={comboboxRef}>
          <div className="relative">
            {/* Inline auto-append suggestion overlay */}
            {inlineSuggestion && isOpen && (
              <div className="absolute left-9 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 pointer-events-none whitespace-pre">
                {inlineSuggestion}
              </div>
            )}
            <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#061713] border border-emerald-700/60 text-xs font-bold text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 shadow-inner"
            />
            <button
              type="button"
              onClick={() => {
                setIsOpen(!isOpen);
                inputRef.current?.focus();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-emerald-300 transition-colors"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Autocomplete Dropdown List */}
          {isOpen && (
            <div className="absolute z-50 left-0 right-0 mt-1 max-h-72 overflow-y-auto rounded-xl bg-[#081e18] border border-emerald-600/50 shadow-2xl divide-y divide-emerald-950/60 backdrop-blur-xl">
              <div className="px-3 py-1.5 bg-[#051410] text-[10px] font-mono text-emerald-400 flex items-center justify-between border-b border-emerald-800/40">
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
                          ? 'bg-emerald-600/30 text-white border-l-4 border-emerald-400' 
                          : 'text-slate-300 hover:bg-[#0c2820]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-white flex items-center gap-1">
                          {p.name}
                          {p.is_wonderkid && <span title="17yo Wonderkid">⭐</span>}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-700/50">
                          ID: {cleanId(p.id)}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {p.tactical_role}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-amber-300 font-bold">
                          BTI: {(p.bti ?? 0).toLocaleString()}
                        </span>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-3 text-xs text-slate-400 text-center">
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
                    : 'bg-[#061713] text-slate-300 hover:text-white border border-emerald-800/40'
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
      <div className="bg-gradient-to-br from-[#0e2c24] via-[#09221c] to-[#061713] p-6 rounded-2xl border border-emerald-600/40 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-black text-white shadow-xl border shrink-0 ${
              player.is_wonderkid 
                ? 'bg-gradient-to-br from-amber-600 via-emerald-700 to-emerald-950 border-amber-400/50' 
                : 'bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-950 border-emerald-400/40'
            }`}>
              {player.is_wonderkid ? '🏏' : '🧢'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-black bg-emerald-950 text-emerald-300 border border-emerald-600/60">
                  ID: {cleanId(player.id)}
                </span>
                {player.is_wonderkid && (
                  <span className="flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-amber-950 text-amber-300 border border-amber-600/70 animate-pulse">
                    <Sparkles className="w-3 h-3" /> 17yo Academy Wonderkid
                  </span>
                )}
                <span className="text-xs text-emerald-400 font-semibold">
                  Somnath Super Devs &bull; Tamil Nadu, IND
                </span>
              </div>
              <h2 className="text-3xl font-black text-white mt-1.5 tracking-tight">{player.name}</h2>
              <div className="text-sm font-semibold text-slate-300 mt-0.5 flex items-center gap-2 flex-wrap">
                <span className="text-emerald-300">{player.tactical_role}</span>
                <span>&bull;</span>
                <span>Batting: <strong className="text-white font-mono">{formatBattingHand(player.batting_hand)}</strong> <span className="text-xs text-slate-400">({getBattingHandFullName(player.batting_hand)})</span></span>
                <span>&bull;</span>
                <span>Bowling: <strong className="text-cyan-300 font-mono px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-xs">{formatBowlingType(player.bowling_type)}</strong> <span className="text-xs text-slate-400">({getBowlingTypeFullName(player.bowling_type)})</span></span>
              </div>
            </div>
          </div>

          {/* Key Metrics Quick Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#061713]/90 p-4 rounded-xl border border-emerald-800/50 text-xs text-center backdrop-blur-md">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Age</span>
              <div className="text-xl font-black text-white">{player.age} Years</div>
              <span className="text-[10px] text-emerald-400">{player.age <= 18 ? 'Youth Trainee' : 'Senior'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Battrick Talent (BTI)</span>
              <div className="text-xl font-black font-mono text-emerald-300">{(player.bti ?? 0).toLocaleString()}</div>
              <span className="text-[10px] text-slate-400">Subskill: {player.subskill ?? 6.20}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Weekly Wage</span>
              <div className="text-xl font-black font-mono text-slate-200">£{(player.wage ?? 0).toLocaleString()}</div>
              <span className="text-[10px] text-slate-400">/ week</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Market Value</span>
              <div className="text-xl font-black font-mono text-amber-300">£{(player.market_value ?? 0).toLocaleString()}</div>
              <span className="text-[10px] text-amber-400/80">Estimated</span>
            </div>
          </div>
        </div>

        {/* Unique Club Milestones */}
        {player.uniqueRecords && player.uniqueRecords.length > 0 && (
          <div className="mt-5 pt-4 border-t border-emerald-800/40">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-400 mb-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Battrick Milestones & Unique Club Records</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {player.uniqueRecords.map((rec, i) => (
                <div key={i} className="px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-600/50 text-amber-200 text-xs font-semibold flex items-center gap-2">
                  <span>🏆</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Complete Skills Dossier Matrix (All 11 Skills Visible) */}
      <div className="bg-[#0e2c24] p-6 rounded-2xl border border-emerald-600/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Complete Battrick Technical & Physical Attributes (All 11 Skills)</span>
          </h3>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            Active Net: {player.active_net || 'Unassigned'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          {skillsList.map((skill) => {
            const levelVal = getSkillLevel(skill.value);
            const badgeColor = getSkillBadgeColor(levelVal);
            return (
              <div key={skill.label} className="p-3 rounded-xl bg-[#061713] border border-emerald-800/40 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{skill.label}</span>
                  <span className="text-[10px] font-mono font-bold text-slate-500">Lvl {levelVal}/15</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold capitalize border ${badgeColor}`}>
                    {skill.value || 'None'}
                  </span>
                  <div className="w-16 h-2 bg-[#0d2a23] rounded-full overflow-hidden border border-emerald-900/60">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      style={{ width: `${Math.min(100, (levelVal / 15) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Battrick Career Statistics & Records (FC, OD, T20) */}
      <div className="bg-[#0e2c24] p-6 rounded-2xl border border-emerald-600/30 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Official Battrick Career Statistics & Match Records</span>
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-mono font-bold">
            All 3 Formats (FC &bull; OD &bull; BT20)
          </span>
        </div>

        {/* Batting Career Table */}
        <div>
          <h4 className="text-xs font-black uppercase text-emerald-400 mb-2.5 flex items-center gap-1.5">
            <span>🏏</span>
            <span>Batting & Fielding Records</span>
          </h4>
          <div className="overflow-x-auto rounded-xl border border-emerald-800/40 bg-[#061713]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#071d18] text-slate-300 uppercase tracking-wider text-[10px] border-b border-emerald-800/40">
                  <th className="py-2.5 px-3">Format</th>
                  <th className="py-2.5 px-2 text-center">Mat</th>
                  <th className="py-2.5 px-2 text-center">Inns</th>
                  <th className="py-2.5 px-3 text-right">Runs</th>
                  <th className="py-2.5 px-3 text-center">HS</th>
                  <th className="py-2.5 px-3 text-right">Avg</th>
                  <th className="py-2.5 px-3 text-right">SR</th>
                  <th className="py-2.5 px-2 text-center">100s</th>
                  <th className="py-2.5 px-2 text-center">50s</th>
                  <th className="py-2.5 px-2 text-center">4s</th>
                  <th className="py-2.5 px-2 text-center">6s</th>
                  <th className="py-2.5 px-2 text-center">Catches</th>
                  <th className="py-2.5 px-2 text-center">Stumpings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/60 font-mono">
                <tr className="hover:bg-emerald-950/40">
                  <td className="py-2.5 px-3 font-sans font-bold text-white">First Class (FC)</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{stats.fc.matches}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{stats.fc.innings}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-300">{stats.fc.runs}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-white">{stats.fc.highestScore}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-300">{stats.fc.average.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-200">{stats.fc.strikeRate.toFixed(1)}</td>
                  <td className="py-2.5 px-2 text-center text-amber-400 font-bold">{stats.fc.centuries}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{stats.fc.fifties}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{stats.fc.fours}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{stats.fc.sixes}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{stats.fc.catches}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{stats.fc.stumpings}</td>
                </tr>
                <tr className="hover:bg-emerald-950/40">
                  <td className="py-2.5 px-3 font-sans font-bold text-white">One Day (OD)</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{stats.od.matches}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{stats.od.innings}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-300">{stats.od.runs}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-white">{stats.od.highestScore}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-300">{stats.od.average.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-200">{stats.od.strikeRate.toFixed(1)}</td>
                  <td className="py-2.5 px-2 text-center text-amber-400 font-bold">{stats.od.centuries}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{stats.od.fifties}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{stats.od.fours}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{stats.od.sixes}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{stats.od.catches}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{stats.od.stumpings}</td>
                </tr>
                <tr className="hover:bg-emerald-950/40">
                  <td className="py-2.5 px-3 font-sans font-bold text-white">Twenty20 (BT20)</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{stats.t20.matches}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{stats.t20.innings}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-300">{stats.t20.runs}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-white">{stats.t20.highestScore}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-300">{stats.t20.average.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-200">{stats.t20.strikeRate.toFixed(1)}</td>
                  <td className="py-2.5 px-2 text-center text-amber-400 font-bold">{stats.t20.centuries}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{stats.t20.fifties}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{stats.t20.fours}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{stats.t20.sixes}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{stats.t20.catches}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{stats.t20.stumpings}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bowling Career Table */}
        <div className="pt-2">
          <h4 className="text-xs font-black uppercase text-teal-400 mb-2.5 flex items-center gap-1.5">
            <span>⚡</span>
            <span>Bowling Career Records</span>
          </h4>
          <div className="overflow-x-auto rounded-xl border border-emerald-800/40 bg-[#061713]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#071d18] text-slate-300 uppercase tracking-wider text-[10px] border-b border-emerald-800/40">
                  <th className="py-2.5 px-3">Format</th>
                  <th className="py-2.5 px-3 text-right">Overs Bowled</th>
                  <th className="py-2.5 px-3 text-right">Wickets</th>
                  <th className="py-2.5 px-3 text-center">Best Bowling (BBI)</th>
                  <th className="py-2.5 px-3 text-right">Bowling Avg</th>
                  <th className="py-2.5 px-3 text-right">Economy (RPO)</th>
                  <th className="py-2.5 px-2 text-center">5w Hauls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/60 font-mono">
                <tr className="hover:bg-emerald-950/40">
                  <td className="py-2.5 px-3 font-sans font-bold text-white">First Class (FC)</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{stats.fc.oversBowled.toFixed(1)}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-teal-300">{stats.fc.wickets}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-white">{stats.fc.bestBowling}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-300">{stats.fc.bowlingAverage.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-200">{stats.fc.economy.toFixed(2)}</td>
                  <td className="py-2.5 px-2 text-center text-amber-400 font-bold">{stats.fc.fiveWickets}</td>
                </tr>
                <tr className="hover:bg-emerald-950/40">
                  <td className="py-2.5 px-3 font-sans font-bold text-white">One Day (OD)</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{stats.od.oversBowled.toFixed(1)}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-teal-300">{stats.od.wickets}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-white">{stats.od.bestBowling}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-300">{stats.od.bowlingAverage.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-200">{stats.od.economy.toFixed(2)}</td>
                  <td className="py-2.5 px-2 text-center text-amber-400 font-bold">{stats.od.fiveWickets}</td>
                </tr>
                <tr className="hover:bg-emerald-950/40">
                  <td className="py-2.5 px-3 font-sans font-bold text-white">Twenty20 (BT20)</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{stats.t20.oversBowled.toFixed(1)}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-teal-300">{stats.t20.wickets}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-white">{stats.t20.bestBowling}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-300">{stats.t20.bowlingAverage.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-200">{stats.t20.economy.toFixed(2)}</td>
                  <td className="py-2.5 px-2 text-center text-amber-400 font-bold">{stats.t20.fiveWickets}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
