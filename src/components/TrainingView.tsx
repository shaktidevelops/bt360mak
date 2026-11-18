import React, { useState } from 'react';
import { Player, TrainingLog, NetAllocation } from '../types/database';
import { Target, Zap, Clock, Sparkles, UserCheck, Flame, Dices } from 'lucide-react';

interface TrainingViewProps {
  logs: TrainingLog[];
  nets?: NetAllocation[];
  squad: Player[];
  onUpdateNet?: (netNumber: number, playerId: string, trainingType: string) => void;
}

export const TrainingView: React.FC<TrainingViewProps> = ({ 
  logs, 
  squad 
}) => {
  // Ensure all 10 nets have active, strategic assignments
  const [activeNets, setActiveNets] = useState<NetAllocation[]>(() => {
    const defaultPrograms = [
      { net: 1, type: 'Bowling (Finger Spin)', pid: 'BT-6099466', wks: 3, notes: 'Wonderkid fast-track pop to Proficient spin' },
      { net: 2, type: 'Batting (Opening Technique)', pid: 'BT-6099471', wks: 4, notes: 'Wonderkid youth batter technique enhancement' },
      { net: 3, type: 'Fielding (Slip Catching)', pid: 'BT-6099475', wks: 5, notes: 'Captain fielding reflexes & runout speed' },
      { net: 4, type: 'Wicket Keeping (Glovework)', pid: 'BT-6099476', wks: 6, notes: 'Specialist keeper bye reduction drills' },
      { net: 5, type: 'Fitness & Stamina', pid: 'BT-6099461', wks: 4, notes: 'Stamina recovery to match-ready standard' },
      { net: 6, type: 'Batting (Middle Order)', pid: 'BT-6099459', wks: 9, notes: 'Youth batter strokeplay development' },
      { net: 7, type: 'Bowling (Finger Spin)', pid: 'BT-6099468', wks: 11, notes: 'Lead spinner control and consistency' },
      { net: 8, type: 'Bowling (Opening Seam)', pid: 'BT-6099470', wks: 10, notes: 'Opening bowler seam positioning' },
      { net: 9, type: 'Bowling (Strike Pace)', pid: 'BT-6099469', wks: 14, notes: 'Strike seamer pace and aggression' },
      { net: 10, type: 'Batting (Finisher)', pid: 'BT-6099474', wks: 10, notes: 'Middle-order acceleration drills' }
    ];

    return defaultPrograms.map(p => {
      const player = squad.find(s => s.id === p.pid);
      return {
        club_id: '13108',
        net_number: p.net,
        training_type: p.type,
        player_id: p.pid,
        player_name: player ? `${player.name} (${player.age}yo)` : 'Unassigned',
        coach_multiplier: 1.00,
        pops_estimated_weeks: p.wks,
        notes: p.notes
      };
    });
  });

  // Youth Academy (ITS) investment state
  const [itsInvestment, setItsInvestment] = useState<number>(36000);
  const [simulatedPull, setSimulatedPull] = useState<string | null>(null);

  const handlePlayerChange = (netNum: number, newPlayerId: string) => {
    setActiveNets(prev => prev.map(n => {
      if (n.net_number !== netNum) return n;
      const player = squad.find(s => s.id === newPlayerId);
      const isWonderkid = player ? player.age <= 18 : false;
      const estWeeks = isWonderkid ? 4 : player && player.age <= 24 ? 8 : 12;
      return {
        ...n,
        player_id: newPlayerId,
        player_name: player ? `${player.name} (${player.age}yo)` : 'Unassigned',
        pops_estimated_weeks: estWeeks
      };
    }));
  };

  const handleTypeChange = (netNum: number, newType: string) => {
    setActiveNets(prev => prev.map(n => n.net_number === netNum ? { ...n, training_type: newType } : n));
  };

  const handleSimulateYouthPull = () => {
    const roles = ['RHB Opener', 'LHB Top-Order Anchor', 'R H Finger Spinner', 'L Fast-Medium Seamer', 'Specialist Wicketkeeper'];
    const skills = ['Competent', 'Respectable', 'Proficient', 'Strong'];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    const randomSkill = skills[Math.floor(Math.random() * skills.length)];
    const randomSub = (Math.random() * 0.8 + 6.0).toFixed(2);
    setSimulatedPull(`17yo Wonderkid (${randomRole}) with ${randomSkill} primary skill (Subskill: ${randomSub}) and Sensational potential!`);
  };

  const totalAssignedNets = activeNets.filter(n => n.player_id).length;

  return (
    <div className="space-y-6">
      {/* Training Command Header */}
      <div className="bg-[#10272a] p-6 rounded-2xl border border-[#204b4c] shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Player Development & Weekly Nets Allocation</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              10-Net Training Facility & Pop Progression Engine
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              100% net utilization across all 10 nets. Competent Head Coach multiplier (1.00x) applied. Friday training updates evaluate subskill growth towards next skill level.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#091719] px-4 py-2 rounded-xl border border-[#204b4c] text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Nets Allocated</span>
              <div className="text-xl font-black font-mono text-emerald-400">
                {totalAssignedNets} / 10
              </div>
            </div>
            <div className="bg-[#091719] px-4 py-2 rounded-xl border border-[#204b4c] text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Head Coach</span>
              <div className="text-sm font-bold text-white flex items-center gap-1 justify-center">
                <span>Devdutt Raman</span>
                <span className="text-emerald-400 text-xs font-mono">(1.00x)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wonderkid Training Velocity Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pt-4 border-t border-[#1c4344]">
          <div className="p-4 rounded-xl bg-[#0a181a] border border-amber-600/40 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Wonderkid Net 1: Bhadraksh Hemalatha (17yo)</span>
              </div>
              <div className="text-sm font-extrabold text-white mt-1">
                Finger Spin Progression: Competent &rarr; Proficient
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Subskill: <span className="font-mono font-bold text-amber-300">6.70 / 7.00</span> (70% to pop)
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase text-slate-400 font-bold">Pop In</span>
              <div className="text-2xl font-black font-mono text-amber-300">~3 wks</div>
              <span className="text-[10px] text-emerald-400 font-semibold">Fast Track</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0a181a] border border-emerald-600/40 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <Flame className="w-4 h-4 text-emerald-400" />
                <span>Wonderkid Net 2: Nandakishor Ramdhyani (17yo)</span>
              </div>
              <div className="text-sm font-extrabold text-white mt-1">
                Batting Technique: Competent &rarr; Proficient
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Subskill: <span className="font-mono font-bold text-emerald-300">6.70 / 7.00</span> (70% to pop)
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase text-slate-400 font-bold">Pop In</span>
              <div className="text-2xl font-black font-mono text-emerald-300">~4 wks</div>
              <span className="text-[10px] text-emerald-400 font-semibold">Fast Track</span>
            </div>
          </div>
        </div>
      </div>

      {/* 10-NET INTERACTIVE ALLOCATION MATRIX */}
      <div className="bg-[#10272a] rounded-2xl border border-[#204b4c] p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-extrabold text-white">
              Active 10-Net Training Roster (Interactive Allocation)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Reassign trainees or specialization drills with 1 click.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#09181a] text-slate-300 uppercase tracking-wider text-[10px] border-b border-[#204b4c]">
                <th className="py-3 px-3 text-center">Net</th>
                <th className="py-3 px-4">Assigned Player</th>
                <th className="py-3 px-4">Training Specialization</th>
                <th className="py-3 px-3 text-center">Coach Multiplier</th>
                <th className="py-3 px-3 text-center">Estimated Pop</th>
                <th className="py-3 px-4">Development Objective</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#18393b]">
              {activeNets.map((net) => {
                const isWonderkid = net.player_id === 'BT-6099466' || net.player_id === 'BT-6099471';

                return (
                  <tr key={net.net_number} className="hover:bg-[#163638]/70 transition-colors">
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-mono font-bold text-xs border ${
                        isWonderkid
                          ? 'bg-amber-950/80 text-amber-300 border-amber-600/70'
                          : 'bg-[#16393b] text-emerald-300 border-[#275c5e]'
                      }`}>
                        #{net.net_number}
                      </span>
                    </td>

                    {/* Interactive Player Dropdown */}
                    <td className="py-3 px-4">
                      <select
                        value={net.player_id || ''}
                        onChange={(e) => handlePlayerChange(net.net_number, e.target.value)}
                        className="bg-[#0a181a] text-white font-bold px-2.5 py-1 rounded-lg border border-[#204b4c] focus:outline-none focus:border-emerald-500 cursor-pointer w-full max-w-[210px]"
                      >
                        <option value="">-- Unassigned --</option>
                        {squad.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.age}yo) {p.is_wonderkid ? '⭐' : ''}
                          </option>
                        ))}
                      </select>
                      {isWonderkid && (
                        <div className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold mt-1">
                          <Sparkles className="w-2.5 h-2.5" /> 17yo High-Velocity Trainee
                        </div>
                      )}
                    </td>

                    {/* Interactive Training Type Dropdown */}
                    <td className="py-3 px-4">
                      <select
                        value={net.training_type}
                        onChange={(e) => handleTypeChange(net.net_number, e.target.value)}
                        className="bg-[#0a181a] text-emerald-300 font-semibold px-2.5 py-1 rounded-lg border border-[#204b4c] focus:outline-none focus:border-emerald-500 cursor-pointer w-full max-w-[210px]"
                      >
                        <option value="Batting (Opening Technique)">Batting (Opening Technique)</option>
                        <option value="Batting (Middle Order)">Batting (Middle Order)</option>
                        <option value="Batting (Finisher)">Batting (Finisher)</option>
                        <option value="Bowling (Finger Spin)">Bowling (Finger Spin)</option>
                        <option value="Bowling (Opening Seam)">Bowling (Opening Seam)</option>
                        <option value="Bowling (Strike Pace)">Bowling (Strike Pace)</option>
                        <option value="Wicket Keeping (Glovework)">Wicket Keeping (Glovework)</option>
                        <option value="Fielding (Slip Catching)">Fielding (Slip Catching)</option>
                        <option value="Fitness & Stamina">Fitness & Stamina</option>
                      </select>
                    </td>

                    <td className="py-3 px-3 text-center text-slate-300 font-mono">
                      {net.coach_multiplier.toFixed(2)}x
                    </td>

                    <td className="py-3 px-3 text-center">
                      {net.pops_estimated_weeks ? (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono font-bold text-xs ${
                          isWonderkid 
                            ? 'bg-amber-950 text-amber-300 border border-amber-600/60' 
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                        }`}>
                          <Clock className="w-3 h-3" />
                          {net.pops_estimated_weeks} wks
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-300">
                      {net.notes}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* BATTRICK YOUTH ACADEMY (ITS) SIMULATOR & PULL GENERATOR */}
      <div className="bg-[#10272a] rounded-2xl border border-[#204b4c] p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Youth Academy & Individual Training Scheme (ITS)</span>
            </div>
            <h3 className="text-lg font-black text-white mt-0.5">
              Weekly Youth Intake & Trainee Generation Hub
            </h3>
          </div>
          <div className="bg-[#091719] px-4 py-2 rounded-xl border border-amber-600/40 font-mono font-bold text-amber-300 text-sm">
            ITS Investment: £{itsInvestment.toLocaleString()} / wk
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#0a181a] border border-[#204b4c]">
            <div className="flex justify-between text-xs text-slate-300 font-semibold mb-2">
              <span>Investment Level</span>
              <span className="font-mono text-amber-300 font-bold">Level 20 (Maximum Intake Potential)</span>
            </div>
            <input
              type="range"
              min="0"
              max="36000"
              step="4000"
              value={itsInvestment}
              onChange={(e) => setItsInvestment(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-[#163638] rounded-lg"
            />
            <p className="text-[11px] text-slate-300 mt-3 leading-relaxed">
              ⭐ <strong>Maximum £36,000/week (Level 20)</strong>: Maximizes the likelihood of pulling high-BTI 17-year-olds with Respectable or Proficient primary skills and high potential.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0a181a] border border-emerald-600/40 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-400">Youth Intake Draft Room</span>
              <p className="text-xs text-slate-300 mt-1">
                {simulatedPull || 'Simulate your club\'s Friday youth draft pull to review new academy wonderkids.'}
              </p>
            </div>
            <button
              onClick={handleSimulateYouthPull}
              className="mt-3 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs shadow-lg transition-all cursor-pointer"
            >
              <Dices className="w-4 h-4" /> Simulate Weekly Youth Pull
            </button>
          </div>
        </div>
      </div>

      {/* Friday Training Pop Celebrations */}
      <div className="bg-[#10272a] rounded-2xl border border-[#204b4c] p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-extrabold text-white">
              Confirmed Friday Skill Pops (Season Archive)
            </h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/50 font-bold font-mono">
            {logs.length} Confirmed Pops
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {logs.map((log) => (
            <div key={log.id} className="p-4 rounded-xl bg-[#0a181a] border border-[#204b4c] flex items-center justify-between hover:border-emerald-600/50 transition-all">
              <div>
                <span className="text-[10px] font-mono text-slate-400">{log.log_date}</span>
                <h4 className="text-sm font-bold text-white mt-0.5">{log.player_name}</h4>
                <div className="text-xs text-amber-300 font-bold mt-1">
                  {log.skill_trained}: {log.previous_level} &rarr; <span className="underline decoration-amber-400">{log.new_level} (POP!)</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400">Subskill Level</span>
                <div className="text-base font-bold font-mono text-emerald-300">{log.subskill}</div>
                <span className="text-[10px] text-slate-400">{log.weeks_taken} Weeks taken</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
