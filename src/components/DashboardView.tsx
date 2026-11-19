import React from 'react';
import { Club, Player } from '../types/database';
import { 
  ArrowRight, 
  UserSquare2 
} from 'lucide-react';
import { TabType } from './Sidebar';

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
      {/* Sovereign Club Executive Welcome Banner - Stadium Mountain Backdrop */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#041f17] via-[#093527] to-[#041f17] p-6 border-2 border-emerald-500/50 shadow-2xl">
        {/* Cricket Background Grid Pattern & Floodlight Aura */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute top-0 right-1/4 w-96 h-32 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
              <span className="w-3 h-3 rounded-full cricket-ball shrink-0"></span>
              <span>🏟️ Prabhas Coastal Arena &bull; Executive Command Console</span>
            </div>
            <h2 className="text-3xl font-black text-white mt-1 flex items-center gap-2">
              <span>Welcome back, Tactician {club.manager}</span>
              <span className="text-xl">🏏</span>
            </h2>
            <p className="text-xs text-slate-200 mt-1.5 max-w-2xl leading-relaxed">
              Somnath Super Devs (#{club.id}) operational status verified. Fan club morale is <strong className="text-amber-300 font-bold">{club.fan_mood}</strong> ({club.fan_club_members} members), treasury capital is <strong className="text-emerald-300 font-bold">£{club.bank_balance.toLocaleString()}</strong>, and team morale stands <strong className="text-teal-300 font-bold">{club.morale}</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-3.5">
              <span className="text-[11px] px-3 py-1 rounded-lg font-black bg-[#02130e] text-emerald-300 border border-emerald-600/70 font-mono shadow-sm flex items-center gap-1">
                <span>🏆</span> FC: {club.division_fc}
              </span>
              <span className="text-[11px] px-3 py-1 rounded-lg font-black bg-[#02130e] text-teal-300 border border-teal-600/70 font-mono shadow-sm flex items-center gap-1">
                <span>⚡</span> OD: {club.division_od}
              </span>
              <span className="text-[11px] px-3 py-1 rounded-lg font-black bg-[#02130e] text-amber-300 border border-amber-600/70 font-mono shadow-sm flex items-center gap-1">
                <span>🔥</span> T20: {club.division_t20}
              </span>
              <span className="text-[11px] px-3 py-1 rounded-lg font-bold bg-[#02130e] text-slate-200 border border-emerald-700/50 shadow-sm flex items-center gap-1">
                <span>🏔️</span> {club.region} Oval
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
            <button 
              onClick={() => onNavigate('tactics')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-xl shadow-emerald-950/80 border border-emerald-400/50 transition-all cursor-pointer"
            >
              <span>⚔️</span> Best XI Strategy &rarr;
            </button>
            <button 
              onClick={() => onNavigate('training')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#031812] hover:bg-[#072a20] text-emerald-300 border border-emerald-500/60 font-bold text-xs transition-all cursor-pointer shadow-md"
            >
              <span>🎯</span> 10-Net Facility &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Club Executive Metric Cards - Sovereign Cricket Stadium Style */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl sovereign-card border border-emerald-500/40 shadow-lg hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Treasury</span>
            <span className="text-sm">💰</span>
          </div>
          <div className="text-lg font-black font-mono text-emerald-300 mt-1">
            £{club.bank_balance.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-200/80 mt-0.5">Solvent Capital</div>
        </div>

        <div className="p-3.5 rounded-2xl sovereign-card border border-emerald-500/40 shadow-lg hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Squad Val</span>
            <span className="text-sm">👥</span>
          </div>
          <div className="text-lg font-black font-mono text-emerald-300 mt-1">
            £{totalMarketVal.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-200/80 mt-0.5">14 Active Players</div>
        </div>

        <div className="p-3.5 rounded-2xl sovereign-card-gold border border-amber-500/50 shadow-lg hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-amber-200 uppercase tracking-wider">Wonderkids</span>
            <span className="text-sm">✨</span>
          </div>
          <div className="text-lg font-black font-mono text-amber-300 mt-1">
            {wonderkids.length} Wonderkids
          </div>
          <div className="text-[10px] text-amber-200/80 mt-0.5">17yo Prodigies</div>
        </div>

        <div className="p-3.5 rounded-2xl sovereign-card border border-emerald-500/40 shadow-lg hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Stadium</span>
            <span className="text-sm">🏟️</span>
          </div>
          <div className="text-lg font-black font-mono text-teal-200 mt-1">
            {club.stadium_capacity.toLocaleString()}
          </div>
          <div className="text-[10px] text-teal-200/80 mt-0.5 truncate">Prabhas Oval</div>
        </div>

        <div className="p-3.5 rounded-2xl sovereign-card border border-emerald-500/40 shadow-lg hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Squad Form</span>
            <span className="text-sm">📈</span>
          </div>
          <div className="text-lg font-black text-emerald-300 mt-1">
            {club.form_avg}
          </div>
          <div className="text-[10px] text-emerald-200/80 mt-0.5">High Cohesion</div>
        </div>

        <div className="p-3.5 rounded-2xl sovereign-card-gold border border-amber-500/50 shadow-lg hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-amber-200 uppercase tracking-wider">ITS Points</span>
            <span className="text-sm">🌟</span>
          </div>
          <div className="text-lg font-black font-mono text-amber-300 mt-1">
            {club.its_points} Lvl 20
          </div>
          <div className="text-[10px] text-amber-200/80 mt-0.5">Youth Academy</div>
        </div>
      </div>

      {/* MATCHDAY SCOUT CENTER & NEXT FIXTURE BREAKDOWN */}
      <div className="scoreboard-panel p-6 rounded-2xl border-2 border-emerald-600/50 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#041a14] text-amber-400 border border-emerald-600/50 shadow-inner">
              <span className="text-xl">🏆</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-black text-amber-400 tracking-wider">Upcoming Match Fixture &bull; Pitch Analysis</span>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <span>First Class Division VIII.17 &bull; vs Pitch Punishers</span>
                <span className="text-xs">⚔️</span>
              </h3>
            </div>
          </div>

          <span className="text-xs px-3.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-400/80 font-mono font-black self-start md:self-auto shadow-md">
            📅 Fixture: 2026-11-24 &bull; 3 Days
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#03140f]/90 p-4 rounded-xl border border-emerald-700/50 text-xs">
          <div className="p-3 rounded-lg bg-[#051c15] border border-emerald-800/60">
            <span className="text-[10px] uppercase font-black text-slate-300 flex items-center gap-1">
              <span>🏟️</span> Venue & 22-Yd Pitch Surface
            </span>
            <div className="text-sm font-black text-white mt-1">Away Grounds (Hard & Fast Surface)</div>
            <p className="text-[11px] text-emerald-200/90 mt-1 leading-relaxed">
              True bounce and carry. Express pace bowling boosted (+25%), seam movement active (+15%). Finger spinners face slight disadvantage (-15%).
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#051c15] border border-emerald-800/60">
            <span className="text-[10px] uppercase font-black text-slate-300 flex items-center gap-1">
              <span>🎯</span> Opposition Scouting Report
            </span>
            <div className="text-sm font-black text-amber-300 mt-1">Pitch Punishers (Top Order Heavy)</div>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Aggressive opening pair vulnerable to swinging deliveries outside off-stump. Middle order collapses when pressured with disciplined line.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#051c15] border border-emerald-800/60">
            <span className="text-[10px] uppercase font-black text-slate-300 flex items-center gap-1">
              <span>🛡️</span> Chief Scout Tactical Recommendation
            </span>
            <div className="text-sm font-black text-emerald-300 mt-1">Deploy 3-Seam Pace Battery</div>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Open with Purumitra Rishi and Kamal Hydrose with 2 slips and 1 gully. Bring Arvind Somal as first change to squeeze dot ball pressure.
            </p>
          </div>
        </div>
      </div>

      {/* TOP PERFORMERS & MVP SPOTLIGHT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Leading Run Scorer */}
        <div className="p-5 rounded-2xl sovereign-card-gold border border-amber-500/50 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🏏</span>
                <span className="text-xs font-black uppercase text-amber-300">Season Leading Run Scorer</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#051c15] text-amber-300 border border-amber-500/70 font-mono font-black">
                Golden Willow MVP
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center text-2xl font-bold text-white border-2 border-amber-400 shadow-md shrink-0">
                🏏
              </div>
              <div>
                <h4 className="text-base font-black text-white">{topRunScorer.name}</h4>
                <div className="text-xs text-amber-200/90 font-medium">{topRunScorer.tactical_role} &bull; {topRunScorer.batting_hand}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-amber-600/30 text-center text-xs">
              <div className="p-2 rounded-lg bg-[#03150f] border border-amber-700/40">
                <span className="text-[10px] text-slate-400 uppercase font-black">Runs</span>
                <div className="text-base font-black font-mono text-emerald-300 mt-0.5">3,602</div>
              </div>
              <div className="p-2 rounded-lg bg-[#03150f] border border-amber-700/40">
                <span className="text-[10px] text-slate-400 uppercase font-black">Highest</span>
                <div className="text-base font-black font-mono text-white mt-0.5">144</div>
              </div>
              <div className="p-2 rounded-lg bg-[#03150f] border border-amber-700/40">
                <span className="text-[10px] text-slate-400 uppercase font-black">Average</span>
                <div className="text-base font-black font-mono text-amber-300 mt-0.5">38.80</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onSelectPlayer?.(topRunScorer.id);
              onNavigate('player-dossier');
            }}
            className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg"
          >
            <UserSquare2 className="w-3.5 h-3.5" />
            <span>Open Player Career Dossier &rarr;</span>
          </button>
        </div>

        {/* Leading Wicket Taker */}
        <div className="p-5 rounded-2xl sovereign-card border border-teal-500/50 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full cricket-ball shrink-0"></span>
                <span className="text-xs font-black uppercase text-teal-300">Season Leading Strike Bowler</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#051c15] text-teal-300 border border-teal-500/70 font-mono font-black">
                Red Leather Ace
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-600 to-teal-950 flex items-center justify-center text-2xl font-bold text-white border-2 border-teal-400 shadow-md shrink-0">
                ⚡
              </div>
              <div>
                <h4 className="text-base font-black text-white">{topWicketTaker.name}</h4>
                <div className="text-xs text-teal-200/90 font-medium">{topWicketTaker.tactical_role} &bull; {topWicketTaker.bowling_type}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-teal-600/30 text-center text-xs">
              <div className="p-2 rounded-lg bg-[#03150f] border border-teal-700/40">
                <span className="text-[10px] text-slate-400 uppercase font-black">Wickets</span>
                <div className="text-base font-black font-mono text-teal-300 mt-0.5">174</div>
              </div>
              <div className="p-2 rounded-lg bg-[#03150f] border border-teal-700/40">
                <span className="text-[10px] text-slate-400 uppercase font-black">Best Figures</span>
                <div className="text-base font-black font-mono text-white mt-0.5">6/45</div>
              </div>
              <div className="p-2 rounded-lg bg-[#03150f] border border-teal-700/40">
                <span className="text-[10px] text-slate-400 uppercase font-black">Bowling Avg</span>
                <div className="text-base font-black font-mono text-amber-300 mt-0.5">23.80</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onSelectPlayer?.(topWicketTaker.id);
              onNavigate('player-dossier');
            }}
            className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-500 hover:to-emerald-600 text-white font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg"
          >
            <UserSquare2 className="w-3.5 h-3.5" />
            <span>Open Strike Bowler Dossier &rarr;</span>
          </button>
        </div>
      </div>

      {/* WONDERKIDS & ACADEMY PRODIGIES */}
      <div className="p-6 rounded-2xl sovereign-card border border-emerald-600/40 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <h3 className="text-base font-black text-white">Youth Academy Wonderkids (17yo Trainees)</h3>
          </div>
          <button
            onClick={() => onNavigate('youth')}
            className="text-xs text-amber-300 hover:text-white font-black flex items-center gap-1 cursor-pointer"
          >
            <span>Youth Academy ITS Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wonderkids.map((player) => (
            <div key={player.id} className="p-4 rounded-xl bg-[#041d16] border border-amber-500/40 flex flex-col justify-between hover:border-amber-400 transition-all shadow-md">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-black">#{player.id}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/70 font-black flex items-center gap-1">
                    <span>✨</span> Age {player.age} Wonderkid
                  </span>
                </div>
                <h4 className="text-base font-black text-white mt-1.5">{player.name}</h4>
                <div className="text-xs text-emerald-200/90 mt-0.5">{player.tactical_role}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-800/40 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-black">Active Net</div>
                  <div className="font-bold text-emerald-300 mt-0.5">{player.active_net}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-black">Subskill</div>
                  <div className="font-black text-amber-300 font-mono mt-0.5">{player.subskill} / 7.0</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-black">Valuation</div>
                  <div className="font-black text-white font-mono mt-0.5">£{player.market_value.toLocaleString()}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectPlayer?.(player.id);
                  onNavigate('player-dossier');
                }}
                className="mt-3 py-2 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/60 text-[11px] font-black transition-all cursor-pointer shadow-sm text-center"
              >
                Inspect Player Career Dossier &rarr;
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* BACKROOM STAFF STATUS OVERVIEW */}
      <div className="p-6 rounded-2xl cricket-turf-card border border-emerald-600/40 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">💼</span>
            <h3 className="text-base font-black text-white">Backroom Science & Performance Staff</h3>
          </div>
          <button
            onClick={() => onNavigate('staff')}
            className="text-xs text-emerald-300 hover:text-white font-black flex items-center gap-1 cursor-pointer"
          >
            <span>Staff Roster Operations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#031812] border border-emerald-700/50">
            <div className="text-[10px] uppercase font-black text-slate-400 flex items-center gap-1">
              <span>🧠</span> Sports Psychologist
            </div>
            <div className="font-black text-white text-sm mt-0.5">Dr. Alok Verma</div>
            <div className="text-teal-300 font-bold text-[11px] mt-1">+15% Mental Training</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#031812] border border-emerald-700/50">
            <div className="text-[10px] uppercase font-black text-slate-400 flex items-center gap-1">
              <span>🏥</span> Lead Physiotherapist
            </div>
            <div className="font-black text-white text-sm mt-0.5">Dr. Chetan Bhatt</div>
            <div className="text-emerald-300 font-bold text-[11px] mt-1">Stamina Recovery Booster</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#031812] border border-emerald-700/50">
            <div className="text-[10px] uppercase font-black text-slate-400 flex items-center gap-1">
              <span>🧢</span> Head Coach
            </div>
            <div className="font-black text-white text-sm mt-0.5">Devdutt Raman</div>
            <div className="text-amber-300 font-bold text-[11px] mt-1">1.00x Base Multiplier</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#031812] border border-emerald-700/50">
            <div className="text-[10px] uppercase font-black text-slate-400 flex items-center gap-1">
              <span>📊</span> Financial Director
            </div>
            <div className="font-black text-white text-sm mt-0.5">Shakti Mak</div>
            <div className="text-emerald-400 font-bold text-[11px] mt-1">AAA Sovereign Treasury</div>
          </div>
        </div>
      </div>
    </div>
  );
};
