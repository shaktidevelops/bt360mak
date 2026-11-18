import React from 'react';
import { FinancialRecord, StadiumTier } from '../types/database';
import { CircleDollarSign, Building, TrendingUp } from 'lucide-react';

interface FinancesViewProps {
  finances: FinancialRecord[];
  stadiumTiers: StadiumTier[];
}

export const FinancesView: React.FC<FinancesViewProps> = ({ finances, stadiumTiers }) => {
  const currentWeek = finances[0];

  return (
    <div className="space-y-6">
      {/* Financial Health Header */}
      <div className="bg-[#06201b]/50 p-5 rounded-xl border border-emerald-900/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CircleDollarSign className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">07_Financial_Ledger & Cashflow</h2>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold font-mono">
            Treasury: £{currentWeek ? currentWeek.cumulative_bank_balance.toLocaleString() : '1,320,573'}
          </span>
        </div>

        {currentWeek && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#031512] border border-emerald-900/60">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Weekly Inflow</span>
              <div className="text-base font-bold font-mono text-emerald-400 mt-1">
                +£{currentWeek.total_inflow.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Gate, Sponsors, Merch</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#031512] border border-emerald-900/60">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Weekly Outflow</span>
              <div className="text-base font-bold font-mono text-rose-400 mt-1">
                -£{currentWeek.total_outflow.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Player & Staff Wages, Ground</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#031512] border border-emerald-900/60">
              <span className="text-[10px] uppercase font-bold text-slate-400">Net Weekly Profit (P&L)</span>
              <div className="text-base font-bold font-mono text-emerald-300 mt-1 flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                +£{currentWeek.net_weekly_pnl.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Weekly Surplus Capital</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#031512] border border-emerald-900/60">
              <span className="text-[10px] uppercase font-bold text-slate-400">Wage-to-Inflow Ratio</span>
              <div className="text-base font-bold font-mono text-teal-300 mt-1">
                {((currentWeek.player_wages / currentWeek.total_inflow) * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Optimal Healthy Threshold &lt; 30%</div>
            </div>
          </div>
        )}
      </div>

      {/* 10,000 Capacity Stadium Planner */}
      <div className="bg-[#031512]/90 rounded-xl border border-emerald-900/40 p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">08_Stadium_Planner - Prabhas Coastal Oval (10,000 Capacity)</h3>
          </div>
          <span className="text-xs text-emerald-400 font-semibold font-mono">Current: 10,000 / Rec: 15,000 Seats</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#062922] text-slate-300 uppercase tracking-wider text-[10px] border-b border-emerald-900/60">
                <th className="py-2.5 px-3">Seating Tier</th>
                <th className="py-2.5 px-3 text-right">Current Seats</th>
                <th className="py-2.5 px-3 text-center">Optimal Ratio</th>
                <th className="py-2.5 px-3 text-right">Recommended</th>
                <th className="py-2.5 px-3 text-right">Ticket Price</th>
                <th className="py-2.5 px-3 text-right">Max Weekly Gate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/60">
              {stadiumTiers.map((tier) => (
                <tr key={tier.id} className="hover:bg-emerald-950/30">
                  <td className="py-3 px-3 font-semibold text-white">
                    {tier.tier_name}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-300">
                    {tier.current_seats.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-emerald-400 font-semibold">
                    {(tier.optimal_ratio * 100).toFixed(0)}%
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-amber-300 font-bold">
                    {tier.recommended_seats.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-200">
                    £{tier.ticket_price.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-300">
                    £{(tier.recommended_seats * tier.ticket_price).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
