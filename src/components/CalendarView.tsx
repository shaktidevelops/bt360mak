import React, { useState } from 'react';
import { CalendarEvent } from '../types/database';
import { CalendarDays, MapPin, Zap, CircleDollarSign, Trophy } from 'lucide-react';

interface CalendarViewProps {
  events: CalendarEvent[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events }) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredEvents = events.filter(e => {
    if (filterType === 'ALL') return true;
    if (filterType === 'MATCHES') return e.type.startsWith('MATCH');
    if (filterType === 'TRAINING') return e.type === 'TRAINING_POP' || e.type === 'YOUTH_DRAFT';
    if (filterType === 'FINANCE') return e.type === 'FINANCE_UPDATE' || e.type === 'SPONSOR_PAYMENT';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Calendar Header & Filter Bar */}
      <div className="bg-[#0e2c24] p-6 rounded-2xl border border-emerald-600/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
            <CalendarDays className="w-4 h-4 text-emerald-400" />
            <span>Clubhouse Calendar & Operational Schedule</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Weekly Battrick Cycle & Event Timeline
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Covers the complete 7-day domestic schedule: Friday Skill Pops, Saturday Youth Pulls, Sunday Financial Settlements, and Tuesday/Thursday/Friday Matchdays.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#061713] p-1 rounded-xl border border-emerald-800/40 text-xs">
          {['ALL', 'MATCHES', 'TRAINING', 'FINANCE'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === f
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Timeline Events List */}
      <div className="space-y-3">
        {filteredEvents.map((event) => {
          const isMatch = event.type.startsWith('MATCH');
          const isTraining = event.type === 'TRAINING_POP' || event.type === 'YOUTH_DRAFT';

          return (
            <div
              key={event.id}
              className={`p-5 rounded-2xl border transition-all ${
                event.importance === 'CRITICAL'
                  ? 'bg-gradient-to-r from-[#17382f] to-[#0e2922] border-amber-500/60 shadow-xl'
                  : 'bg-[#0e2c24] border-emerald-800/40 shadow-md hover:border-emerald-600/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    isMatch
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : isTraining
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  }`}>
                    {isMatch ? <Trophy className="w-5 h-5" /> : isTraining ? <Zap className="w-5 h-5" /> : <CircleDollarSign className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {event.dayOfWeek}, {event.date}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-extrabold bg-[#061713] text-slate-300 border border-emerald-800/50">
                        {event.time}
                      </span>
                      {event.importance === 'CRITICAL' && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase bg-amber-950 text-amber-300 border border-amber-600">
                          CRITICAL EVENT
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-black text-white mt-1">
                      {event.title}
                    </h4>
                  </div>
                </div>

                {event.venue && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold self-start sm:self-auto">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{event.venue}</span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-emerald-800/30 text-xs text-slate-300 flex items-center justify-between">
                <span>{event.details}</span>
                <span className="font-mono text-emerald-400/80 font-bold hidden sm:inline">
                  Battrick Server Sync: Active
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
