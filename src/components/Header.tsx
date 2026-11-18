import React, { useState, useEffect } from 'react';
import { Club } from '../types/database';
import { Clock, ShieldCheck, Database, Award } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import { ClubLogo } from './ClubLogo';

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
    <header className="sticky top-0 z-40 bg-[#0e2225]/95 backdrop-blur-md border-b border-[#204b4c] px-6 py-3 shadow-xl flex flex-wrap items-center justify-between gap-4">
      {/* Left: Custom SVG Club Crest & Meta */}
      <div className="flex items-center gap-4">
        <ClubLogo size={46} />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span>{club.name}</span>
            </h1>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-900/60 text-emerald-200 border border-emerald-600/40 font-mono font-bold">
              #{club.id}
            </span>
            <span className="text-xs text-emerald-300 font-medium hidden sm:inline">
              📍 {club.region}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#163638] text-emerald-200 border border-[#275d5e] font-medium">
              FC: {club.division_fc}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#163638] text-teal-200 border border-[#275d5e] font-medium">
              OD: {club.division_od}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#163638] text-amber-200 border border-[#275d5e] font-medium">
              T20: {club.division_t20}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Live Battrick Clock */}
      <div className="hidden lg:flex flex-col items-center px-4 py-1.5 rounded-xl bg-[#091719] border border-[#204b4c] shadow-inner">
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
          <Clock className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
          <span>Battrick Live Server Clock</span>
        </div>
        <div className="font-mono text-xs font-bold text-white tracking-wider mt-0.5">
          {time || 'Synchronizing UTC...'}
        </div>
      </div>

      {/* Right: Financial & Morale Ticker */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 bg-[#091719] px-4 py-1.5 rounded-xl border border-[#204b4c] text-xs">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Treasury</div>
            <div className="text-emerald-300 font-bold font-mono">
              £{club.bank_balance.toLocaleString()}
            </div>
          </div>
          <div className="h-6 w-px bg-[#204b4c]" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Fan Mood</div>
            <div className="text-amber-300 font-bold truncate max-w-[140px]">
              {club.fan_mood}
            </div>
          </div>
          <div className="h-6 w-px bg-[#204b4c] hidden sm:block" />
          <div className="hidden sm:block">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Weekly Wage</div>
            <div className="text-slate-200 font-bold font-mono">
              £{club.weekly_wage_bill.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Database Status Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold bg-[#091719] border-[#204b4c]">
          <Database className={`w-3.5 h-3.5 ${isSupabaseConfigured ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span className={isSupabaseConfigured ? 'text-emerald-300 text-[11px]' : 'text-amber-300 text-[11px]'}>
            {isSupabaseConfigured ? 'Supabase PostgreSQL' : 'Local Verified State'}
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
