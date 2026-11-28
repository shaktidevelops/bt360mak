import React, { useState, useEffect } from 'react';
import { Club } from '../types/database';
import { Clock, Upload, FileSpreadsheet, ExternalLink } from 'lucide-react';
import { isGoogleSheetsConfigured, GOOGLE_SHEET_URL } from '../lib/googleSheetsService';
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
    <header className="sticky top-0 z-40 px-4 lg:px-6 h-[58px] shadow-xs flex items-center justify-between gap-3 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      {/* Left: Custom SVG Club Crest & Identity */}
      <div className="flex items-center gap-3 shrink-0">
        <ClubLogo size={38} />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-black tracking-tight text-slate-900 whitespace-nowrap">
              {club.name || 'Awaiting Club Import'}
            </h1>
            {club.id && club.id !== 'Unassigned' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                #{club.id}
              </span>
            )}
            {club.stadium_name && club.stadium_name !== 'Unassigned Ground' && (
              <span className="text-xs font-semibold text-slate-500 hidden xl:inline whitespace-nowrap">
                &bull; {club.stadium_name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            <span className="px-1.5 py-0.5 rounded font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap">
              FC: {club.division_fc || '—'}
            </span>
            <span className="px-1.5 py-0.5 rounded font-bold bg-teal-50 text-teal-800 border border-teal-200 whitespace-nowrap">
              OD: {club.division_od || '—'}
            </span>
            <span className="px-1.5 py-0.5 rounded font-bold bg-amber-50 text-amber-900 border border-amber-200 whitespace-nowrap">
              T20: {club.division_t20 || '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Live Battrick Server Clock */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-50 border border-emerald-200 text-xs shadow-xs shrink-0">
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Server:</span>
        <span className="font-mono text-xs font-black text-emerald-800">{time.ist}</span>
        <span className="text-[10px] text-slate-500 font-mono">({time.utc})</span>
      </div>

      {/* Right: Quick Treasury, Fan Mood, Wage & Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="hidden md:flex items-center gap-3 px-3 py-1 rounded-xl bg-slate-50 text-xs border border-slate-200">
          <div>
            <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Treasury</div>
            <div className="text-emerald-700 font-black font-mono text-xs">
              £{(club.bank_balance ?? 0).toLocaleString()}
            </div>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div>
            <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Fan Mood</div>
            <div className="text-amber-800 font-bold whitespace-nowrap text-xs">
              {club.fan_mood || '—'}
            </div>
          </div>
          <div className="h-4 w-px bg-slate-200 hidden lg:block" />
          <div className="hidden lg:block">
            <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Wage Bill</div>
            <div className="font-mono font-bold text-slate-700 text-xs">
              £{(club.weekly_wage_bill ?? 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Sync & Import Action Button */}
        {onOpenImport && (
          <button
            onClick={onOpenImport}
            className="btn-cricket-emerald flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
            title="Import Club Roster, Tactics, Finances, or Grounds from Battrick"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Hub</span>
          </button>
        )}

        {/* Google Sheet Live Database Status */}
        <a
          href={GOOGLE_SHEET_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50/80 hover:bg-emerald-100 text-xs font-semibold shadow-xs transition-colors group cursor-pointer"
          title="Open Google Sheet Database (ID: 1KXQbrZ2D7aYJUAniQ5F3L8FeFfM8zmsMsIDHfl2An_E)"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
          <span className="text-[11px] font-bold text-emerald-800">
            {isGoogleSheetsConfigured() ? 'Sheet DB Live' : 'Google Sheet'}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <ExternalLink className="w-3 h-3 text-emerald-600 opacity-60 group-hover:opacity-100" />
        </a>
      </div>
    </header>
  );
};
