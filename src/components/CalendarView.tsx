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
      <div className="sovereign-card p-6 rounded-2xl border-emerald-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700">
            <CalendarDays className="w-4 h-4 text-emerald-600" />
            <span>Clubhouse Calendar & Operational Schedule</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Weekly Battrick Cycle & Event Timeline
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Covers the complete 7-day domestic schedule: Friday Skill Pops, Saturday Youth Pulls, Sunday Financial Settlements, and Tuesday/Thursday/Friday Matchdays.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          {['ALL', 'MATCHES', 'TRAINING', 'FINANCE'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === f
                  ? 'bg-emerald-600 text-white shadow font-bold'
                  : 'text-slate-600 hover:text-slate-900'
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
                  ? 'sovereign-card-gold shadow-md'
                  : 'sovereign-card border-slate-200 hover:border-emerald-500 shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    isMatch
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : isTraining
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-teal-100 text-teal-800 border border-teal-300'
                  }`}>
                    {isMatch ? <Trophy className="w-5 h-5" /> : isTraining ? <Zap className="w-5 h-5" /> : <CircleDollarSign className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-700">
                        {event.dayOfWeek}, {event.date}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                        {event.time}
                      </span>
                      {event.importance === 'CRITICAL' && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase bg-amber-100 text-amber-800 border border-amber-300">
                          CRITICAL EVENT
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-black text-slate-900 mt-1">
                      {event.title}
                    </h4>
                  </div>
                </div>

                {event.venue && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold self-start sm:self-auto">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{event.venue}</span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>{event.details}</span>
                <span className="font-mono text-emerald-700 font-bold hidden sm:inline">
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
