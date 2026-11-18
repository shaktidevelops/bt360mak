import React from 'react';
import { Club, Player } from '../types/database';
import { Award, TrendingUp, Sparkles, DollarSign, Swords, Target, Building2, Flame } from 'lucide-react';

interface DashboardViewProps {
  club: Club;
  squad: Player[];
  onNavigate: (tab: 'squad' | 'tactics' | 'training' | 'finances' | 'stadium') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ club, squad, onNavigate }) => {
  const wonderkids = squad.filter(p => p.is_wonderkid);
  const totalMarketVal = squad.reduce((acc, p) => acc + p.market_value, 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d282b] via-[#123639] to-[#0a2022] p-6 border border-[#204b4c] shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Sovereign Executive Operations Center</span>
            </div>
            <h2 className="text-3xl font-black text-white mt-1">
              Welcome back, Lead Tactician {club.manager}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Somnath Super Devs operations running at peak efficiency. Fan club morale is <strong className="text-amber-300">{club.fan_mood}</strong>, treasury holds <strong className="text-emerald-300">£{club.bank_balance.toLocaleString()}</strong>, and 2 wonderkids are active in Friday pop progression.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => onNavigate('tactics')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
            >
              <Swords className="w-4 h-4" /> Best XI Strategy &rarr;
            </button>
            <button 
              onClick={() => onNavigate('training')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0e272a] hover:bg-[#163c40] text-emerald-300 border border-[#255b5d] font-bold text-xs transition-all cursor-pointer"
            >
              <Target className="w-4 h-4" /> 10-Net Facility &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#10272a] border border-[#204b4c] shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Squad Valuation</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-300 mt-1">
            £{totalMarketVal.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-300 mt-1">14 Senior & Academy Players</div>
        </div>

        <div className="p-4 rounded-xl bg-[#10272a] border border-[#204b4c] shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Wonderkid Trainees</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-300 mt-1">
            {wonderkids.length} Wonderkids
          </div>
          <div className="text-[11px] text-slate-300 mt-1">Under 17yo high-velocity nets</div>
        </div>

        <div className="p-4 rounded-xl bg-[#10272a] border border-[#204b4c] shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Stadium Capacity</span>
            <Building2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black font-mono text-teal-200 mt-1">
            {club.stadium_capacity.toLocaleString()} Seats
          </div>
          <div className="text-[11px] text-slate-300 mt-1">{club.stadium_name}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#10272a] border border-[#204b4c] shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Match Form Average</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-300 mt-1">
            {club.form_avg}
          </div>
          <div className="text-[11px] text-slate-300 mt-1">Sponsor: {club.sponsor_confidence}</div>
        </div>
      </div>

      {/* Wonderkids Spotlight */}
      <div className="p-6 rounded-2xl bg-[#10272a] border border-[#204b4c] shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-extrabold text-white">Youth Academy Progression Trainees</h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-600/60 font-bold">
            17yo Friday Pop Trainees
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wonderkids.map((player) => (
            <div key={player.id} className="p-4 rounded-xl bg-[#0a181a] border border-[#204b4c] flex flex-col justify-between hover:border-emerald-600/60 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-bold">{player.id}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#163638] text-amber-300 border border-amber-600/50 font-bold">
                    Age {player.age} (Wonderkid)
                  </span>
                </div>
                <h4 className="text-base font-black text-white mt-1.5">{player.name}</h4>
                <div className="text-xs text-slate-300 mt-0.5">{player.tactical_role}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1a3c3e] grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Net</div>
                  <div className="font-bold text-emerald-300 mt-0.5">{player.active_net}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Subskill</div>
                  <div className="font-bold text-amber-300 font-mono mt-0.5">{player.subskill} / 7.0</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Market Value</div>
                  <div className="font-bold text-white font-mono mt-0.5">£{player.market_value.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
