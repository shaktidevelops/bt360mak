import React from 'react';
import { TrainingLog, NetAllocation } from '../types/database';
import { Target, Zap, Clock } from 'lucide-react';

interface TrainingViewProps {
  logs: TrainingLog[];
  nets: NetAllocation[];
}

export const TrainingView: React.FC<TrainingViewProps> = ({ logs, nets }) => {
  return (
    <div className="space-y-6">
      {/* Friday Skill Pops Confirmed */}
      <div className="bg-[#06201b]/50 p-5 rounded-xl border border-emerald-900/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">03_Training_Tracker & Confirmed Pops</h2>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold font-mono">
            {logs.length} Confirmed Pops This Season
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {logs.map((log) => (
            <div key={log.id} className="p-4 rounded-xl bg-[#031512] border border-amber-900/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400">{log.log_date}</span>
                <h4 className="text-sm font-bold text-white mt-0.5">{log.player_name}</h4>
                <div className="text-xs text-amber-300 font-semibold mt-1">
                  {log.skill_trained}: {log.previous_level} &rarr; <span className="underline decoration-amber-400">{log.new_level} (POP!)</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400">Subskill</span>
                <div className="text-base font-bold font-mono text-emerald-300">{log.subskill}</div>
                <span className="text-[10px] text-slate-400">{log.weeks_taken} Weeks taken</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 10-Net Matrix Table */}
      <div className="bg-[#031512]/90 rounded-xl border border-emerald-900/40 p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">04_Nets_Matrix - 10 Weekly Nets Allocation</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#062922] text-slate-300 uppercase tracking-wider text-[10px] border-b border-emerald-900/60">
                <th className="py-2.5 px-3">Net #</th>
                <th className="py-2.5 px-3">Training Type</th>
                <th className="py-2.5 px-3">Primary Trainee</th>
                <th className="py-2.5 px-3 text-center">Coach Quality</th>
                <th className="py-2.5 px-3 text-center">Est. Pop</th>
                <th className="py-2.5 px-3">Development Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/60">
              {nets.map((net) => (
                <tr key={net.net_number} className="hover:bg-emerald-950/30">
                  <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                    Net {net.net_number}
                  </td>
                  <td className="py-3 px-3 font-semibold text-white">
                    {net.training_type}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-200">
                    {net.player_name || 'Unassigned'}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-400 font-mono">
                    {net.coach_multiplier}x
                  </td>
                  <td className="py-3 px-3 text-center">
                    {net.pops_estimated_weeks ? (
                      <span className="flex items-center justify-center gap-1 text-emerald-300 font-mono font-semibold">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        {net.pops_estimated_weeks} wks
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {net.notes || '-'}
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
