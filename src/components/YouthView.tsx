import React, { useState } from 'react';
import { Player } from '../types/database';
import { Sparkles, Dices, Award, CheckCircle2, Sliders, UserPlus } from 'lucide-react';

interface YouthViewProps {
  squad: Player[];
  onPromotePlayer?: (newPlayer: Player) => void;
}

export const YouthView: React.FC<YouthViewProps> = ({ squad, onPromotePlayer }) => {
  const [weeklyInvestment, setWeeklyInvestment] = useState<number>(36000);
  const bankedITS = 70; // Maximum in Battrick is 70 points
  
  // Player Specification for Saturday Youth Pull
  const [traineeRole, setTraineeRole] = useState<'Batter' | 'Spinner' | 'Pacer' | 'Keeper' | 'AllRounder'>('Batter');
  const [battingHand, setBattingHand] = useState<'RHB' | 'LHB'>('RHB');
  const [bowlingStyle, setBowlingStyle] = useState<string>('Right-arm Finger Spin');

  // Interactive ITS Point Allocations (Must sum to bankedITS or user's target, max 70)
  const [allocations, setAllocations] = useState<{
    batting: number;
    bowling: number;
    keeping: number;
    fielding: number;
    concentration: number;
    consistency: number;
    stamina: number;
  }>({
    batting: 25,
    bowling: 2,
    keeping: 2,
    fielding: 8,
    concentration: 15,
    consistency: 10,
    stamina: 8
  });

  const [simulatedPull, setSimulatedPull] = useState<Player | null>(null);
  const [isPromoted, setIsPromoted] = useState(false);

  const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  const remainingPoints = bankedITS - totalAllocated;

  const wonderkids = squad.filter(p => p.is_wonderkid);

  // Quick preset templates
  const applyPreset = (preset: 'Batter' | 'Spinner' | 'Pacer' | 'Keeper' | 'AllRounder') => {
    setTraineeRole(preset);
    if (preset === 'Batter') {
      setBattingHand('LHB');
      setBowlingStyle('None');
      setAllocations({ batting: 26, bowling: 0, keeping: 2, fielding: 8, concentration: 16, consistency: 10, stamina: 8 });
    } else if (preset === 'Spinner') {
      setBattingHand('RHB');
      setBowlingStyle('Right-arm Finger Spin');
      setAllocations({ batting: 2, bowling: 26, keeping: 2, fielding: 8, concentration: 10, consistency: 14, stamina: 8 });
    } else if (preset === 'Pacer') {
      setBattingHand('RHB');
      setBowlingStyle('Right-arm Fast');
      setAllocations({ batting: 3, bowling: 26, keeping: 0, fielding: 9, concentration: 8, consistency: 14, stamina: 10 });
    } else if (preset === 'Keeper') {
      setBattingHand('RHB');
      setBowlingStyle('None');
      setAllocations({ batting: 12, bowling: 0, keeping: 26, fielding: 12, concentration: 8, consistency: 6, stamina: 6 });
    } else if (preset === 'AllRounder') {
      setBattingHand('LHB');
      setBowlingStyle('Left-arm Medium');
      setAllocations({ batting: 18, bowling: 18, keeping: 2, fielding: 10, concentration: 8, consistency: 8, stamina: 6 });
    }
  };

  const handleSliderChange = (skill: keyof typeof allocations, val: number) => {
    setAllocations(prev => ({
      ...prev,
      [skill]: Math.max(0, val)
    }));
  };

  // Convert ITS points directly to official Battrick skill levels
  function pointsToLevel(pts: number): string {
    if (pts >= 25) return 'competent';
    if (pts >= 18) return 'mediocre';
    if (pts >= 11) return 'feeble';
    if (pts >= 5) return 'woeful';
    if (pts >= 1) return 'abysmal';
    return 'worthless';
  }

  const handleExecuteDraft = () => {
    const firstNames = ['Bhadraksh', 'Nandakishor', 'Karthik', 'Dhanush', 'Ranganath', 'Tirumalai', 'Sriram', 'Venkatesan'];
    const lastNames = ['Narayanan', 'Subramanian', 'Iyengar', 'Sundaresan', 'Rajagopalan', 'Meenakshi', 'Krishnaswamy'];
    const randomName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    
    // Generate clean 7-digit numeric ID without "BT-"
    const generatedId = (6099500 + Math.floor(Math.random() * 400)).toString();

    const batLevel = pointsToLevel(allocations.batting);
    const bowlLevel = pointsToLevel(allocations.bowling);
    const keepLevel = pointsToLevel(allocations.keeping);
    const fldLevel = pointsToLevel(allocations.fielding);
    const concLevel = pointsToLevel(allocations.concentration);
    const consLevel = pointsToLevel(allocations.consistency);
    const stamLevel = pointsToLevel(allocations.stamina);

    // Calculate BTI from allocated points
    const calculatedBti = 5800 + (totalAllocated * 28) + Math.floor(Math.random() * 200);
    const calculatedWage = 520 + Math.floor((calculatedBti - 5500) / 45);

    const newWonderkid: Player = {
      id: generatedId,
      club_id: '13108',
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
      subskill: 6.70,
      active_net: 'Unassigned',
      market_value: 650000 + Math.floor(Math.random() * 50000),
      tactical_role: `${traineeRole === 'Batter' ? 'Top-Order Batter' : traineeRole === 'Spinner' ? 'Finger Spinner' : traineeRole === 'Pacer' ? 'Opening Fast Bowler' : traineeRole === 'Keeper' ? 'Wicketkeeper' : 'All-Rounder'} (Wonderkid)`,
      is_wonderkid: true,
      uniqueRecords: [
        `Level 20 Saturday Academy Pull with ${totalAllocated} Allocated ITS Points`,
        `17yo Trainee fast-tracked for Friday skill pops`
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
      {/* Youth Academy Header */}
      <div className="bg-[#0e2c24] p-6 rounded-2xl border border-emerald-600/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Youth Academy & Individual Training Scheme (ITS)</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Somnath Super Devs Youth Academy & Saturday Draft Intake
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            The foundation of long-term Battrick success. Bank up to 70 ITS points through £36,000/week investments, distribute points precisely across technical skills, and pull elite 17yo wonderkids every Saturday.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#061713] px-4 py-2.5 rounded-xl border border-amber-600/50 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Banked ITS Points</span>
            <div className="text-2xl font-black font-mono text-amber-300">
              {bankedITS} / 70 Max
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">Ready for Allocation</span>
          </div>

          <div className="bg-[#061713] px-4 py-2.5 rounded-xl border border-emerald-800/40 text-center min-w-44">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 mb-1">
              <span>Weekly Investment</span>
              <span className="text-amber-400 font-mono">Lvl {weeklyInvestment / 1800}</span>
            </div>
            <div className="text-xl font-black font-mono text-white mb-1.5">
              £{weeklyInvestment.toLocaleString()}/wk
            </div>
            <input
              type="range"
              min="0"
              max="36000"
              step="4000"
              value={weeklyInvestment}
              onChange={(e) => setWeeklyInvestment(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-[#0e2c24] rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* ITS ALLOCATION CONTROL CONSOLE */}
      <div className="bg-[#0e2c24] p-6 rounded-2xl border border-emerald-600/30 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-emerald-800/40">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Saturday 17yo Youth Trainee Specification & ITS Point Allocator</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Distribute your {bankedITS} banked ITS points across the 7 skills below. Points determine starting skill levels.
            </p>
          </div>

          {/* Allocation Budget Meter */}
          <div className={`px-4 py-2 rounded-xl border font-mono font-bold text-xs flex items-center gap-2 ${
            remainingPoints === 0 
              ? 'bg-emerald-950 text-emerald-300 border-emerald-600' 
              : remainingPoints > 0 
              ? 'bg-amber-950 text-amber-300 border-amber-600' 
              : 'bg-rose-950 text-rose-300 border-rose-600'
          }`}>
            <span>Total Points:</span>
            <span className="text-sm font-black">{totalAllocated} / {bankedITS}</span>
            <span>({remainingPoints >= 0 ? `${remainingPoints} remaining` : `${Math.abs(remainingPoints)} over budget`})</span>
          </div>
        </div>

        {/* Quick Presets & Player Specification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#061713] border border-emerald-800/40 space-y-2.5">
            <span className="text-[10px] uppercase font-bold text-amber-400">Quick Archetype Presets</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: '🏏 Opening Wonderkid Batter', type: 'Batter' as const },
                { label: '🌀 Strike Finger Spinner', type: 'Spinner' as const },
                { label: '⚡ Express Opening Pacer', type: 'Pacer' as const },
                { label: '🧤 Specialist Wicketkeeper', type: 'Keeper' as const },
                { label: '⚖️ All-Rounder Prodigy', type: 'AllRounder' as const }
              ].map(p => (
                <button
                  key={p.type}
                  onClick={() => applyPreset(p.type)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    traineeRole === p.type
                      ? 'bg-amber-500 text-black shadow font-black'
                      : 'bg-[#09221b] text-slate-300 hover:text-white border border-emerald-900/60'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#061713] border border-emerald-800/40 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Batting Hand</span>
              <select
                value={battingHand}
                onChange={(e) => setBattingHand(e.target.value as any)}
                className="mt-1 w-full p-1.5 rounded-lg bg-[#0e2c24] text-white font-bold border border-emerald-700/60 focus:outline-none"
              >
                <option value="RHB">Right Hand Bat (RHB)</option>
                <option value="LHB">Left Hand Bat (LHB)</option>
              </select>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Bowling Style</span>
              <select
                value={bowlingStyle}
                onChange={(e) => setBowlingStyle(e.target.value)}
                className="mt-1 w-full p-1.5 rounded-lg bg-[#0e2c24] text-white font-bold border border-emerald-700/60 focus:outline-none"
              >
                <option value="Right-arm Finger Spin">Right-arm Finger Spin (Off Spin)</option>
                <option value="Right-arm Wrist Spin">Right-arm Wrist Spin (Leg Spin)</option>
                <option value="Right-arm Fast">Right-arm Fast (RF)</option>
                <option value="Left-arm Fast Medium">Left-arm Fast Medium (LFM)</option>
                <option value="Left-arm Medium">Left-arm Medium (LM)</option>
                <option value="Left-arm Finger Spin">Left-arm Finger Spin (Orthodox)</option>
                <option value="None">None (Pure Batter/Keeper)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 7 Skill Sliders with Live Battrick Level Translations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {[
            { key: 'batting' as const, label: 'Batting Skill', max: 30, color: 'accent-emerald-400' },
            { key: 'bowling' as const, label: 'Bowling Skill', max: 30, color: 'accent-teal-400' },
            { key: 'keeping' as const, label: 'Keeping Skill', max: 30, color: 'accent-cyan-400' },
            { key: 'fielding' as const, label: 'Fielding Skill', max: 20, color: 'accent-amber-400' },
            { key: 'concentration' as const, label: 'Concentration', max: 20, color: 'accent-emerald-400' },
            { key: 'consistency' as const, label: 'Consistency', max: 20, color: 'accent-teal-400' },
            { key: 'stamina' as const, label: 'Stamina', max: 20, color: 'accent-amber-400' }
          ].map(skill => {
            const val = allocations[skill.key];
            const level = pointsToLevel(val);
            return (
              <div key={skill.key} className="p-3.5 rounded-xl bg-[#061713] border border-emerald-800/40 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">{skill.label}</span>
                  <span className="font-mono font-black text-amber-300">{val} pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={skill.max}
                  value={val}
                  onChange={(e) => handleSliderChange(skill.key, Number(e.target.value))}
                  className={`w-full cursor-pointer h-2 bg-[#0c241e] rounded-lg ${skill.color}`}
                />
                <div className="flex justify-between items-center text-[11px] pt-1 border-t border-emerald-950">
                  <span className="text-slate-400">Resulting Level:</span>
                  <span className="capitalize font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.2 rounded border border-emerald-700/50">
                    {level}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Action Trigger Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#12382e] to-[#09221b] border border-amber-500/50 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400">Saturday Draft Action</span>
              <div className="text-xs text-slate-300 mt-1">
                Execute youth pull based on {totalAllocated} allocated points.
              </div>
            </div>

            <button
              onClick={handleExecuteDraft}
              disabled={remainingPoints < 0}
              className={`w-full py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg ${
                remainingPoints < 0 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black'
              }`}
            >
              <Dices className="w-4 h-4" />
              <span>Draw Saturday Youth Trainee</span>
            </button>
          </div>
        </div>
      </div>

      {/* REVEAL ROOM: GENERATED 17YO TRAINEE CARD */}
      {simulatedPull && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#12382e] via-[#0e2c24] to-[#071d18] border border-amber-500/60 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-600/40">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">🌟</span>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-amber-400 tracking-wider">
                  Saturday Draft Pull Certified Trainee (17yo Wonderkid)
                </span>
                <h3 className="text-2xl font-black text-white">{simulatedPull.name}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/60">
                Clean ID: {simulatedPull.id}
              </span>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-600/60">
                BTI: {simulatedPull.bti.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Generated Trainee Full Skills Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs text-center">
            <div className="p-2.5 rounded-xl bg-[#061713] border border-emerald-800/40">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Batting</span>
              <div className="text-sm font-black capitalize text-emerald-300 mt-0.5">{simulatedPull.batting}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#061713] border border-emerald-800/40">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Bowling</span>
              <div className="text-sm font-black capitalize text-teal-300 mt-0.5">{simulatedPull.bowling}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#061713] border border-emerald-800/40">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Keeping</span>
              <div className="text-sm font-black capitalize text-slate-200 mt-0.5">{simulatedPull.keeping}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#061713] border border-emerald-800/40">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Fielding</span>
              <div className="text-sm font-black capitalize text-amber-300 mt-0.5">{simulatedPull.fielding}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#061713] border border-emerald-800/40">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Concentration</span>
              <div className="text-sm font-black capitalize text-emerald-300 mt-0.5">{simulatedPull.concentration}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#061713] border border-emerald-800/40">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Consistency</span>
              <div className="text-sm font-black capitalize text-teal-300 mt-0.5">{simulatedPull.consistency}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#061713] border border-emerald-800/40">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Stamina</span>
              <div className="text-sm font-black capitalize text-amber-300 mt-0.5">{simulatedPull.stamina}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-emerald-800/40 text-xs">
            <div className="text-slate-300">
              <span>Role: <strong className="text-white">{simulatedPull.tactical_role}</strong></span>
              <span className="mx-2">&bull;</span>
              <span>Style: <strong className="text-white">{simulatedPull.batting_hand} | {simulatedPull.bowling_type}</strong></span>
              <span className="mx-2">&bull;</span>
              <span>Wage: <strong className="text-white font-mono">£{simulatedPull.wage}/wk</strong></span>
            </div>

            {isPromoted ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-600/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Successfully Promoted to Senior Roster!</span>
              </div>
            ) : (
              <button
                onClick={handlePromoteToSquad}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all cursor-pointer shadow flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Induct Trainee into First Team Roster</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ACTIVE ACADEMY WONDERKIDS IN SENIOR ROSTER */}
      <div className="bg-[#0e2c24] p-6 rounded-2xl border border-emerald-600/30 shadow-xl space-y-4">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Active Academy Wonderkids in Senior First Team Roster</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wonderkids.map((player) => (
            <div key={player.id} className="p-4 rounded-xl bg-[#061713] border border-amber-600/40 flex justify-between items-center hover:border-amber-400 transition-all">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400">ID: {player.id}</span>
                  <span className="text-[10px] px-2 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-600 font-bold font-mono">
                    Age {player.age} (Wonderkid)
                  </span>
                </div>
                <h4 className="text-base font-black text-white mt-1">{player.name}</h4>
                <div className="text-xs text-slate-300 mt-0.5">{player.tactical_role} &bull; {player.batting_hand}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">BTI Talent</span>
                <div className="text-base font-black font-mono text-emerald-300">{(player.bti ?? 0).toLocaleString()}</div>
                <span className="text-[10px] text-amber-300 font-bold">Subskill: {player.subskill} / 7.0</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
