import React, { useState } from 'react';
import { Player } from '../types/database';
import { Search, Sparkles } from 'lucide-react';

interface SquadViewProps {
  squad: Player[];
}

export const SquadView: React.FC<SquadViewProps> = ({ squad }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filteredSquad = squad.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          player.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          player.tactical_role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || 
                        (roleFilter === 'WONDERKID' && player.is_wonderkid) ||
                        (roleFilter === 'BATTER' && player.tactical_role.includes('Batter')) ||
                        (roleFilter === 'BOWLER' && player.tactical_role.includes('Bowler')) ||
                        (roleFilter === 'KEEPER' && player.tactical_role.includes('Wicketkeeper'));
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Squad Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#06201b]/50 p-4 rounded-xl border border-emerald-900/40">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>02_Squad_Master</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-mono">
              {filteredSquad.length} Players Listed
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete active squad roster with BTI, subskill estimates, weekly wages, and live valuations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search player, role, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-lg bg-[#031512] border border-emerald-900/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#031512] p-1 rounded-lg border border-emerald-900/60 text-xs">
            {['ALL', 'WONDERKID', 'BATTER', 'BOWLER', 'KEEPER'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                  roleFilter === role
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modern High-Density Data Grid */}
      <div className="overflow-x-auto rounded-xl border border-emerald-900/40 bg-[#031512]/90 shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#062922] text-slate-300 font-semibold border-b border-emerald-900/60 uppercase tracking-wider text-[10px]">
              <th className="py-3 px-3">Player ID</th>
              <th className="py-3 px-3">Player Name & Role</th>
              <th className="py-3 px-2 text-center">Age</th>
              <th className="py-3 px-3 text-right">Wage (£)</th>
              <th className="py-3 px-2 text-center">Style</th>
              <th className="py-3 px-3">Key Skills</th>
              <th className="py-3 px-2 text-center">Form</th>
              <th className="py-3 px-2 text-center">Fatigue</th>
              <th className="py-3 px-3 text-center">Active Net</th>
              <th className="py-3 px-3 text-right">Market Val</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-950/60">
            {filteredSquad.map((player) => (
              <tr key={player.id} className="hover:bg-emerald-950/30 transition-colors">
                <td className="py-3 px-3 font-mono text-[11px] text-emerald-400 font-semibold whitespace-nowrap">
                  {player.id}
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    {player.name}
                    {player.is_wonderkid && (
                      <span className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800/60">
                        <Sparkles className="w-2.5 h-2.5" /> Wonderkid
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400">{player.tactical_role}</div>
                </td>
                <td className="py-3 px-2 text-center font-bold text-slate-300">
                  {player.age}
                </td>
                <td className="py-3 px-3 text-right font-mono font-semibold text-slate-200">
                  £{player.wage.toLocaleString()}
                </td>
                <td className="py-3 px-2 text-center font-mono text-[10px] text-slate-300">
                  {player.batting_hand} | {player.bowling_type}
                </td>
                <td className="py-3 px-3">
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-900/60">
                      Bat: {player.batting}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-900/60">
                      Bowl: {player.bowling}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-800">
                      Fld: {player.fielding}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-2 text-center capitalize font-semibold text-emerald-300">
                  {player.form}
                </td>
                <td className="py-3 px-2 text-center capitalize text-slate-400">
                  {player.fatigue}
                </td>
                <td className="py-3 px-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    player.active_net !== 'None' 
                      ? 'bg-amber-950 text-amber-300 border border-amber-800/50' 
                      : 'text-slate-500'
                  }`}>
                    {player.active_net}
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-white whitespace-nowrap">
                  £{player.market_value.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
