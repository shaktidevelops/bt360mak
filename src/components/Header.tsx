import React, { useState, useEffect } from 'react';
import { Club } from '../types/database';
import { Clock, ShieldCheck, Database, Award } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import { ClubLogo } from './ClubLogo';

interface HeaderProps {
  club: Club;
}

export const Header: React.FC<HeaderProps> = ({ club }) => {
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
    <header className="sticky top-0 z-40 px-6 py-3 shadow-2xl flex flex-wrap items-center justify-between gap-4 border-b border-emerald-600/30 bg-[#071915]/95 backdrop-blur-md">
      {/* Left: Custom SVG Club Crest & Ground Identity */}
      <div className="flex items-center gap-4">
        <ClubLogo size={48} />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
              <span>{club.name}</span>
            </h1>
            <span className="text-[11px] px-2 py-0.5 rounded-md font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-600/50">
              #{club.id}
            </span>
            <span className="text-xs font-semibold text-emerald-300 hidden sm:inline">
              📍 {club.region}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[11px] px-2 py-0.5 rounded font-bold bg-[#0d2a23] text-emerald-200 border border-[#1b5043]">
              FC: {club.division_fc}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded font-bold bg-[#0d2a23] text-teal-200 border border-[#1b5043]">
              OD: {club.division_od}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded font-bold bg-[#0d2a23] text-amber-200 border border-[#1b5043]">
              T20: {club.division_t20}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Live Battrick Server Clock */}
      <div className="hidden lg:flex flex-col items-center px-4 py-1.5 rounded-xl border border-emerald-700/40 bg-[#051411] shadow-inner">
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
          <Clock className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
          <span>Battrick Live Server Time</span>
        </div>
        <div className="font-mono text-xs font-black tracking-wider text-white mt-0.5">
          {time.ist} <span className="text-[10px] text-emerald-400/80">({time.utc})</span>
        </div>
      </div>

      {/* Right: Treasury, Fan Mood, Wage & Database Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 px-4 py-1.5 rounded-xl border border-emerald-700/40 bg-[#051411] text-xs shadow-sm">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Treasury</div>
            <div className="text-emerald-400 font-black font-mono">
              £{club.bank_balance.toLocaleString()}
            </div>
          </div>
          <div className="h-6 w-px bg-emerald-900/60" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Fan Mood</div>
            <div className="text-amber-300 font-black truncate max-w-[130px]">
              {club.fan_mood}
            </div>
          </div>
          <div className="h-6 w-px bg-emerald-900/60 hidden sm:block" />
          <div className="hidden sm:block">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Weekly Wage</div>
            <div className="font-mono font-bold text-slate-200">
              £{club.weekly_wage_bill.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Database Status */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-700/40 bg-[#051411] text-xs font-semibold">
          <Database className={`w-3.5 h-3.5 ${isSupabaseConfigured ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span className={`text-[11px] font-bold ${isSupabaseConfigured ? 'text-emerald-300' : 'text-amber-300'}`}>
            {isSupabaseConfigured ? 'Supabase' : 'Verified State'}
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
