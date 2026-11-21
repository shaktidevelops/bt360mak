import React, { useState } from 'react';
import { MatchRecord } from '../types/database';
import { Trophy, MapPin, Clock, Upload, Calendar } from 'lucide-react';

interface MatchesViewProps {
  matches: MatchRecord[];
  onNavigateToImport?: () => void;
}

export const MatchesView: React.FC<MatchesViewProps> = ({ matches, onNavigateToImport }) => {
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
      <div className="sovereign-card p-6 rounded-2xl border-emerald-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700">
            <Trophy className="w-4 h-4 text-emerald-600" />
            <span>Domestic Fixture Schedule & Performance Archives</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Somnath Super Devs Competitive Match Archives
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Authenticated First Class, One Day, and BT20 fixture scorecards, pitch surface conditions, and upcoming league matches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {['ALL', 'FC', 'OD', 'T20'].map((f) => (
              <button
                key={f}
                onClick={() => setFormatFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  formatFilter === f
                    ? 'bg-emerald-600 text-white shadow font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f === 'ALL' ? 'All Formats' : f === 'FC' ? 'First Class' : f === 'OD' ? 'One Day' : 'BT20'}
              </button>
            ))}
          </div>

          {onNavigateToImport && (
            <button
              onClick={onNavigateToImport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
              title="Upload new Battrick scorecard"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Scorecard</span>
            </button>
          )}
        </div>
      </div>

      {/* Match List or Clean Empty State */}
      {filteredMatches.length === 0 ? (
        <div className="sovereign-card p-12 rounded-2xl border-slate-200 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4 shadow-xs">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Awaiting Official Matchday Scorecards</h3>
          <p className="text-xs text-slate-600 mt-1.5 max-w-md leading-relaxed">
            All fake and dummy statistics have been removed so your records reflect genuine Battrick performances. Paste or upload your official match scorecards in the Import Hub to automatically populate match results, player averages, and clubhouse milestones.
          </p>
          {onNavigateToImport && (
            <button
              onClick={onNavigateToImport}
              className="mt-5 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              <Upload className="w-4 h-4" />
              <span>Go to Import Hub</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMatches.map((match) => {
            const isUpcoming = match.status === 'upcoming';
            const isWon = match.result?.includes('WON');

            return (
              <div
                key={match.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isUpcoming
                    ? 'bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-300 shadow-md'
                    : 'sovereign-card border-slate-200 hover:border-emerald-500'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-md font-bold uppercase font-mono ${
                      match.match_type === 'First Class'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : match.match_type === 'One Day'
                        ? 'bg-teal-100 text-teal-800 border border-teal-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {match.match_type}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-600">{match.match_date}</span>
                    <span className="text-xs font-mono text-emerald-700 font-bold">#{match.id}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-800 font-medium">{match.venue}</span>
                    <span className="text-amber-700 font-semibold font-mono">({match.pitch_type} Track)</span>
                  </div>
                </div>

                <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200">
                  <div>
                    <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <span>vs {match.opponent_club}</span>
                    </h4>
                    {match.result && (
                      <p className={`text-xs mt-1 font-semibold ${isWon ? 'text-emerald-700' : 'text-slate-600'}`}>
                        {match.result}
                      </p>
                    )}
                    {match.scoreSummary && (
                      <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                        Highlights: {match.scoreSummary}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {match.topPerformer && (
                      <span className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-300 font-mono font-bold">
                        ⭐ {match.topPerformer}
                      </span>
                    )}
                    {isUpcoming ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 border border-teal-300 text-xs font-bold shadow-xs">
                        <Clock className="w-3.5 h-3.5" /> Orders Ready
                      </span>
                    ) : isWon ? (
                      <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold shadow-xs">
                        <Trophy className="w-3.5 h-3.5 text-amber-600" /> Victory
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
