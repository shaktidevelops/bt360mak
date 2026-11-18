import React, { useState } from 'react';
import { Player } from '../types/database';
import { Sparkles, Dices, Award, ShieldCheck } from 'lucide-react';

interface YouthViewProps {
  squad: Player[];
}

export const YouthView: React.FC<YouthViewProps> = ({ squad }) => {
  const [itsInvestment, setItsInvestment] = useState<number>(36000);
  const [simulatedPull, setSimulatedPull] = useState<{
    name: string;
    age: number;
    role: string;
    batting: string;
    bowling: string;
    potential: string;
    wage: number;
  } | null>(null);

  const wonderkids = squad.filter(p => p.is_wonderkid);

  const handleSimulateDraft = () => {
    const firstNames = ['Tejas', 'Rohan', 'Prithvi', 'Devendra', 'Manoj', 'Subhash', 'Aditya'];
    const lastNames = ['Natarajan', 'Venkatesh', 'Kalyan', 'Bhardwaj', 'Sundaram', 'Pillai'];
    const randomName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    
    const roles = [
      { role: 'Opening Batsman (LHB)', bat: 'Competent', bowl: 'Woeful', wage: 540 },
      { role: 'Right-arm Finger Spinner', bat: 'Abysmal', bowl: 'Competent', wage: 535 },
      { role: 'Opening Strike Pacer (RHB/RF)', bat: 'Feeble', bowl: 'Competent', wage: 550 },
      { role: 'Specialist Wicketkeeper (RHB)', bat: 'Mediocre', bowl: 'Nonexistent', wage: 510 },
      { role: 'Batting All-Rounder (RHB/RM)', bat: 'Competent', bowl: 'Mediocre', wage: 565 }
    ];
    const picked = roles[Math.floor(Math.random() * roles.length)];

    setSimulatedPull({
      name: randomName,
      age: 17,
      role: picked.role,
      batting: picked.bat,
      bowling: picked.bowl,
      potential: 'Exceptional (First XI Star)',
      wage: picked.wage
    });
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
            Somnath Super Devs Youth Academy & Draft Intake
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            The lifeblood of Battrick progression. High ITS weekly investments guarantee high-caliber 17yo trainees like Bhadraksh Hemalatha and Nandakishor Ramdhyani.
          </p>
        </div>

        <div className="bg-[#061713] px-4 py-2 rounded-xl border border-amber-600/40 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Current Investment</span>
          <div className="text-xl font-black font-mono text-amber-300">
            £{itsInvestment.toLocaleString()} / wk
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">Level 20 Maximum</span>
        </div>
      </div>

      {/* Draft Pull Simulator Room */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-[#0e2c24] border border-emerald-800/40 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-white mb-1">Weekly ITS Investment Controls</h3>
            <p className="text-xs text-slate-300 mb-4">
              Allocate your club's weekly youth scouting fund. 36,000/week maximizes youth BTI.
            </p>

            <div className="p-4 rounded-xl bg-[#061713] border border-emerald-800/40">
              <div className="flex justify-between text-xs font-bold text-white mb-2">
                <span>Scouting Level</span>
                <span className="text-amber-400 font-mono">£{itsInvestment.toLocaleString()} / week</span>
              </div>
              <input
                type="range"
                min="0"
                max="36000"
                step="4000"
                value={itsInvestment}
                onChange={(e) => setItsInvestment(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-[#10342a] rounded-lg"
              />
            </div>
          </div>

          <button
            onClick={handleSimulateDraft}
            className="mt-4 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-sm shadow-xl transition-all cursor-pointer"
          >
            <Dices className="w-5 h-5" /> Simulate Saturday Youth Draft Pull
          </button>
        </div>

        {/* Draft Reveal Showcase */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#12382e] to-[#0a201a] border border-amber-600/50 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-black tracking-wider text-amber-400">
                Saturday Youth Draft Room
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-600 font-mono font-bold">
                Level 20 Intake
              </span>
            </div>

            {simulatedPull ? (
              <div className="mt-3 p-4 rounded-xl bg-[#061713] border border-amber-500/60 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-black text-white">{simulatedPull.name}</h4>
                  <span className="text-xs font-bold text-amber-300 font-mono">Age 17</span>
                </div>
                <div className="text-xs text-slate-300 font-semibold">{simulatedPull.role}</div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-emerald-950 font-mono">
                  <div>Batting: <strong className="text-emerald-400">{simulatedPull.batting}</strong></div>
                  <div>Bowling: <strong className="text-teal-400">{simulatedPull.bowling}</strong></div>
                  <div>Potential: <strong className="text-amber-300">{simulatedPull.potential}</strong></div>
                  <div>Starting Wage: <strong className="text-white">£{simulatedPull.wage}</strong></div>
                </div>
              </div>
            ) : (
              <div className="mt-3 p-8 rounded-xl bg-[#061713] border border-dashed border-emerald-800/60 text-center text-xs text-slate-400">
                Click "Simulate Saturday Youth Draft Pull" to generate an authentic 17yo Battrick trainee based on your £36,000/wk ITS investment.
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-800/40 text-[11px] text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Chief Scout Girish Kumble evaluates all pulls before senior squad induction.</span>
          </div>
        </div>
      </div>

      {/* Active Academy Wonderkids in Senior Roster */}
      <div className="bg-[#0e2c24] p-6 rounded-2xl border border-emerald-600/30 shadow-xl space-y-4">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Active Academy Wonderkids in First XI Roster</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wonderkids.map((player) => (
            <div key={player.id} className="p-4 rounded-xl bg-[#061713] border border-amber-600/40 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400">ID: {player.id}</span>
                  <span className="text-[10px] px-2 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-600 font-bold">
                    Age {player.age} (Wonderkid)
                  </span>
                </div>
                <h4 className="text-base font-black text-white mt-1">{player.name}</h4>
                <div className="text-xs text-slate-300 mt-0.5">{player.tactical_role}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Market Value</span>
                <div className="text-base font-black font-mono text-amber-300">£{player.market_value.toLocaleString()}</div>
                <span className="text-[10px] text-emerald-400 font-bold">Subskill: {player.subskill} / 7.0</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
