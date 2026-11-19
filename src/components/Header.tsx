import React, { useState, useEffect } from 'react';
import { Club } from '../types/database';
import { Clock, ShieldCheck, Database, Award, Upload } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import { ClubLogo } from './ClubLogo';

interface HeaderProps {
  club: Club;
  onOpenImport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ club, onOpenImport }) => {
  const [time, setTime] = useState<{ utc: string; ist: string }>({ utc: '', ist: '' });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utc = now.toUTCString().split(' ')[4] + ' UTC';
      const ist = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST';
      setTime({ utc, ist });
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 px-6 py-3 shadow-2xl flex flex-wrap items-center justify-between gap-4 border-b-2 border-emerald-500/50 bg-gradient-to-r from-[#06241b] via-[#0a382a] to-[#06241b] backdrop-blur-md">
      {/* Left: Custom SVG Club Crest & Ground Identity */}
      <div className="flex items-center gap-4">
        <ClubLogo size={52} />
        <div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full cricket-ball shrink-0" title="Cherry Leather Match Ball"></span>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
              <span>{club.name}</span>
              <span className="text-xs">🏏</span>
            </h1>
            <span className="text-[11px] px-2.5 py-0.5 rounded-md font-mono font-black bg-emerald-950 text-emerald-300 border border-emerald-500/60 shadow-sm">
              #{club.id}
            </span>
            <span className="text-xs font-extrabold text-emerald-200 hidden sm:inline">
              📍 {club.region} &bull; 🏟️ Prabhas Coastal Oval 🏔️
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 font-mono text-[11px]">
            <span className="px-2.5 py-0.5 rounded font-extrabold bg-[#053022] text-emerald-200 border border-emerald-600/60 shadow-sm">
              🏆 FC: {club.division_fc}
            </span>
            <span className="px-2.5 py-0.5 rounded font-extrabold bg-[#053022] text-teal-200 border border-teal-600/60 shadow-sm">
              ⚡ OD: {club.division_od}
            </span>
            <span className="px-2.5 py-0.5 rounded font-extrabold bg-[#053022] text-amber-200 border border-amber-600/60 shadow-sm">
              🔥 T20: {club.division_t20}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Live Battrick Server Clock */}
      <div className="hidden lg:flex flex-col items-center px-5 py-1.5 rounded-xl scoreboard-panel shadow-xl">
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-black text-amber-400 tracking-wider">
          <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span>🏟️ Battrick Server Time</span>
        </div>
        <div className="font-mono text-xs font-black tracking-wider text-emerald-300 mt-0.5">
          {time.ist} <span className="text-[10px] text-slate-300">({time.utc})</span>
        </div>
      </div>

      {/* Right: Treasury, Fan Mood, Wage & Database Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 px-4 py-1.5 rounded-xl sovereign-card text-xs shadow-md border-emerald-500/40">
          <div>
            <div className="text-[10px] text-slate-300 uppercase tracking-wider font-extrabold">💰 Treasury</div>
            <div className="text-emerald-300 font-black font-mono">
              £{club.bank_balance.toLocaleString()}
            </div>
          </div>
          <div className="h-6 w-px bg-emerald-700/50" />
          <div>
            <div className="text-[10px] text-slate-300 uppercase tracking-wider font-extrabold">👥 Fan Club</div>
            <div className="text-amber-300 font-black truncate max-w-[130px]">
              {club.fan_mood}
            </div>
          </div>
          <div className="h-6 w-px bg-emerald-700/50 hidden sm:block" />
          <div className="hidden sm:block">
            <div className="text-[10px] text-slate-300 uppercase tracking-wider font-extrabold">🏟️ Wage Bill</div>
            <div className="font-mono font-bold text-slate-100">
              £{club.weekly_wage_bill.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Import from Battrick Action Button */}
        {onOpenImport && (
          <button
            onClick={onOpenImport}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-[#091e17] font-black text-xs shadow-lg hover:shadow-amber-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer border border-amber-300/80"
            title="Import Club Roster, Tactics, Finances, or Grounds from Battrick"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_8px_#ef4444] animate-pulse"></span>
            <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="tracking-tight">⚡ Import Battrick</span>
          </button>
        )}

        {/* Database Status */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-600/50 bg-[#06241b] text-xs font-semibold shadow">
          <Database className={`w-3.5 h-3.5 ${isSupabaseConfigured ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span className={`text-[11px] font-extrabold ${isSupabaseConfigured ? 'text-emerald-300' : 'text-amber-300'}`}>
            {isSupabaseConfigured ? 'Supabase' : 'Verified'}
          </span>
          {isSupabaseConfigured ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Award className="w-3.5 h-3.5 text-amber-400" />
          )}
        </div>
      </div>
    </header>
  );
};
