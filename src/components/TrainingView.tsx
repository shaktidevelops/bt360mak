import React, { useState } from 'react';
import { Player, TrainingLog, NetAllocation } from '../types/database';
import { Target, Zap, Clock, Sparkles, Award, Activity } from 'lucide-react';

interface TrainingViewProps {
  logs: TrainingLog[];
  nets?: NetAllocation[];
  squad: Player[];
  onUpdateNet?: (netNumber: number, playerId: string, trainingType: string) => void;
}

// Battrick strictly limits training nets to 4 core disciplines
export type BattrickTrainingType = 'Batting' | 'Bowling' | 'Keeping' | 'Fielding';

export const TrainingView: React.FC<TrainingViewProps> = ({ 
  logs, 
  squad 
}) => {
  // Global club stamina training slider (Battrick authentic: 0% to 30%, default 10%)
  const [staminaAllocation, setStaminaAllocation] = useState<number>(10);

  // All 10 nets default to unassigned, strictly choosing between Batting, Bowling, Keeping, Fielding
  const [activeNets, setActiveNets] = useState<NetAllocation[]>(() => {
    const defaultTypes: BattrickTrainingType[] = [
      'Bowling', 'Batting', 'Fielding', 'Keeping',
      'Bowling', 'Batting', 'Bowling', 'Bowling',
      'Batting', 'Fielding'
    ];

    return Array.from({ length: 10 }, (_, i) => ({
      club_id: '13108',
      net_number: i + 1,
      training_type: defaultTypes[i],
      player_id: '',
      player_name: 'Unassigned',
      coach_multiplier: 1.00,
      pops_estimated_weeks: null,
      notes: 'Net open and ready for tactical player assignment'
    }));
  });

  const handlePlayerChange = (netNum: number, newPlayerId: string) => {
    setActiveNets(prev => prev.map(n => {
      if (n.net_number !== netNum) return n;
      if (!newPlayerId) {
        return {
          ...n,
          player_id: '',
          player_name: 'Unassigned',
          pops_estimated_weeks: null,
          notes: 'Net open and ready for tactical player assignment'
        };
      }
      const player = squad.find(s => s.id === newPlayerId);
      const isWonderkid = player ? player.age <= 18 : false;
      const isYouth = player && player.age <= 22;
      // Wonderkids pop faster: 4-6 wks, young: 7-9 wks, senior: 12-16 wks
      const baseWeeks = isWonderkid ? 5 : isYouth ? 8 : 14;
      return {
        ...n,
        player_id: newPlayerId,
        player_name: player ? `${player.name} (${player.age}yo)` : 'Unassigned',
        pops_estimated_weeks: baseWeeks,
        notes: isWonderkid 
          ? `Fast-track wonderkid pop trajectory in ${n.training_type}` 
          : `Active progression in ${n.training_type} for ${player?.name}`
      };
    }));
  };

  const handleTypeChange = (netNum: number, newType: BattrickTrainingType) => {
    setActiveNets(prev => prev.map(n => {
      if (n.net_number !== netNum) return n;
      return {
        ...n,
        training_type: newType,
        notes: n.player_id 
          ? `Active progression in ${newType}` 
          : 'Net open and ready for tactical player assignment'
      };
    }));
  };

  const totalAssignedNets = activeNets.filter(n => n.player_id !== '').length;

  return (
    <div className="space-y-6">
      {/* Training Command Header */}
      <div className="bg-[#0e2c24] p-6 rounded-2xl border border-emerald-600/30 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Official Battrick Training Facility (10 Nets)</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Weekly Nets Allocation & Friday Skill Pop Engine
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              In accordance with authentic Battrick engine rules, individual nets train strictly <strong>Batting, Bowling, Keeping, or Fielding</strong>. Stamina is governed globally across the whole squad via the club stamina slider.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#061713] px-4 py-2 rounded-xl border border-emerald-800/40 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Nets Allocated</span>
              <div className="text-xl font-black font-mono text-emerald-400">
                {totalAssignedNets} / 10 Active
              </div>
            </div>

            <div className="bg-[#061713] px-4 py-2 rounded-xl border border-emerald-800/40 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Confirmed Pops</span>
              <div className="text-xl font-black font-mono text-amber-300">
                {logs.length} This Cycle
              </div>
            </div>
          </div>
        </div>

        {/* Battrick Core Rule Callout & Global Stamina Slider */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pt-4 border-t border-emerald-800/40">
          <div className="p-4 rounded-xl bg-[#061713] border border-emerald-700/40 flex items-start gap-3">
            <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-extrabold text-white">Battrick 4-Net Rules Engine</div>
              <p className="text-slate-300 leading-relaxed">
                Nets can ONLY be set to <strong className="text-emerald-300">Batting</strong>, <strong className="text-teal-300">Bowling</strong>, <strong className="text-cyan-300">Keeping</strong>, or <strong className="text-amber-300">Fielding</strong>. Secondary skills (Concentration & Consistency) develop automatically alongside primary net routines.
              </p>
            </div>
          </div>

          {/* Global Stamina Slider */}
          <div className="p-4 rounded-xl bg-[#061713] border border-teal-700/40 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold text-white">Global Club Stamina Training</span>
              </div>
              <span className="text-xs font-mono font-black text-teal-300 bg-teal-950 px-2 py-0.5 rounded border border-teal-600/60">
                {staminaAllocation}% of Club Focus
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="5"
              value={staminaAllocation}
              onChange={(e) => setStaminaAllocation(Number(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer h-2 bg-[#09221b] rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
              <span>0% (Full Net Speed)</span>
              <span>10% (Recommended)</span>
              <span>30% (High Endurance)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 10-NET ALLOCATION MATRIX */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Active 10-Net Training Allocations & Pop Velocities</span>
          </h3>
          <span className="text-xs text-slate-400">
            Training Type strictly: Batting, Bowling, Keeping, Fielding
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeNets.map((net) => {
            const isAssigned = net.player_id !== '';
            const assignedPlayer = isAssigned ? squad.find(s => s.id === net.player_id) : null;
            const isWonderkid = assignedPlayer?.is_wonderkid;

            return (
              <div
                key={net.net_number}
                className={`p-4 rounded-2xl border transition-all ${
                  isAssigned
                    ? isWonderkid
                      ? 'bg-gradient-to-r from-[#17382f] to-[#0e2922] border-amber-500/60 shadow-xl'
                      : 'bg-[#0e2c24] border-emerald-600/40 shadow-lg'
                    : 'bg-[#0b241e]/70 border-dashed border-emerald-800/50 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#061713] text-emerald-300 border border-emerald-800/60 flex items-center justify-center font-mono font-black text-xs">
                      #{net.net_number}
                    </span>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Net Discipline</span>
                      {/* Strictly the 4 Battrick Training Types */}
                      <select
                        value={net.training_type}
                        onChange={(e) => handleTypeChange(net.net_number, e.target.value as BattrickTrainingType)}
                        className="block text-xs font-black text-white bg-transparent focus:outline-none cursor-pointer"
                      >
                        <option value="Batting" className="bg-[#0c241e] text-emerald-300">Batting</option>
                        <option value="Bowling" className="bg-[#0c241e] text-teal-300">Bowling</option>
                        <option value="Keeping" className="bg-[#0c241e] text-cyan-300">Keeping</option>
                        <option value="Fielding" className="bg-[#0c241e] text-amber-300">Fielding</option>
                      </select>
                    </div>
                  </div>

                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase font-mono ${
                    isAssigned 
                      ? isWonderkid 
                        ? 'bg-amber-950 text-amber-300 border border-amber-600/60' 
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-600/60'
                      : 'bg-[#061713] text-slate-400 border border-emerald-900/40'
                  }`}>
                    {isAssigned ? (isWonderkid ? '⭐ Wonderkid Net' : 'Active Net') : 'Unassigned'}
                  </span>
                </div>

                {/* Player Assignment Selector */}
                <div className="mt-3 pt-3 border-t border-emerald-800/40">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400 font-semibold">Assigned Trainee:</span>
                    {isAssigned && assignedPlayer && (
                      <span className="text-emerald-400 font-mono font-bold">
                        BTI: {(assignedPlayer.bti ?? 0).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <select
                    value={net.player_id || ''}
                    onChange={(e) => handlePlayerChange(net.net_number, e.target.value)}
                    className="w-full py-1.5 px-2.5 rounded-xl bg-[#061713] border border-emerald-800/40 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="">(None - Keep Net Unassigned)</option>
                    {squad.map(p => (
                      <option key={p.id} value={p.id} className="bg-[#0c241e]">
                        {p.name} ({p.age}yo) &bull; ID: {p.id} {p.is_wonderkid ? '⭐' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pop Projection & Notes */}
                <div className="mt-3 pt-2 border-t border-emerald-800/30 flex items-center justify-between text-[11px]">
                  <div className="text-slate-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Est. Pop Velocity:</span>
                  </div>
                  <div className="font-mono font-bold text-white">
                    {isAssigned ? (
                      <span className={isWonderkid ? 'text-amber-300' : 'text-emerald-300'}>
                        ~{net.pops_estimated_weeks} Weeks (Friday 05:00 UTC)
                      </span>
                    ) : (
                      <span className="text-slate-400">Awaiting Assignment</span>
                    )}
                  </div>
                </div>

                <div className="mt-1 text-[10px] text-slate-400 italic">
                  {net.notes}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CONFIRMED FRIDAY POPS AUDIT LOG */}
      <div className="bg-[#0e2c24] p-5 rounded-2xl border border-emerald-600/30 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-extrabold text-white">Confirmed Friday Training Pop History</h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/60 font-bold">
            Season 41 Certified Logs
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-emerald-800/40 bg-[#061713]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#071d18] text-slate-300 uppercase tracking-wider text-[10px] border-b border-emerald-800/40">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Player Name & ID</th>
                <th className="py-2.5 px-3">Skill Trained</th>
                <th className="py-2.5 px-3 text-center">Progression</th>
                <th className="py-2.5 px-3 text-center">Subskill</th>
                <th className="py-2.5 px-3 text-center">Weeks Taken</th>
                <th className="py-2.5 px-3 text-center">Pop Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/60 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-emerald-950/40 transition-colors">
                  <td className="py-2.5 px-3 text-slate-400">{log.log_date}</td>
                  <td className="py-2.5 px-3 font-sans font-bold text-white">
                    <span>{log.player_name}</span>
                    <span className="text-xs text-emerald-400 font-mono ml-1.5">({log.player_id})</span>
                  </td>
                  <td className="py-2.5 px-3 text-emerald-300 font-semibold">{log.skill_trained}</td>
                  <td className="py-2.5 px-3 text-center font-sans">
                    <span className="text-slate-400 capitalize">{log.previous_level}</span>
                    <span className="text-emerald-400 mx-1">&rarr;</span>
                    <span className="font-bold text-white capitalize">{log.new_level}</span>
                  </td>
                  <td className="py-2.5 px-3 text-center text-amber-300 font-bold">{log.subskill.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-center text-slate-200">{log.weeks_taken} Wks</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/70 font-bold">
                      POPPED ✅
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
