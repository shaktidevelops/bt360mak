import React, { useState } from 'react';
import { Player } from '../types/database';
import { Award, Sparkles, TrendingUp, DollarSign } from 'lucide-react';

interface PlayerProfileViewProps {
  squad: Player[];
  selectedPlayerId?: string;
}

export const PlayerProfileView: React.FC<PlayerProfileViewProps> = ({ squad, selectedPlayerId }) => {
  const [currentId, setCurrentId] = useState<string>(selectedPlayerId || squad[0].id);
  const player = squad.find(p => p.id === currentId) || squad[0];

  return (
    <div className="space-y-6">
      {/* Selector Strip */}
      <div className="bg-[#0b241e] p-4 rounded-2xl border border-emerald-600/30 flex items-center justify-between gap-4 overflow-x-auto shadow-xl">
        <span className="text-xs font-black uppercase text-emerald-400 whitespace-nowrap">
          Select Player Dossier:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {squad.map((p) => {
            const isSelected = p.id === player.id;
            return (
              <button
                key={p.id}
                onClick={() => setCurrentId(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-[#061713] text-slate-300 hover:text-white border border-emerald-800/40'
                }`}
              >
                {p.name} {p.is_wonderkid ? '⭐' : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Dossier Card */}
      <div className="bg-[#0e2c24] p-6 rounded-2xl border border-emerald-600/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-950 flex items-center justify-center text-3xl font-black text-white shadow-xl border border-emerald-400/40 shrink-0">
              {player.is_wonderkid ? '🏏' : '🧢'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-black bg-emerald-950 text-emerald-300 border border-emerald-600/60">
                  ID: {player.id}
                </span>
                {player.is_wonderkid && (
                  <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-bold bg-amber-950 text-amber-300 border border-amber-600/60">
                    <Sparkles className="w-3 h-3" /> Wonderkid (17yo)
                  </span>
                )}
                <span className="text-xs text-emerald-400 font-semibold">
                  Tamil Nadu, IND
                </span>
              </div>
              <h2 className="text-3xl font-black text-white mt-1">{player.name}</h2>
              <div className="text-sm font-semibold text-slate-300 mt-0.5">
                {player.tactical_role} &bull; {player.batting_hand} &bull; {player.bowling_type}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#061713] p-3.5 rounded-xl border border-emerald-800/40 text-xs text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Age</span>
              <div className="text-lg font-black text-white">{player.age} Years</div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">BTI Talent</span>
              <div className="text-lg font-black font-mono text-emerald-300">{player.bti.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Weekly Wage</span>
              <div className="text-lg font-black font-mono text-slate-200">£{player.wage.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Market Value</span>
              <div className="text-lg font-black font-mono text-amber-300">£{player.market_value.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Unique Club Records & Milestones */}
        {player.uniqueRecords && player.uniqueRecords.length > 0 && (
          <div className="mt-5 pt-4 border-t border-emerald-800/40">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-400 mb-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Cricinfo Milestones & Unique Club Records</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {player.uniqueRecords.map((rec, i) => (
                <div key={i} className="px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-600/50 text-amber-200 text-xs font-semibold flex items-center gap-2">
                  <span>🏆</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Complete Skills Dossier */}
      <div className="bg-[#0e2c24] p-6 rounded-2xl border border-emerald-600/30 shadow-xl space-y-4">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Battrick Technical Skills Breakdown & Levels</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#061713] border border-emerald-800/40 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Batting</span>
            <div className="text-sm font-black capitalize text-emerald-300 mt-1">{player.batting}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#061713] border border-emerald-800/40 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Bowling</span>
            <div className="text-sm font-black capitalize text-teal-300 mt-1">{player.bowling}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#061713] border border-emerald-800/40 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Fielding</span>
            <div className="text-sm font-black capitalize text-amber-300 mt-1">{player.fielding}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#061713] border border-emerald-800/40 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Keeping</span>
            <div className="text-sm font-black capitalize text-slate-300 mt-1">{player.keeping}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#061713] border border-emerald-800/40 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Consistency</span>
            <div className="text-sm font-black capitalize text-emerald-300 mt-1">{player.consistency}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#061713] border border-emerald-800/40 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Concentration</span>
            <div className="text-sm font-black capitalize text-emerald-300 mt-1">{player.concentration}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-3 rounded-xl bg-[#061713] border border-emerald-800/40 flex justify-between items-center">
            <span className="text-slate-400 font-bold">Stamina:</span>
            <span className="capitalize font-black text-white">{player.stamina}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#061713] border border-emerald-800/40 flex justify-between items-center">
            <span className="text-slate-400 font-bold">Match Form:</span>
            <span className="capitalize font-black text-emerald-400">{player.form}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#061713] border border-emerald-800/40 flex justify-between items-center">
            <span className="text-slate-400 font-bold">Fatigue Level:</span>
            <span className="capitalize font-black text-slate-200">{player.fatigue}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#061713] border border-emerald-800/40 flex justify-between items-center">
            <span className="text-slate-400 font-bold">Leadership:</span>
            <span className="capitalize font-black text-amber-300">{player.leadership}</span>
          </div>
        </div>
      </div>

      {/* Cricinfo Style Comprehensive Career Statistics */}
      <div className="bg-[#0e2c24] p-6 rounded-2xl border border-emerald-600/30 shadow-xl space-y-4">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>ESPNCricinfo Detailed Career Statistics & Records</span>
        </h3>

        {/* Batting Career Table */}
        <div>
          <h4 className="text-xs font-black uppercase text-emerald-400 mb-2">Batting & Fielding Career Stats</h4>
          <div className="overflow-x-auto rounded-xl border border-emerald-800/40 bg-[#061713]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#071d18] text-slate-300 uppercase tracking-wider text-[10px] border-b border-emerald-800/40">
                  <th className="py-2.5 px-3">Format</th>
                  <th className="py-2.5 px-2 text-center">Mat</th>
                  <th className="py-2.5 px-2 text-center">Inns</th>
                  <th className="py-2.5 px-3 text-right">Runs</th>
                  <th className="py-2.5 px-3 text-center">HS</th>
                  <th className="py-2.5 px-3 text-right">Avg</th>
                  <th className="py-2.5 px-3 text-right">SR</th>
                  <th className="py-2.5 px-2 text-center">100s</th>
                  <th className="py-2.5 px-2 text-center">50s</th>
                  <th className="py-2.5 px-2 text-center">4s</th>
                  <th className="py-2.5 px-2 text-center">6s</th>
                  <th className="py-2.5 px-2 text-center">Ct</th>
                  <th className="py-2.5 px-2 text-center">St</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/60 font-mono">
                <tr className="hover:bg-emerald-950/40">
                  <td className="py-2.5 px-3 font-sans font-bold text-white">First Class</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{player.statsFC.matches}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{player.statsFC.innings}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-300">{player.statsFC.runs}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-white">{player.statsFC.highestScore}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-300">{player.statsFC.average.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-200">{player.statsFC.strikeRate.toFixed(1)}</td>
                  <td className="py-2.5 px-2 text-center text-amber-400 font-bold">{player.statsFC.centuries}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{player.statsFC.fifties}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{player.statsFC.fours}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{player.statsFC.sixes}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{player.statsFC.catches}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{player.statsFC.stumpings}</td>
                </tr>
                <tr className="hover:bg-emerald-950/40">
                  <td className="py-2.5 px-3 font-sans font-bold text-white">One Day</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{player.statsOD.matches}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{player.statsOD.innings}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-300">{player.statsOD.runs}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-white">{player.statsOD.highestScore}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-300">{player.statsOD.average.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-200">{player.statsOD.strikeRate.toFixed(1)}</td>
                  <td className="py-2.5 px-2 text-center text-amber-400 font-bold">{player.statsOD.centuries}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{player.statsOD.fifties}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{player.statsOD.fours}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{player.statsOD.sixes}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{player.statsOD.catches}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{player.statsOD.stumpings}</td>
                </tr>
                <tr className="hover:bg-emerald-950/40">
                  <td className="py-2.5 px-3 font-sans font-bold text-white">Twenty20 (BT20)</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{player.statsT20.matches}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{player.statsT20.innings}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-300">{player.statsT20.runs}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-white">{player.statsT20.highestScore}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-300">{player.statsT20.average.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-200">{player.statsT20.strikeRate.toFixed(1)}</td>
                  <td className="py-2.5 px-2 text-center text-amber-400 font-bold">{player.statsT20.centuries}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{player.statsT20.fifties}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{player.statsT20.fours}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{player.statsT20.sixes}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{player.statsT20.catches}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">{player.statsT20.stumpings}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bowling Career Table */}
        <div className="pt-2">
          <h4 className="text-xs font-black uppercase text-emerald-400 mb-2">Bowling Career Stats</h4>
          <div className="overflow-x-auto rounded-xl border border-emerald-800/40 bg-[#061713]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#071d18] text-slate-300 uppercase tracking-wider text-[10px] border-b border-emerald-800/40">
                  <th className="py-2.5 px-3">Format</th>
                  <th className="py-2.5 px-3 text-right">Overs</th>
                  <th className="py-2.5 px-3 text-right">Wickets</th>
                  <th className="py-2.5 px-3 text-center">BBI</th>
                  <th className="py-2.5 px-3 text-right">Average</th>
                  <th className="py-2.5 px-3 text-right">Economy</th>
                  <th className="py-2.5 px-2 text-center">5w Hauls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/60 font-mono">
                <tr className="hover:bg-emerald-950/40">
                  <td className="py-2.5 px-3 font-sans font-bold text-white">First Class</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{player.statsFC.oversBowled}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-teal-300">{player.statsFC.wickets}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-white">{player.statsFC.bestBowling}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-300">{player.statsFC.bowlingAverage.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-200">{player.statsFC.economy.toFixed(2)}</td>
                  <td className="py-2.5 px-2 text-center text-amber-400 font-bold">{player.statsFC.fiveWickets}</td>
                </tr>
                <tr className="hover:bg-emerald-950/40">
                  <td className="py-2.5 px-3 font-sans font-bold text-white">One Day</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{player.statsOD.oversBowled}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-teal-300">{player.statsOD.wickets}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-white">{player.statsOD.bestBowling}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-300">{player.statsOD.bowlingAverage.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-200">{player.statsOD.economy.toFixed(2)}</td>
                  <td className="py-2.5 px-2 text-center text-amber-400 font-bold">{player.statsOD.fiveWickets}</td>
                </tr>
                <tr className="hover:bg-emerald-950/40">
                  <td className="py-2.5 px-3 font-sans font-bold text-white">Twenty20 (BT20)</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{player.statsT20.oversBowled}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-teal-300">{player.statsT20.wickets}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-white">{player.statsT20.bestBowling}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-300">{player.statsT20.bowlingAverage.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-200">{player.statsT20.economy.toFixed(2)}</td>
                  <td className="py-2.5 px-2 text-center text-amber-400 font-bold">{player.statsT20.fiveWickets}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
