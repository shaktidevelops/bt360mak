import React, { useState } from 'react';
import { CricketRecord } from '../types/database';
import { Medal, Trophy, Upload, Award } from 'lucide-react';

interface RecordsViewProps {
  records: CricketRecord[];
  onNavigateToImport?: () => void;
}

export const RecordsView: React.FC<RecordsViewProps> = ({ records, onNavigateToImport }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredRecords = records.filter(r => {
    if (selectedCategory === 'ALL') return true;
    return r.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Records Header */}
      <div className="sovereign-card p-6 rounded-2xl border-emerald-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700">
            <Medal className="w-4 h-4 text-emerald-600" />
            <span>Clubhouse Hall of Fame & Milestone Archives</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Somnath Super Devs All-Time Cricket Records
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Historical club batting, bowling, partnership, and team records authenticated from Battrick league and friendly scorecards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {['ALL', 'BATTING', 'BOWLING', 'PARTNERSHIP', 'TEAM'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
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

      {/* Records Grid or Clean Empty State */}
      {filteredRecords.length === 0 ? (
        <div className="sovereign-card p-12 rounded-2xl border-slate-200 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4 shadow-xs">
            <Award className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Official Club Records Reset &bull; Ready for Match Data</h3>
          <p className="text-xs text-slate-600 mt-1.5 max-w-md leading-relaxed">
            All placeholder and dummy records have been cleared. As you upload match scorecards in the Import Hub, highest individual scores, best bowling figures, highest team totals, and record partnerships will automatically compute and honor the record holders here.
          </p>
          {onNavigateToImport && (
            <button
              onClick={onNavigateToImport}
              className="mt-5 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              <Upload className="w-4 h-4" />
              <span>Import Matches to Generate Records</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map((rec, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl sovereign-card border-slate-200 hover:border-amber-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase font-mono px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-300">
                    {rec.category} RECORD
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{rec.date}</span>
                </div>
                <h3 className="text-base font-black text-slate-900 mt-2">{rec.recordName}</h3>
                <div className="text-2xl font-black font-mono text-amber-600 mt-1">
                  {rec.value}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>{rec.holder}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{rec.matchContext}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
