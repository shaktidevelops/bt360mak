import React from 'react';
import { MatchRecord } from '../types/database';
import { Calendar, Trophy, MapPin, Clock } from 'lucide-react';

interface MatchesViewProps {
  matches: MatchRecord[];
}

export const MatchesView: React.FC<MatchesViewProps> = ({ matches }) => {
  return (
    <div className="space-y-6">
      {/* Match Calendar Header */}
      <div className="bg-[#10272a] p-6 rounded-2xl border border-[#204b4c] shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>Domestic Fixture Schedule</span>
        </div>
        <h2 className="text-2xl font-black text-white mt-1">
          Match Calendar & Performance Archives
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Complete fixture records, pitch surface ratings, and upcoming First Class/One Day/T20 encounters for Somnath Super Devs.
        </p>
      </div>

      <div className="space-y-3">
        {matches.map((match) => {
          const isUpcoming = match.status === 'upcoming';
          const isWon = match.result?.includes('WON');

          return (
            <div
              key={match.id}
              className={`p-5 rounded-2xl border transition-all ${
                isUpcoming
                  ? 'bg-gradient-to-r from-[#123639] to-[#0e2427] border-teal-500/50 shadow-lg'
                  : 'bg-[#10272a] border-[#204b4c] shadow-md hover:border-emerald-600/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-md font-bold uppercase font-mono ${
                    match.match_type === 'First Class'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/60'
                      : match.match_type === 'One Day'
                      ? 'bg-teal-950 text-teal-300 border border-teal-600/60'
                      : 'bg-amber-950 text-amber-300 border border-amber-600/60'
                  }`}>
                    {match.match_type}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-300">{match.match_date}</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">{match.id}</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-white font-medium">{match.venue}</span>
                  <span className="text-amber-300 font-semibold">({match.pitch_type} Pitch)</span>
                </div>
              </div>

              <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#18393b]">
                <div>
                  <h4 className="text-base font-black text-white flex items-center gap-2">
                    <span>vs {match.opponent_club}</span>
                  </h4>
                  {match.result && (
                    <p className={`text-xs mt-1 font-semibold ${isWon ? 'text-emerald-300' : 'text-slate-300'}`}>
                      {match.result}
                    </p>
                  )}
                </div>

                {isUpcoming ? (
                  <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-950 text-teal-300 border border-teal-500/70 text-xs font-bold self-start sm:self-auto shadow">
                    <Clock className="w-3.5 h-3.5" /> Upcoming Match Orders Ready
                  </span>
                ) : isWon ? (
                  <span className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/70 text-xs font-bold self-start sm:self-auto shadow">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" /> Victory Confirmed
                  </span>
                ) : (
                  <span className="px-3.5 py-1.5 rounded-full bg-[#163638] text-slate-200 border border-[#275d5e] text-xs font-semibold self-start sm:self-auto">
                    Fixture Concluded
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
