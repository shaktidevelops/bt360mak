import React, { useState, useEffect } from 'react';
import { Club } from '../types/database';
import { Clock, ShieldCheck, Database } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface HeaderProps {
  club: Club;
}

export const Header: React.FC<HeaderProps> = ({ club }) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#06201b]/95 backdrop-blur-md border-b border-emerald-900/40 px-6 py-3 shadow-2xl flex flex-wrap items-center justify-between gap-4">
      {/* Left: Club Crest & Meta */}
      <div className="flex items-center gap-4">
        <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-2xl shadow-lg shadow-emerald-950/50 border border-emerald-400/20">
          🏏
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-white">{club.name}</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-mono font-medium">
              #{club.id}
            </span>
            <span className="text-xs text-emerald-400/80 font-medium hidden sm:inline">
              📍 {club.region}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-200 border border-emerald-800/30">
              FC: {club.division_fc}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-teal-900/40 text-teal-200 border border-teal-800/30">
              OD: {club.division_od}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-amber-900/40 text-amber-200 border border-amber-800/30">
              T20: {club.division_t20}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Live Battrick Clock */}
      <div className="hidden lg:flex flex-col items-center px-4 py-1.5 rounded-xl bg-[#041613] border border-emerald-900/60">
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
          <Clock className="w-3 h-3 text-emerald-400 animate-spin-slow" />
          <span>Battrick Live Server</span>
        </div>
        <div className="font-mono text-xs font-semibold text-emerald-100 tracking-wider mt-0.5">
          {time || 'Syncing clock...'}
        </div>
      </div>

      {/* Right: Financial Ticker & Database Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-[#031411] px-4 py-1.5 rounded-xl border border-emerald-900/60 text-xs">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Treasury</div>
            <div className="text-emerald-300 font-bold font-mono">
              £{club.bank_balance.toLocaleString()}
            </div>
          </div>
          <div className="h-6 w-px bg-emerald-900/60" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Fan Mood</div>
            <div className="text-amber-300 font-bold truncate max-w-[140px]">
              {club.fan_mood}
            </div>
          </div>
          <div className="h-6 w-px bg-emerald-900/60 hidden sm:block" />
          <div className="hidden sm:block">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Wage Bill</div>
            <div className="text-slate-200 font-bold font-mono">
              £{club.weekly_wage_bill.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium bg-[#031411] border-emerald-900/50">
          <Database className={`w-3.5 h-3.5 ${isSupabaseConfigured ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span className={isSupabaseConfigured ? 'text-emerald-300 text-[11px]' : 'text-amber-300 text-[11px]'}>
            {isSupabaseConfigured ? 'Supabase Connected' : 'Local Preview'}
          </span>
          {isSupabaseConfigured && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
        </div>
      </div>
    </header>
  );
};
