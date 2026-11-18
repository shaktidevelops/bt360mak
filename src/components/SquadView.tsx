import React, { useState, useMemo } from 'react';
import { Player } from '../types/database';
import { Search, Sparkles, Users, UserSquare2, LayoutGrid, Table, ArrowUpDown } from 'lucide-react';

interface SquadViewProps {
  squad: Player[];
  onViewDossier?: (playerId: string) => void;
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
  let color = 'bg-slate-900/80 text-slate-400 border-slate-700/60';
  if (score >= 11) color = 'bg-emerald-950 text-emerald-300 border-emerald-500 font-extrabold shadow-sm';
  else if (score >= 9) color = 'bg-teal-950 text-teal-300 border-teal-500 font-bold';
  else if (score >= 7) color = 'bg-cyan-950 text-cyan-300 border-cyan-500/70 font-semibold';
  else if (score >= 5) color = 'bg-amber-950/80 text-amber-300 border-amber-600/60';

  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono capitalize border ${color} whitespace-nowrap`}>
      {skillName || '-'}
    </span>
  );
}

export const SquadView: React.FC<SquadViewProps> = ({ squad, onViewDossier }) => {
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
    <div className="space-y-6">
      {/* Squad Master Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0e2c24] p-5 rounded-2xl border border-emerald-600/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Squad Master Roster & Complete Skills Register</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1 flex items-center gap-2.5">
            <span>First XI & Reserve Squad Intel</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#061713] text-emerald-300 border border-emerald-700/50 font-mono font-bold">
              {filteredSquad.length} Players Available
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Displaying all 11 Battrick technical attributes, talent indices (BTI), subskills, wages, and weekly valuations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-[#061713] p-1 rounded-xl border border-emerald-800/40 text-xs">
            <button
              onClick={() => setViewMode('matrix')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'matrix' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Full 11-Skills Table Matrix"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'cards' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
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
              className="pl-9 pr-3 py-1.5 rounded-xl bg-[#061713] border border-emerald-800/40 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 w-44 sm:w-56"
            />
          </div>

          {/* Role Filters */}
          <div className="flex items-center gap-1 bg-[#061713] p-1 rounded-xl border border-emerald-800/40 text-xs">
            {['ALL', 'WONDERKID', 'BATTER', 'BOWLER', 'KEEPER'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  roleFilter === role
                    ? 'bg-emerald-600 text-white shadow font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MATRIX VIEW: FULL 11-SKILLS DATA TABLE */}
      {viewMode === 'matrix' ? (
        <div className="overflow-x-auto rounded-2xl border border-emerald-600/30 bg-[#0e2c24] shadow-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#071d18] text-slate-300 font-bold border-b border-emerald-800/40 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Player ID</th>
                <th 
                  onClick={() => toggleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:text-emerald-300 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Name & Role</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  onClick={() => toggleSort('age')}
                  className="py-3 px-2 text-center cursor-pointer hover:text-emerald-300"
                >
                  Age
                </th>
                <th 
                  onClick={() => toggleSort('bti')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-emerald-300"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>BTI</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-2 text-center">Sub</th>
                <th className="py-3 px-2 text-center">Batting</th>
                <th className="py-3 px-2 text-center">Bowling</th>
                <th className="py-3 px-2 text-center">Keeping</th>
                <th className="py-3 px-2 text-center">Fielding</th>
                <th className="py-3 px-2 text-center">Consistency</th>
                <th className="py-3 px-2 text-center">Concentration</th>
                <th className="py-3 px-2 text-center">Stamina</th>
                <th className="py-3 px-2 text-center">Form</th>
                <th className="py-3 px-2 text-center">Fatigue</th>
                <th className="py-3 px-2 text-center">Ldr / Exp</th>
                <th 
                  onClick={() => toggleSort('wage')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-emerald-300"
                >
                  Wage (£)
                </th>
                <th className="py-3 px-3 text-center">Net</th>
                <th className="py-3 px-3 text-center">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/60">
              {filteredSquad.map((player) => (
                <tr key={player.id} className="hover:bg-[#12362b]/80 transition-colors">
                  {/* Clean Numeric ID */}
                  <td className="py-3 px-3 font-mono text-[11px] text-emerald-400 font-bold whitespace-nowrap">
                    {String(player.id).replace(/^BT-/, '')}
                  </td>

                  {/* Name, Wonderkid Tag, Tactical Role */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-bold text-white text-[13px]">
                      <span>{player.name}</span>
                      {player.is_wonderkid && (
                        <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-600/70 font-bold font-mono">
                          <Sparkles className="w-2.5 h-2.5" /> 17yo
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-300 mt-0.5 flex items-center gap-1.5">
                      <span>{player.tactical_role}</span>
                      <span>&bull;</span>
                      <span className="font-mono text-slate-400">{player.batting_hand}</span>
                    </div>
                  </td>

                  {/* Age */}
                  <td className="py-3 px-2 text-center font-bold text-white">
                    {player.age}
                  </td>

                  {/* BTI */}
                  <td className="py-3 px-3 text-right font-mono font-extrabold text-emerald-300">
                    {(player.bti ?? 0).toLocaleString()}
                  </td>

                  {/* Subskill */}
                  <td className="py-3 px-2 text-center font-mono text-[11px] text-amber-300 font-bold">
                    {player.subskill ?? 6.20}
                  </td>

                  {/* Complete 11 Skills Displayed Individually */}
                  <td className="py-3 px-2 text-center">{getSkillBadge(player.batting)}</td>
                  <td className="py-3 px-2 text-center">{getSkillBadge(player.bowling)}</td>
                  <td className="py-3 px-2 text-center">{getSkillBadge(player.keeping)}</td>
                  <td className="py-3 px-2 text-center">{getSkillBadge(player.fielding)}</td>
                  <td className="py-3 px-2 text-center">{getSkillBadge(player.consistency)}</td>
                  <td className="py-3 px-2 text-center">{getSkillBadge(player.concentration)}</td>
                  <td className="py-3 px-2 text-center">{getSkillBadge(player.stamina)}</td>
                  <td className="py-3 px-2 text-center">{getSkillBadge(player.form)}</td>
                  <td className="py-3 px-2 text-center">{getSkillBadge(player.fatigue)}</td>

                  {/* Leadership & Experience */}
                  <td className="py-3 px-2 text-center font-mono text-[10px] text-slate-300">
                    <span className="capitalize">{player.leadership?.slice(0, 4)}</span>
                    <span className="text-slate-500"> / </span>
                    <span className="capitalize">{player.experience?.slice(0, 4) || 'abys'}</span>
                  </td>

                  {/* Wage */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-200">
                    £{(player.wage ?? 0).toLocaleString()}
                  </td>

                  {/* Active Net */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      player.active_net && player.active_net !== 'Unassigned' && player.active_net !== 'None'
                        ? 'bg-amber-950 text-amber-300 border border-amber-600/60' 
                        : 'text-slate-400 bg-[#061713]'
                    }`}>
                      {player.active_net || 'Unassigned'}
                    </span>
                  </td>

                  {/* Dossier Link */}
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => onViewDossier?.(player.id)}
                      className="flex items-center gap-1 mx-auto px-2.5 py-1 rounded-lg bg-emerald-700/60 hover:bg-emerald-600 text-white font-bold text-[11px] border border-emerald-500/50 transition-all cursor-pointer shadow-sm"
                      title="Inspect full Battrick career statistics and records"
                    >
                      <UserSquare2 className="w-3.5 h-3.5" />
                      <span>Dossier</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* CARDS VIEW: TACTICAL DETAILED CARDS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSquad.map((player) => (
            <div 
              key={player.id} 
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                player.is_wonderkid 
                  ? 'bg-gradient-to-br from-[#12382e] via-[#0e2c24] to-[#071d18] border-amber-500/60 shadow-xl' 
                  : 'bg-[#0e2c24] border-emerald-600/30 shadow-lg'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-[#061713] text-emerald-400 border border-emerald-800/60">
                    ID: {String(player.id).replace(/^BT-/, '')}
                  </span>
                  {player.is_wonderkid && (
                    <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-950 text-amber-300 border border-amber-600/70">
                      <Sparkles className="w-2.5 h-2.5" /> Wonderkid
                    </span>
                  )}
                  <span className="text-xs font-mono font-extrabold text-white">
                    Age {player.age}
                  </span>
                </div>

                <h3 className="text-lg font-black text-white">{player.name}</h3>
                <div className="text-xs text-slate-300 mt-0.5">
                  {player.tactical_role} &bull; {player.batting_hand}
                </div>

                {/* Key Numbers Bar */}
                <div className="grid grid-cols-3 gap-2 mt-3 p-2.5 rounded-xl bg-[#061713] border border-emerald-800/40 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">BTI</span>
                    <div className="font-mono font-black text-emerald-300 mt-0.5">{(player.bti ?? 0).toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Subskill</span>
                    <div className="font-mono font-black text-amber-300 mt-0.5">{player.subskill ?? 6.20}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Wage</span>
                    <div className="font-mono font-black text-slate-200 mt-0.5">£{(player.wage ?? 0).toLocaleString()}</div>
                  </div>
                </div>

                {/* Full 11-Skills Grid Inside Card */}
                <div className="grid grid-cols-2 gap-1.5 mt-3 pt-3 border-t border-emerald-800/30 text-[11px]">
                  <div className="flex justify-between items-center bg-[#071d18] px-2 py-1 rounded">
                    <span className="text-slate-400">Batting:</span>
                    {getSkillBadge(player.batting)}
                  </div>
                  <div className="flex justify-between items-center bg-[#071d18] px-2 py-1 rounded">
                    <span className="text-slate-400">Bowling:</span>
                    {getSkillBadge(player.bowling)}
                  </div>
                  <div className="flex justify-between items-center bg-[#071d18] px-2 py-1 rounded">
                    <span className="text-slate-400">Keeping:</span>
                    {getSkillBadge(player.keeping)}
                  </div>
                  <div className="flex justify-between items-center bg-[#071d18] px-2 py-1 rounded">
                    <span className="text-slate-400">Fielding:</span>
                    {getSkillBadge(player.fielding)}
                  </div>
                  <div className="flex justify-between items-center bg-[#071d18] px-2 py-1 rounded">
                    <span className="text-slate-400">Consistency:</span>
                    {getSkillBadge(player.consistency)}
                  </div>
                  <div className="flex justify-between items-center bg-[#071d18] px-2 py-1 rounded">
                    <span className="text-slate-400">Concentration:</span>
                    {getSkillBadge(player.concentration)}
                  </div>
                  <div className="flex justify-between items-center bg-[#071d18] px-2 py-1 rounded">
                    <span className="text-slate-400">Stamina:</span>
                    {getSkillBadge(player.stamina)}
                  </div>
                  <div className="flex justify-between items-center bg-[#071d18] px-2 py-1 rounded">
                    <span className="text-slate-400">Form:</span>
                    {getSkillBadge(player.form)}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-800/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400">Market Valuation:</span>
                  <div className="font-mono font-bold text-white text-xs">£{(player.market_value ?? 0).toLocaleString()}</div>
                </div>
                <button
                  onClick={() => onViewDossier?.(player.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all cursor-pointer shadow"
                >
                  <UserSquare2 className="w-3.5 h-3.5" />
                  <span>View Dossier</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
