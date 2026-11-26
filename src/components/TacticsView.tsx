import React, { useState, useMemo } from 'react';
import { Player } from '../types/database';
import { 
  Swords, 
  Crown, 
  Shield, 
  Target, 
  ArrowUp, 
  ArrowDown, 
  Zap, 
  Dices,
  Users
} from 'lucide-react';
import { formatBowlingType, getBowlingTypeFullName, formatBattingHand, getBattingHandFullName } from '../lib/cricketFormatters';

interface TacticsViewProps {
  squad: Player[];
  initialTab?: 'lineup' | 'field' | 'bowling' | 'pitch';
  mode?: 'best-xi' | 'tactics';
}

export type BattrickPitch = 'Hard' | 'Green' | 'Dusty' | 'Slow' | 'Flat' | 'Uneven';
export type BattrickAggression = 'Very Defensive' | 'Defensive' | 'Moderate' | 'Attacking' | 'Very Attacking';
export type FieldSetup = 'Attacking' | 'Balanced' | 'Defensive';

const skillScoreMap: Record<string, number> = {
  nonexistent: 1, worthless: 2, abysmal: 3, woeful: 4, feeble: 5,
  mediocre: 6, competent: 7, respectable: 8, proficient: 9, strong: 10,
  superb: 11, quality: 12, remarkable: 13, wonderful: 14, exceptional: 15, sensational: 16
};

function getSkillScore(level?: string): number {
  if (!level) return 5;
  return skillScoreMap[level.toLowerCase()] || 5;
}

function cleanId(id?: string): string {
  return String(id || '').replace(/^BT-/, '').trim();
}

export const TacticsView: React.FC<TacticsViewProps> = ({ 
  squad, 
  initialTab = 'lineup',
  mode = 'best-xi' 
}) => {
  const [pitch, setPitch] = useState<BattrickPitch>('Hard');
  const [matchFormat, setMatchFormat] = useState<'FC' | 'OD' | 'T20'>('FC');
  const [tossDecision, setTossDecision] = useState<'Bat First' | 'Bowl First'>('Bat First');
  const [fieldSetup, setFieldSetup] = useState<FieldSetup>('Attacking');
  const [activeTab, setActiveTab] = useState<'lineup' | 'field' | 'bowling' | 'pitch'>(initialTab);

  // Official Battrick 6-Pitch Engine Profiles
  const pitchProfiles: Record<BattrickPitch, {
    name: string;
    paceModifier: string;
    seamModifier: string;
    spinModifier: string;
    battingConditions: string;
    tossRecommendation: 'Bat First' | 'Bowl First';
    tacticsTip: string;
    recommendedBowlers: string;
  }> = {
    Hard: {
      name: 'Hard & Fast Turf (Prabhas Coastal Oval)',
      paceModifier: '+25% Pace Boost',
      seamModifier: '+10% Bounce Carry',
      spinModifier: '-15% Minimal Turn',
      battingConditions: 'True bounce. High reward for strokeplay; slips and keeper catch opportunities frequent.',
      tossRecommendation: 'Bat First',
      tacticsTip: 'Select express fast bowlers who exploit bounce. Top-order batters with high concentration thrive.',
      recommendedBowlers: 'Fast (F) & Fast-Medium (FM) Pacers'
    },
    Green: {
      name: 'Green Seamer Surface',
      paceModifier: '+10% Movement',
      seamModifier: '+35% Sharp Seam',
      spinModifier: '-30% Ineffective',
      battingConditions: 'Difficult initial overs. Sharp seam movement off the deck; early top-order collapses common.',
      tossRecommendation: 'Bowl First',
      tacticsTip: 'Bowl first if toss won! Field extra seamers with defensive/moderate batting settings early.',
      recommendedBowlers: 'Fast-Medium (FM) & Medium (M) Swingers'
    },
    Dusty: {
      name: 'Dry & Dusty Track',
      paceModifier: '-25% Low Bounce',
      seamModifier: '-20% Little Seam',
      spinModifier: '+40% Massive Turn',
      battingConditions: 'Abrasive and dry. Dramatic turn and variable low bounce from over 1.',
      tossRecommendation: 'Bat First',
      tacticsTip: 'Field 2 or 3 spinners! In First Class matches, batting last in 4th innings on a dusty pitch is fatal.',
      recommendedBowlers: 'Finger Spinners (Off-Spin) & Wrist Spinners'
    },
    Slow: {
      name: 'Slow & Low Track',
      paceModifier: '-20% Pace Deadened',
      seamModifier: '+10% Gripping Deck',
      spinModifier: '+25% Helpful Turn',
      battingConditions: 'Ball sticks into the turf. Difficult to time shots; requires high patience.',
      tossRecommendation: 'Bat First',
      tacticsTip: 'Pace bowlers lose sting. Medium pacers and slow bowlers who bowl wicket-to-wicket dominate.',
      recommendedBowlers: 'Medium Pacers & Slow Spinners'
    },
    Flat: {
      name: 'Flat Highway Track',
      paceModifier: '-5% Neutral',
      seamModifier: '-5% Minimal Aid',
      spinModifier: '+5% True Turn',
      battingConditions: 'Batting paradise. Consistent even bounce; high team totals expected.',
      tossRecommendation: 'Bat First',
      tacticsTip: 'Bowlers need high Stamina and Consistency to prevent leaking runs. Aggressive batting pays off.',
      recommendedBowlers: 'High Consistency Bowlers of any type'
    },
    Uneven: {
      name: 'Uneven Surface',
      paceModifier: '+15% Unpredictable',
      seamModifier: '+25% Shooters/Rippers',
      spinModifier: '+20% Variable Bite',
      battingConditions: 'Dangerous variable bounce. Some balls stay low ("shooters"), others rear up sharply.',
      tossRecommendation: 'Bowl First',
      tacticsTip: 'Expect low scoring matches and frequent LBWs/edges. Defensive batting settings recommended.',
      recommendedBowlers: 'Accurate Seamers & Finger Spinners'
    }
  };

  // Authentic Battrick Captaincy Formula: (Leadership * 1.5) + Experience
  const captainRankings = useMemo(() => {
    return [...squad].map(p => {
      const ldr = getSkillScore(p.leadership);
      const exp = getSkillScore(p.experience);
      return {
        player: p,
        score: (ldr * 1.5) + exp,
        leadership: p.leadership,
        exp: p.experience
      };
    }).sort((a, b) => b.score - a.score);
  }, [squad]);

  const [captainId, setCaptainId] = useState<string>(() => cleanId(captainRankings[0]?.player?.id || squad[0]?.id));

  // Authentic Battrick Wicketkeeper Formula: (Keeping * 2.0) + (Fielding * 0.8) + (Concentration * 0.5)
  const keeperRankings = useMemo(() => {
    return [...squad].map(p => {
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
  }, [squad]);

  const [keeperId, setKeeperId] = useState<string>(() => cleanId(keeperRankings[0]?.player?.id || squad[0]?.id));

  // Default blueprint for 11 distinct tactical positions
  const defaultLineupBlueprint = [
    { pos: 1, targetId: '6099471', nameKeyword: 'Ramdhyani', role: 'Opening Batter (Wonderkid)', defaultAggression: 'Attacking' as BattrickAggression },
    { pos: 2, targetId: '6099472', nameKeyword: 'Baboor', role: 'Top-Order Anchor', defaultAggression: 'Moderate' as BattrickAggression },
    { pos: 3, targetId: '6099475', nameKeyword: 'Kharge', role: 'Captain & Middle-Order Solidifier', defaultAggression: 'Moderate' as BattrickAggression, bowlingOrder: '4th Change (RM)' },
    { pos: 4, targetId: '6099473', nameKeyword: 'Malla', role: 'Middle-Order Power Hitter', defaultAggression: 'Attacking' as BattrickAggression },
    { pos: 5, targetId: '6099474', nameKeyword: 'Sinduvalli', role: 'Middle-Order Finisher', defaultAggression: 'Attacking' as BattrickAggression },
    { pos: 6, targetId: '6099476', nameKeyword: 'Palanisamy', role: 'Primary Wicketkeeper (WK)', defaultAggression: 'Moderate' as BattrickAggression },
    { pos: 7, targetId: '6099467', nameKeyword: 'Somal', role: 'Pace All-Rounder (Vice-Captain)', defaultAggression: 'Defensive' as BattrickAggression, bowlingOrder: '1st Change (LM)' },
    { pos: 8, targetId: '6099468', nameKeyword: 'Battasi', role: 'Senior Finger Spinner', defaultAggression: 'Defensive' as BattrickAggression, bowlingOrder: '2nd Change (RH spin)' },
    { pos: 9, targetId: '6099466', nameKeyword: 'Hemalatha', role: 'Strike Finger Spinner (Wonderkid)', defaultAggression: 'Attacking' as BattrickAggression, bowlingOrder: 'Opening Spin / 3rd Change' },
    { pos: 10, targetId: '6099470', nameKeyword: 'Hydrose', role: 'Opening Seam Bowler', defaultAggression: 'Very Defensive' as BattrickAggression, bowlingOrder: 'Bowler 2 (Opening Seam)' },
    { pos: 11, targetId: '6099469', nameKeyword: 'Rishi', role: 'Opening Strike Bowler', defaultAggression: 'Very Defensive' as BattrickAggression, bowlingOrder: 'Bowler 1 (Opening Pace)' }
  ];

  // Guaranteed UNIQUE 11-player lineup state
  const [lineupPlayerIds, setLineupPlayerIds] = useState<string[]>(() => {
    const usedIds = new Set<string>();
    return defaultLineupBlueprint.map((bp, idx) => {
      let found = squad.find(p => cleanId(p.id) === bp.targetId && !usedIds.has(cleanId(p.id)));
      if (!found) {
        found = squad.find(p => p.name.toLowerCase().includes(bp.nameKeyword.toLowerCase()) && !usedIds.has(cleanId(p.id)));
      }
      if (!found) {
        found = squad.find(p => !usedIds.has(cleanId(p.id)));
      }
      if (!found) {
        found = squad[idx % squad.length];
      }
      const selectedClean = cleanId(found?.id);
      usedIds.add(selectedClean);
      return selectedClean;
    });
  });

  const [lineupAggressions, setLineupAggressions] = useState<BattrickAggression[]>(
    defaultLineupBlueprint.map(bp => bp.defaultAggression)
  );

  // Bowling Quota State
  const maxOversPerBowler = matchFormat === 'T20' ? 4 : matchFormat === 'OD' ? 10 : 35;
  const getFormatBowlerDefaults = (fmt: 'FC' | 'OD' | 'T20') => {
    if (fmt === 'T20') return [4, 4, 4, 4, 4];
    if (fmt === 'OD') return [10, 10, 10, 10, 10];
    return [20, 20, 20, 20, 20]; // First Class standard 100 overs
  };
  const [bowlerOvers, setBowlerOvers] = useState<number[]>(() => getFormatBowlerDefaults(matchFormat));

  // Handle position swaps / moves
  const movePlayer = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= 11) return;
    setLineupPlayerIds(prev => {
      const next = [...prev];
      const temp = next[fromIndex];
      next[fromIndex] = next[toIndex];
      next[toIndex] = temp;
      return next;
    });

    setLineupAggressions(prev => {
      const next = [...prev];
      const temp = next[fromIndex];
      next[fromIndex] = next[toIndex];
      next[toIndex] = temp;
      return next;
    });
  };

  const handlePlayerChange = (posIndex: number, newPlayerId: string) => {
    const cleanNew = cleanId(newPlayerId);
    setLineupPlayerIds(prev => {
      const next = [...prev];
      // If player already in lineup, swap positions
      const existingIndex = next.indexOf(cleanNew);
      if (existingIndex !== -1 && existingIndex !== posIndex) {
        next[existingIndex] = next[posIndex];
      }
      next[posIndex] = cleanNew;
      return next;
    });
  };

  const handleAggressionChange = (posIndex: number, newAgg: BattrickAggression) => {
    setLineupAggressions(prev => {
      const next = [...prev];
      next[posIndex] = newAgg;
      return next;
    });
  };

  // 1-Click Auto-Optimize Lineup for Format & Pitch
  const autoOptimizeForFormat = (fmt: 'FC' | 'OD' | 'T20') => {
    setMatchFormat(fmt);
    const selectedIds = new Set<string>();
    const new11: string[] = [];
    const newAgg: BattrickAggression[] = [];

    // 1. Pick Best Keeper first to secure spot in team
    const bestKeeper = keeperRankings[0] || { player: squad[0] };
    const kId = cleanId(bestKeeper.player.id);

    // 2. Batters sorted by format requirements:
    // For FC: Batting weighted with concentration and stamina
    // For OD: Batting weighted with consistency and form
    // For T20: Batting weighted with aggressive scoring potential
    const sortedBatters = [...squad].sort((a, b) => {
      if (cleanId(a.id) === kId) return 1;
      if (cleanId(b.id) === kId) return -1;
      const scoreA = getSkillScore(a.batting) * 2.5 + (fmt === 'FC' ? getSkillScore(a.concentration) + getSkillScore(a.stamina) : getSkillScore(a.consistency) * 1.5);
      const scoreB = getSkillScore(b.batting) * 2.5 + (fmt === 'FC' ? getSkillScore(b.concentration) + getSkillScore(b.stamina) : getSkillScore(b.consistency) * 1.5);
      return scoreB - scoreA;
    });

    // Positions 1 to 5: Top 5 specialist batters
    for (let p of sortedBatters) {
      if (new11.length >= 5) break;
      const cid = cleanId(p.id);
      if (!selectedIds.has(cid)) {
        selectedIds.add(cid);
        new11.push(cid);
        if (fmt === 'T20') {
          newAgg.push(new11.length <= 2 ? 'Attacking' : 'Very Attacking');
        } else if (fmt === 'OD') {
          newAgg.push(new11.length <= 2 ? 'Moderate' : 'Attacking');
        } else {
          newAgg.push(new11.length <= 3 ? 'Moderate' : 'Moderate');
        }
      }
    }

    // Position 6: Wicketkeeper
    selectedIds.add(kId);
    new11.push(kId);
    setKeeperId(kId);
    newAgg.push(fmt === 'T20' ? 'Attacking' : 'Moderate');

    // Bowlers based on pitch & format
    const isSpinPitch = pitch === 'Dusty' || pitch === 'Slow';
    const isPacePitch = pitch === 'Hard' || pitch === 'Green' || pitch === 'Uneven';

    const sortedBowlers = [...squad].sort((a, b) => {
      if (selectedIds.has(cleanId(a.id))) return 1;
      if (selectedIds.has(cleanId(b.id))) return -1;
      let scoreA = getSkillScore(a.bowling) * 2 + getSkillScore(a.consistency);
      let scoreB = getSkillScore(b.bowling) * 2 + getSkillScore(b.consistency);
      if (isSpinPitch) {
        if (a.bowling_type?.toLowerCase().includes('spin')) scoreA += 6;
        if (b.bowling_type?.toLowerCase().includes('spin')) scoreB += 6;
      }
      if (isPacePitch) {
        if (a.bowling_type?.toLowerCase().includes('fast')) scoreA += 6;
        if (b.bowling_type?.toLowerCase().includes('fast')) scoreB += 6;
      }
      return scoreB - scoreA;
    });

    // Positions 7 to 11
    for (let p of sortedBowlers) {
      if (new11.length >= 11) break;
      const cid = cleanId(p.id);
      if (!selectedIds.has(cid)) {
        selectedIds.add(cid);
        new11.push(cid);
        newAgg.push(fmt === 'T20' ? 'Attacking' : 'Defensive');
      }
    }

    // Safety pad in case squad has fewer than 11
    for (let p of squad) {
      if (new11.length >= 11) break;
      const cid = cleanId(p.id);
      if (!selectedIds.has(cid)) {
        selectedIds.add(cid);
        new11.push(cid);
        newAgg.push('Moderate');
      }
    }

    setLineupPlayerIds(new11);
    setLineupAggressions(newAgg);
    setCaptainId(cleanId(captainRankings[0]?.player?.id || squad[0]?.id));
    setBowlerOvers(getFormatBowlerDefaults(fmt));
  };

  // Resolve player objects in lineup
  const active11Players = useMemo(() => {
    return lineupPlayerIds.map((id, idx) => {
      return squad.find(p => cleanId(p.id) === id) || squad[idx % squad.length] || squad[0];
    });
  }, [lineupPlayerIds, squad]);

  // 5-Man Bowling Attack from the 11
  const bowlingAttack = useMemo(() => {
    // Pick the top 5 bowling skills in the active 11
    return [...active11Players]
      .sort((a, b) => getSkillScore(b.bowling) - getSkillScore(a.bowling))
      .slice(0, 5);
  }, [active11Players]);

  const totalAllocatedOvers = bowlerOvers.reduce((a, b) => a + b, 0);
  const targetFormatOvers = matchFormat === 'T20' ? 20 : matchFormat === 'OD' ? 50 : 100;

  // Visual Fielding Positions on Oval
  const fieldPositions = useMemo(() => {
    if (fieldSetup === 'Attacking') {
      return [
        { name: 'Wicketkeeper', top: '80%', left: '46%', role: 'WK' },
        { name: '1st Slip', top: '76%', left: '57%', role: 'Catching' },
        { name: '2nd Slip', top: '72%', left: '65%', role: 'Catching' },
        { name: 'Gully', top: '65%', left: '73%', role: 'Catching' },
        { name: 'Point', top: '54%', left: '78%', role: 'Ring' },
        { name: 'Cover', top: '42%', left: '72%', role: 'Ring' },
        { name: 'Mid-Off', top: '34%', left: '58%', role: 'Ring' },
        { name: 'Bowler', top: '28%', left: '50%', role: 'Bowler' },
        { name: 'Mid-On', top: '34%', left: '42%', role: 'Ring' },
        { name: 'Mid-Wicket', top: '48%', left: '29%', role: 'Ring' },
        { name: 'Square Leg', top: '65%', left: '32%', role: 'Ring' }
      ];
    } else if (fieldSetup === 'Defensive') {
      return [
        { name: 'Wicketkeeper', top: '81%', left: '46%', role: 'WK' },
        { name: '1st Slip', top: '77%', left: '58%', role: 'Catching' },
        { name: 'Deep Point', top: '70%', left: '88%', role: 'Boundary' },
        { name: 'Deep Cover', top: '45%', left: '86%', role: 'Boundary' },
        { name: 'Long-Off', top: '15%', left: '65%', role: 'Boundary' },
        { name: 'Bowler', top: '28%', left: '50%', role: 'Bowler' },
        { name: 'Long-On', top: '15%', left: '35%', role: 'Boundary' },
        { name: 'Deep Mid-Wicket', top: '45%', left: '14%', role: 'Boundary' },
        { name: 'Deep Square Leg', top: '70%', left: '14%', role: 'Boundary' },
        { name: 'Fine Leg', top: '85%', left: '25%', role: 'Boundary' },
        { name: 'Third Man', top: '85%', left: '75%', role: 'Boundary' }
      ];
    } else {
      // Balanced
      return [
        { name: 'Wicketkeeper', top: '80%', left: '46%', role: 'WK' },
        { name: '1st Slip', top: '77%', left: '58%', role: 'Catching' },
        { name: 'Cover Point', top: '58%', left: '72%', role: 'Ring' },
        { name: 'Extra Cover', top: '45%', left: '68%', role: 'Ring' },
        { name: 'Mid-Off', top: '33%', left: '58%', role: 'Ring' },
        { name: 'Bowler', top: '28%', left: '50%', role: 'Bowler' },
        { name: 'Mid-On', top: '33%', left: '42%', role: 'Ring' },
        { name: 'Mid-Wicket', top: '48%', left: '32%', role: 'Ring' },
        { name: 'Deep Square Leg', top: '68%', left: '16%', role: 'Boundary' },
        { name: 'Deep Point', top: '68%', left: '84%', role: 'Boundary' },
        { name: 'Fine Leg', top: '85%', left: '30%', role: 'Boundary' }
      ];
    }
  }, [fieldSetup]);

  return (
    <div className="space-y-6">
      {/* Sovereign Stadium Tactical Header */}
      <div className="sovereign-card p-6 rounded-2xl border-emerald-500/40 relative overflow-hidden shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700">
              <Swords className="w-4 h-4 text-emerald-600" />
              <span>{mode === 'best-xi' ? '🛡️ Sovereign Best XI Lineup & Orders' : '⚔️ 22-Yd Pitch & Match Tactics Command'}</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mt-1 flex items-center gap-3">
              <span>{mode === 'best-xi' ? 'Best XI Match Lineup' : 'Tactics & Ground Command'}</span>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono font-bold">
                11 / 11 Active Positions
              </span>
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Design your match orders, visual cricket field settings, captaincy morale synergy, and 5-man bowling spells optimized for <strong className="text-emerald-700">{pitchProfiles[pitch].name}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Format Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              {(['FC', 'OD', 'T20'] as const).map(fmt => (
                <button
                  key={fmt}
                  onClick={() => {
                    setMatchFormat(fmt);
                    setBowlerOvers(getFormatBowlerDefaults(fmt));
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    matchFormat === fmt
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {fmt === 'FC' ? 'First Class' : fmt === 'OD' ? 'One Day' : 'BT20'}
                </button>
              ))}
            </div>

            {/* Pitch Selector */}
            <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-300 text-xs shadow-xs">
              <span className="text-slate-500 font-semibold mr-2">Surface:</span>
              <select
                value={pitch}
                onChange={(e) => setPitch(e.target.value as BattrickPitch)}
                className="bg-transparent text-emerald-700 font-bold focus:outline-none cursor-pointer"
              >
                <option value="Hard" className="bg-white text-slate-900">Hard & Fast (+25% Pace)</option>
                <option value="Green" className="bg-white text-slate-900">Green Seamer (+35% Seam)</option>
                <option value="Dusty" className="bg-white text-slate-900">Dry & Dusty (+40% Spin)</option>
                <option value="Slow" className="bg-white text-slate-900">Slow & Low Track</option>
                <option value="Flat" className="bg-white text-slate-900">Flat Highway Track</option>
                <option value="Uneven" className="bg-white text-slate-900">Uneven Surface</option>
              </select>
            </div>

            {/* 3 Dedicated Format Auto-Optimize Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-xs">
              <button
                onClick={() => autoOptimizeForFormat('FC')}
                className="btn-cricket-emerald flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer shadow-xs"
                title="Optimize XI for First Class: high concentration, patient batting, 3-seam/2-spin battery"
              >
                <span>🏆</span>
                <span>Auto FC XI</span>
              </button>
              <button
                onClick={() => autoOptimizeForFormat('OD')}
                className="btn-cricket-teal flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer shadow-xs"
                title="Optimize XI for One Day: balanced run scoring, powerplay & death bowlers"
              >
                <span>⚡</span>
                <span>Auto OD XI</span>
              </button>
              <button
                onClick={() => autoOptimizeForFormat('T20')}
                className="btn-cricket-amber flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer shadow-xs"
                title="Optimize XI for BT20: explosive boundary hitters & express strike bowling"
              >
                <span>🔥</span>
                <span>Auto T20 XI</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tactical Badges Strip: Captain, Keeper, Toss Strategy */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-200 text-xs">
          {/* Captaincy */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 border border-amber-300 flex items-center justify-center">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Match Captain (C)</span>
                <div className="font-black text-slate-900">{active11Players.find(p => cleanId(p.id) === captainId)?.name || 'Select Captain'}</div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-mono font-bold">
              +15% Morale
            </span>
          </div>

          {/* Wicketkeeper */}
          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 border border-teal-300 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Primary Keeper (WK)</span>
                <div className="font-black text-slate-900">{active11Players.find(p => cleanId(p.id) === keeperId)?.name || 'Select Keeper'}</div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-teal-200 text-teal-900 font-mono font-bold">
              Bye Defense
            </span>
          </div>

          {/* Toss Recommendation */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Toss Strategy Recommendation</span>
              <div className="font-black text-emerald-800 flex items-center gap-2 mt-0.5">
                <span>{pitchProfiles[pitch].tossRecommendation}</span>
                <span className="text-[10px] text-slate-600 font-normal">({pitch} pitch synergy)</span>
              </div>
            </div>
            <select
              value={tossDecision}
              onChange={(e) => setTossDecision(e.target.value as any)}
              className="bg-white text-xs font-bold text-slate-800 border border-slate-300 rounded-lg px-2 py-1 focus:outline-none"
            >
              <option value="Bat First">Bat First</option>
              <option value="Bowl First">Bowl First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs: Lineup vs 2D Field Formation vs Bowling Spells */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('lineup')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'lineup'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Batting Order (1 to 11)</span>
        </button>

        <button
          onClick={() => setActiveTab('field')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'field'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Visual Cricket Ground & Field Radar</span>
        </button>

        <button
          onClick={() => setActiveTab('bowling')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'bowling'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>5-Phase Bowling Spells & Overs ({totalAllocatedOvers}/{targetFormatOvers} ov)</span>
        </button>

        <button
          onClick={() => setActiveTab('pitch')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'pitch'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Swords className="w-4 h-4" />
          <span>22-Yard Pitch Strip & Surface Intel</span>
        </button>
      </div>

      {/* VIEW 1: INTERACTIVE 1 TO 11 BATTING LINEUP */}
      {activeTab === 'lineup' && (
        <div className="space-y-4">
          <div className="sovereign-card p-5 rounded-2xl shadow-md border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
              <span className="font-black uppercase text-emerald-700">
                Somnath Super Devs Starting XI Tactical Lineup
              </span>
              <span className="text-slate-500">
                Use <strong className="text-slate-800">▲ / ▼</strong> to reorder batsmen or click <strong className="text-amber-600">C</strong> / <strong className="text-teal-600">WK</strong> to reassign roles
              </span>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {active11Players.map((player, idx) => {
                const pId = cleanId(player.id);
                const isC = pId === captainId;
                const isWK = pId === keeperId;
                const aggression = lineupAggressions[idx] || 'Moderate';

                return (
                  <div 
                    key={pId} 
                    className="py-3 px-2 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-emerald-50/50 rounded-xl transition-all"
                  >
                    {/* Left: Position Number & Move Buttons */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => movePlayer(idx, idx - 1)}
                          disabled={idx === 0}
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-20 cursor-pointer text-[10px]"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => movePlayer(idx, idx + 1)}
                          disabled={idx === 10}
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-20 cursor-pointer text-[10px]"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center font-black font-mono text-sm shadow-xs">
                        #{idx + 1}
                      </div>

                      {/* Player Select Dropdown */}
                      <div className="min-w-[200px]">
                        <select
                          value={pId}
                          onChange={(e) => handlePlayerChange(idx, e.target.value)}
                          className="w-full bg-white text-slate-900 font-bold text-xs p-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-xs"
                        >
                          {squad.map(p => (
                            <option key={p.id} value={cleanId(p.id)} className="bg-white text-slate-900">
                              {p.name} ({p.age}yo) - {p.tactical_role}
                            </option>
                          ))}
                        </select>
                        <div className="text-[11px] text-slate-500 mt-0.5 font-mono flex items-center gap-1.5 flex-wrap">
                          <span>ID: #{pId}</span>
                          <span>&bull;</span>
                          <span>Bat: <strong className="text-emerald-700 capitalize">{player.batting}</strong></span>
                          <span>&bull;</span>
                          <span>Bowl: <strong className="text-teal-700 capitalize">{player.bowling}</strong></span>
                          <span>&bull;</span>
                          <span className="text-cyan-800 font-semibold cursor-help" title={getBowlingTypeFullName(player.bowling_type)}>
                            [{formatBowlingType(player.bowling_type)}]
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Tactical Role & Captain/Keeper Toggle */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCaptainId(pId)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                          isC
                            ? 'bg-amber-500 text-black shadow-xs font-black'
                            : 'bg-slate-100 text-slate-600 hover:text-amber-800 border border-slate-200'
                        }`}
                        title="Assign as Captain"
                      >
                        <Crown className="w-3 h-3" />
                        <span>(C)</span>
                      </button>

                      <button
                        onClick={() => setKeeperId(pId)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                          isWK
                            ? 'bg-teal-600 text-white shadow-xs font-black'
                            : 'bg-slate-100 text-slate-600 hover:text-teal-800 border border-slate-200'
                        }`}
                        title="Assign as Wicketkeeper"
                      >
                        <Shield className="w-3 h-3" />
                        <span>(WK)</span>
                      </button>

                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 hidden sm:inline font-mono cursor-help" title={getBattingHandFullName(player.batting_hand)}>
                        {formatBattingHand(player.batting_hand)}
                      </span>
                    </div>

                    {/* Right: Individual Aggression Setting */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Aggression:</span>
                      <select
                        value={aggression}
                        onChange={(e) => handleAggressionChange(idx, e.target.value as BattrickAggression)}
                        className={`text-xs font-black p-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                          aggression === 'Very Attacking' || aggression === 'Attacking'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : aggression === 'Very Defensive' || aggression === 'Defensive'
                            ? 'bg-slate-100 text-slate-800 border-slate-300'
                            : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        }`}
                      >
                        <option value="Very Defensive">Very Defensive</option>
                        <option value="Defensive">Defensive</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Attacking">Attacking</option>
                        <option value="Very Attacking">Very Attacking</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: VISUAL 2D CRICKET GROUND & FIELD FORMATION RADAR */}
      {activeTab === 'field' && (
        <div className="space-y-4">
          <div className="sovereign-card p-6 rounded-2xl border-slate-200 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-600" />
                  <span>2D Cricket Oval & Field Setup Radar</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Visual tactical representation of fielders positioned on the Prabhas Coastal Oval ground.
                </p>
              </div>

              <div className="flex items-center gap-1.5 nav-tab-track p-1 rounded-xl text-xs">
                {(['Attacking', 'Balanced', 'Defensive'] as FieldSetup[]).map(setup => (
                  <button
                    key={setup}
                    onClick={() => setFieldSetup(setup)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      fieldSetup === setup
                        ? 'btn-cricket-emerald shadow'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {setup}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Oval Field */}
            <div className="relative w-full h-[520px] rounded-3xl bg-gradient-to-b from-[#092b21] via-[#0d382b] to-[#092b21] border-4 border-emerald-600/40 overflow-hidden shadow-2xl flex items-center justify-center">
              {/* Boundary Rope Line */}
              <div className="absolute inset-4 rounded-[120px] border-2 border-dashed border-white/25 pointer-events-none" />

              {/* 30-Yard Inner Circle */}
              <div className="absolute w-[360px] h-[360px] rounded-full border-2 border-white/30 pointer-events-none" />

              {/* 22-Yard Central Cricket Pitch Strip */}
              <div className={`w-28 h-56 rounded-md shadow-2xl flex flex-col justify-between p-2 relative z-10 ${
                pitch === 'Green' ? 'cricket-pitch-green' : pitch === 'Dusty' ? 'cricket-pitch-dusty' : pitch === 'Uneven' ? 'cricket-pitch-uneven' : 'cricket-pitch-strip'
              }`}>
                {/* Bowling Crease & Stumps (Top - Pavilion End) */}
                <div className="w-full flex justify-center items-center gap-1 border-b-2 border-white/80 pb-1">
                  <span className="w-1.5 h-3 bg-amber-200 rounded-xs" />
                  <span className="w-1.5 h-3 bg-amber-200 rounded-xs" />
                  <span className="w-1.5 h-3 bg-amber-200 rounded-xs" />
                </div>

                <div className="text-[9px] font-black uppercase text-center text-white/90 drop-shadow">
                  {pitch} Pitch
                </div>

                {/* Batting Crease & Stumps (Bottom - Striker End) */}
                <div className="w-full flex justify-center items-center gap-1 border-t-2 border-white/80 pt-1">
                  <span className="w-1.5 h-3 bg-amber-200 rounded-xs" />
                  <span className="w-1.5 h-3 bg-amber-200 rounded-xs" />
                  <span className="w-1.5 h-3 bg-amber-200 rounded-xs" />
                </div>
              </div>

              {/* 11 Field Position Markers */}
              {fieldPositions.map((pos, idx) => {
                const playerAssigned = active11Players[idx] || squad[0];
                return (
                  <div
                    key={idx}
                    style={{ top: pos.top, left: pos.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-20"
                  >
                    <div className="w-8 h-8 rounded-full cricket-ball text-white text-[11px] font-mono font-black flex items-center justify-center border-2 border-white shadow-lg group-hover:scale-125 transition-transform">
                      {idx === 0 ? 'WK' : idx === 7 ? '⚡' : idx + 1}
                    </div>
                    <div className="mt-1 px-2 py-0.5 rounded-md bg-[#04120e]/90 text-white font-black text-[10px] whitespace-nowrap border border-emerald-500/40 shadow">
                      {pos.name}
                    </div>
                    <div className="text-[9px] text-amber-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 px-1.5 rounded">
                      {playerAssigned.name}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 pt-2">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-3 h-3 rounded-full cricket-ball" />
                <span>Fielders & Positions</span>
              </span>
              <span className="text-emerald-700 font-bold">
                Field Strategy: {fieldSetup} ({fieldSetup === 'Attacking' ? 'Targeting slips & edges' : fieldSetup === 'Defensive' ? 'Boundary ring protection' : 'Balanced containment'})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: 5-PHASE BOWLING ATTACK & SPELLS */}
      {activeTab === 'bowling' && (
        <div className="space-y-4">
          <div className="sovereign-card p-6 rounded-2xl border-slate-200 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span>5-Bowler Quota & Spell Rotation</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Allocate overs quota across your 5 bowlers strictly respecting Battrick format limits ({maxOversPerBowler} ov/bowler).
                </p>
              </div>

              <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-right shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500">Total Overs Allocated</span>
                <div className={`text-base font-black font-mono ${totalAllocatedOvers === targetFormatOvers ? 'text-emerald-700' : 'text-amber-600'}`}>
                  {totalAllocatedOvers} / {targetFormatOvers} Overs
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bowlingAttack.map((bowler, bIdx) => {
                const overs = bowlerOvers[bIdx] || maxOversPerBowler;
                const spellRole = bIdx === 0 ? 'Opening Bowler 1 (New Ball)' :
                                  bIdx === 1 ? 'Opening Bowler 2 (New Ball)' :
                                  bIdx === 2 ? 'First Change Strike' :
                                  bIdx === 3 ? 'Middle Spin Controller' : 'Fifth Option / All-Rounder';

                return (
                  <div key={bowler.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-black text-amber-700 tracking-wider">
                          {spellRole}
                        </span>
                        <h4 className="text-base font-black text-slate-900 mt-0.5">{bowler.name}</h4>
                        <div className="text-[11px] text-slate-600 flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono px-1.5 py-0.5 rounded text-[10px] bg-cyan-100 text-cyan-800 border border-cyan-300 font-bold" title={getBowlingTypeFullName(bowler.bowling_type)}>
                            {formatBowlingType(bowler.bowling_type)}
                          </span>
                          <span className="text-slate-500">({getBowlingTypeFullName(bowler.bowling_type)})</span>
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-mono font-black text-xs">
                        #{bIdx + 1}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center text-xs pt-2 border-t border-slate-200 font-mono">
                      <div className="p-1.5 rounded bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Bowling</span>
                        <strong className="text-teal-700 capitalize">{bowler.bowling}</strong>
                      </div>
                      <div className="p-1.5 rounded bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Stamina</span>
                        <strong className="text-emerald-700 capitalize">{bowler.stamina}</strong>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                        <span>Overs Spell Allocation:</span>
                        <span className="text-amber-700 font-mono">{overs} Overs</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max={maxOversPerBowler}
                        value={overs}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setBowlerOvers(prev => {
                            const next = [...prev];
                            next[bIdx] = val;
                            return next;
                          });
                        }}
                        className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* VIEW 4: 22-YARD PITCH STRIP & SURFACE CONDITIONS INTEL */}
      {activeTab === 'pitch' && (
        <div className="space-y-6">
          <div className="sovereign-card p-6 rounded-2xl border-slate-200 shadow-md space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700">
                  <span className="w-3 h-3 rounded-full cricket-ball"></span>
                  <span>Prabhas Coastal Oval &bull; 22-Yard Pitch Command</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
                  <span>{pitchProfiles[pitch].name}</span>
                  <span className="text-lg">🏏</span>
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-xl">
                  Inspect the physical surface dynamics, bounce multipliers, spin coefficients, and tactical toss directives for this pitch.
                </p>
              </div>

              {/* Pitch Selector Buttons */}
              <div className="flex flex-wrap gap-2">
                {(['Hard', 'Green', 'Dusty', 'Slow', 'Flat', 'Uneven'] as BattrickPitch[]).map(pType => (
                  <button
                    key={pType}
                    onClick={() => setPitch(pType)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                      pitch === pType
                        ? 'bg-amber-500 text-black border-amber-400 shadow-sm'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    {pType}
                  </button>
                ))}
              </div>
            </div>

            {/* Pitch Visual Strip & Surface Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Graphical 22-Yard Pitch Strip */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
                <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider mb-3">
                  22-Yard Turf Surface Strip (20.12m)
                </span>

                <div className={`w-40 h-80 rounded-xl shadow-md flex flex-col justify-between p-3 relative border-4 border-[#8c6747] ${
                  pitch === 'Green' ? 'cricket-pitch-green' : pitch === 'Dusty' ? 'cricket-pitch-dusty' : pitch === 'Uneven' ? 'cricket-pitch-uneven' : 'cricket-pitch-strip'
                }`}>
                  {/* Top Bowling Crease & Stumps (North End) */}
                  <div className="w-full flex flex-col items-center border-b-2 border-white/90 pb-2">
                    <div className="flex items-end gap-1.5 h-6">
                      <span className="w-1.5 h-5 bg-amber-200 rounded-xs shadow"></span>
                      <span className="w-1.5 h-5 bg-amber-200 rounded-xs shadow"></span>
                      <span className="w-1.5 h-5 bg-amber-200 rounded-xs shadow"></span>
                    </div>
                    <span className="text-[9px] font-mono font-bold mt-1 px-2.5 py-0.5 rounded-full bg-black/85 text-white shadow-sm border border-white/20">Bowling Crease</span>
                  </div>

                  {/* Pitch Center Surface Intel */}
                  <div className="text-center bg-black/60 backdrop-blur-xs p-2 rounded-lg border border-white/20">
                    <div className="text-xs font-black text-amber-300 uppercase tracking-wider">{pitch} Track</div>
                    <div className="text-[10px] text-white font-mono mt-0.5">{pitchProfiles[pitch].paceModifier}</div>
                    <div className="text-[10px] text-teal-300 font-mono">{pitchProfiles[pitch].spinModifier}</div>
                  </div>

                  {/* Bottom Batting Crease & Stumps (Striker End) */}
                  <div className="w-full flex flex-col items-center border-t-2 border-white/90 pt-2">
                    <span className="text-[9px] font-mono font-bold mb-1 px-2.5 py-0.5 rounded-full bg-black/85 text-white shadow-sm border border-white/20">Popping Crease</span>
                    <div className="flex items-end gap-1.5 h-6">
                      <span className="w-1.5 h-5 bg-amber-200 rounded-xs shadow"></span>
                      <span className="w-1.5 h-5 bg-amber-200 rounded-xs shadow"></span>
                      <span className="w-1.5 h-5 bg-amber-200 rounded-xs shadow"></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4 text-[11px] text-slate-600 font-mono">
                  <span>Width: 3.05m</span>
                  <span>&bull;</span>
                  <span className="text-emerald-700 font-bold">Standard Turf Match Pitch</span>
                </div>
              </div>

              {/* Tactical Analysis & Recommendations */}
              <div className="lg:col-span-7 space-y-4">
                {/* 3 Metric Gauges */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] uppercase font-black text-slate-500 block">Pace & Bounce</span>
                    <strong className="text-base font-black text-emerald-700 font-mono mt-1 block">
                      {pitchProfiles[pitch].paceModifier}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] uppercase font-black text-slate-500 block">Seam Movement</span>
                    <strong className="text-base font-black text-teal-700 font-mono mt-1 block">
                      {pitchProfiles[pitch].seamModifier}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] uppercase font-black text-slate-500 block">Spin Bite</span>
                    <strong className="text-base font-black text-amber-700 font-mono mt-1 block">
                      {pitchProfiles[pitch].spinModifier}
                    </strong>
                  </div>
                </div>

                {/* Toss Strategy Card */}
                <div className="p-4 rounded-xl sovereign-card border border-emerald-400 shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black uppercase text-amber-700 flex items-center gap-1.5">
                      <span>🪙</span> Toss Directive
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-black">
                      Recommended: {pitchProfiles[pitch].tossRecommendation}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed mt-1">
                    {pitchProfiles[pitch].battingConditions}
                  </p>
                </div>

                {/* Recommended Bowlers */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-black uppercase text-teal-700 flex items-center gap-1.5 mb-1">
                    <span>⚡</span> Prime Bowler Arsenal
                  </span>
                  <div className="text-sm font-black text-slate-900 mt-1">
                    {pitchProfiles[pitch].recommendedBowlers}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {pitchProfiles[pitch].tacticsTip}
                  </p>
                </div>

                {/* Quick Auto-Lineup Action */}
                <button
                  onClick={() => autoOptimizeForFormat(matchFormat)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <Dices className="w-4 h-4" />
                  <span>Auto-Align Best XI to {pitch} Surface ({matchFormat}) &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
