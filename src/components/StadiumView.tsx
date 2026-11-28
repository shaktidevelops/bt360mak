import React, { useState } from 'react';
import { StadiumTier, Club } from '../types/database';
import { Building2, Hammer, Ticket } from 'lucide-react';

interface StadiumViewProps {
  tiers?: StadiumTier[];
  club?: Club;
}

export const StadiumView: React.FC<StadiumViewProps> = ({ tiers = [], club }) => {
  const [targetCapacity, setTargetCapacity] = useState<number>(club?.stadium_capacity && club.stadium_capacity > 0 ? club.stadium_capacity : 10000);

  // Standard Battrick Optimal Seating Ratios:
  // Standing: 68%, Uncovered: 23%, Covered: 7%, Members: 2%
  const targetStanding = Math.round(targetCapacity * 0.68);
  const targetUncovered = Math.round(targetCapacity * 0.23);
  const targetCovered = Math.round(targetCapacity * 0.07);
  const targetMembers = Math.round(targetCapacity * 0.02);

  const standingTier = tiers?.find(t => t.tier_name.toLowerCase().includes('standing'));
  const uncoveredTier = tiers?.find(t => t.tier_name.toLowerCase().includes('uncovered'));
  const coveredTier = tiers?.find(t => t.tier_name.toLowerCase().includes('covered'));
  const membersTier = tiers?.find(t => t.tier_name.toLowerCase().includes('member'));

  const currentStanding = standingTier?.current_seats ?? (club?.stadium_capacity ? Math.round(club.stadium_capacity * 0.5275) : 0);
  const currentUncovered = uncoveredTier?.current_seats ?? (club?.stadium_capacity ? Math.round(club.stadium_capacity * 0.327) : 0);
  const currentCovered = coveredTier?.current_seats ?? (club?.stadium_capacity ? Math.round(club.stadium_capacity * 0.11) : 0);
  const currentMembers = membersTier?.current_seats ?? (club?.stadium_capacity ? Math.round(club.stadium_capacity * 0.0355) : 0);
  const currentTotal = club?.stadium_capacity ?? (currentStanding + currentUncovered + currentCovered + currentMembers);

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
      <div className="sovereign-card p-6 rounded-2xl border-emerald-500/40 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Infrastructure Architecture & Stadium Optimization</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              {club?.stadium_name && club.stadium_name !== 'Unassigned Ground' ? `${club.stadium_name} Arena Planner` : 'Stadium Arena Planner'}
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {club?.name && club.name !== 'Awaiting Club Import' ? club.name : 'Club'} home arena. Optimize seating distribution ratios (68% Standing, 23% Uncovered, 7% Covered, 2% Members), ticket pricing models, and ground expansion ROI.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500">Current Capacity</span>
              <div className="text-xl font-black font-mono text-emerald-700">
                {currentTotal > 0 ? `${currentTotal.toLocaleString()} Seats` : '0 Seats'}
              </div>
            </div>
            <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500">Pitch Condition</span>
              <div className="text-sm font-bold text-amber-700">{club?.pitch_condition || 'Standard'}</div>
            </div>
          </div>
        </div>

        {/* Stadium Performance Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-200">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500">Current Gate Potential</span>
            <div className="text-2xl font-black font-mono text-emerald-700 mt-0.5">
              £{currentMaxGate.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Per sellout home fixture</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500">Target Gate Potential</span>
            <div className="text-2xl font-black font-mono text-teal-700 mt-0.5">
              £{targetMaxGate.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-700 mt-1 font-semibold">
              +£{incrementalRevenuePerHomeMatch.toLocaleString()} gain / match
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500">Total Expansion Cost</span>
            <div className="text-2xl font-black font-mono text-amber-700 mt-0.5">
              £{totalExpansionCost.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Contractor capital expenditure</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500">Capital Break-Even</span>
            <div className="text-2xl font-black font-mono text-slate-900 mt-0.5">
              ~{breakEvenHomeMatches} Home Matches
            </div>
            <div className="text-[11px] text-emerald-700 mt-1 font-semibold">High ROI investment window</div>
          </div>
        </div>
      </div>

      {/* EXPANSION SLIDER & ROI CALCULATOR */}
      <div className="sovereign-card rounded-2xl border-slate-200 p-5 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Hammer className="w-5 h-5 text-amber-600" />
              <span>Interactive Stadium Expansion Simulator</span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Drag slider to calculate optimal distribution ratios and contractor quotes for your next stadium tier upgrade.
            </p>
          </div>
          <div className="bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-300 font-mono font-bold text-emerald-800 text-sm">
            Target: {targetCapacity.toLocaleString()} Seats
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex justify-between text-xs text-slate-500 font-bold mb-2">
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
            className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
        </div>
      </div>

      {/* DETAILED STAND-BY-STAND BLUEPRINT */}
      <div className="sovereign-card rounded-2xl border-slate-200 p-5 shadow-md">
        <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <Ticket className="w-5 h-5 text-emerald-600" />
          <span>{club?.stadium_name && club.stadium_name !== 'Unassigned Ground' ? club.stadium_name : 'Stadium'} Seating Blueprint & Pricing Matrix</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[10px] border-b border-slate-200">
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
            <tbody className="divide-y divide-slate-100 font-mono">
              <tr className="hover:bg-emerald-50/50 transition-colors">
                <td className="py-3.5 px-4 font-sans font-bold text-slate-900">
                  Standing Terraces (General Admission)
                </td>
                <td className="py-3.5 px-3 text-right font-bold text-slate-800">
                  {currentStanding.toLocaleString()}
                </td>
                <td className="py-3.5 px-3 text-center text-slate-500">
                  {((currentStanding / currentTotal) * 100).toFixed(1)}%
                </td>
                <td className="py-3.5 px-3 text-center text-emerald-700 font-bold">
                  68.0%
                </td>
                <td className="py-3.5 px-3 text-right font-bold text-emerald-700">
                  {targetStanding.toLocaleString()}
                </td>
                <td className="py-3.5 px-3 text-right text-slate-700">
                  £5.00
                </td>
                <td className="py-3.5 px-3 text-right text-amber-700 font-semibold">
                  £{costStanding.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                  £{(targetStanding * 5).toLocaleString()}
                </td>
              </tr>

              <tr className="hover:bg-emerald-50/50 transition-colors">
                <td className="py-3.5 px-4 font-sans font-bold text-slate-900">
                  Uncovered Grandstand
                </td>
                <td className="py-3.5 px-3 text-right font-bold text-slate-800">
                  {currentUncovered.toLocaleString()}
                </td>
                <td className="py-3.5 px-3 text-center text-slate-500">
                  {((currentUncovered / currentTotal) * 100).toFixed(1)}%
                </td>
                <td className="py-3.5 px-3 text-center text-emerald-700 font-bold">
                  23.0%
                </td>
                <td className="py-3.5 px-3 text-right font-bold text-emerald-700">
                  {targetUncovered.toLocaleString()}
                </td>
                <td className="py-3.5 px-3 text-right text-slate-700">
                  £8.00
                </td>
                <td className="py-3.5 px-3 text-right text-amber-700 font-semibold">
                  £{costUncovered.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                  £{(targetUncovered * 8).toLocaleString()}
                </td>
              </tr>

              <tr className="hover:bg-emerald-50/50 transition-colors">
                <td className="py-3.5 px-4 font-sans font-bold text-slate-900">
                  Covered Pavilion Seats
                </td>
                <td className="py-3.5 px-3 text-right font-bold text-slate-800">
                  {currentCovered.toLocaleString()}
                </td>
                <td className="py-3.5 px-3 text-center text-slate-500">
                  {((currentCovered / currentTotal) * 100).toFixed(1)}%
                </td>
                <td className="py-3.5 px-3 text-center text-emerald-700 font-bold">
                  7.0%
                </td>
                <td className="py-3.5 px-3 text-right font-bold text-emerald-700">
                  {targetCovered.toLocaleString()}
                </td>
                <td className="py-3.5 px-3 text-right text-slate-700">
                  £14.00
                </td>
                <td className="py-3.5 px-3 text-right text-amber-700 font-semibold">
                  £{costCovered.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                  £{(targetCovered * 14).toLocaleString()}
                </td>
              </tr>

              <tr className="hover:bg-emerald-50/50 transition-colors">
                <td className="py-3.5 px-4 font-sans font-bold text-slate-900">
                  Members & Executive Enclosure
                </td>
                <td className="py-3.5 px-3 text-right font-bold text-slate-800">
                  {currentMembers.toLocaleString()}
                </td>
                <td className="py-3.5 px-3 text-center text-slate-500">
                  {((currentMembers / currentTotal) * 100).toFixed(1)}%
                </td>
                <td className="py-3.5 px-3 text-center text-emerald-700 font-bold">
                  2.0%
                </td>
                <td className="py-3.5 px-3 text-right font-bold text-emerald-700">
                  {targetMembers.toLocaleString()}
                </td>
                <td className="py-3.5 px-3 text-right text-slate-700">
                  £25.00
                </td>
                <td className="py-3.5 px-3 text-right text-amber-700 font-semibold">
                  £{costMembers.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-slate-900">
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
