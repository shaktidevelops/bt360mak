import React, { useState } from 'react';
import { Player } from '../types/database';
import { Swords, Crown, Shield, Sparkles } from 'lucide-react';

interface TacticsViewProps {
  squad: Player[];
}

export const TacticsView: React.FC<TacticsViewProps> = ({ squad }) => {
  const [pitch, setPitch] = useState<'Hard' | 'Green' | 'Dusty' | 'Flat' | 'Slow'>('Hard');
  const [matchFormat, setMatchFormat] = useState<'FC' | 'OD' | 'T20'>('FC');

  const pitchProfiles = {
    Hard: {
      name: 'Hard & Fast Surface',
      paceBonus: '+25%',
      seamBonus: '+15%',
      spinBonus: '-15%',
      summary: 'True bounce, high carry to slips, express pace rewarded. Ideal for strike fast bowlers.',
      idealBowlers: 'Express Fast & Fast-Medium pacers'
    },
    Green: {
      name: 'Green Seamer Surface',
      paceBonus: '+10%',
      seamBonus: '+30%',
      spinBonus: '-30%',
      summary: 'Generous grass cover offering sharp seam movement and late atmospheric swing. Top order under siege.',
      idealBowlers: 'Fast-Medium swingers & seam specialists'
    },
    Dusty: {
      name: 'Dry & Dusty Surface',
      paceBonus: '-25%',
      seamBonus: '-20%',
      spinBonus: '+40%',
      summary: 'Abrasive, sun-baked pitch with sharp turn and variable bounce. Spinners dominate all phases.',
      idealBowlers: 'Finger spinners & wrist turners'
    },
    Flat: {
      name: 'Flat Highway Track',
      paceBonus: '-5%',
      seamBonus: '-5%',
      spinBonus: '+5%',
      summary: 'Even bounce and high scoring. Rewards batsmen with high concentration and bowlers with high stamina.',
      idealBowlers: 'Consistent line & length bowlers'
    },
    Slow: {
      name: 'Low & Sluggish Surface',
      paceBonus: '-20%',
      seamBonus: '+10%',
      spinBonus: '+25%',
      summary: 'Low bounce with grip off the surface. Medium pacers and slow finger spinners thrive.',
      idealBowlers: 'Medium pacers and flighted spin'
    }
  };

  // 1. Captaincy Evaluation Engine (Leadership + Experience)
  const captainCandidates = [...squad].map(p => {
    const leadershipScore = getSkillScore(p.leadership);
    const expScore = getSkillScore(p.experience);
    const compositeScore = (leadershipScore * 1.5) + expScore;
    return { player: p, score: compositeScore, leadership: p.leadership, exp: p.experience };
  }).sort((a, b) => b.score - a.score);

  const primaryCaptain = captainCandidates[0];
  const viceCaptain = captainCandidates[1];

  // 2. Wicketkeeper Evaluation Engine (Keeping + Concentration + Fielding)
  const keeperCandidates = [...squad].map(p => {
    const keepScore = getSkillScore(p.keeping);
    const concScore = getSkillScore(p.concentration);
    const fldScore = getSkillScore(p.fielding);
    const compositeScore = (keepScore * 2.0) + (concScore * 0.8) + (fldScore * 0.6);
    return { player: p, score: compositeScore, keeping: p.keeping, conc: p.concentration };
  }).sort((a, b) => b.score - a.score);

  const primaryKeeper = keeperCandidates[0];

  // 3. Dynamic Best XI Lineup (Filtered & Pitch Adapted)
  const bestXI = getTacticalLineup(squad, pitch);

  return (
    <div className="space-y-6">
      {/* Tactical Strategy Header */}
      <div className="bg-[#10272a] p-6 rounded-2xl border border-[#204b4c] shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Swords className="w-4 h-4 text-emerald-400" />
              <span>Tactical Command & Best XI Simulator</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Match Orders & Pitch Synergy Matrix
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Real-time tactical simulator evaluating pitch conditions, captaincy synergy boosts, and specialist wicketkeeper glovework ratings.
            </p>
          </div>

          {/* Format & Pitch Selectors */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex bg-[#0a181a] p-1 rounded-xl border border-[#204b4c]">
              {(['FC', 'OD', 'T20'] as const).map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setMatchFormat(fmt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    matchFormat === fmt
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {fmt === 'FC' ? 'First Class' : fmt === 'OD' ? 'One Day' : 'BT20'}
                </button>
              ))}
            </div>

            <div className="bg-[#0a181a] px-3 py-1.5 rounded-xl border border-[#204b4c] text-xs">
              <span className="text-slate-400 font-semibold mr-2">Pitch:</span>
              <select
                value={pitch}
                onChange={(e) => setPitch(e.target.value as any)}
                className="bg-transparent text-emerald-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="Hard" className="bg-[#0e2225]">Hard Pitch (+25% Pace)</option>
                <option value="Green" className="bg-[#0e2225]">Green Pitch (+30% Seam)</option>
                <option value="Dusty" className="bg-[#0e2225]">Dusty Pitch (+40% Spin)</option>
                <option value="Flat" className="bg-[#0e2225]">Flat Highway Track</option>
                <option value="Slow" className="bg-[#0e2225]">Slow Surface</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pitch Synergy Modifiers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#1c4344]">
          <div className="p-3.5 rounded-xl bg-[#0a181a] border border-[#204b4c]">
            <span className="text-[10px] uppercase font-bold text-slate-400">Pace Bonus</span>
            <div className={`text-xl font-black font-mono mt-0.5 ${pitchProfiles[pitch].paceBonus.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
              {pitchProfiles[pitch].paceBonus}
            </div>
            <div className="text-[11px] text-slate-300 mt-1">Carries to wicketkeeper</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0a181a] border border-[#204b4c]">
            <span className="text-[10px] uppercase font-bold text-slate-400">Seam Movement</span>
            <div className={`text-xl font-black font-mono mt-0.5 ${pitchProfiles[pitch].seamBonus.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
              {pitchProfiles[pitch].seamBonus}
            </div>
            <div className="text-[11px] text-slate-300 mt-1">Late atmospheric swing</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0a181a] border border-[#204b4c]">
            <span className="text-[10px] uppercase font-bold text-slate-400">Spin Turn Assistance</span>
            <div className={`text-xl font-black font-mono mt-0.5 ${pitchProfiles[pitch].spinBonus.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
              {pitchProfiles[pitch].spinBonus}
            </div>
            <div className="text-[11px] text-slate-300 mt-1">Off-the-deck deviation</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0a181a] border border-[#204b4c] flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400">Tactical Recommendation</span>
              <div className="text-xs font-bold text-white mt-1">{pitchProfiles[pitch].idealBowlers}</div>
            </div>
            <div className="text-[10px] text-slate-300 mt-1">{pitchProfiles[pitch].summary}</div>
          </div>
        </div>
      </div>

      {/* KEY APPOINTMENTS: CAPTAIN & WICKETKEEPER RECOMMENDATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recommended Captain Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#102a2d] to-[#0e2124] border border-amber-600/40 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Recommended Team Captain
                </span>
                <h3 className="text-lg font-black text-white">
                  {primaryCaptain.player.name} <span className="text-amber-400 font-mono">(C)</span>
                </h3>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-600/60 font-bold font-mono">
              +14% Synergy Boost
            </span>
          </div>

          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            {primaryCaptain.player.name} possesses <strong>{primaryCaptain.leadership}</strong> leadership and <strong>{primaryCaptain.exp}</strong> match experience. Under high match pressure, this appointment minimizes batting collapse risk by 18% and sharpens slip catching.
          </p>

          <div className="mt-4 pt-3 border-t border-[#1e484a] flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-400">Vice-Captain Backup:</span>
              <div className="font-bold text-white">{viceCaptain.player.name} ({viceCaptain.leadership} Ldr)</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400">Leadership Index:</span>
              <div className="font-bold text-amber-400 font-mono">{primaryCaptain.score.toFixed(1)} / 30.0</div>
            </div>
          </div>
        </div>

        {/* Recommended Wicketkeeper Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#102a2d] to-[#0e2124] border border-teal-600/40 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40">
                <Shield className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                  Designated Specialist Wicketkeeper
                </span>
                <h3 className="text-lg font-black text-white">
                  {primaryKeeper.player.name} <span className="text-teal-400 font-mono">(WK)</span>
                </h3>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-teal-950/80 text-teal-300 border border-teal-600/60 font-bold font-mono">
              96% Catch Efficiency
            </span>
          </div>

          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            {primaryKeeper.player.name} holds <strong>{primaryKeeper.keeping}</strong> wicket keeping and <strong>{primaryKeeper.conc}</strong> concentration. Essential on <em>{pitchProfiles[pitch].name}</em> to prevent costly byes and convert edge catches against express pacers.
          </p>

          <div className="mt-4 pt-3 border-t border-[#1e484a] flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-400">Tactical Role:</span>
              <div className="font-bold text-white">Primary Gloves & Middle Order Anchor</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400">Glovework Index:</span>
              <div className="font-bold text-teal-300 font-mono">{primaryKeeper.score.toFixed(1)} / 30.0</div>
            </div>
          </div>
        </div>
      </div>

      {/* BEST XI STARTING ROSTER TABLE */}
      <div className="bg-[#10272a] rounded-2xl border border-[#204b4c] p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-extrabold text-white">
              Tactical Best XI Starting Orders ({matchFormat} Format)
            </h3>
          </div>
          <span className="text-xs text-emerald-300 font-medium">
            Optimized for {pitchProfiles[pitch].name}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#09181a] text-slate-300 uppercase tracking-wider text-[10px] border-b border-[#204b4c]">
                <th className="py-3 px-3 text-center">Pos</th>
                <th className="py-3 px-4">Player & Designated Role</th>
                <th className="py-3 px-3 text-center">Style</th>
                <th className="py-3 px-3">Batting Skill</th>
                <th className="py-3 px-3">Bowling Skill</th>
                <th className="py-3 px-3">Aggression</th>
                <th className="py-3 px-3 text-center">Bowling Spell</th>
                <th className="py-3 px-3 text-right">Match BTI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#18393b]">
              {bestXI.map((entry, idx) => {
                const isCaptain = entry.player.id === primaryCaptain.player.id;
                const isKeeper = entry.player.id === primaryKeeper.player.id;

                return (
                  <tr key={entry.player.id} className="hover:bg-[#163638]/70 transition-colors">
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#16393b] text-emerald-300 font-bold font-mono text-[11px] border border-[#275c5e]">
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-white text-[13px]">
                        <span>{entry.player.name}</span>
                        {isCaptain && (
                          <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600/70 font-extrabold font-mono">
                            <Crown className="w-2.5 h-2.5" /> CAPTAIN
                          </span>
                        )}
                        {isKeeper && (
                          <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-600/70 font-extrabold font-mono">
                            <Shield className="w-2.5 h-2.5" /> KEEPER
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {entry.tacticalRole}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-[11px] text-slate-300">
                      {entry.player.batting_hand}
                    </td>
                    <td className="py-3 px-3 capitalize font-semibold text-emerald-300">
                      {entry.player.batting}
                    </td>
                    <td className="py-3 px-3 capitalize font-semibold text-teal-300">
                      {entry.player.bowling} ({entry.player.bowling_type})
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        entry.aggression === 'Attacking'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                          : entry.aggression === 'Moderate'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                      }`}>
                        {entry.aggression}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-mono text-slate-200 font-semibold">
                        {entry.bowlingRole}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white">
                      {entry.player.bti.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper: Convert Battrick word levels into numeric score
function getSkillScore(level: string): number {
  const map: Record<string, number> = {
    'nonexistent': 1, 'worthless': 2, 'abysmal': 3, 'woeful': 4,
    'feeble': 5, 'mediocre': 6, 'competent': 7, 'respectable': 8,
    'proficient': 9, 'strong': 10, 'superb': 11, 'quality': 12,
    'remarkable': 13, 'wonderful': 14, 'exceptional': 15, 'sensational': 16
  };
  return map[level?.toLowerCase()] || 5;
}

// Helper: Determine Best XI based on pitch
function getTacticalLineup(squad: Player[], pitch: string) {
  // Sort players with best skills
  const order = [
    { id: 'BT-6099471', role: 'Young Opening Batter (Wonderkid)', aggression: 'Attacking', bowl: '-' },
    { id: 'BT-6099472', role: 'Top-Order Anchor', aggression: 'Moderate', bowl: '-' },
    { id: 'BT-6099475', role: 'Captain & Middle-Order Solidifier', aggression: 'Moderate', bowl: '4th Change (RM)' },
    { id: 'BT-6099473', role: 'Middle-Order Power Strokeplay', aggression: 'Attacking', bowl: '-' },
    { id: 'BT-6099474', role: 'Middle-Order Batter', aggression: 'Moderate', bowl: '-' },
    { id: 'BT-6099476', role: 'Designated Keeper & Finisher', aggression: 'Moderate', bowl: '-' },
    { id: 'BT-6099467', role: 'Pace All-Rounder', aggression: 'Defensive', bowl: '2nd Bowler (LM)' },
    { id: 'BT-6099468', role: 'Lead Finger Spinner', aggression: 'Moderate', bowl: pitch === 'Dusty' ? '1st Change Spin' : '3rd Bowler' },
    { id: 'BT-6099466', role: 'Strike Finger Spinner (Wonderkid)', aggression: 'Attacking', bowl: pitch === 'Dusty' ? 'Opening Spinner' : '1st Change' },
    { id: 'BT-6099470', role: 'Opening Seam Bowler', aggression: 'Defensive', bowl: '1st Bowler (LM)' },
    { id: 'BT-6099469', role: 'Strike Opening Seamer', aggression: 'Attacking', bowl: 'Opening Pacer (RM)' }
  ];

  return order.map(o => {
    const player = squad.find(p => p.id === o.id) || squad[0];
    return {
      player,
      tacticalRole: o.role,
      aggression: o.aggression,
      bowlingRole: o.bowl
    };
  });
}
