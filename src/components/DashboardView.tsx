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

  // Top performers
  const topRunScorer = squad.find(p => p.id === '6099470') || squad[0]; // Achintya Kharge
  const topWicketTaker = squad.find(p => p.id === '6099469') || squad[1]; // Purumitra Rishi

  return (
    <div className="space-y-6">
      {/* Sovereign Club Executive Welcome Banner - Stadium Command Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0a1820] via-[#0e242e] to-[#08151b] p-6 lg:p-7 border border-emerald-500/30 shadow-2xl">
        {/* Subtle Stadium Grid & Floodlight Glow */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:18px_18px]"></div>
        <div className="absolute top-0 right-1/4 w-80 h-32 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full cricket-ball shrink-0"></span>
              <span>Prabhas Coastal Arena &bull; Season 69 Command</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Welcome back, Lead Tactician {club.manager}</span>
              <span className="text-lg">🏏</span>
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Somnath Super Devs (#{club.id}) operational status verified. Fan club morale is <strong className="text-amber-300 font-semibold">{club.fan_mood}</strong> ({club.fan_club_members} members), treasury capital stands at <strong className="text-emerald-300 font-semibold">£{club.bank_balance.toLocaleString()}</strong>, and team morale is <strong className="text-cyan-300 font-semibold">{club.morale}</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-emerald-300 border border-emerald-500/40 shadow-sm flex items-center gap-1.5">
                <span>🏟️</span> 10,000 Capacity Arena
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-amber-300 border border-amber-500/40 shadow-sm flex items-center gap-1.5">
                <span>✨</span> 70 ITS Banked (2 Pulls Ready)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-cyan-300 border border-cyan-500/40 shadow-sm flex items-center gap-1.5">
                <span>📈</span> Form Average: {club.form_avg}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-slate-200 border border-slate-700 shadow-sm flex items-center gap-1.5">
                <span>👥</span> 14 Senior Players
              </span>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <button 
              onClick={() => onNavigate('tactics')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/80 border border-emerald-400/40 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>⚔️</span> Best XI Strategy &rarr;
            </button>
            <button 
              onClick={() => onNavigate('training')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition-all cursor-pointer shadow whitespace-nowrap"
            >
              <span>🎯</span> 10-Net Facility &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Club Executive Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl sovereign-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Treasury</span>
            <CircleDollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl lg:text-2xl font-bold font-mono text-emerald-300 mt-1">
            £{club.bank_balance.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Solvent Capital</div>
        </div>

        <div className="p-4 rounded-2xl sovereign-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Squad Val</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl lg:text-2xl font-bold font-mono text-cyan-300 mt-1">
            £{totalMarketVal.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">14 Active Players</div>
        </div>

        <div className="p-4 rounded-2xl sovereign-card-gold">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-200 uppercase tracking-wider">Wonderkids</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl lg:text-2xl font-bold font-mono text-amber-300 mt-1">
            {wonderkids.length} Wonderkids
          </div>
          <div className="text-xs text-amber-200/80 mt-0.5">17yo Prodigies</div>
        </div>

        <div className="p-4 rounded-2xl sovereign-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Stadium</span>
            <Building2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl lg:text-2xl font-bold font-mono text-white mt-1">
            {club.stadium_capacity.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-0.5 truncate">Prabhas Oval</div>
        </div>

        <div className="p-4 rounded-2xl sovereign-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Squad Form</span>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-xl lg:text-2xl font-bold font-mono text-teal-300 mt-1">
            {club.form_avg}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">High Cohesion</div>
        </div>

        <div className="p-4 rounded-2xl sovereign-card-gold">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-200 uppercase tracking-wider">ITS Reserve</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl lg:text-2xl font-bold font-mono text-amber-300 mt-1">
            {club.its_points} Lvl 20
          </div>
          <div className="text-xs text-amber-200/80 mt-0.5">2 Pulls Ready</div>
        </div>
      </div>

      {/* MATCHDAY SCOUT CENTER & NEXT FIXTURE BREAKDOWN */}
      <div className="scoreboard-panel p-6 rounded-2xl border border-emerald-500/30 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-900 text-amber-400 border border-slate-700 shadow-inner">
              <Calendar className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-amber-400 tracking-wider">Upcoming Match Fixture &bull; Pitch Analysis</span>
              <h3 className="text-lg lg:text-xl font-bold text-white flex items-center gap-2">
                <span>First Class Division VIII.17 &bull; vs Pitch Punishers</span>
                <span className="text-xs">⚔️</span>
              </h3>
            </div>
          </div>

          <span className="text-xs px-3.5 py-1.5 rounded-full bg-slate-900 text-cyan-300 border border-cyan-500/50 font-mono font-bold self-start md:self-auto shadow-md">
            📅 Fixture: 2026-11-24 &bull; 3 Days
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#050c11] p-4 rounded-xl border border-slate-800 text-xs">
          <div className="p-3.5 rounded-xl bg-[#08151f] border border-cyan-500/30">
            <span className="text-[11px] uppercase font-bold text-cyan-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Venue & 22-Yd Pitch Surface</span>
            </span>
            <div className="text-sm font-bold text-white mt-1">Away Grounds (Hard & Fast Surface)</div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              True bounce and carry. Express pace bowling boosted (+25%), seam movement active (+10%). Finger spinners face slight disadvantage (-15%).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#08151f] border border-amber-500/30">
            <span className="text-[11px] uppercase font-bold text-amber-300 flex items-center gap-1.5">
              <span>🎯</span>
              <span>Opposition Scouting Report</span>
            </span>
            <div className="text-sm font-bold text-amber-200 mt-1">Pitch Punishers (Top Order Heavy)</div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Aggressive opening pair vulnerable to swinging deliveries outside off-stump. Middle order collapses when pressured with disciplined line.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#08151f] border border-emerald-500/30">
            <span className="text-[11px] uppercase font-bold text-emerald-300 flex items-center gap-1.5">
              <span>🛡️</span>
              <span>Chief Scout Tactical Recommendation</span>
            </span>
            <div className="text-sm font-bold text-emerald-200 mt-1">Deploy 3-Seam Pace Battery</div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Open with Purumitra Rishi and Kamal Hydrose with 2 slips and 1 gully. Bring Arvind Somal as first change to squeeze dot ball pressure.
            </p>
          </div>
        </div>
      </div>

      {/* TOP PERFORMERS & MVP SPOTLIGHT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Leading Run Scorer */}
        <div className="p-5 rounded-2xl sovereign-card-gold flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🏏</span>
                <span className="text-xs font-bold uppercase text-amber-300">Season Leading Run Scorer</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#0a1820] text-amber-300 border border-amber-500/60 font-mono font-bold">
                Golden Willow MVP
              </span>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center text-2xl font-bold text-white border border-amber-400/80 shadow-md shrink-0">
                🏏
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{topRunScorer.name}</h4>
                <div className="text-xs text-amber-200/90 font-medium">{topRunScorer.tactical_role} &bull; {topRunScorer.batting_hand}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-amber-600/30 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-[#061017] border border-amber-700/40">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Runs</span>
                <div className="text-base font-bold font-mono text-emerald-300 mt-0.5">3,602</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#061017] border border-amber-700/40">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Highest</span>
                <div className="text-base font-bold font-mono text-white mt-0.5">144</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#061017] border border-amber-700/40">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Average</span>
                <div className="text-base font-bold font-mono text-amber-300 mt-0.5">38.80</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onSelectPlayer?.(topRunScorer.id);
              onNavigate('player-dossier');
            }}
            className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
          >
            <UserSquare2 className="w-3.5 h-3.5" />
            <span>Open Player Career Dossier &rarr;</span>
          </button>
        </div>

        {/* Leading Wicket Taker */}
        <div className="p-5 rounded-2xl sovereign-card-cyan flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full cricket-ball shrink-0"></span>
                <span className="text-xs font-bold uppercase text-cyan-300">Season Leading Strike Bowler</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#0a1820] text-cyan-300 border border-cyan-500/60 font-mono font-bold">
                Red Leather Ace
              </span>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-teal-900 flex items-center justify-center text-2xl font-bold text-white border border-cyan-400/80 shadow-md shrink-0">
                ⚡
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{topWicketTaker.name}</h4>
                <div className="text-xs text-cyan-200/90 font-medium flex items-center gap-1.5 mt-0.5">
                  <span>{topWicketTaker.tactical_role}</span>
                  <span className="text-cyan-400/60">&bull;</span>
                  <span className="font-mono px-1.5 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold" title={getBowlingTypeFullName(topWicketTaker.bowling_type)}>
                    {formatBowlingType(topWicketTaker.bowling_type)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-cyan-600/30 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-[#061017] border border-cyan-700/40">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Wickets</span>
                <div className="text-base font-bold font-mono text-cyan-300 mt-0.5">174</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#061017] border border-cyan-700/40">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Best Figures</span>
                <div className="text-base font-bold font-mono text-white mt-0.5">6/45</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#061017] border border-cyan-700/40">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Bowling Avg</span>
                <div className="text-base font-bold font-mono text-amber-300 mt-0.5">23.80</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onSelectPlayer?.(topWicketTaker.id);
              onNavigate('player-dossier');
            }}
            className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md border border-cyan-400/40"
          >
            <UserSquare2 className="w-3.5 h-3.5" />
            <span>Open Strike Bowler Dossier &rarr;</span>
          </button>
        </div>
      </div>

      {/* WONDERKIDS & ACADEMY PRODIGIES */}
      <div className="p-6 rounded-2xl sovereign-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <h3 className="text-base font-bold text-white">Youth Academy Wonderkids (17yo Trainees)</h3>
          </div>
          <button
            onClick={() => onNavigate('youth')}
            className="text-xs text-amber-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Youth Academy Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wonderkids.map((player) => (
            <div key={player.id} className="p-4 rounded-xl bg-[#061017] border border-amber-500/40 flex flex-col justify-between hover:border-amber-400 transition-all shadow-md">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-bold">#{player.id}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/70 font-bold flex items-center gap-1">
                    <span>✨</span> Age {player.age} Wonderkid
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mt-1.5">{player.name}</h4>
                <div className="text-xs text-slate-300 mt-0.5">{player.tactical_role}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Net</div>
                  <div className="font-bold text-emerald-300 mt-0.5">{player.active_net}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Subskill</div>
                  <div className="font-bold text-amber-300 font-mono mt-0.5">{player.subskill} / 7.0</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Valuation</div>
                  <div className="font-bold text-white font-mono mt-0.5">£{player.market_value.toLocaleString()}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectPlayer?.(player.id);
                  onNavigate('player-dossier');
                }}
                className="mt-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-600/50 text-[11px] font-bold transition-all cursor-pointer shadow-sm text-center"
              >
                Inspect Player Career Dossier &rarr;
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* BACKROOM STAFF STATUS OVERVIEW */}
      <div className="p-6 rounded-2xl sovereign-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">💼</span>
            <h3 className="text-base font-bold text-white">Backroom Science & Performance Staff</h3>
          </div>
          <button
            onClick={() => onNavigate('staff')}
            className="text-xs text-emerald-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Staff Roster Operations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          <div className="p-3.5 rounded-xl bg-[#061017] border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <span>🧠</span> Sports Psychologist
            </div>
            <div className="font-bold text-white text-sm mt-0.5">Dr. Alok Verma</div>
            <div className="text-cyan-300 font-semibold text-[11px] mt-1">+15% Mental Training</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#061017] border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <span>🏥</span> Lead Physiotherapist
            </div>
            <div className="font-bold text-white text-sm mt-0.5">Dr. Chetan Bhatt</div>
            <div className="text-emerald-300 font-semibold text-[11px] mt-1">Stamina Recovery Booster</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#061017] border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <span>🧢</span> Head Coach
            </div>
            <div className="font-bold text-white text-sm mt-0.5">Devdutt Raman</div>
            <div className="text-amber-300 font-semibold text-[11px] mt-1">1.00x Base Multiplier</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#061017] border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <span>📊</span> Financial Director
            </div>
            <div className="font-bold text-white text-sm mt-0.5">Shakti Mak</div>
            <div className="text-emerald-400 font-semibold text-[11px] mt-1">AAA Sovereign Treasury</div>
          </div>
        </div>
      </div>
    </div>
  );
};
