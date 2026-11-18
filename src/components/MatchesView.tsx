import React, { useState } from 'react';
import { MatchRecord } from '../types/database';
import { Trophy, MapPin, Clock } from 'lucide-react';

interface MatchesViewProps {
  matches: MatchRecord[];
}

export const MatchesView: React.FC<MatchesViewProps> = ({ matches }) => {
  const [formatFilter, setFormatFilter] = useState<string>('ALL');

  const filteredMatches = matches.filter(m => {
    if (formatFilter === 'ALL') return true;
    if (formatFilter === 'FC') return m.match_type === 'First Class';
    if (formatFilter === 'OD') return m.match_type === 'One Day';
    if (formatFilter === 'T20') return m.match_type === 'BT20';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Match Calendar Header */}
      <div className="bg-[#0e2c24] p-6 rounded-2xl border border-emerald-600/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span>Domestic Fixture Schedule & Performance Archives</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Somnath Super Devs Competitive Match Archives
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Authenticated First Class, One Day, and BT20 fixture scorecards, pitch surface conditions, and upcoming league matches.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#061713] p-1 rounded-xl border border-emerald-800/40 text-xs">
          {['ALL', 'FC', 'OD', 'T20'].map((f) => (
            <button
              key={f}
              onClick={() => setFormatFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                formatFilter === f
                  ? 'bg-emerald-600 text-white shadow font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {f === 'ALL' ? 'All Formats' : f === 'FC' ? 'First Class' : f === 'OD' ? 'One Day' : 'BT20'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredMatches.map((match) => {
          const isUpcoming = match.status === 'upcoming';
          const isWon = match.result?.includes('WON');

          return (
            <div
              key={match.id}
              className={`p-5 rounded-2xl border transition-all ${
                isUpcoming
                  ? 'bg-gradient-to-r from-[#17382f] to-[#0e2922] border-teal-500/60 shadow-xl'
                  : 'bg-[#0e2c24] border-emerald-800/40 shadow-md hover:border-emerald-600/60'
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
                  <span className="text-xs font-mono font-bold text-slate-300">{match.match_date}</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">#{match.id}</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-white font-medium">{match.venue}</span>
                  <span className="text-amber-300 font-semibold font-mono">({match.pitch_type} Track)</span>
                </div>
              </div>

              <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-emerald-800/40">
                <div>
                  <h4 className="text-base font-black text-white flex items-center gap-2">
                    <span>vs {match.opponent_club}</span>
                  </h4>
                  {match.result && (
                    <p className={`text-xs mt-1 font-semibold ${isWon ? 'text-emerald-300' : 'text-slate-300'}`}>
                      {match.result}
                    </p>
                  )}
                  {match.scoreSummary && (
                    <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      Highlights: {match.scoreSummary}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {match.topPerformer && (
                    <span className="text-[11px] px-2.5 py-1 rounded-lg bg-[#061713] text-amber-300 border border-amber-600/40 font-mono font-bold">
                      ⭐ {match.topPerformer}
                    </span>
                  )}
                  {isUpcoming ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950 text-teal-300 border border-teal-500/70 text-xs font-bold shadow">
                      <Clock className="w-3.5 h-3.5" /> Orders Ready
                    </span>
                  ) : isWon ? (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/70 text-xs font-bold shadow">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" /> Victory
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
