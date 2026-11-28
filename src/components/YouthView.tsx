import React, { useState } from 'react';
import { Player, Club } from '../types/database';
import { Sparkles, Dices, Award, CheckCircle2, Sliders, UserPlus, Target } from 'lucide-react';
import { formatBowlingType, formatBattingHand } from '../lib/cricketFormatters';

interface YouthViewProps {
  squad: Player[];
  club?: Club;
  onPromotePlayer?: (newPlayer: Player) => void;
}

export const YouthView: React.FC<YouthViewProps> = ({ squad, club, onPromotePlayer }) => {
  // Official Battrick Rules:
  // - Club bank can hold up to 70 ITS points max
  // - A single youth pull can use a MAXIMUM of 35 ITS points
  // - Weekly investment is £36,000/week (Level 20, granting 3 ITS/week)
  const bankedITS = club?.its_points ?? 0;
  const MAX_ITS_PER_PULL = 35;
  const weeklyInvestment = club?.youth_investment ?? (club?.its_points && club.its_points > 0 ? 36000 : 0);

  // Player Specification for Saturday Youth Pull
  const [traineeRole, setTraineeRole] = useState<'Batter' | 'Spinner' | 'Pacer' | 'Keeper' | 'AllRounder'>('Batter');
  const [battingHand, setBattingHand] = useState<'RHB' | 'LHB'>('LHB');
  const [bowlingStyle, setBowlingStyle] = useState<string>('None');

  // Interactive ITS Point Allocations (Capped at 35 ITS MAX per pull)
  const [allocations, setAllocations] = useState<{
    batting: number;
    bowling: number;
    keeping: number;
    fielding: number;
    concentration: number;
    consistency: number;
    stamina: number;
  }>({
    batting: 14,
    bowling: 0,
    keeping: 1,
    fielding: 4,
    concentration: 8,
    consistency: 5,
    stamina: 3
  });

  const [simulatedPull, setSimulatedPull] = useState<Player | null>(null);
  const [isPromoted, setIsPromoted] = useState(false);

  // Total allocated for THIS pull (Max 35)
  const totalAllocatedThisPull = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  const remainingForThisPull = MAX_ITS_PER_PULL - totalAllocatedThisPull;
  const remainingBankAfterPull = bankedITS - totalAllocatedThisPull;

  const wonderkids = squad.filter(p => p.is_wonderkid);

  // Quick Archetype Presets (Strictly calibrated to sum exactly to 35 ITS)
  const applyPreset = (preset: 'Batter' | 'Spinner' | 'Pacer' | 'Keeper' | 'AllRounder') => {
    setTraineeRole(preset);
    if (preset === 'Batter') {
      setBattingHand('LHB');
      setBowlingStyle('None');
      setAllocations({ batting: 14, bowling: 0, keeping: 1, fielding: 3, concentration: 9, consistency: 5, stamina: 3 });
    } else if (preset === 'Spinner') {
      setBattingHand('RHB');
      setBowlingStyle('Right-arm Finger Spin');
      setAllocations({ batting: 1, bowling: 14, keeping: 0, fielding: 3, concentration: 4, consistency: 9, stamina: 4 });
    } else if (preset === 'Pacer') {
      setBattingHand('RHB');
      setBowlingStyle('Right-arm Fast');
      setAllocations({ batting: 1, bowling: 14, keeping: 0, fielding: 3, concentration: 4, consistency: 8, stamina: 5 });
    } else if (preset === 'Keeper') {
      setBattingHand('RHB');
      setBowlingStyle('None');
      setAllocations({ batting: 9, bowling: 0, keeping: 14, fielding: 4, concentration: 5, consistency: 1, stamina: 2 });
    } else if (preset === 'AllRounder') {
      setBattingHand('LHB');
      setBowlingStyle('Left-arm Medium');
      setAllocations({ batting: 10, bowling: 10, keeping: 0, fielding: 3, concentration: 5, consistency: 4, stamina: 3 });
    }
  };

  const handleSliderChange = (skill: keyof typeof allocations, val: number) => {
    setAllocations(prev => ({
      ...prev,
      [skill]: Math.max(0, val)
    }));
  };

  function pointsToLevel(pts: number): string {
    if (pts >= 14) return 'respectable';
    if (pts >= 11) return 'competent';
    if (pts >= 7) return 'mediocre';
    if (pts >= 3) return 'feeble';
    if (pts >= 1) return 'woeful';
    return 'worthless';
  }

  const handleExecuteDraft = () => {
    const firstNames = ['Bhadraksh', 'Nandakishor', 'Karthik', 'Dhanush', 'Ranganath', 'Tirumalai', 'Sriram', 'Venkatesan', 'Achintya', 'Arvind'];
    const lastNames = ['Narayanan', 'Subramanian', 'Iyengar', 'Sundaresan', 'Rajagopalan', 'Meenakshi', 'Krishnaswamy', 'Gowda', 'Somal'];
    const randomName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    
    // Generate clean 7-digit numeric ID
    const generatedId = (6099510 + Math.floor(Math.random() * 400)).toString();

    const batLevel = pointsToLevel(allocations.batting);
    const bowlLevel = pointsToLevel(allocations.bowling);
    const keepLevel = pointsToLevel(allocations.keeping);
    const fldLevel = pointsToLevel(allocations.fielding);
    const concLevel = pointsToLevel(allocations.concentration);
    const consLevel = pointsToLevel(allocations.consistency);
    const stamLevel = pointsToLevel(allocations.stamina);

    // Calculate realistic 17yo BTI from 35 allocated points + Superb academy base
    const calculatedBti = 5200 + (totalAllocatedThisPull * 48) + Math.floor(Math.random() * 250);
    const calculatedWage = 480 + Math.floor((calculatedBti - 4800) / 40);

    const newWonderkid: Player = {
      id: generatedId,
      club_id: club?.id || '',
      name: randomName,
      age: 17,
      wage: calculatedWage,
      batting_hand: battingHand,
      bowling_type: bowlingStyle,
      batting: batLevel,
      bowling: bowlLevel,
      keeping: keepLevel,
      fielding: fldLevel,
      consistency: consLevel,
      concentration: concLevel,
      stamina: stamLevel,
      form: 'respectable',
      fatigue: 'sublime',
      leadership: 'competent',
      experience: 'worthless',
      bti: calculatedBti,
      subskill: 6.80,
      active_net: 'Unassigned',
      market_value: 620000 + Math.floor(Math.random() * 60000),
      tactical_role: `${traineeRole === 'Batter' ? 'Top-Order Batter' : traineeRole === 'Spinner' ? 'Finger Spinner' : traineeRole === 'Pacer' ? 'Opening Fast Bowler' : traineeRole === 'Keeper' ? 'Wicketkeeper' : 'All-Rounder'} (Wonderkid)`,
      is_wonderkid: true,
      uniqueRecords: [
        `Saturday Academy Pull with ${totalAllocatedThisPull} Allocated ITS Points (Max 35)`,
        `17yo Superb Academy Prodigy fast-tracked for Friday Net Training`
      ],
      statsFC: { matches: 0, innings: 0, runs: 0, highestScore: '-', average: 0, strikeRate: 0, centuries: 0, fifties: 0, fours: 0, sixes: 0, oversBowled: 0, wickets: 0, bestBowling: '-', bowlingAverage: 0, economy: 0, fiveWickets: 0, catches: 0, stumpings: 0 },
      statsOD: { matches: 0, innings: 0, runs: 0, highestScore: '-', average: 0, strikeRate: 0, centuries: 0, fifties: 0, fours: 0, sixes: 0, oversBowled: 0, wickets: 0, bestBowling: '-', bowlingAverage: 0, economy: 0, fiveWickets: 0, catches: 0, stumpings: 0 },
      statsT20: { matches: 0, innings: 0, runs: 0, highestScore: '-', average: 0, strikeRate: 0, centuries: 0, fifties: 0, fours: 0, sixes: 0, oversBowled: 0, wickets: 0, bestBowling: '-', bowlingAverage: 0, economy: 0, fiveWickets: 0, catches: 0, stumpings: 0 }
    };

    setSimulatedPull(newWonderkid);
    setIsPromoted(false);
  };

  const handlePromoteToSquad = () => {
    if (simulatedPull && onPromotePlayer) {
      onPromotePlayer(simulatedPull);
      setIsPromoted(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Youth Academy Sovereign Header */}
      <div className="sovereign-card p-6 rounded-2xl border-emerald-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{club?.name && club.name !== 'Awaiting Club Import' ? club.name : 'Club'} &bull; {club?.youth_academy_level || 'Youth'} Academy (ITS)</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <span>Saturday Youth Draft & ITS Point Allocator</span>
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            The lifeblood of your cricket franchise. In Battrick, your club can bank up to <strong className="text-amber-700">70 ITS points</strong> total, with a strict engine cap of <strong className="text-emerald-700">35 ITS points per single youth pull</strong>. With {bankedITS} ITS banked, you have enough points for <strong className="text-amber-700">{Math.floor(bankedITS / 35)} complete 35-point wonderkid pulls</strong>!
          </p>
        </div>

        {/* Live Bank & Weekly Funding Cards */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-center min-w-[140px] shadow-xs">
            <span className="text-[10px] uppercase font-black text-slate-500 block">Banked ITS Reserve</span>
            <div className="text-2xl font-black font-mono text-amber-700 mt-0.5">
              {bankedITS} / 70 Max
            </div>
            <span className="text-[10px] text-emerald-700 font-bold">{Math.floor(bankedITS / 35)} Full Pulls Ready</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[170px] shadow-xs">
            <div className="flex items-center justify-between text-[10px] uppercase font-black text-slate-500 mb-1">
              <span>Weekly Investment</span>
              <span className="text-amber-700 font-mono font-bold">Lvl 20 (Max)</span>
            </div>
            <div className="text-xl font-black font-mono text-slate-900 mb-1">
              £{weeklyInvestment.toLocaleString()}/wk
            </div>
            <span className="text-[10px] text-emerald-700 font-bold block">+3 ITS Added Every Sunday</span>
          </div>
        </div>
      </div>

      {/* 2-PULL STRATEGIC PIPELINE PLANNER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pull 1 Status */}
        <div className="p-4 rounded-xl sovereign-card border-emerald-400 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-800" />
              <span className="text-xs font-black uppercase text-emerald-800">Active Pull #1 (This Saturday)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono font-black">
              Max 35 ITS
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-700">
            Current configuration allocates <strong className="text-amber-700 font-bold font-mono">{totalAllocatedThisPull} / 35 ITS</strong>. This creates an immediate 17-year-old wonderkid ready for Friday training nets.
          </div>
        </div>

        {/* Pull 2 Reserve Status */}
        <div className="p-4 rounded-xl sovereign-card-gold border-amber-300 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">⏳</span>
              <span className="text-xs font-black uppercase text-amber-800">Reserve Pull #2 (Next Saturday)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-mono font-black">
              35 ITS Banked
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-700">
            After this pull, you will still retain <strong className="text-emerald-700 font-bold font-mono">{remainingBankAfterPull} ITS points</strong> in reserve, allowing an immediate second 35-ITS wonderkid pull next week!
          </div>
        </div>
      </div>

      {/* ITS ALLOCATION CONTROL CONSOLE */}
      <div className="sovereign-card p-6 rounded-2xl border-slate-200 shadow-md space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Saturday Trainee Specification & 35-ITS Point Allocator</span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Distribute your 35 ITS points across the 7 skills below. Points determine the starting skill levels of your 17yo draft pull.
            </p>
          </div>

          {/* Allocation Budget Meter (Strictly 35 Max) */}
          <div className={`px-4 py-2 rounded-xl border font-mono font-black text-xs flex items-center gap-2 shadow-xs ${
            remainingForThisPull === 0 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
              : remainingForThisPull > 0 
              ? 'bg-amber-50 text-amber-800 border-amber-300' 
              : 'bg-rose-50 text-rose-800 border-rose-300'
          }`}>
            <span>This Pull:</span>
            <span className="text-sm font-black">{totalAllocatedThisPull} / {MAX_ITS_PER_PULL} ITS</span>
            <span>({remainingForThisPull >= 0 ? `${remainingForThisPull} remaining` : `${Math.abs(remainingForThisPull)} over 35 limit`})</span>
          </div>
        </div>

        {/* Quick Presets & Player Specification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <span className="text-[10px] uppercase font-black text-emerald-800">Quick 35-ITS Archetype Presets</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'Pure Opening Batter', type: 'Batter' as const },
                { label: 'Strike Finger Spinner', type: 'Spinner' as const },
                { label: 'Express Opening Pacer', type: 'Pacer' as const },
                { label: 'Specialist Wicketkeeper', type: 'Keeper' as const },
                { label: 'Dynamic All-Rounder', type: 'AllRounder' as const }
              ].map(p => (
                <button
                  key={p.type}
                  onClick={() => applyPreset(p.type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    traineeRole === p.type
                      ? 'bg-amber-500 text-black shadow-xs font-black border border-amber-400'
                      : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-black">Batting Hand</span>
              <select
                value={battingHand}
                onChange={(e) => setBattingHand(e.target.value as any)}
                className="mt-1 w-full p-2 rounded-lg bg-white text-slate-900 font-bold border border-slate-300 focus:outline-none cursor-pointer shadow-xs"
              >
                <option value="RHB">Right Hand Bat (RHB)</option>
                <option value="LHB">Left Hand Bat (LHB)</option>
              </select>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-black">Bowling Style</span>
              <select
                value={bowlingStyle}
                onChange={(e) => setBowlingStyle(e.target.value)}
                className="mt-1 w-full p-2 rounded-lg bg-white text-slate-900 font-bold border border-slate-300 focus:outline-none cursor-pointer shadow-xs"
              >
                <option value="None">None (Pure Batter/Keeper)</option>
                <option value="Right-arm Fast">Right-arm Fast (RF)</option>
                <option value="Right-arm Fast Medium">Right-arm Fast Medium (RFM)</option>
                <option value="Left-arm Fast Medium">Left-arm Fast Medium (LFM)</option>
                <option value="Left-arm Medium">Left-arm Medium (LM)</option>
                <option value="Right-arm Finger Spin">Right-arm Finger Spin (Off Spin)</option>
                <option value="Right-arm Wrist Spin">Right-arm Wrist Spin (Leg Spin)</option>
                <option value="Left-arm Finger Spin">Left-arm Finger Spin (Orthodox)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 7 Skill Sliders with Live Battrick Level Translations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {[
            { key: 'batting' as const, label: 'Batting', max: 20, color: 'accent-emerald-600' },
            { key: 'bowling' as const, label: 'Bowling', max: 20, color: 'accent-teal-600' },
            { key: 'keeping' as const, label: 'Keeping', max: 20, color: 'accent-cyan-600' },
            { key: 'fielding' as const, label: 'Fielding', max: 10, color: 'accent-amber-600' },
            { key: 'concentration' as const, label: 'Concentration', max: 12, color: 'accent-emerald-600' },
            { key: 'consistency' as const, label: 'Consistency', max: 12, color: 'accent-teal-600' },
            { key: 'stamina' as const, label: 'Stamina', max: 10, color: 'accent-amber-600' }
          ].map(skill => {
            const val = allocations[skill.key];
            const level = pointsToLevel(val);
            return (
              <div key={skill.key} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-black text-slate-900">{skill.label}</span>
                  <span className="font-mono font-black text-amber-700">{val} pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={skill.max}
                  value={val}
                  onChange={(e) => handleSliderChange(skill.key, Number(e.target.value))}
                  className={`w-full cursor-pointer h-2 bg-slate-200 rounded-lg ${skill.color}`}
                />
                <div className="flex justify-between items-center text-[11px] pt-1.5 border-t border-slate-200">
                  <span className="text-slate-500">Predicted Skill:</span>
                  <span className="capitalize font-mono font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    {level}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Action Trigger Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-300 flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-[10px] uppercase font-black text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
                <span>Saturday Draft Pull</span>
              </span>
              <div className="text-xs text-slate-700 mt-1">
                Draw 17yo trainee with {totalAllocatedThisPull}/35 allocated ITS points.
              </div>
            </div>

            <button
              onClick={handleExecuteDraft}
              disabled={totalAllocatedThisPull > MAX_ITS_PER_PULL || totalAllocatedThisPull === 0}
              className={`w-full py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md ${
                totalAllocatedThisPull > MAX_ITS_PER_PULL || totalAllocatedThisPull === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black border border-amber-400'
              }`}
            >
              <Dices className="w-4 h-4" />
              <span>Pull 17yo Youth Trainee &rarr;</span>
            </button>
          </div>
        </div>
      </div>

      {/* REVEAL ROOM: GENERATED 17YO TRAINEE CARD */}
      {simulatedPull && (
        <div className="p-6 rounded-2xl sovereign-card-gold border-2 border-amber-400 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-300">
            <div className="flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-amber-600" />
              <div>
                <span className="text-[10px] uppercase font-mono font-black text-amber-800 tracking-wider flex items-center gap-1">
                  <span>Saturday Intake Certified</span> &bull; <span>17yo Superb Academy Wonderkid</span>
                </span>
                <h3 className="text-2xl font-black text-slate-900">{simulatedPull.name}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                #{simulatedPull.id}
              </span>
              <span className="text-xs font-mono font-black px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                BTI: {simulatedPull.bti.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Generated Trainee Full Skills Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs text-center">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-black">Batting</span>
              <div className="text-sm font-black capitalize text-emerald-700 mt-0.5">{simulatedPull.batting}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-black">Bowling</span>
              <div className="text-sm font-black capitalize text-teal-700 mt-0.5">{simulatedPull.bowling}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-black">Keeping</span>
              <div className="text-sm font-black capitalize text-slate-800 mt-0.5">{simulatedPull.keeping}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-black">Fielding</span>
              <div className="text-sm font-black capitalize text-amber-700 mt-0.5">{simulatedPull.fielding}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-black">Concentration</span>
              <div className="text-sm font-black capitalize text-emerald-700 mt-0.5">{simulatedPull.concentration}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-black">Consistency</span>
              <div className="text-sm font-black capitalize text-teal-700 mt-0.5">{simulatedPull.consistency}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-black">Stamina</span>
              <div className="text-sm font-black capitalize text-amber-700 mt-0.5">{simulatedPull.stamina}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-amber-300 text-xs">
            <div className="text-slate-800">
              <span>Role: <strong className="text-slate-900 font-bold">{simulatedPull.tactical_role}</strong></span>
              <span className="mx-2">&bull;</span>
              <span>Style: <strong className="text-slate-900 font-mono">{formatBattingHand(simulatedPull.batting_hand)} | {formatBowlingType(simulatedPull.bowling_type)}</strong> <span className="text-slate-500 font-sans">({simulatedPull.bowling_type})</span></span>
              <span className="mx-2">&bull;</span>
              <span>Wage: <strong className="text-slate-900 font-mono">£{simulatedPull.wage}/wk</strong></span>
            </div>

            {isPromoted ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-black bg-emerald-100 px-4 py-2 rounded-xl border border-emerald-300 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Successfully Inducted into Senior Roster!</span>
              </div>
            ) : (
              <button
                onClick={handlePromoteToSquad}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs transition-all cursor-pointer shadow-md flex items-center gap-2 border border-emerald-500"
              >
                <UserPlus className="w-4 h-4" />
                <span>Induct Trainee into First Team Squad &rarr;</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ACTIVE ACADEMY WONDERKIDS IN SENIOR ROSTER */}
      <div className="sovereign-card p-6 rounded-2xl border-slate-200 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Active Academy Wonderkids Currently in Senior Roster ({wonderkids.length})</span>
          </h3>
          <span className="text-xs text-emerald-800 font-mono font-black bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            17yo Prodigies
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wonderkids.map((player) => (
            <div key={player.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center hover:border-amber-400 transition-all shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black text-emerald-700">#{player.id}</span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-black font-mono">
                    Age {player.age} Wonderkid
                  </span>
                </div>
                <h4 className="text-base font-black text-slate-900 mt-1">{player.name}</h4>
                <div className="text-xs text-slate-600 mt-0.5">{player.tactical_role} &bull; {player.batting_hand}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-black">BTI Talent</span>
                <div className="text-base font-black font-mono text-emerald-700">{(player.bti ?? 0).toLocaleString()}</div>
                <span className="text-[10px] text-amber-700 font-black">Subskill: {player.subskill} / 7.0</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
