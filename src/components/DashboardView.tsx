import React from 'react';
import { Club, Player } from '../types/database';
import { 
  ArrowRight, 
  UserSquare2, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Award, 
  Zap, 
  Building2, 
  CircleDollarSign, 
  Users 
} from 'lucide-react';
import { TabType } from './Sidebar';
import { formatBowlingType, getBowlingTypeFullName } from '../lib/cricketFormatters';

interface DashboardViewProps {
  club: Club;
  squad: Player[];
  onNavigate: (tab: TabType) => void;
  onSelectPlayer?: (playerId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  club, 
  squad, 
  onNavigate,
  onSelectPlayer
}) => {
  const wonderkids = squad.filter(p => p.is_wonderkid);
  const totalMarketVal = squad.reduce((acc, p) => acc + p.market_value, 0);

  // Dynamically calculate batting leader from squad
  const sortedBatters = [...squad].sort((a, b) => {
    const runsA = (a.statsFC?.runs || 0) + (a.statsOD?.runs || 0) + (a.statsT20?.runs || 0);
    const runsB = (b.statsFC?.runs || 0) + (b.statsOD?.runs || 0) + (b.statsT20?.runs || 0);
    return runsB - runsA;
  });
  const topRunScorer = sortedBatters[0] || squad[0];
  const topRuns = (topRunScorer?.statsFC?.runs || 0) + (topRunScorer?.statsOD?.runs || 0) + (topRunScorer?.statsT20?.runs || 0);

  // Dynamically calculate bowling leader from squad
  const sortedBowlers = [...squad].sort((a, b) => {
    const wktsA = (a.statsFC?.wickets || 0) + (a.statsOD?.wickets || 0) + (a.statsT20?.wickets || 0);
    const wktsB = (b.statsFC?.wickets || 0) + (b.statsOD?.wickets || 0) + (b.statsT20?.wickets || 0);
    return wktsB - wktsA;
  });
  const topWicketTaker = sortedBowlers[0] || squad[1];
  const topWickets = (topWicketTaker?.statsFC?.wickets || 0) + (topWicketTaker?.statsOD?.wickets || 0) + (topWicketTaker?.statsT20?.wickets || 0);

  return (
    <div className="space-y-6">
      {/* Sovereign Club Executive Welcome Banner - Daylight Cricket Pavilion Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white p-6 lg:p-7 border border-emerald-300 shadow-md">
        {/* Subtle Cricket Pitch Grid Accents */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
              <span className="w-2.5 h-2.5 rounded-full cricket-ball shrink-0"></span>
              <span>Prabhas Coastal Arena &bull; Season 69 Command</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2 flex-wrap">
              <span>Welcome back, Lead Tactician {club.manager}</span>
              <span className="text-lg">🏏</span>
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Somnath Super Devs (#{club.id}) operational status verified. Fan club morale is <strong className="text-amber-800 font-bold">{club.fan_mood}</strong> ({club.fan_club_members} members), treasury capital stands at <strong className="text-emerald-800 font-bold">£{club.bank_balance.toLocaleString()}</strong>, and team morale is <strong className="text-teal-800 font-bold">{club.morale}</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-white text-emerald-800 border border-emerald-200 shadow-xs flex items-center gap-1.5 font-bold">
                <span>🏟️</span> 10,000 Capacity Arena
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white text-amber-800 border border-amber-200 shadow-xs flex items-center gap-1.5 font-bold">
                <span>✨</span> 70 ITS Banked (2 Pulls Ready)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white text-teal-800 border border-teal-200 shadow-xs flex items-center gap-1.5 font-bold">
                <span>📈</span> Form Average: {club.form_avg}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white text-slate-700 border border-slate-200 shadow-xs flex items-center gap-1.5 font-bold">
                <span>👥</span> 14 Senior Players
              </span>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <button 
              onClick={() => onNavigate('tactics')}
              className="btn-cricket-emerald flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              <span>⚔️</span> Best XI Strategy &rarr;
            </button>
            <button 
              onClick={() => onNavigate('training')}
              className="btn-cricket-white flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-xs whitespace-nowrap"
            >
              <span>🎯</span> 10-Net Facility &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Club Executive Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-3.5">
        <div className="p-3.5 rounded-2xl sovereign-card min-w-0" title={`£${club.bank_balance.toLocaleString()}`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Treasury</span>
            <CircleDollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
          <div className="text-sm sm:text-base xl:text-[17px] font-black font-mono text-emerald-700 mt-1 whitespace-nowrap">
            £{club.bank_balance.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-0.5 truncate">Solvent Capital</div>
        </div>

        <div className="p-3.5 rounded-2xl sovereign-card min-w-0" title={`£${totalMarketVal.toLocaleString()}`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Squad Val</span>
            <Users className="w-4 h-4 text-teal-600 shrink-0" />
          </div>
          <div className="text-sm sm:text-base xl:text-[17px] font-black font-mono text-teal-700 mt-1 whitespace-nowrap">
            £{totalMarketVal.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-0.5 truncate">14 Active Squad</div>
        </div>

        <div className="p-3.5 rounded-2xl sovereign-card-gold min-w-0" title={`${wonderkids.length} Wonderkid Trainees`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Wonderkids</span>
            <Award className="w-4 h-4 text-amber-600 shrink-0" />
          </div>
          <div className="text-sm sm:text-base xl:text-[17px] font-black font-mono text-amber-800 mt-1 whitespace-nowrap">
            {wonderkids.length} Trainees
          </div>
          <div className="text-xs text-amber-700 mt-0.5 truncate">17yo Prodigies</div>
        </div>

        <div className="p-3.5 rounded-2xl sovereign-card min-w-0" title={`${club.stadium_capacity.toLocaleString()} Capacity`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Stadium</span>
            <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
          <div className="text-sm sm:text-base xl:text-[17px] font-black font-mono text-slate-900 mt-1 whitespace-nowrap">
            {club.stadium_capacity.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-0.5 truncate">Prabhas Oval</div>
        </div>

        <div className="p-3.5 rounded-2xl sovereign-card min-w-0" title={`Form Average: ${club.form_avg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Squad Form</span>
            <TrendingUp className="w-4 h-4 text-teal-600 shrink-0" />
          </div>
          <div className="text-sm sm:text-base xl:text-[17px] font-black font-mono text-teal-700 mt-1 whitespace-nowrap">
            {club.form_avg}
          </div>
          <div className="text-xs text-slate-500 mt-0.5 truncate">High Cohesion</div>
        </div>

        <div className="p-3.5 rounded-2xl sovereign-card-gold min-w-0" title="70 ITS Level 20 Banked">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">ITS Reserve</span>
            <Zap className="w-4 h-4 text-amber-600 shrink-0" />
          </div>
          <div className="text-sm sm:text-base xl:text-[17px] font-black font-mono text-amber-800 mt-1 whitespace-nowrap">
            70 ITS
          </div>
          <div className="text-xs text-amber-700 mt-0.5 truncate">Lvl 20 &bull; 2 Pulls</div>
        </div>
      </div>

      {/* MATCHDAY SCOUT CENTER & NEXT FIXTURE BREAKDOWN */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 shadow-xs">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-amber-700 tracking-wider">Next Match Fixture &bull; Pitch Analysis</span>
              <h3 className="text-lg lg:text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>First Class Division VIII.17 &bull; Season Schedule Ready</span>
                <span className="text-xs">⚔️</span>
              </h3>
            </div>
          </div>

          <span className="text-xs px-3.5 py-1.5 rounded-full bg-slate-100 text-teal-800 border border-teal-300 font-mono font-bold self-start md:self-auto shadow-xs">
            📅 Battrick S69 Fixtures
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div className="p-3.5 rounded-xl bg-white border border-cyan-200">
            <span className="text-[11px] uppercase font-bold text-cyan-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-600" />
              <span>Venue & 22-Yd Pitch Surface</span>
            </span>
            <div className="text-sm font-bold text-slate-900 mt-1">Prabhas Coastal Oval (Hard & Fast)</div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              True bounce and carry. Express pace bowling boosted (+25%), seam movement active (+10%). Top-order concentration thrives.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-amber-200">
            <span className="text-[11px] uppercase font-bold text-amber-800 flex items-center gap-1.5">
              <span>🎯</span>
              <span>Squad Match Preparedness</span>
            </span>
            <div className="text-sm font-bold text-slate-900 mt-1">14-Man Squad Registered & Primed</div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Upload match scorecards in the Import Hub to dynamically track batting averages, bowling figures, and milestones.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-emerald-200">
            <span className="text-[11px] uppercase font-bold text-emerald-800 flex items-center gap-1.5">
              <span>🛡️</span>
              <span>Match Orders Directive</span>
            </span>
            <div className="text-sm font-bold text-emerald-800 mt-1">Tactics Engine Active</div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Use the Best XI Optimizer to assign aggression, field setup, and 5-bowler spells before each fixture.
            </p>
          </div>
        </div>
      </div>

      {/* SEASON MVP SPOTLIGHT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Leading Run Scorer Card */}
        <div className="p-5 rounded-2xl sovereign-card-gold flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">🏏</span>
                <span className="text-xs font-bold uppercase text-amber-800">Season Leading Batsman</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-mono font-bold">
                {topRuns > 0 ? 'Golden Willow MVP' : 'Awaiting Matchday Data'}
              </span>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-2xl font-bold text-white shadow-sm shrink-0">
                🏏
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">{topRunScorer.name}</h4>
                <div className="text-xs text-amber-800 font-medium">{topRunScorer.tactical_role} &bull; {topRunScorer.batting_hand}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-amber-200 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-amber-200 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Runs</span>
                <div className="text-base font-bold font-mono text-emerald-700 mt-0.5">
                  {topRuns > 0 ? topRuns.toLocaleString() : '0'}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-amber-200 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Highest</span>
                <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                  {topRunScorer.statsFC?.highestScore || '-'}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-amber-200 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Average</span>
                <div className="text-base font-bold font-mono text-amber-700 mt-0.5">
                  {topRunScorer.statsFC?.average ? topRunScorer.statsFC.average.toFixed(2) : '0.00'}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onSelectPlayer?.(topRunScorer.id);
              onNavigate('player-dossier');
            }}
            className="mt-4 w-full py-2.5 rounded-xl btn-cricket-amber text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <UserSquare2 className="w-3.5 h-3.5 text-white" />
            <span>Open Player Career Dossier &rarr;</span>
          </button>
        </div>

        {/* Leading Wicket Taker Card */}
        <div className="p-5 rounded-2xl sovereign-card-cyan flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full cricket-ball shrink-0"></span>
                <span className="text-xs font-bold uppercase text-cyan-800">Season Leading Strike Bowler</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300 font-mono font-bold">
                {topWickets > 0 ? 'Red Leather Ace' : 'Awaiting Matchday Data'}
              </span>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-teal-800 flex items-center justify-center text-2xl font-bold text-white shadow-sm shrink-0">
                ⚡
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">{topWicketTaker.name}</h4>
                <div className="text-xs text-cyan-800 font-medium flex items-center gap-1.5 mt-0.5">
                  <span>{topWicketTaker.tactical_role}</span>
                  <span className="text-cyan-600">&bull;</span>
                  <span className="font-mono px-1.5 py-0.5 rounded text-[10px] bg-cyan-100 text-cyan-900 border border-cyan-400 font-bold" title={getBowlingTypeFullName(topWicketTaker.bowling_type)}>
                    {formatBowlingType(topWicketTaker.bowling_type)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-cyan-200 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-cyan-200 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Wickets</span>
                <div className="text-base font-bold font-mono text-cyan-800 mt-0.5">
                  {topWickets > 0 ? topWickets.toLocaleString() : '0'}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-cyan-200 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Best Figures</span>
                <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                  {topWicketTaker.statsFC?.bestBowling || '-'}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-cyan-200 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Bowling Avg</span>
                <div className="text-base font-bold font-mono text-amber-700 mt-0.5">
                  {topWicketTaker.statsFC?.bowlingAverage ? topWicketTaker.statsFC.bowlingAverage.toFixed(2) : '0.00'}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onSelectPlayer?.(topWicketTaker.id);
              onNavigate('player-dossier');
            }}
            className="mt-4 w-full py-2.5 rounded-xl btn-cricket-teal text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <UserSquare2 className="w-3.5 h-3.5 text-white" />
            <span>Open Strike Bowler Dossier &rarr;</span>
          </button>
        </div>
      </div>

      {/* WONDERKID ACADEMY PORTAL */}
      <div className="sovereign-card p-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-700">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Somnath Super Devs Superb Academy Prodigies</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              Active Wonderkids Fast-Track Pipeline ({wonderkids.length})
            </h3>
          </div>

          <button
            onClick={() => onNavigate('youth')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer self-start sm:self-auto border border-emerald-500"
          >
            <span>Youth Draft & ITS &rarr;</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {wonderkids.map((kid) => (
            <div 
              key={kid.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between gap-4 shadow-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900">{kid.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold font-mono">
                    17yo Prodigy
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {kid.tactical_role} &bull; <span className="font-mono font-semibold text-slate-700">{kid.batting_hand}</span> &bull; <span className="font-mono text-cyan-800 font-bold">{formatBowlingType(kid.bowling_type)}</span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs font-mono">
                  <span className="text-slate-600">BTI: <strong className="text-emerald-700 font-bold">{kid.bti.toLocaleString()}</strong></span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-slate-600">Subskill: <strong className="text-amber-700 font-bold">{kid.subskill}</strong></span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-slate-600">Wage: <strong className="text-slate-800 font-bold">£{kid.wage}/wk</strong></span>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectPlayer?.(kid.id);
                  onNavigate('player-dossier');
                }}
                className="p-2.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 transition-all cursor-pointer shrink-0 shadow-xs"
                title="Inspect Wonderkid Dossier"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
