import React, { useState } from 'react';
import { Player } from '../types/database';
import { Swords, Crown, Shield, Sparkles, Target } from 'lucide-react';

interface TacticsViewProps {
  squad: Player[];
}

export type BattrickPitch = 'Hard' | 'Green' | 'Dusty' | 'Slow' | 'Flat' | 'Uneven';
export type BattrickAggression = 'Very Defensive' | 'Defensive' | 'Moderate' | 'Attacking' | 'Very Attacking';

const skillScoreMap: Record<string, number> = {
  nonexistent: 1, worthless: 2, abysmal: 3, woeful: 4, feeble: 5,
  mediocre: 6, competent: 7, respectable: 8, proficient: 9, strong: 10,
  superb: 11, quality: 12, remarkable: 13, wonderful: 14, exceptional: 15, sensational: 16
};

function getSkillScore(level?: string): number {
  if (!level) return 5;
  return skillScoreMap[level.toLowerCase()] || 5;
}

export const TacticsView: React.FC<TacticsViewProps> = ({ squad }) => {
  const [pitch, setPitch] = useState<BattrickPitch>('Hard');
  const [matchFormat, setMatchFormat] = useState<'FC' | 'OD' | 'T20'>('FC');

  // Official Battrick 6-Pitch Engine Profiles
  const pitchProfiles: Record<BattrickPitch, {
    name: string;
    paceModifier: string;
    seamModifier: string;
    spinModifier: string;
    battingConditions: string;
    tacticsTip: string;
    recommendedBowlers: string;
  }> = {
    Hard: {
      name: 'Hard & Fast Turf',
      paceModifier: '+25% Pace Boost',
      seamModifier: '+10% Bounce Carry',
      spinModifier: '-15% Minimal Turn',
      battingConditions: 'True bounce. Rewarding for strokeplay; slips and keeper catch opportunities high.',
      tacticsTip: 'Select express fast bowlers who exploit bounce. Top-order batters with high concentration thrive.',
      recommendedBowlers: 'Fast (F) & Fast-Medium (FM) Pacers'
    },
    Green: {
      name: 'Green Seamer Surface',
      paceModifier: '+10% Movement',
      seamModifier: '+35% Sharp Seam',
      spinModifier: '-30% Ineffective',
      battingConditions: 'Difficult initial overs. Sharp seam movement off the deck; early batting collapses common.',
      tacticsTip: 'Bowl first if toss won. Field extra seamers with defensive/moderate batting settings early.',
      recommendedBowlers: 'Fast-Medium (FM) & Medium (M) Swingers'
    },
    Dusty: {
      name: 'Dry & Dusty Track',
      paceModifier: '-25% Low Bounce',
      seamModifier: '-20% Little Seam',
      spinModifier: '+40% Massive Turn',
      battingConditions: 'Abrasive and dry. Dramatic turn and variable low bounce from over 1.',
      tacticsTip: 'Field 2 or 3 spinners! In First Class matches, batting last on a dusty pitch is lethal.',
      recommendedBowlers: 'Finger Spinners (Off-Spin) & Wrist Spinners'
    },
    Slow: {
      name: 'Slow & Low Pitch',
      paceModifier: '-20% Pace Deadened',
      seamModifier: '+10% Gripping Deck',
      spinModifier: '+25% Helpful Turn',
      battingConditions: 'Ball sticks into the turf. Difficult to time shots; requires high patience.',
      tacticsTip: 'Pace bowlers lose sting. Medium pacers and slow bowlers who bowl wicket-to-wicket dominate.',
      recommendedBowlers: 'Medium Pacers & Slow Spinners'
    },
    Flat: {
      name: 'Flat Highway Track',
      paceModifier: '-5% Neutral',
      seamModifier: '-5% Minimal Aid',
      spinModifier: '+5% True Turn',
      battingConditions: 'Batting paradise. Consistent even bounce; high team totals expected.',
      tacticsTip: 'Bowlers need high Stamina and Consistency to prevent leaking runs. Aggressive batting pays off.',
      recommendedBowlers: 'High Consistency Bowlers of any type'
    },
    Uneven: {
      name: 'Uneven Surface',
      paceModifier: '+15% Unpredictable',
      seamModifier: '+25% Shooters/Rippers',
      spinModifier: '+20% Variable Bite',
      battingConditions: 'Dangerous variable bounce. Some balls stay low ("shooters"), others rear up sharply.',
      tacticsTip: 'Expect low scoring matches and frequent LBWs/edges. Defensive batting settings recommended.',
      recommendedBowlers: 'Accurate Seamers & Finger Spinners'
    }
  };

  // Authentic Battrick Captaincy Formula: (Leadership * 1.5) + Experience
  const captainRankings = [...squad].map(p => {
    const ldr = getSkillScore(p.leadership);
    const exp = getSkillScore(p.experience);
    return {
      player: p,
      score: (ldr * 1.5) + exp,
      leadership: p.leadership,
      exp: p.experience
    };
  }).sort((a, b) => b.score - a.score);

  const primaryCaptain = captainRankings[0] || { player: squad[0], score: 20, leadership: 'competent', exp: 'abysmal' };
  const viceCaptain = captainRankings[1] || { player: squad[1] || squad[0], score: 18, leadership: 'competent', exp: 'abysmal' };

  // Authentic Battrick Wicketkeeper Formula: (Keeping * 2.0) + (Fielding * 0.8) + (Concentration * 0.5)
  const keeperRankings = [...squad].map(p => {
    const keep = getSkillScore(p.keeping);
    const fld = getSkillScore(p.fielding);
    const conc = getSkillScore(p.concentration);
    return {
      player: p,
      score: (keep * 2.0) + (fld * 0.8) + (conc * 0.5),
      keeping: p.keeping,
      fld: p.fielding
    };
  }).sort((a, b) => b.score - a.score);

  const primaryKeeper = keeperRankings[0] || { player: squad[0], score: 20, keeping: 'competent', fld: 'feeble' };

  // Batting Lineup 1 to 11 with authentic individual aggression
  const battingOrders: {
    pos: number;
    id: string;
    role: string;
    aggression: BattrickAggression;
    bowlingOrder?: string;
  }[] = [
    { pos: 1, id: '6099471', role: 'Opening Batter (Wonderkid)', aggression: 'Attacking' },
    { pos: 2, id: '6099472', role: 'Top-Order Anchor', aggression: 'Moderate' },
    { pos: 3, id: '6099475', role: 'Captain & Middle-Order Solidifier', aggression: 'Moderate', bowlingOrder: '4th Change (RM)' },
    { pos: 4, id: '6099473', role: 'Middle-Order Power Hitter', aggression: 'Attacking' },
    { pos: 5, id: '6099474', role: 'Middle-Order Finisher', aggression: 'Attacking' },
    { pos: 6, id: '6099476', role: 'Primary Wicketkeeper (WK)', aggression: 'Moderate' },
    { pos: 7, id: '6099467', role: 'Pace All-Rounder (Vice-Captain)', aggression: 'Defensive', bowlingOrder: '1st Change (LM)' },
    { pos: 8, id: '6099468', role: 'Senior Finger Spinner', aggression: 'Defensive', bowlingOrder: '2nd Change (RH spin)' },
    { pos: 9, id: '6099466', role: 'Strike Finger Spinner (Wonderkid)', aggression: 'Attacking', bowlingOrder: pitch === 'Dusty' ? 'Bowler 1 (Opening Spin)' : '3rd Change (RH spin)' },
    { pos: 10, id: '6099470', role: 'Opening Seam Bowler', aggression: 'Very Defensive', bowlingOrder: 'Bowler 2 (Opening Seam)' },
    { pos: 11, id: '6099469', role: 'Opening Strike Bowler', aggression: 'Very Defensive', bowlingOrder: pitch === 'Dusty' ? '1st Change Pace' : 'Bowler 1 (Opening Pace)' }
  ];

  const maxOversPerBowler = matchFormat === 'T20' ? '4 Overs Max' : matchFormat === 'OD' ? '10 Overs Max' : 'Unlimited (Fatigue Dependent)';

  // Bowling Rotation Plan for Battrick Match Engine
  const bowlingOrders = [
    { order: 'Bowler 1 (Opening Bowler)', player: squad.find(p => p.id === (pitch === 'Dusty' ? '6099466' : '6099469')) || squad[0], maxOvers: maxOversPerBowler, engineRole: 'Takes new ball from Pavilion End. Exploits early bounce and conditions.' },
    { order: 'Bowler 2 (Opening Bowler)', player: squad.find(p => p.id === '6099470') || squad[0], maxOvers: maxOversPerBowler, engineRole: 'Takes new ball from Coastal End. Tight line and length accuracy.' },
    { order: 'Bowler 3 (1st Change)', player: squad.find(p => p.id === '6099467') || squad[0], maxOvers: maxOversPerBowler, engineRole: 'Enters spell after opening pair. Controls run rate and targets stumps.' },
    { order: 'Bowler 4 (2nd Change)', player: squad.find(p => p.id === '6099468') || squad[0], maxOvers: maxOversPerBowler, engineRole: 'Middle overs control. Exploits pitch degradation and spin grip.' },
    { order: 'Bowler 5 (3rd Change)', player: squad.find(p => p.id === '6099475') || squad[0], maxOvers: maxOversPerBowler, engineRole: 'Fifth bowling option to fulfill quota and break stubborn partnerships.' }
  ];

  return (
    <div className="space-y-6">
      {/* Tactical Engine Header */}
      <div className="bg-[#0e2c24] p-6 rounded-2xl border border-emerald-600/30 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
              <Swords className="w-4 h-4 text-emerald-400" />
              <span>Battrick Match Engine & Tactical Command</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Match Orders, Pitch Conditions & Working Engine Tactics
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Configure your 1-11 batting order, individual player aggression, 5-man bowling rotation, captaincy leadership formula, and pitch synergy strictly matching Battrick mechanics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Format Selector */}
            <div className="flex bg-[#061713] p-1 rounded-xl border border-emerald-800/40">
              {(['FC', 'OD', 'T20'] as const).map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setMatchFormat(fmt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    matchFormat === fmt
                      ? 'bg-emerald-600 text-white shadow font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {fmt === 'FC' ? 'First Class (3 Days)' : fmt === 'OD' ? 'One Day (50 Over)' : 'BT20 (20 Over)'}
                </button>
              ))}
            </div>

            {/* Pitch Surface Selector */}
            <div className="bg-[#061713] px-3 py-1.5 rounded-xl border border-emerald-800/40 text-xs">
              <span className="text-slate-400 font-semibold mr-2">Surface:</span>
              <select
                value={pitch}
                onChange={(e) => setPitch(e.target.value as BattrickPitch)}
                className="bg-transparent text-emerald-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="Hard" className="bg-[#0c241e]">Hard & Fast (+25% Pace)</option>
                <option value="Green" className="bg-[#0c241e]">Green Seamer (+35% Seam)</option>
                <option value="Dusty" className="bg-[#0c241e]">Dry & Dusty (+40% Spin)</option>
                <option value="Slow" className="bg-[#0c241e]">Slow & Low Track</option>
                <option value="Flat" className="bg-[#0c241e]">Flat Highway Track</option>
                <option value="Uneven" className="bg-[#0c241e]">Uneven Surface</option>
              </select>
            </div>
          </div>
        </div>

        {/* Battrick Pitch Engine Multipliers Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-4 border-t border-emerald-800/40">
          <div className="p-3.5 rounded-xl bg-[#061713] border border-emerald-800/40">
            <span className="text-[10px] uppercase font-bold text-slate-400">Pace Assistance</span>
            <div className={`text-xl font-black font-mono mt-0.5 ${pitchProfiles[pitch].paceModifier.includes('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
              {pitchProfiles[pitch].paceModifier}
            </div>
            <div className="text-[11px] text-slate-300 mt-1">Direct effect on fast bowlers</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#061713] border border-emerald-800/40">
            <span className="text-[10px] uppercase font-bold text-slate-400">Seam Movement</span>
            <div className={`text-xl font-black font-mono mt-0.5 ${pitchProfiles[pitch].seamModifier.includes('+') ? 'text-emerald-400' : 'text-slate-400'}`}>
              {pitchProfiles[pitch].seamModifier}
            </div>
            <div className="text-[11px] text-slate-300 mt-1">Lateral deviation off the pitch</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#061713] border border-emerald-800/40">
            <span className="text-[10px] uppercase font-bold text-slate-400">Spin Assistance</span>
            <div className={`text-xl font-black font-mono mt-0.5 ${pitchProfiles[pitch].spinModifier.includes('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
              {pitchProfiles[pitch].spinModifier}
            </div>
            <div className="text-[11px] text-slate-300 mt-1">Turn and bounce off the surface</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#061713] border border-emerald-800/40 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400">Battrick Engine Guidance</span>
              <div className="text-xs font-bold text-white mt-0.5">{pitchProfiles[pitch].recommendedBowlers}</div>
            </div>
            <div className="text-[10px] text-slate-300 mt-1">{pitchProfiles[pitch].tacticsTip}</div>
          </div>
        </div>
      </div>

      {/* KEY APPOINTMENTS: CAPTAINCY & WICKETKEEPING ENGINE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recommended Captain Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#12382e] to-[#0c241e] border border-amber-600/50 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Battrick Designated Team Captain
                </span>
                <h3 className="text-lg font-black text-white">
                  {primaryCaptain.player.name} <span className="text-amber-400 font-mono">(C)</span>
                </h3>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-600 font-bold font-mono">
              ID: {primaryCaptain.player.id}
            </span>
          </div>

          <div className="mt-3 p-3 rounded-xl bg-[#061713]/80 border border-emerald-800/40 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Leadership:</span>
              <strong className="text-white capitalize font-mono">{primaryCaptain.leadership}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Experience:</span>
              <strong className="text-white capitalize font-mono">{primaryCaptain.exp || 'Abysmal'}</strong>
            </div>
            <div className="flex justify-between pt-1 border-t border-emerald-900/60">
              <span className="text-amber-300 font-semibold">Engine Impact:</span>
              <span className="text-emerald-300 font-bold">Boosts all 10 players, reduces collapses</span>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-300 leading-relaxed">
            In Battrick, a Captain with high <strong>Leadership</strong> and <strong>Experience</strong> enhances the entire team's performance. Vice-Captain: <strong>{viceCaptain.player.name} ({viceCaptain.leadership})</strong>.
          </div>
        </div>

        {/* Recommended Wicketkeeper Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#12382e] to-[#0c241e] border border-teal-600/50 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40">
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
            <span className="text-xs px-2.5 py-1 rounded-full bg-teal-950 text-teal-300 border border-teal-600 font-bold font-mono">
              ID: {primaryKeeper.player.id}
            </span>
          </div>

          <div className="mt-3 p-3 rounded-xl bg-[#061713]/80 border border-emerald-800/40 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Keeping Skill:</span>
              <strong className="text-white capitalize font-mono">{primaryKeeper.keeping}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Fielding Skill:</span>
              <strong className="text-white capitalize font-mono">{primaryKeeper.fld}</strong>
            </div>
            <div className="flex justify-between pt-1 border-t border-emerald-900/60">
              <span className="text-teal-300 font-semibold">Engine Impact:</span>
              <span className="text-emerald-300 font-bold">Prevents byes, catches nicked edges</span>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-300 leading-relaxed">
            In Battrick, fielding a non-specialist keeper results in costly dropped catches off fast bowling and conceding extra byes every inning.
          </div>
        </div>
      </div>

      {/* 5-MAN BOWLING ORDERS (BATTRICK MATCH ENGINE) */}
      <div className="bg-[#0e2c24] rounded-2xl border border-emerald-600/30 p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-extrabold text-white">
              Official Battrick 5-Man Bowling Order ({matchFormat} Format - {maxOversPerBowler})
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-300">
            Bowler Quota Management
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {bowlingOrders.map((bo, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#061713] border border-emerald-800/40 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                    Order #{idx + 1}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                    {bo.maxOvers}
                  </span>
                </div>
                <div className="font-extrabold text-white text-xs mt-1">
                  {bo.player.name}
                </div>
                <div className="text-[11px] text-teal-300 mt-0.5 font-mono">
                  {bo.player.bowling_type}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Bowl: <strong className="text-white capitalize">{bo.player.bowling}</strong> &bull; Cons: <strong className="text-white capitalize">{bo.player.consistency}</strong>
                </div>
              </div>

              <div className="text-[10px] text-slate-300 pt-2 border-t border-emerald-950 leading-tight">
                {bo.engineRole}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 1 TO 11 BATTING ORDERS WITH BATTRICK AGGRESSION SETTINGS */}
      <div className="bg-[#0e2c24] rounded-2xl border border-emerald-600/30 p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-black text-white">
              Tactical Best XI Starting Orders (Positions 1 to 11)
            </h3>
          </div>
          <span className="text-xs text-emerald-300 font-bold font-mono">
            Surface: {pitchProfiles[pitch].name}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#061713] text-slate-300 uppercase tracking-wider text-[10px] border-b border-emerald-800/40">
                <th className="py-3 px-3 text-center">Pos</th>
                <th className="py-3 px-4">Player & Designated Role</th>
                <th className="py-3 px-3 text-center">Hand</th>
                <th className="py-3 px-3">Batting</th>
                <th className="py-3 px-3">Concentration</th>
                <th className="py-3 px-3">Aggression Order</th>
                <th className="py-3 px-3 text-center">Bowling Order</th>
                <th className="py-3 px-3 text-right">BTI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/60">
              {battingOrders.map((order) => {
                const player = squad.find(p => p.id === order.id) || squad[0];
                const isCaptain = player.id === primaryCaptain.player.id;
                const isKeeper = player.id === primaryKeeper.player.id;

                let aggClass = 'bg-amber-950 text-amber-300 border-amber-800';
                if (order.aggression === 'Attacking' || order.aggression === 'Very Attacking') {
                  aggClass = 'bg-rose-950 text-rose-300 border-rose-800';
                } else if (order.aggression === 'Defensive' || order.aggression === 'Very Defensive') {
                  aggClass = 'bg-emerald-950 text-emerald-300 border-emerald-800';
                }

                return (
                  <tr key={player.id} className="hover:bg-emerald-950/40 transition-colors">
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#0d2a23] text-emerald-300 font-bold font-mono text-[11px] border border-emerald-700/60">
                        {order.pos}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-white text-[13px]">
                        <span>{player.name}</span>
                        <span className="text-[10px] font-mono text-emerald-400">({player.id})</span>
                        {isCaptain && (
                          <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-600 font-black font-mono">
                            <Crown className="w-2.5 h-2.5" /> CAPTAIN
                          </span>
                        )}
                        {isKeeper && (
                          <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded bg-teal-950 text-teal-300 border border-teal-600 font-black font-mono">
                            <Shield className="w-2.5 h-2.5" /> KEEPER
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        {order.role}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-[11px] text-slate-300">
                      {player.batting_hand}
                    </td>
                    <td className="py-3 px-3 capitalize font-bold text-emerald-300">
                      {player.batting}
                    </td>
                    <td className="py-3 px-3 capitalize text-slate-300">
                      {player.concentration}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${aggClass}`}>
                        {order.aggression}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-mono text-slate-200 text-[11px]">
                        {order.bowlingOrder || '-'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white">
                      {(player.bti ?? 0).toLocaleString()}
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
