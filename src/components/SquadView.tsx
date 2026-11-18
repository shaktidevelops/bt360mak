import React, { useState } from 'react';
import { Player } from '../types/database';
import { Search, Sparkles, Users } from 'lucide-react';

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
      {/* Squad Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#10272a] p-5 rounded-2xl border border-[#204b4c] shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Squad Master Roster</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1 flex items-center gap-2.5">
            <span>Senior & Academy Player Intel</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#163638] text-emerald-300 border border-[#275d5e] font-mono font-bold">
              {filteredSquad.length} Players
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
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
              className="pl-9 pr-3 py-1.5 rounded-xl bg-[#09181a] border border-[#204b4c] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 w-48 sm:w-60"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#09181a] p-1 rounded-xl border border-[#204b4c] text-xs">
            {['ALL', 'WONDERKID', 'BATTER', 'BOWLER', 'KEEPER'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  roleFilter === role
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* High-Contrast Data Grid */}
      <div className="overflow-x-auto rounded-2xl border border-[#204b4c] bg-[#10272a] shadow-2xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#09181a] text-slate-300 font-bold border-b border-[#204b4c] uppercase tracking-wider text-[10px]">
              <th className="py-3 px-3">Player ID</th>
              <th className="py-3 px-4">Player Name & Role</th>
              <th className="py-3 px-2 text-center">Age</th>
              <th className="py-3 px-3 text-right">Wage (£)</th>
              <th className="py-3 px-3 text-center">Style</th>
              <th className="py-3 px-4">Key Skills</th>
              <th className="py-3 px-2 text-center">Form</th>
              <th className="py-3 px-2 text-center">Fatigue</th>
              <th className="py-3 px-3 text-center">Active Net</th>
              <th className="py-3 px-4 text-right">Market Valuation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#18393b]">
            {filteredSquad.map((player) => (
              <tr key={player.id} className="hover:bg-[#163638]/70 transition-colors">
                <td className="py-3.5 px-3 font-mono text-[11px] text-emerald-400 font-bold whitespace-nowrap">
                  {player.id}
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 font-bold text-white text-[13px]">
                    {player.name}
                    {player.is_wonderkid && (
                      <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-600/70 font-bold font-mono">
                        <Sparkles className="w-2.5 h-2.5" /> Wonderkid
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">{player.tactical_role}</div>
                </td>
                <td className="py-3.5 px-2 text-center font-bold text-white">
                  {player.age}
                </td>
                <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-200">
                  £{player.wage.toLocaleString()}
                </td>
                <td className="py-3.5 px-3 text-center font-mono text-[11px] text-slate-300">
                  {player.batting_hand} | {player.bowling_type}
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-[#163638] text-emerald-300 border border-[#275d5e] font-semibold">
                      Bat: {player.batting}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#163638] text-teal-300 border border-[#275d5e] font-semibold">
                      Bowl: {player.bowling}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#163638] text-slate-200 border border-[#275d5e] font-semibold">
                      Fld: {player.fielding}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-2 text-center capitalize font-bold text-emerald-300">
                  {player.form}
                </td>
                <td className="py-3.5 px-2 text-center capitalize text-slate-300">
                  {player.fatigue}
                </td>
                <td className="py-3.5 px-3 text-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    player.active_net !== 'None' 
                      ? 'bg-amber-950 text-amber-300 border border-amber-600/60' 
                      : 'text-slate-500'
                  }`}>
                    {player.active_net}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-extrabold text-white whitespace-nowrap">
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
