import React from 'react';
import { StaffMember } from '../types/database';
import { Briefcase, Brain, HeartPulse, Award } from 'lucide-react';

interface StaffViewProps {
  staff: StaffMember[];
}

export const StaffView: React.FC<StaffViewProps> = ({ staff }) => {
  return (
    <div className="space-y-6">
      {/* Staff Header */}
      <div className="bg-[#0e2c24] p-6 rounded-2xl border border-emerald-600/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>Cricket Coaching, Psychological & Medical Operations</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Backroom Staff & Multiplier Synergies
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Professional sports science department directly accelerating weekly training net absorption, fatigue recovery, and matchday nerve stabilization.
          </p>
        </div>

        <div className="bg-[#061713] px-4 py-2 rounded-xl border border-emerald-800/40 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Staff Wage Bill</span>
          <div className="text-xl font-black font-mono text-emerald-400">
            £15,650 / wk
          </div>
        </div>
      </div>

      {/* Staff Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((member) => {
          const isPsych = member.role.includes('Psychologist');
          const isPhysio = member.role.includes('Physio');

          return (
            <div
              key={member.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isPsych 
                  ? 'bg-gradient-to-br from-[#12362b] to-[#0c241e] border-teal-500/50 shadow-xl'
                  : isPhysio
                  ? 'bg-gradient-to-br from-[#16382c] to-[#0c241e] border-emerald-500/50 shadow-xl'
                  : 'bg-[#0e2c24] border-emerald-800/40 shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-[#061713] text-emerald-400 border border-emerald-800/50">
                      {isPsych ? <Brain className="w-4 h-4 text-teal-400" /> : isPhysio ? <HeartPulse className="w-4 h-4 text-rose-400" /> : <Award className="w-4 h-4 text-amber-400" />}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">{member.role}</span>
                      <h3 className="text-base font-black text-white">{member.name}</h3>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#061713] text-emerald-300 border border-emerald-600/50">
                    {member.skillLevel}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {member.impactDescription}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-800/40 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase">Training Synergy:</span>
                  <div className="font-bold text-white">{member.synergyBonus}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400">Weekly Salary:</span>
                  <div className="font-mono font-bold text-slate-200">£{member.weeklyWage.toLocaleString()}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
