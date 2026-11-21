import React, { useState, useMemo } from 'react';
import { Player } from '../types/database';
import { Search, Sparkles, Users, UserSquare2, LayoutGrid, Table, ArrowUpDown, Upload } from 'lucide-react';
import { formatBowlingType, getBowlingTypeFullName, formatBattingHand, getBattingHandFullName } from '../lib/cricketFormatters';

interface SquadViewProps {
  squad: Player[];
  onViewDossier?: (playerId: string) => void;
  onNavigateToImport?: () => void;
}

const skillScoreMap: Record<string, number> = {
  nonexistent: 1, worthless: 2, abysmal: 3, woeful: 4, feeble: 5,
  mediocre: 6, competent: 7, respectable: 8, proficient: 9, strong: 10,
  superb: 11, quality: 12, remarkable: 13, wonderful: 14, exceptional: 15, sensational: 16
};

function getScore(skill?: string): number {
  if (!skill) return 0;
  return skillScoreMap[skill.toLowerCase()] || 0;
}

function getSkillBadge(skillName?: string) {
  const score = getScore(skillName);
  let color = 'bg-slate-100 text-slate-600 border-slate-200';
  if (score >= 13) color = 'bg-purple-100 text-purple-900 border-purple-400 font-bold shadow-xs';
  else if (score >= 11) color = 'bg-emerald-100 text-emerald-900 border-emerald-500 font-bold shadow-xs';
  else if (score >= 9) color = 'bg-teal-100 text-teal-900 border-teal-400 font-semibold';
  else if (score >= 7) color = 'bg-cyan-100 text-cyan-900 border-cyan-400 font-semibold';
  else if (score >= 5) color = 'bg-amber-100 text-amber-900 border-amber-400 font-medium';
  else if (score >= 3) color = 'bg-orange-100 text-orange-900 border-orange-400 font-medium';

  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono capitalize border ${color} whitespace-nowrap min-w-[72px] text-center`}>
      {skillName || '-'}
    </span>
  );
}

export const SquadView: React.FC<SquadViewProps> = ({ squad, onViewDossier, onNavigateToImport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'matrix' | 'cards'>('matrix');
  const [sortField, setSortField] = useState<'bti' | 'wage' | 'age' | 'market_value' | 'name'>('bti');
  const [sortAsc, setSortAsc] = useState(false);

  const filteredSquad = useMemo(() => {
    return squad
      .filter(player => {
        const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              player.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (player.tactical_role && player.tactical_role.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesRole = roleFilter === 'ALL' || 
                            (roleFilter === 'WONDERKID' && player.is_wonderkid) ||
                            (roleFilter === 'BATTER' && (player.tactical_role?.includes('Batter') || getScore(player.batting) >= 7)) ||
                            (roleFilter === 'BOWLER' && (player.tactical_role?.includes('Bowler') || player.tactical_role?.includes('Spinner') || getScore(player.bowling) >= 7)) ||
                            (roleFilter === 'KEEPER' && (player.tactical_role?.includes('Keeper') || getScore(player.keeping) >= 6));
        return matchesSearch && matchesRole;
      })
      .sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];
        if (typeof valA === 'string') {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortAsc ? (valA - valB) : (valB - valA);
      });
  }, [squad, searchTerm, roleFilter, sortField, sortAsc]);

  const toggleSort = (field: 'bti' | 'wage' | 'age' | 'market_value' | 'name') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Squad Master Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sovereign-card p-6 rounded-2xl border-emerald-500/40 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Squad Master Roster & Complete 11-Skills Register</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mt-1 flex items-center gap-3">
            <span>First XI & Reserve Squad Intel</span>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono font-bold">
              {filteredSquad.length} Players Available
            </span>
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Spacious, high-visibility 11-attribute register with BTI talent indices, wages, subskills, and weekly valuations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('matrix')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'matrix' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Full 11-Skills Table Matrix"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'cards' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tactical Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search player, role, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 w-48 sm:w-60 shadow-xs"
            />
          </div>

          {/* Role Filters */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {['ALL', 'WONDERKID', 'BATTER', 'BOWLER', 'KEEPER'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  roleFilter === role
                    ? 'bg-emerald-600 text-white shadow font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Quick Import Link */}
          {onNavigateToImport && (
            <button
              onClick={onNavigateToImport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-xs hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer shadow"
              title="Import new players from Battrick"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Players</span>
            </button>
          )}
        </div>
      </div>

      {/* MATRIX VIEW: ULTRA-WIDE, SPACIOUS 11-SKILLS DATA TABLE */}
      {viewMode === 'matrix' ? (
        <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-md">
          <table className="w-full min-w-[1780px] text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px] sticky top-0 z-10 shadow-xs">
                <th className="py-4 px-3.5 w-32">
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <span>#</span>
                    <span>Player ID</span>
                  </span>
                </th>
                <th 
                  onClick={() => toggleSort('name')}
                  className="py-4 px-4 min-w-[280px] cursor-pointer hover:text-emerald-700 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>🏏 Player Name & Role</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => toggleSort('age')}
                  className="py-4 px-2 w-16 text-center cursor-pointer hover:text-emerald-700"
                >
                  Age
                </th>
                <th 
                  onClick={() => toggleSort('bti')}
                  className="py-4 px-3.5 w-28 text-right cursor-pointer hover:text-emerald-700"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>BTI Index</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th className="py-4 px-2 w-20 text-center">Subskill</th>
                <th className="py-4 px-2 text-center w-28">Batting 🏏</th>
                <th className="py-4 px-2 text-center w-28">Bowling 🔴</th>
                <th className="py-4 px-2 text-center w-28">Keeping 🧤</th>
                <th className="py-4 px-2 text-center w-28">Fielding ⚡</th>
                <th className="py-4 px-2 text-center w-28">Consistency</th>
                <th className="py-4 px-2 text-center w-28">Concentration</th>
                <th className="py-4 px-2 text-center w-28">Stamina</th>
                <th className="py-4 px-2 text-center w-28">Form</th>
                <th className="py-4 px-2 text-center w-28">Fatigue</th>
                <th className="py-4 px-2 text-center w-24">Ldr / Exp</th>
                <th 
                  onClick={() => toggleSort('wage')}
                  className="py-4 px-3.5 w-32 text-right cursor-pointer hover:text-emerald-700"
                >
                  Wage (£)
                </th>
                <th className="py-4 px-3.5 w-32 text-center">Active Net</th>
                <th className="py-4 px-3.5 w-28 text-center">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredSquad.map((player) => {
                const isKeeper = player.tactical_role?.includes('Keeper') || getScore(player.keeping) >= 7;
                const isBowler = player.tactical_role?.includes('Bowler') || player.tactical_role?.includes('Spinner') || getScore(player.bowling) >= 7;
                const isBatter = player.tactical_role?.includes('Batter') || getScore(player.batting) >= 7;
                const roleIcon = isKeeper ? '🧤' : isBowler ? '🔴' : isBatter ? '🏏' : '⚡';

                return (
                  <tr key={player.id} className="odd:bg-white even:bg-slate-50/70 hover:bg-emerald-50/60 transition-colors">
                    {/* Clean Numeric ID */}
                    <td className="py-4 px-3.5 font-mono text-xs text-emerald-700 font-extrabold whitespace-nowrap">
                      #{String(player.id).replace(/^BT-/, '')}
                    </td>

                    {/* Name, Wonderkid Tag, Tactical Role */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 font-black text-slate-900 text-[13px] font-sans">
                        <span>{roleIcon}</span>
                        <span>{player.name}</span>
                        {player.is_wonderkid && (
                          <span className="flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-black font-mono shadow-xs">
                            <Sparkles className="w-2.5 h-2.5 text-amber-600" /> Wonderkid
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-2 font-sans">
                        <span className="text-emerald-700 font-bold">{player.tactical_role}</span>
                        <span className="text-slate-400">&bull;</span>
                        <span className="font-mono text-slate-600" title={getBattingHandFullName(player.batting_hand)}>{formatBattingHand(player.batting_hand)}</span>
                        <span className="text-slate-400">&bull;</span>
                        <span className="font-mono px-1.5 py-0.5 rounded text-[10px] bg-cyan-100 text-cyan-800 border border-cyan-300 font-bold" title={getBowlingTypeFullName(player.bowling_type)}>
                          {formatBowlingType(player.bowling_type)}
                        </span>
                      </div>
                    </td>

                    {/* Age */}
                    <td className="py-4 px-2 text-center font-bold text-slate-800 text-sm">
                      {player.age}
                    </td>

                    {/* BTI */}
                    <td className="py-4 px-3.5 text-right font-mono font-black text-emerald-700 text-sm">
                      {(player.bti ?? 0).toLocaleString()}
                    </td>

                    {/* Subskill */}
                    <td className="py-4 px-2 text-center font-mono text-xs text-amber-700 font-black">
                      {player.subskill ?? 6.20}
                    </td>

                    {/* Complete 11 Skills Displayed Individually */}
                    <td className="py-4 px-2 text-center">{getSkillBadge(player.batting)}</td>
                    <td className="py-4 px-2 text-center">{getSkillBadge(player.bowling)}</td>
                    <td className="py-4 px-2 text-center">{getSkillBadge(player.keeping)}</td>
                    <td className="py-4 px-2 text-center">{getSkillBadge(player.fielding)}</td>
                    <td className="py-4 px-2 text-center">{getSkillBadge(player.consistency)}</td>
                    <td className="py-4 px-2 text-center">{getSkillBadge(player.concentration)}</td>
                    <td className="py-4 px-2 text-center">{getSkillBadge(player.stamina)}</td>
                    <td className="py-4 px-2 text-center">{getSkillBadge(player.form)}</td>
                    <td className="py-4 px-2 text-center">{getSkillBadge(player.fatigue)}</td>

                    {/* Leadership & Experience */}
                    <td className="py-4 px-2 text-center font-mono text-[11px] text-slate-600">
                      <span className="capitalize">{player.leadership?.slice(0, 4)}</span>
                      <span className="text-slate-400"> / </span>
                      <span className="capitalize">{player.experience?.slice(0, 4) || 'abys'}</span>
                    </td>

                    {/* Wage */}
                    <td className="py-4 px-3.5 text-right font-mono font-extrabold text-slate-800">
                      £{(player.wage ?? 0).toLocaleString()}
                    </td>

                    {/* Active Net */}
                    <td className="py-4 px-3.5 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                        player.active_net && player.active_net !== 'Unassigned' && player.active_net !== 'None'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300 font-mono shadow-xs' 
                          : 'text-slate-500 bg-slate-100 border border-slate-200'
                      }`}>
                        {player.active_net || 'Unassigned'}
                      </span>
                    </td>

                    {/* Dossier Link */}
                    <td className="py-4 px-3.5 text-center">
                      <button
                        onClick={() => onViewDossier?.(player.id)}
                        className="flex items-center justify-center gap-1.5 mx-auto px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs transition-all cursor-pointer shadow-sm"
                        title="Inspect full Battrick career statistics and records"
                      >
                        <UserSquare2 className="w-3.5 h-3.5" />
                        <span>Dossier</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* CARDS VIEW: TACTICAL DETAILED CARDS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSquad.map((player) => (
            <div 
              key={player.id} 
              className={`p-5 rounded-2xl transition-all flex flex-col justify-between ${
                player.is_wonderkid 
                  ? 'sovereign-card-gold' 
                  : 'sovereign-card'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-700 font-bold">
                    #{String(player.id).replace(/^BT-/, '')}
                  </span>
                  <span className="text-xs font-bold text-slate-500">Age {player.age}</span>
                </div>
                <h4 className="text-lg font-black text-slate-900 mt-1">{player.name}</h4>
                <div className="text-xs text-slate-600 mt-1 flex items-center gap-1.5 flex-wrap">
                  <span className="text-emerald-700 font-bold">{player.tactical_role}</span>
                  <span className="text-slate-400">&bull;</span>
                  <span className="font-mono text-slate-600" title={getBattingHandFullName(player.batting_hand)}>{formatBattingHand(player.batting_hand)}</span>
                  <span className="text-slate-400">&bull;</span>
                  <span className="font-mono px-1.5 py-0.5 rounded text-[10px] bg-cyan-100 text-cyan-800 border border-cyan-300 font-bold" title={getBowlingTypeFullName(player.bowling_type)}>
                    {formatBowlingType(player.bowling_type)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200 text-center text-xs font-mono">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-sans">BTI</span>
                    <strong className="text-emerald-700">{player.bti?.toLocaleString()}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-sans">Wage</span>
                    <strong className="text-slate-800">£{player.wage?.toLocaleString()}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-sans">Subskill</span>
                    <strong className="text-amber-700">{player.subskill}</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onViewDossier?.(player.id)}
                className="mt-4 w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <UserSquare2 className="w-3.5 h-3.5" />
                <span>Open Player Dossier</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
