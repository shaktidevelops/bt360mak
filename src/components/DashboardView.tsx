import React from 'react';
import { Club, Player } from '../types/database';
import { Award, TrendingUp, Users, ShieldAlert, Sparkles, DollarSign } from 'lucide-react';

interface DashboardViewProps {
  club: Club;
  squad: Player[];
  onNavigateToSquad: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ club, squad, onNavigateToSquad }) => {
  const wonderkids = squad.filter(p => p.is_wonderkid);
  const totalMarketVal = squad.reduce((acc, p) => acc + p.market_value, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-[#062922] to-teal-950 p-6 border border-emerald-800/40 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Sovereign Executive Intelligence Dashboard</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1">
              Welcome back, Tactician {club.manager}
            </h2>
            <p className="text-sm text-emerald-200/80 mt-1 max-w-2xl">
              Somnath Super Devs operations running smoothly on Supabase PostgreSQL. Fan club morale is at peak and Friday training pops are tracked.
            </p>
          </div>
          <button 
            onClick={onNavigateToSquad}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/50 transition-all self-start md:self-auto cursor-pointer"
          >
            Review 14-Man Squad &rarr;
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#06201b]/60 border border-emerald-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Squad Valuation</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-300 mt-2">
            £{totalMarketVal.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1">14 Senior & Youth Players</div>
        </div>

        <div className="p-4 rounded-xl bg-[#06201b]/60 border border-emerald-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Wonderkid Trainees</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-300 mt-2">
            {wonderkids.length} Wonderkids
          </div>
          <div className="text-xs text-slate-400 mt-1">Under 17yo high-progression nets</div>
        </div>

        <div className="p-4 rounded-xl bg-[#06201b]/60 border border-emerald-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Stadium Capacity</span>
            <Users className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-xl font-bold text-teal-200 mt-2">
            {club.stadium_capacity.toLocaleString()} Seats
          </div>
          <div className="text-xs text-slate-400 mt-1">{club.stadium_name}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#06201b]/60 border border-emerald-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Team Form Average</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-300 mt-2">
            {club.form_avg}
          </div>
          <div className="text-xs text-slate-400 mt-1">Sponsor: {club.sponsor_confidence}</div>
        </div>
      </div>

      {/* Wonderkids Spotlight */}
      <div className="p-6 rounded-2xl bg-[#06201b]/40 border border-emerald-900/40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Academy Trainee Progression</h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/50 font-semibold">
            High Priority Trainees
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wonderkids.map((player) => (
            <div key={player.id} className="p-4 rounded-xl bg-[#031512] border border-emerald-900/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-semibold">{player.id}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50 font-bold">
                    Age {player.age}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mt-1">{player.name}</h4>
                <div className="text-xs text-slate-400 mt-0.5">{player.tactical_role}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-950/80 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Active Net</div>
                  <div className="font-semibold text-emerald-300">{player.active_net}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Subskill</div>
                  <div className="font-semibold text-amber-300 font-mono">{player.subskill}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Valuation</div>
                  <div className="font-semibold text-white font-mono">£{player.market_value.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
