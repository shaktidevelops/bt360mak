import React from 'react';
import { MatchRecord } from '../types/database';
import { Calendar, Trophy, MapPin } from 'lucide-react';

interface MatchesViewProps {
  matches: MatchRecord[];
}

export const MatchesView: React.FC<MatchesViewProps> = ({ matches }) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#06201b]/50 p-5 rounded-xl border border-emerald-900/40">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">05_Match_Archives & Upcoming Fixtures</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Historical league results, ratings, and upcoming First Class/One Day/T20 match calendar.
        </p>
      </div>

      <div className="space-y-3">
        {matches.map((match) => {
          const isUpcoming = match.status === 'upcoming';
          const isWon = match.result?.includes('WON');

          return (
            <div
              key={match.id}
              className={`p-4 rounded-xl border transition-all ${
                isUpcoming
                  ? 'bg-gradient-to-r from-teal-950/40 to-[#031512] border-teal-800/40'
                  : 'bg-[#031512]/90 border-emerald-900/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase font-mono ${
                    match.match_type === 'First Class'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                      : match.match_type === 'One Day'
                      ? 'bg-teal-950 text-teal-300 border border-teal-800/50'
                      : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                  }`}>
                    {match.match_type}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{match.match_date}</span>
                  <span className="text-xs font-mono text-emerald-500 font-semibold">{match.id}</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-300">{match.venue}</span>
                  <span className="text-emerald-400 font-mono">({match.pitch_type} Pitch)</span>
                </div>
              </div>

              <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>vs {match.opponent_club}</span>
                  </h4>
                  {match.result && (
                    <p className={`text-xs mt-1 font-medium ${isWon ? 'text-emerald-300' : 'text-slate-300'}`}>
                      {match.result}
                    </p>
                  )}
                </div>

                {isUpcoming ? (
                  <span className="px-3 py-1 rounded-full bg-teal-950 text-teal-300 border border-teal-800/60 text-xs font-bold self-start sm:self-auto">
                    Upcoming Fixture
                  </span>
                ) : isWon ? (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-xs font-bold self-start sm:self-auto">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" /> Victory
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700 text-xs font-semibold self-start sm:self-auto">
                    Completed
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
