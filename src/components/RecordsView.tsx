import React, { useState } from 'react';
import { CricketRecord } from '../types/database';
import { Medal, Trophy } from 'lucide-react';

interface RecordsViewProps {
  records: CricketRecord[];
}

export const RecordsView: React.FC<RecordsViewProps> = ({ records }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredRecords = records.filter(r => {
    if (selectedCategory === 'ALL') return true;
    return r.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Records Header */}
      <div className="bg-[#0e2c24] p-6 rounded-2xl border border-emerald-600/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
            <Medal className="w-4 h-4 text-amber-400" />
            <span>Clubhouse Hall of Fame & Milestone Archives</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Somnath Super Devs All-Time Cricket Records
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Historical club batting, bowling, partnership, and team records authenticated from Battrick league and friendly scorecards.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#061713] p-1 rounded-xl border border-emerald-800/40 text-xs">
          {['ALL', 'BATTING', 'BOWLING', 'PARTNERSHIP', 'TEAM'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-black shadow font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecords.map((rec, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#0e2c24] border border-emerald-800/40 shadow-xl hover:border-amber-500/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase font-mono px-2 py-0.5 rounded-md bg-[#061713] text-amber-300 border border-amber-600/50">
                  {rec.category} RECORD
                </span>
                <span className="text-[10px] font-mono text-slate-400">{rec.date}</span>
              </div>
              <h3 className="text-base font-black text-white mt-2">{rec.recordName}</h3>
              <div className="text-2xl font-black font-mono text-amber-400 mt-1">
                {rec.value}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-800/40 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>{rec.holder}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">{rec.matchContext}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
