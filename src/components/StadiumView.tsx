import React, { useState } from 'react';
import { StadiumTier } from '../types/database';
import { Building2, Hammer, Ticket } from 'lucide-react';

interface StadiumViewProps {
  tiers?: StadiumTier[];
}

export const StadiumView: React.FC<StadiumViewProps> = () => {
  const [targetCapacity, setTargetCapacity] = useState<number>(15000);

  // Standard Battrick Optimal Seating Ratios:
  // Standing: 68%, Uncovered: 23%, Covered: 7%, Members: 2%
  const targetStanding = Math.round(targetCapacity * 0.68);
  const targetUncovered = Math.round(targetCapacity * 0.23);
  const targetCovered = Math.round(targetCapacity * 0.07);
  const targetMembers = Math.round(targetCapacity * 0.02);

  const currentStanding = 5275;
  const currentUncovered = 3270;
  const currentCovered = 1100;
  const currentMembers = 355;
  const currentTotal = 10000;

  // Expansion Costs per Seat (£):
  // Standing: £35, Uncovered: £48, Covered: £72, Members: £120
  const costStanding = Math.max(0, targetStanding - currentStanding) * 35;
  const costUncovered = Math.max(0, targetUncovered - currentUncovered) * 48;
  const costCovered = Math.max(0, targetCovered - currentCovered) * 72;
  const costMembers = Math.max(0, targetMembers - currentMembers) * 120;
  const totalExpansionCost = costStanding + costUncovered + costCovered + costMembers;

  // Gate Receipts at 100% Sellout
  const currentMaxGate = (currentStanding * 5) + (currentUncovered * 8) + (currentCovered * 14) + (currentMembers * 25);
  const targetMaxGate = (targetStanding * 5) + (targetUncovered * 8) + (targetCovered * 14) + (targetMembers * 25);
  const incrementalRevenuePerHomeMatch = targetMaxGate - currentMaxGate;
  const breakEvenHomeMatches = incrementalRevenuePerHomeMatch > 0 
    ? Math.ceil(totalExpansionCost / incrementalRevenuePerHomeMatch) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Stadium Command Header */}
      <div className="bg-[#10272a] p-6 rounded-2xl border border-[#204b4c] shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Infrastructure Architecture & Stadium Optimization</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Prabhas Coastal Oval Arena Planner
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Somnath Super Devs home arena. Optimize seating distribution ratios, ticket pricing models, and ground expansion ROI.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#091719] px-4 py-2 rounded-xl border border-[#204b4c] text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Current Capacity</span>
              <div className="text-xl font-black font-mono text-emerald-400">
                10,000 Seats
              </div>
            </div>
            <div className="bg-[#091719] px-4 py-2 rounded-xl border border-[#204b4c] text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Pitch Condition</span>
              <div className="text-sm font-bold text-amber-300">Hard & Fast</div>
            </div>
          </div>
        </div>

        {/* Stadium Performance Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#1c4344]">
          <div className="p-4 rounded-xl bg-[#0a181a] border border-[#204b4c]">
            <span className="text-[10px] uppercase font-bold text-slate-400">Current Gate Potential</span>
            <div className="text-2xl font-black font-mono text-emerald-300 mt-0.5">
              £{currentMaxGate.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-300 mt-1">Per sellout home fixture</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0a181a] border border-[#204b4c]">
            <span className="text-[10px] uppercase font-bold text-slate-400">Target Gate Potential</span>
            <div className="text-2xl font-black font-mono text-teal-300 mt-0.5">
              £{targetMaxGate.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1">
              +£{incrementalRevenuePerHomeMatch.toLocaleString()} gain / match
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0a181a] border border-[#204b4c]">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Expansion Cost</span>
            <div className="text-2xl font-black font-mono text-amber-300 mt-0.5">
              £{totalExpansionCost.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-300 mt-1">Contractor capital expenditure</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0a181a] border border-[#204b4c]">
            <span className="text-[10px] uppercase font-bold text-slate-400">Capital Break-Even</span>
            <div className="text-2xl font-black font-mono text-white mt-0.5">
              ~{breakEvenHomeMatches} Home Matches
            </div>
            <div className="text-[11px] text-emerald-400 mt-1">High ROI investment window</div>
          </div>
        </div>
      </div>

      {/* EXPANSION SLIDER & ROI CALCULATOR */}
      <div className="bg-[#10272a] rounded-2xl border border-[#204b4c] p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Hammer className="w-5 h-5 text-amber-400" />
              <span>Interactive Stadium Expansion Simulator</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Drag slider to calculate optimal distribution ratios and contractor quotes for your next stadium tier upgrade.
            </p>
          </div>
          <div className="bg-[#091719] px-3.5 py-1.5 rounded-xl border border-emerald-600/50 font-mono font-bold text-emerald-300 text-sm">
            Target: {targetCapacity.toLocaleString()} Seats
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0a181a] border border-[#204b4c]">
          <div className="flex justify-between text-xs text-slate-400 font-bold mb-2">
            <span>10,000 (Current)</span>
            <span>15,000 (Recommended)</span>
            <span>20,000</span>
            <span>25,000 (Championship)</span>
          </div>
          <input
            type="range"
            min="10000"
            max="25000"
            step="500"
            value={targetCapacity}
            onChange={(e) => setTargetCapacity(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-[#163638] rounded-lg"
          />
        </div>
      </div>

      {/* DETAILED STAND-BY-STAND BLUEPRINT */}
      <div className="bg-[#10272a] rounded-2xl border border-[#204b4c] p-5 shadow-xl">
        <h3 className="text-base font-extrabold text-white mb-4 flex items-center gap-2">
          <Ticket className="w-5 h-5 text-emerald-400" />
          <span>Prabhas Coastal Oval Seating Blueprint & Pricing Matrix</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#09181a] text-slate-300 uppercase tracking-wider text-[10px] border-b border-[#204b4c]">
                <th className="py-3 px-4">Stand / Seating Enclosure</th>
                <th className="py-3 px-3 text-right">Current Seats</th>
                <th className="py-3 px-3 text-center">Current Ratio</th>
                <th className="py-3 px-3 text-center">Battrick Optimal</th>
                <th className="py-3 px-3 text-right">Recommended Seats</th>
                <th className="py-3 px-3 text-right">Ticket Price</th>
                <th className="py-3 px-3 text-right">Expansion Cost</th>
                <th className="py-3 px-4 text-right">Weekly Gate Potential</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#18393b]">
              <tr className="hover:bg-[#163638]/70 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white">
                  Standing Terraces (General Admission)
                </td>
                <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-200">
                  {currentStanding.toLocaleString()}
                </td>
                <td className="py-3.5 px-3 text-center font-mono text-slate-400">
                  {((currentStanding / currentTotal) * 100).toFixed(1)}%
                </td>
                <td className="py-3.5 px-3 text-center font-mono text-emerald-400 font-bold">
                  68.0%
                </td>
                <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-300">
                  {targetStanding.toLocaleString()}
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                  £5.00
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-amber-300 font-semibold">
                  £{costStanding.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                  £{(targetStanding * 5).toLocaleString()}
                </td>
              </tr>

              <tr className="hover:bg-[#163638]/70 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white">
                  Uncovered Grandstand
                </td>
                <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-200">
                  {currentUncovered.toLocaleString()}
                </td>
                <td className="py-3.5 px-3 text-center font-mono text-slate-400">
                  {((currentUncovered / currentTotal) * 100).toFixed(1)}%
                </td>
                <td className="py-3.5 px-3 text-center font-mono text-emerald-400 font-bold">
                  23.0%
                </td>
                <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-300">
                  {targetUncovered.toLocaleString()}
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                  £8.00
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-amber-300 font-semibold">
                  £{costUncovered.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                  £{(targetUncovered * 8).toLocaleString()}
                </td>
              </tr>

              <tr className="hover:bg-[#163638]/70 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white">
                  Covered Pavilion Seats
                </td>
                <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-200">
                  {currentCovered.toLocaleString()}
                </td>
                <td className="py-3.5 px-3 text-center font-mono text-slate-400">
                  {((currentCovered / currentTotal) * 100).toFixed(1)}%
                </td>
                <td className="py-3.5 px-3 text-center font-mono text-emerald-400 font-bold">
                  7.0%
                </td>
                <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-300">
                  {targetCovered.toLocaleString()}
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                  £14.00
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-amber-300 font-semibold">
                  £{costCovered.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                  £{(targetCovered * 14).toLocaleString()}
                </td>
              </tr>

              <tr className="hover:bg-[#163638]/70 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white">
                  Members & Executive Enclosure
                </td>
                <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-200">
                  {currentMembers.toLocaleString()}
                </td>
                <td className="py-3.5 px-3 text-center font-mono text-slate-400">
                  {((currentMembers / currentTotal) * 100).toFixed(1)}%
                </td>
                <td className="py-3.5 px-3 text-center font-mono text-emerald-400 font-bold">
                  2.0%
                </td>
                <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-300">
                  {targetMembers.toLocaleString()}
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                  £25.00
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-amber-300 font-semibold">
                  £{costMembers.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                  £{(targetMembers * 25).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
