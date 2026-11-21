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
      <div className="sovereign-card p-6 rounded-2xl border-emerald-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700">
            <Briefcase className="w-4 h-4 text-emerald-600" />
            <span>Cricket Coaching, Psychological & Medical Operations</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Backroom Staff & Multiplier Synergies
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Professional sports science department directly accelerating weekly training net absorption, fatigue recovery, and matchday nerve stabilization.
          </p>
        </div>

        <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-center shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500">Total Staff Wage Bill</span>
          <div className="text-xl font-black font-mono text-emerald-700">
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
                  ? 'sovereign-card-cyan shadow-md'
                  : isPhysio
                  ? 'sovereign-card shadow-md'
                  : 'sovereign-card-gold shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-100 text-emerald-700 border border-slate-200 shadow-xs">
                      {isPsych ? <Brain className="w-4 h-4 text-teal-600" /> : isPhysio ? <HeartPulse className="w-4 h-4 text-rose-600" /> : <Award className="w-4 h-4 text-amber-600" />}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500">{member.role}</span>
                      <h3 className="text-base font-black text-slate-900">{member.name}</h3>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {member.skillLevel}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {member.impactDescription}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-amber-700 font-bold uppercase">Training Synergy:</span>
                  <div className="font-bold text-slate-900">{member.synergyBonus}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500">Weekly Salary:</span>
                  <div className="font-mono font-bold text-slate-800">£{member.weeklyWage.toLocaleString()}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
