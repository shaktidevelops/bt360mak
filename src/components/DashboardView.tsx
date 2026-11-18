import React from 'react';
import { Club, Player } from '../types/database';
import { 
  Award, 
  TrendingUp, 
  Sparkles, 
  DollarSign, 
  Swords, 
  Target, 
  Building2, 
  Flame, 
  Calendar, 
  Users, 
  Medal, 
  Brain, 
  MapPin, 
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
      {/* Sovereign Club Executive Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0e2c24] via-[#154236] to-[#0a201a] p-6 border border-emerald-600/40 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Sovereign Executive Operations Command</span>
            </div>
            <h2 className="text-3xl font-black text-white mt-1">
              Welcome back, Lead Tactician {club.manager}
            </h2>
            <p className="text-xs text-slate-200 mt-1 max-w-2xl leading-relaxed">
              Somnath Super Devs (#{club.id}) operational performance is verified. Fan club morale is <strong className="text-amber-300">{club.fan_mood}</strong> ({club.fan_club_members} members), treasury holds <strong className="text-emerald-300">£{club.bank_balance.toLocaleString()}</strong>, and team morale stands <strong className="text-teal-300">{club.morale}</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-[11px] px-2.5 py-0.5 rounded-md font-bold bg-[#061713] text-emerald-300 border border-emerald-700/60 font-mono">
                FC: {club.division_fc}
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-md font-bold bg-[#061713] text-teal-300 border border-teal-700/60 font-mono">
                OD: {club.division_od}
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-md font-bold bg-[#061713] text-amber-300 border border-amber-700/60 font-mono">
                T20: {club.division_t20}
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-md font-bold bg-[#061713] text-slate-300 border border-emerald-800/40">
                📍 {club.region}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
            <button 
              onClick={() => onNavigate('tactics')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-950/80 transition-all cursor-pointer"
            >
              <Swords className="w-4 h-4" /> Best XI Strategy &rarr;
            </button>
            <button 
              onClick={() => onNavigate('training')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#061713] hover:bg-[#0c241e] text-emerald-300 border border-emerald-600/50 font-bold text-xs transition-all cursor-pointer"
            >
              <Target className="w-4 h-4 text-emerald-400" /> 10-Net Facility &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Club Executive Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-[#0e2c24] border border-emerald-600/30 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Treasury</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-black font-mono text-emerald-300 mt-1">
            £{club.bank_balance.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-300 mt-0.5">Solvent Capital</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0e2c24] border border-emerald-600/30 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Squad Valuation</span>
            <Users className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-black font-mono text-emerald-300 mt-1">
            £{totalMarketVal.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-300 mt-0.5">14 Active Players</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0e2c24] border border-emerald-600/30 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Wonderkids</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-black font-mono text-amber-300 mt-1">
            {wonderkids.length} Wonderkids
          </div>
          <div className="text-[10px] text-slate-300 mt-0.5">17yo Prodigies</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0e2c24] border border-emerald-600/30 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Stadium</span>
            <Building2 className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="text-lg font-black font-mono text-teal-200 mt-1">
            {club.stadium_capacity.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-300 mt-0.5 truncate">Prabhas Oval</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0e2c24] border border-emerald-600/30 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Squad Form</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-black text-emerald-300 mt-1">
            {club.form_avg}
          </div>
          <div className="text-[10px] text-slate-300 mt-0.5">High Cohesion</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0e2c24] border border-emerald-600/30 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">ITS Points</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-black font-mono text-amber-300 mt-1">
            {club.its_points} Level 20
          </div>
          <div className="text-[10px] text-slate-300 mt-0.5">Youth Academy</div>
        </div>
      </div>

      {/* MATCHDAY SCOUT CENTER & NEXT FIXTURE BREAKDOWN */}
      <div className="bg-[#0e2c24] p-6 rounded-2xl border border-emerald-600/30 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#061713] text-emerald-400 border border-emerald-800/40">
              <Calendar className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400">Next Upcoming Match Fixture</span>
              <h3 className="text-xl font-black text-white">First Class Division VIII.17 &bull; vs Pitch Punishers</h3>
            </div>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-teal-950 text-teal-300 border border-teal-500/70 font-mono font-bold self-start md:self-auto">
            Fixture Date: 2026-11-24 &bull; 3 Days
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#061713] p-4 rounded-xl border border-emerald-800/40 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" /> Venue & Pitch Surface
            </span>
            <div className="text-sm font-bold text-white mt-1">Away Grounds (Hard & Fast Surface)</div>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              True bounce and carry. Express pace bowling boosted (+25%), seam movement active (+15%). Finger spinners face slight disadvantage (-15%).
            </p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Opposition Scouting Report</span>
            <div className="text-sm font-bold text-amber-300 mt-1">Pitch Punishers (Strength: Top Order)</div>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Aggressive opening pair vulnerable to swinging deliveries outside off-stump. Middle order collapses when pressured with disciplined line.
            </p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Chief Scout Tactical Recommendation</span>
            <div className="text-sm font-bold text-emerald-300 mt-1">Deploy 3-Seam Pace Battery</div>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Open with Purumitra Rishi and Kamal Hydrose with 2 slips and 1 gully. Bring Arvind Somal as first change to squeeze dot ball pressure.
            </p>
          </div>
        </div>
      </div>

      {/* TOP PERFORMERS & MVP SPOTLIGHT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Leading Run Scorer */}
        <div className="p-5 rounded-2xl bg-[#0e2c24] border border-emerald-600/30 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Medal className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-black uppercase text-amber-400">Season Leading Run Scorer</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-[#061713] text-amber-300 border border-amber-600/50 font-mono font-bold">
                MVP Batter
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center text-xl font-bold text-white border border-amber-400/40 shrink-0">
                🏏
              </div>
              <div>
                <h4 className="text-base font-black text-white">{topRunScorer.name}</h4>
                <div className="text-xs text-slate-300">{topRunScorer.tactical_role} &bull; {topRunScorer.batting_hand}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-emerald-800/40 text-center text-xs">
              <div className="p-2 rounded-lg bg-[#061713] border border-emerald-800/40">
                <span className="text-[10px] text-slate-400 uppercase">Runs</span>
                <div className="text-base font-black font-mono text-emerald-300 mt-0.5">3,602</div>
              </div>
              <div className="p-2 rounded-lg bg-[#061713] border border-emerald-800/40">
                <span className="text-[10px] text-slate-400 uppercase">Highest</span>
                <div className="text-base font-black font-mono text-white mt-0.5">144</div>
              </div>
              <div className="p-2 rounded-lg bg-[#061713] border border-emerald-800/40">
                <span className="text-[10px] text-slate-400 uppercase">Average</span>
                <div className="text-base font-black font-mono text-amber-300 mt-0.5">38.80</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onSelectPlayer?.(topRunScorer.id);
              onNavigate('player-dossier');
            }}
            className="mt-4 w-full py-2 rounded-xl bg-[#061713] hover:bg-emerald-950 text-emerald-300 border border-emerald-700/50 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <UserSquare2 className="w-3.5 h-3.5" />
            <span>Open Cricinfo Dossier</span>
          </button>
        </div>

        {/* Leading Wicket Taker */}
        <div className="p-5 rounded-2xl bg-[#0e2c24] border border-emerald-600/30 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-teal-400" />
                <span className="text-xs font-black uppercase text-teal-400">Season Leading Strike Bowler</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-[#061713] text-teal-300 border border-teal-600/50 font-mono font-bold">
                Strike Pacer
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-600 to-teal-950 flex items-center justify-center text-xl font-bold text-white border border-teal-400/40 shrink-0">
                ⚡
              </div>
              <div>
                <h4 className="text-base font-black text-white">{topWicketTaker.name}</h4>
                <div className="text-xs text-slate-300">{topWicketTaker.tactical_role} &bull; {topWicketTaker.bowling_type}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-emerald-800/40 text-center text-xs">
              <div className="p-2 rounded-lg bg-[#061713] border border-emerald-800/40">
                <span className="text-[10px] text-slate-400 uppercase">Wickets</span>
                <div className="text-base font-black font-mono text-teal-300 mt-0.5">174</div>
              </div>
              <div className="p-2 rounded-lg bg-[#061713] border border-emerald-800/40">
                <span className="text-[10px] text-slate-400 uppercase">Best Bowling</span>
                <div className="text-base font-black font-mono text-white mt-0.5">6/45</div>
              </div>
              <div className="p-2 rounded-lg bg-[#061713] border border-emerald-800/40">
                <span className="text-[10px] text-slate-400 uppercase">Bowling Avg</span>
                <div className="text-base font-black font-mono text-amber-300 mt-0.5">23.80</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onSelectPlayer?.(topWicketTaker.id);
              onNavigate('player-dossier');
            }}
            className="mt-4 w-full py-2 rounded-xl bg-[#061713] hover:bg-teal-950 text-teal-300 border border-teal-700/50 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <UserSquare2 className="w-3.5 h-3.5" />
            <span>Open Cricinfo Dossier</span>
          </button>
        </div>
      </div>

      {/* WONDERKIDS & ACADEMY PRODIGIES */}
      <div className="p-6 rounded-2xl bg-[#0e2c24] border border-emerald-600/30 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-black text-white">Youth Academy Wonderkids (17yo Trainees)</h3>
          </div>
          <button
            onClick={() => onNavigate('youth')}
            className="text-xs text-amber-300 hover:text-white font-bold flex items-center gap-1"
          >
            <span>Youth Academy ITS Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wonderkids.map((player) => (
            <div key={player.id} className="p-4 rounded-xl bg-[#061713] border border-emerald-800/40 flex flex-col justify-between hover:border-amber-500/50 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-bold">{player.id}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600/50 font-bold">
                    Age {player.age} (Wonderkid)
                  </span>
                </div>
                <h4 className="text-base font-black text-white mt-1.5">{player.name}</h4>
                <div className="text-xs text-slate-300 mt-0.5">{player.tactical_role}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-800/30 grid grid-cols-3 gap-2 text-center text-xs">
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

              <button
                onClick={() => {
                  onSelectPlayer?.(player.id);
                  onNavigate('player-dossier');
                }}
                className="mt-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 text-[11px] font-bold transition-all cursor-pointer"
              >
                Inspect Cricinfo Career Stats &rarr;
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* BACKROOM STAFF STATUS OVERVIEW */}
      <div className="p-6 rounded-2xl bg-[#0e2c24] border border-emerald-600/30 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-black text-white">Backroom Science & Performance Staff</h3>
          </div>
          <button
            onClick={() => onNavigate('staff')}
            className="text-xs text-emerald-300 hover:text-white font-bold flex items-center gap-1"
          >
            <span>Staff Roster Operations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#061713] border border-emerald-800/40">
            <div className="text-[10px] uppercase font-bold text-slate-400">Sports Psychologist</div>
            <div className="font-black text-white text-sm mt-0.5">Dr. Alok Verma</div>
            <div className="text-teal-300 font-bold text-[11px] mt-1">+15% Mental Training</div>
          </div>

          <div className="p-3 rounded-xl bg-[#061713] border border-emerald-800/40">
            <div className="text-[10px] uppercase font-bold text-slate-400">Lead Physiotherapist</div>
            <div className="font-black text-white text-sm mt-0.5">Dr. Chetan Bhatt</div>
            <div className="text-emerald-300 font-bold text-[11px] mt-1">Stamina Recovery Booster</div>
          </div>

          <div className="p-3 rounded-xl bg-[#061713] border border-emerald-800/40">
            <div className="text-[10px] uppercase font-bold text-slate-400">Head Coach</div>
            <div className="font-black text-white text-sm mt-0.5">Devdutt Raman</div>
            <div className="text-amber-300 font-bold text-[11px] mt-1">1.00x Base Multiplier</div>
          </div>

          <div className="p-3 rounded-xl bg-[#061713] border border-emerald-800/40">
            <div className="text-[10px] uppercase font-bold text-slate-400">Financial Director</div>
            <div className="font-black text-white text-sm mt-0.5">Shakti Mak</div>
            <div className="text-emerald-400 font-bold text-[11px] mt-1">AAA Sovereign Treasury</div>
          </div>
        </div>
      </div>
    </div>
  );
};
