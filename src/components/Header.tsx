import React, { useState, useEffect } from 'react';
import { Club } from '../types/database';
import { Clock, ShieldCheck, Database, Award, Sun, Moon, Sparkles } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import { ClubLogo } from './ClubLogo';

export type AppTheme = 'emerald' | 'light' | 'midnight';

interface HeaderProps {
  club: Club;
  theme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
}

export const Header: React.FC<HeaderProps> = ({ club, theme, onThemeChange }) => {
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

  const isLight = theme === 'light';

  return (
    <header className={`sticky top-0 z-40 px-6 py-3 shadow-xl flex flex-wrap items-center justify-between gap-4 border-b backdrop-blur-md transition-colors ${
      isLight 
        ? 'bg-white/95 border-slate-200 text-slate-800' 
        : theme === 'midnight'
        ? 'bg-[#0e1630]/95 border-[#1c2c54] text-slate-100'
        : 'bg-[#0f2427]/95 border-[#204b4c] text-slate-100'
    }`}>
      {/* Left: Custom SVG Club Crest & Identity */}
      <div className="flex items-center gap-4">
        <ClubLogo size={46} />
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-lg font-black tracking-tight flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <span>{club.name}</span>
            </h1>
            <span className={`text-[11px] px-2 py-0.5 rounded-md font-mono font-bold border ${
              isLight 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50'
            }`}>
              #{club.id}
            </span>
            <span className={`text-xs font-semibold hidden sm:inline ${isLight ? 'text-emerald-700' : 'text-emerald-300'}`}>
              📍 {club.region}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`text-[11px] px-2 py-0.5 rounded font-bold border ${
              isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-[#163638] text-emerald-200 border-[#275d5e]'
            }`}>
              FC: {club.division_fc}
            </span>
            <span className={`text-[11px] px-2 py-0.5 rounded font-bold border ${
              isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-[#163638] text-teal-200 border-[#275d5e]'
            }`}>
              OD: {club.division_od}
            </span>
            <span className={`text-[11px] px-2 py-0.5 rounded font-bold border ${
              isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-[#163638] text-amber-200 border-[#275d5e]'
            }`}>
              T20: {club.division_t20}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Live Battrick Server Clock */}
      <div className={`hidden lg:flex flex-col items-center px-4 py-1.5 rounded-xl border shadow-inner ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#091719] border-[#204b4c]'
      }`}>
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
          <Clock className="w-3.5 h-3.5 text-emerald-500 animate-spin-slow" />
          <span>Battrick Live Server Clock</span>
        </div>
        <div className={`font-mono text-xs font-black tracking-wider mt-0.5 ${isLight ? 'text-slate-800' : 'text-white'}`}>
          {time.ist} <span className="text-[10px] opacity-75">({time.utc})</span>
        </div>
      </div>

      {/* Right: Treasury Ticker & Theme Selector */}
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-3 px-4 py-1.5 rounded-xl border text-xs shadow-sm ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#091719] border-[#204b4c]'
        }`}>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Treasury</div>
            <div className="text-emerald-600 dark:text-emerald-300 font-black font-mono">
              £{club.bank_balance.toLocaleString()}
            </div>
          </div>
          <div className={`h-6 w-px ${isLight ? 'bg-slate-200' : 'bg-[#204b4c]'}`} />
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Fan Mood</div>
            <div className="text-amber-600 dark:text-amber-300 font-black truncate max-w-[130px]">
              {club.fan_mood}
            </div>
          </div>
          <div className={`h-6 w-px ${isLight ? 'bg-slate-200' : 'bg-[#204b4c]'} hidden sm:block`} />
          <div className="hidden sm:block">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Weekly Wage</div>
            <div className="font-mono font-bold text-slate-700 dark:text-slate-200">
              £{club.weekly_wage_bill.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Theme Switcher Button Group */}
        <div className={`flex items-center p-1 rounded-xl border ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#091719] border-[#204b4c]'
        }`}>
          <button
            onClick={() => onThemeChange('emerald')}
            title="Sovereign Emerald Theme (Vibrant Slate)"
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              theme === 'emerald' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onThemeChange('light')}
            title="Daylight Pavilion (Clean Light Mode)"
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              theme === 'light' ? 'bg-amber-500 text-white shadow' : 'text-slate-400 hover:text-amber-500'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onThemeChange('midnight')}
            title="Midnight Sapphire Theme"
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              theme === 'midnight' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-indigo-400'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Database Status */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#091719] border-[#204b4c]'
        }`}>
          <Database className={`w-3.5 h-3.5 ${isSupabaseConfigured ? 'text-emerald-500' : 'text-amber-500'}`} />
          <span className={`text-[11px] font-bold ${
            isSupabaseConfigured 
              ? 'text-emerald-600 dark:text-emerald-300' 
              : 'text-amber-600 dark:text-amber-300'
          }`}>
            {isSupabaseConfigured ? 'Supabase' : 'Verified State'}
          </span>
          {isSupabaseConfigured ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Award className="w-3.5 h-3.5 text-amber-500" />
          )}
        </div>
      </div>
    </header>
  );
};
