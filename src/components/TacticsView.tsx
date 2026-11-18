import React, { useState } from 'react';
import { Player } from '../types/database';
import { Swords, Info } from 'lucide-react';

interface TacticsViewProps {
  squad: Player[];
}

export const TacticsView: React.FC<TacticsViewProps> = ({ squad }) => {
  const [pitch, setPitch] = useState<'Hard' | 'Green' | 'Dusty' | 'Flat' | 'Slow'>('Hard');

  const pitchModifiers = {
    Hard: { fast: '+25%', seam: '+15%', spin: '-15%', desc: 'Express pace and high carry. Favors strike pacers and fast bowlers.' },
    Green: { fast: '+10%', seam: '+30%', spin: '-30%', desc: 'Heavy seam movement and atmospheric swing. Batters struggle early on.' },
    Dusty: { fast: '-25%', seam: '-20%', spin: '+40%', desc: 'Dry, turning pitch. Premium arena for lead finger spinners.' },
    Flat: { fast: '-5%', seam: '-5%', spin: '+5%', desc: 'True bounce, heavy run-scoring conditions. Rewards high stamina.' },
    Slow: { fast: '-20%', seam: '+10%', spin: '+25%', desc: 'Sluggish surface with low bounce. Medium pace and slow bowling effective.' }
  };

  const currentMod = pitchModifiers[pitch];

  return (
    <div className="space-y-6">
      {/* Header & Pitch Selector */}
      <div className="bg-[#06201b]/50 p-5 rounded-xl border border-emerald-900/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Swords className="w-5 h-5 text-emerald-400" />
              <span>06_Lineup_Tactics & Pitch Synergy</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate pitch condition impacts, bowling order, and aggression strategies for the next fixture.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#031512] px-3 py-1.5 rounded-lg border border-emerald-900/60 text-xs">
            <span className="text-slate-400 font-semibold">Selected Pitch:</span>
            <select
              value={pitch}
              onChange={(e) => setPitch(e.target.value as any)}
              className="bg-transparent text-emerald-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value="Hard" className="bg-[#031512]">Hard Pitch</option>
              <option value="Green" className="bg-[#031512]">Green Pitch</option>
              <option value="Dusty" className="bg-[#031512]">Dusty Pitch</option>
              <option value="Flat" className="bg-[#031512]">Flat Track</option>
              <option value="Slow" className="bg-[#031512]">Slow Pitch</option>
            </select>
          </div>
        </div>

        {/* Pitch Modifier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-lg bg-[#031512] border border-emerald-900/60">
            <span className="text-[10px] uppercase font-bold text-slate-400">Pace Bonus</span>
            <div className={`text-base font-bold font-mono ${currentMod.fast.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
              {currentMod.fast}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[#031512] border border-emerald-900/60">
            <span className="text-[10px] uppercase font-bold text-slate-400">Seam Movement</span>
            <div className={`text-base font-bold font-mono ${currentMod.seam.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
              {currentMod.seam}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[#031512] border border-emerald-900/60">
            <span className="text-[10px] uppercase font-bold text-slate-400">Spin Assistance</span>
            <div className={`text-base font-bold font-mono ${currentMod.spin.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
              {currentMod.spin}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[#031512] border border-emerald-900/60 flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] text-slate-300 leading-tight">{currentMod.desc}</span>
          </div>
        </div>
      </div>

      {/* Suggested Starting XI */}
      <div className="p-4 rounded-xl bg-[#031512]/90 border border-emerald-900/40">
        <h3 className="text-sm font-bold text-white mb-3">Tactical XI Match Orders</h3>
        <div className="space-y-2">
          {squad.slice(0, 11).map((player, idx) => (
            <div key={player.id} className="flex items-center justify-between p-3 rounded-lg bg-[#06201b]/40 border border-emerald-950 hover:border-emerald-800/60 transition-all text-xs">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-900/60 text-emerald-300 font-bold font-mono text-[11px]">
                  {idx + 1}
                </span>
                <div>
                  <div className="font-bold text-white">{player.name}</div>
                  <div className="text-[11px] text-slate-400">{player.tactical_role}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">
                  {player.batting_hand}
                </span>
                <span className="text-[11px] text-slate-300">
                  {idx < 6 ? 'Aggression: Attacking' : 'Bowling: Core Rotation'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
