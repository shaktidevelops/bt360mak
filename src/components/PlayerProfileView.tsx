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

const EMPTY_CAREER_STATS: PlayerStats = {
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

function resolvePlayerStats(player: Player) {
  return {
    fc: player.statsFC || EMPTY_CAREER_STATS,
    od: player.statsOD || EMPTY_CAREER_STATS,
    t20: player.statsT20 || EMPTY_CAREER_STATS
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-black shadow-md border shrink-0 ${
              player.is_wonderkid 
                ? 'bg-gradient-to-br from-amber-400 to-amber-600 border-amber-300 text-black' 
                : 'bg-gradient-to-br from-emerald-600 to-teal-700 border-emerald-400 text-white'
            }`}>
              {player.is_wonderkid ? '🏏' : '🧢'}
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
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Market Value</span>
              <div className="text-xl font-black font-mono text-amber-700">£{(player.market_value ?? 0).toLocaleString()}</div>
              <span className="text-[10px] text-amber-600/80">Estimated</span>
            </div>
          </div>
        </div>

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

      {/* Official Battrick Career Statistics & Records (FC, OD, T20) */}
      <div className="sovereign-card p-6 rounded-2xl border-slate-200 shadow-md space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Official Battrick Career Statistics & Match Records</span>
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono font-bold">
            All 3 Formats (FC &bull; OD &bull; BT20)
          </span>
        </div>

        {/* Batting Career Table */}
        <div>
          <h4 className="text-xs font-black uppercase text-emerald-700 mb-2.5 flex items-center gap-1.5">
            <span>🏏</span>
            <span>Batting & Fielding Records</span>
          </h4>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[10px] border-b border-slate-200">
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
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr className="hover:bg-emerald-50/50">
                  <td className="py-2.5 px-3 font-sans font-bold text-slate-900">First Class (FC)</td>
                  <td className="py-2.5 px-2 text-center text-slate-700">{stats.fc.matches}</td>
                  <td className="py-2.5 px-2 text-center text-slate-700">{stats.fc.innings}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-700">{stats.fc.runs}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-800">{stats.fc.highestScore}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-700">{stats.fc.average.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-700">{stats.fc.strikeRate.toFixed(1)}</td>
                  <td className="py-2.5 px-2 text-center text-amber-700 font-bold">{stats.fc.centuries}</td>
                  <td className="py-2.5 px-2 text-center text-slate-700">{stats.fc.fifties}</td>
                  <td className="py-2.5 px-2 text-center text-slate-700">{stats.fc.fours}</td>
                  <td className="py-2.5 px-2 text-center text-slate-700">{stats.fc.sixes}</td>
                  <td className="py-2.5 px-2 text-center text-slate-700">{stats.fc.catches}</td>
                  <td className="py-2.5 px-2 text-center text-slate-700">{stats.fc.stumpings}</td>
                </tr>
                <tr className="hover:bg-emerald-50/50">
                  <td className="py-2.5 px-3 font-sans font-bold text-slate-900">One Day (OD)</td>
                  <td className="py-2.5 px-2 text-center text-slate-700">{stats.od.matches}</td>
                  <td className="py-2.5 px-2 text-center text-slate-700">{stats.od.innings}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-700">{stats.od.runs}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-800">{stats.od.highestScore}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-700">{stats.od.average.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-700">{stats.od.strikeRate.toFixed(1)}</td>
                  <td className="py-2.5 px-2 text-center text-amber-700 font-bold">{stats.od.centuries}</td>
                  <td className="py-2.5 px-2 text-center text-slate-700">{stats.od.fifties}</td>
                  <td className="py-2.5 px-2 text-center text-slate-700">{stats.od.fours}</td>
                  <td className="py-2.5 px-2 text-center text-slate-700">{stats.od.sixes}</td>
                  <td className="py-2.5 px-2 text-center text-slate-700">{stats.od.catches}</td>
                  <td className="py-2.5 px-2 text-center text-slate-700">{stats.od.stumpings}</td>
                </tr>
                <tr className="hover:bg-emerald-50/50">
                  <td className="py-2.5 px-3 font-sans font-bold text-slate-900">Twenty20 (BT20)</td>
                  <td className="py-2.5 px-2 text-center text-slate-700">{stats.t20.matches}</td>
                  <td className="py-2.5 px-2 text-center text-slate-700">{stats.t20.innings}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-700">{stats.t20.runs}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-800">{stats.t20.highestScore}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-700">{stats.t20.average.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-700">{stats.t20.strikeRate.toFixed(1)}</td>
                  <td className="py-2.5 px-2 text-center text-amber-700 font-bold">{stats.t20.centuries}</td>
                  <td className="py-2.5 px-2 text-center text-slate-700">{stats.t20.fifties}</td>
                  <td className="py-2.5 px-2 text-center text-slate-700">{stats.t20.fours}</td>
                  <td className="py-2.5 px-2 text-center text-slate-700">{stats.t20.sixes}</td>
                  <td className="py-2.5 px-2 text-center text-slate-700">{stats.t20.catches}</td>
                  <td className="py-2.5 px-2 text-center text-slate-700">{stats.t20.stumpings}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bowling Career Table */}
        <div className="pt-2">
          <h4 className="text-xs font-black uppercase text-teal-700 mb-2.5 flex items-center gap-1.5">
            <span>⚡</span>
            <span>Bowling Career Records</span>
          </h4>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <th className="py-2.5 px-3">Format</th>
                  <th className="py-2.5 px-3 text-right">Overs Bowled</th>
                  <th className="py-2.5 px-3 text-right">Wickets</th>
                  <th className="py-2.5 px-3 text-center">Best Bowling (BBI)</th>
                  <th className="py-2.5 px-3 text-right">Bowling Avg</th>
                  <th className="py-2.5 px-3 text-right">Economy (RPO)</th>
                  <th className="py-2.5 px-2 text-center">5w Hauls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr className="hover:bg-emerald-50/50">
                  <td className="py-2.5 px-3 font-sans font-bold text-slate-900">First Class (FC)</td>
                  <td className="py-2.5 px-3 text-right text-slate-700">{stats.fc.oversBowled.toFixed(1)}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-teal-700">{stats.fc.wickets}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-800">{stats.fc.bestBowling}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-700">{stats.fc.bowlingAverage.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-700">{stats.fc.economy.toFixed(2)}</td>
                  <td className="py-2.5 px-2 text-center text-amber-700 font-bold">{stats.fc.fiveWickets}</td>
                </tr>
                <tr className="hover:bg-emerald-50/50">
                  <td className="py-2.5 px-3 font-sans font-bold text-slate-900">One Day (OD)</td>
                  <td className="py-2.5 px-3 text-right text-slate-700">{stats.od.oversBowled.toFixed(1)}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-teal-700">{stats.od.wickets}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-800">{stats.od.bestBowling}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-700">{stats.od.bowlingAverage.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-700">{stats.od.economy.toFixed(2)}</td>
                  <td className="py-2.5 px-2 text-center text-amber-700 font-bold">{stats.od.fiveWickets}</td>
                </tr>
                <tr className="hover:bg-emerald-50/50">
                  <td className="py-2.5 px-3 font-sans font-bold text-slate-900">Twenty20 (BT20)</td>
                  <td className="py-2.5 px-3 text-right text-slate-700">{stats.t20.oversBowled.toFixed(1)}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-teal-700">{stats.t20.wickets}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-800">{stats.t20.bestBowling}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-700">{stats.t20.bowlingAverage.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-700">{stats.t20.economy.toFixed(2)}</td>
                  <td className="py-2.5 px-2 text-center text-amber-700 font-bold">{stats.t20.fiveWickets}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
