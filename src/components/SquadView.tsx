import React, { useState, useMemo } from 'react';
import { Player } from '../types/database';
import { Search, Sparkles, Users, UserSquare2, LayoutGrid, Table, ArrowUpDown, Upload } from 'lucide-react';

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
  let color = 'bg-[#04120e] text-slate-400 border-slate-700/60';
  if (score >= 11) color = 'bg-emerald-950 text-emerald-300 border-emerald-500 font-extrabold shadow-sm';
  else if (score >= 9) color = 'bg-teal-950 text-teal-300 border-teal-500 font-bold';
  else if (score >= 7) color = 'bg-cyan-950 text-cyan-300 border-cyan-500/70 font-semibold';
  else if (score >= 5) color = 'bg-amber-950/80 text-amber-300 border-amber-600/60';

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
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Squad Master Roster & Complete 11-Skills Register</span>
          </div>
          <h2 className="text-3xl font-black text-white mt-1 flex items-center gap-3">
            <span>First XI & Reserve Squad Intel</span>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/60 font-mono font-bold">
              {filteredSquad.length} Players Available
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Spacious, high-visibility 11-attribute register with BTI talent indices, wages, subskills, and weekly valuations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-[#04120e] p-1 rounded-xl border border-emerald-800/60 text-xs">
            <button
              onClick={() => setViewMode('matrix')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'matrix' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Full 11-Skills Table Matrix"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'cards' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
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
              className="pl-9 pr-3 py-1.5 rounded-xl bg-[#04120e] border border-emerald-800/60 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 w-48 sm:w-60"
            />
          </div>

          {/* Role Filters */}
          <div className="flex items-center gap-1 bg-[#04120e] p-1 rounded-xl border border-emerald-800/60 text-xs">
            {['ALL', 'WONDERKID', 'BATTER', 'BOWLER', 'KEEPER'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  roleFilter === role
                    ? 'bg-emerald-600 text-white shadow font-black'
                    : 'text-slate-300 hover:text-white'
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
        <div className="w-full overflow-x-auto rounded-2xl border-2 border-emerald-600/40 bg-[#071c17] shadow-2xl">
          <table className="w-full min-w-[1550px] text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#030d0a] text-slate-300 font-bold border-b-2 border-emerald-700/60 uppercase tracking-wider text-[11px] sticky top-0 z-10 shadow-sm">
                <th className="py-3.5 px-3 w-28">Player ID</th>
                <th 
                  onClick={() => toggleSort('name')}
                  className="py-3.5 px-4 min-w-[240px] cursor-pointer hover:text-emerald-300 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Player Name & Role</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th 
                  onClick={() => toggleSort('age')}
                  className="py-3.5 px-2 w-14 text-center cursor-pointer hover:text-emerald-300"
                >
                  Age
                </th>
                <th 
                  onClick={() => toggleSort('bti')}
                  className="py-3.5 px-3 w-24 text-right cursor-pointer hover:text-emerald-300"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>BTI</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-3.5 px-2 w-16 text-center">Subskill</th>
                <th className="py-3.5 px-2 text-center w-24">Batting</th>
                <th className="py-3.5 px-2 text-center w-24">Bowling</th>
                <th className="py-3.5 px-2 text-center w-24">Keeping</th>
                <th className="py-3.5 px-2 text-center w-24">Fielding</th>
                <th className="py-3.5 px-2 text-center w-24">Consistency</th>
                <th className="py-3.5 px-2 text-center w-24">Concentration</th>
                <th className="py-3.5 px-2 text-center w-24">Stamina</th>
                <th className="py-3.5 px-2 text-center w-24">Form</th>
                <th className="py-3.5 px-2 text-center w-24">Fatigue</th>
                <th className="py-3.5 px-2 text-center w-24">Ldr / Exp</th>
                <th 
                  onClick={() => toggleSort('wage')}
                  className="py-3.5 px-3 w-28 text-right cursor-pointer hover:text-emerald-300"
                >
                  Wage (£)
                </th>
                <th className="py-3.5 px-3 w-28 text-center">Active Net</th>
                <th className="py-3.5 px-3 w-24 text-center">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/70 font-mono">
              {filteredSquad.map((player) => (
                <tr key={player.id} className="hover:bg-[#103a2f]/80 transition-colors">
                  {/* Clean Numeric ID */}
                  <td className="py-4 px-3 font-mono text-xs text-emerald-400 font-extrabold whitespace-nowrap">
                    {String(player.id).replace(/^BT-/, '')}
                  </td>

                  {/* Name, Wonderkid Tag, Tactical Role */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 font-black text-white text-[13px] font-sans">
                      <span>{player.name}</span>
                      {player.is_wonderkid && (
                        <span className="flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-600/70 font-bold font-mono">
                          <Sparkles className="w-2.5 h-2.5 text-amber-400" /> Wonderkid
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-300 mt-1 flex items-center gap-2 font-sans">
                      <span className="text-emerald-300 font-semibold">{player.tactical_role}</span>
                      <span className="text-slate-500">&bull;</span>
                      <span className="font-mono text-slate-400">{player.batting_hand}</span>
                      <span className="text-slate-500">&bull;</span>
                      <span className="text-slate-400">{player.bowling_type}</span>
                    </div>
                  </td>

                  {/* Age */}
                  <td className="py-4 px-2 text-center font-bold text-white text-sm">
                    {player.age}
                  </td>

                  {/* BTI */}
                  <td className="py-4 px-3 text-right font-mono font-black text-emerald-300 text-sm">
                    {(player.bti ?? 0).toLocaleString()}
                  </td>

                  {/* Subskill */}
                  <td className="py-4 px-2 text-center font-mono text-xs text-amber-300 font-bold">
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
                  <td className="py-4 px-2 text-center font-mono text-[11px] text-slate-300">
                    <span className="capitalize">{player.leadership?.slice(0, 4)}</span>
                    <span className="text-slate-500"> / </span>
                    <span className="capitalize">{player.experience?.slice(0, 4) || 'abys'}</span>
                  </td>

                  {/* Wage */}
                  <td className="py-4 px-3 text-right font-mono font-extrabold text-slate-200">
                    £{(player.wage ?? 0).toLocaleString()}
                  </td>

                  {/* Active Net */}
                  <td className="py-4 px-3 text-center whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      player.active_net && player.active_net !== 'Unassigned' && player.active_net !== 'None'
                        ? 'bg-amber-950 text-amber-300 border border-amber-600/70 font-mono' 
                        : 'text-slate-400 bg-[#04120e] border border-emerald-900/60'
                    }`}>
                      {player.active_net || 'Unassigned'}
                    </span>
                  </td>

                  {/* Dossier Link */}
                  <td className="py-4 px-3 text-center">
                    <button
                      onClick={() => onViewDossier?.(player.id)}
                      className="flex items-center justify-center gap-1.5 mx-auto px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs border border-emerald-400/40 transition-all cursor-pointer shadow-md"
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
                  : 'sovereign-card border-emerald-600/30 shadow-lg'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    #{String(player.id).replace(/^BT-/, '')}
                  </span>
                  <span className="text-xs font-bold text-slate-300">Age {player.age}</span>
                </div>
                <h4 className="text-lg font-black text-white mt-1">{player.name}</h4>
                <div className="text-xs text-slate-300 mt-0.5">{player.tactical_role}</div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-emerald-800/40 text-center text-xs font-mono">
                  <div className="p-2 rounded-lg bg-[#04120e]">
                    <span className="text-[10px] text-slate-400 block font-sans">BTI</span>
                    <strong className="text-emerald-300">{player.bti?.toLocaleString()}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-[#04120e]">
                    <span className="text-[10px] text-slate-400 block font-sans">Wage</span>
                    <strong className="text-slate-200">£{player.wage?.toLocaleString()}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-[#04120e]">
                    <span className="text-[10px] text-slate-400 block font-sans">Subskill</span>
                    <strong className="text-amber-300">{player.subskill}</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onViewDossier?.(player.id)}
                className="mt-4 w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow"
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
