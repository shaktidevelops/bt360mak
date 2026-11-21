import React, { useState, useEffect } from 'react';
import { Club } from '../types/database';
import { Clock, ShieldCheck, Database, Upload } from 'lucide-react';
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
    <header className="sticky top-0 z-40 px-6 py-2.5 shadow-sm flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      {/* Left: Custom SVG Club Crest & Identity */}
      <div className="flex items-center gap-3.5">
        <ClubLogo size={46} />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              <span>{club.name}</span>
            </h1>
            <span className="text-[11px] px-2 py-0.5 rounded-md font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs">
              #{club.id}
            </span>
            <span className="text-xs font-medium text-slate-600 hidden md:inline">
              &bull; 📍 {club.region} (Prabhas Coastal Oval)
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 font-mono text-[11px]">
            <span className="px-2 py-0.5 rounded-md font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs flex items-center gap-1">
              <span className="text-[10px]">🏆</span> FC: {club.division_fc}
            </span>
            <span className="px-2 py-0.5 rounded-md font-bold bg-teal-50 text-teal-800 border border-teal-300 shadow-xs flex items-center gap-1">
              <span className="text-[10px]">⚡</span> OD: {club.division_od}
            </span>
            <span className="px-2 py-0.5 rounded-md font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-xs flex items-center gap-1">
              <span className="text-[10px]">🔥</span> T20: {club.division_t20}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Live Battrick Server Clock */}
      <div className="hidden lg:flex flex-col items-center px-4 py-1.5 rounded-xl bg-slate-50 border border-emerald-300 shadow-xs">
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-amber-700 tracking-wider">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Battrick Server Time</span>
        </div>
        <div className="font-mono text-xs font-bold tracking-wider text-emerald-800 mt-0.5 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{time.ist}</span>
          <span className="text-[10px] text-slate-500 font-normal">({time.utc})</span>
        </div>
      </div>

      {/* Right: Quick Treasury, Fan Mood, Wage & Actions */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-3.5 px-3.5 py-1.5 rounded-xl bg-slate-50 text-xs shadow-xs border border-slate-200">
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Treasury</div>
            <div className="text-emerald-700 font-bold font-mono">
              £{club.bank_balance.toLocaleString()}
            </div>
          </div>
          <div className="h-5 w-px bg-slate-200" />
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Fan Mood</div>
            <div className="text-amber-700 font-bold truncate max-w-[120px]">
              {club.fan_mood}
            </div>
          </div>
          <div className="h-5 w-px bg-slate-200 hidden md:block" />
          <div className="hidden md:block">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Wage Bill</div>
            <div className="font-mono font-semibold text-slate-700">
              £{club.weekly_wage_bill.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Sync & Import Action Button */}
        {onOpenImport && (
          <button
            onClick={onOpenImport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer border border-emerald-500"
            title="Import Club Roster, Tactics, Finances, or Grounds from Battrick"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="tracking-tight">Import Hub</span>
          </button>
        )}

        {/* Database Status */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold shadow-xs">
          <Database className={`w-3.5 h-3.5 ${isSupabaseConfigured ? 'text-emerald-600' : 'text-amber-600'}`} />
          <span className={`text-[11px] font-bold ${isSupabaseConfigured ? 'text-emerald-700' : 'text-amber-700'}`}>
            {isSupabaseConfigured ? 'Live DB' : 'Local'}
          </span>
          {isSupabaseConfigured ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          )}
        </div>
      </div>
    </header>
  );
};
