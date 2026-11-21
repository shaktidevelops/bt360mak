import React from 'react';
import { Club } from '../types/database';

interface FooterProps {
  club: Club;
}

export const Footer: React.FC<FooterProps> = ({ club }) => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white text-slate-700 py-6 px-6 text-xs shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Club Status Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-xl font-black text-white shadow-sm border border-emerald-400">
            🏏
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 text-sm">{club.name}</span>
              <span className="font-mono text-[10px] text-emerald-800 font-black bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 shadow-xs">
                #{club.id}
              </span>
              <span className="text-[11px] text-slate-600 font-bold hidden sm:inline">&bull; 🏟️ Prabhas Coastal Oval 🏔️</span>
            </div>
            <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-2 flex-wrap font-mono">
              <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">FC: <strong className="text-emerald-700">{club.division_fc}</strong></span>
              <span>&bull;</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">OD: <strong className="text-teal-700">{club.division_od}</strong></span>
              <span>&bull;</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">T20: <strong className="text-amber-700">{club.division_t20}</strong></span>
            </div>
          </div>
        </div>

        {/* Live Engine Synchronizer */}
        <div className="flex items-center gap-4 text-center">
          <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-xs" />
            <span className="text-[11px] font-black text-emerald-800">Battrick S69 Real Engine Active</span>
          </div>
          <div className="hidden sm:block text-[11px] text-slate-600">
            Next Cycle: <span className="text-amber-700 font-mono font-black">Friday Training Pops (05:00 UTC)</span>
          </div>
        </div>

        {/* Version & Sovereign Tag */}
        <div className="flex items-center gap-3 text-right">
          <div>
            <div className="font-mono text-[11px] font-black text-slate-900">
              BT360MAK <span className="text-emerald-700 font-mono">v3.0 Daylight Sovereign</span>
            </div>
            <div className="text-[10px] text-slate-500">
              React 19 &bull; Vite 6 &bull; Supabase Live &bull; 12 Battrick Domains
            </div>
          </div>
          <a
            href="https://github.com/shaktidevelops/bt360mak"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-all border border-slate-200 shadow-xs"
            title="GitHub Repository"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};
