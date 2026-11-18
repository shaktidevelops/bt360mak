import React, { useState } from 'react';
import { FinancialRecord } from '../types/database';
import { CircleDollarSign, TrendingUp, TrendingDown, ArrowUpRight, ShieldCheck, DollarSign } from 'lucide-react';

interface FinancesViewProps {
  finances: FinancialRecord[];
}

export const FinancesView: React.FC<FinancesViewProps> = ({ finances }) => {
  const currentWeek = finances[0] || {
    id: 'fin-1',
    club_id: '13108',
    week_number: 1,
    record_date: '2026-11-18',
    gate_receipts: 126546,
    sponsors: 22823,
    merchandise: 15128,
    prize_money: 33114,
    total_inflow: 197611,
    player_wages: 7034,
    staff_wages: 12250,
    stadium_upkeep: 14702,
    youth_academy: 0,
    total_outflow: 33986,
    net_weekly_pnl: 163625,
    cumulative_bank_balance: 1320573
  };

  const [wageAdjustment, setWageAdjustment] = useState<number>(0);
  const projectedWeeklyProfit = currentWeek.net_weekly_pnl - wageAdjustment;
  const projectedAnnualSurplus = (currentWeek.cumulative_bank_balance + (projectedWeeklyProfit * 16));

  const totalInflow = currentWeek.total_inflow;
  const gatePct = Math.round((currentWeek.gate_receipts / totalInflow) * 100);
  const sponsorPct = Math.round((currentWeek.sponsors / totalInflow) * 100);
  const merchPct = Math.round((currentWeek.merchandise / totalInflow) * 100);
  const prizePct = Math.round((currentWeek.prize_money / totalInflow) * 100);

  return (
    <div className="space-y-6">
      {/* Financial Operations Header */}
      <div className="bg-[#10272a] p-6 rounded-2xl border border-[#204b4c] shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <CircleDollarSign className="w-4 h-4 text-emerald-400" />
              <span>Commercial Intelligence & Financial Treasury</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Somnath Super Devs Financial Control Center
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              52-week cashflow audit, wage cap compliance, and revenue stream distribution for active domestic campaigns.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#091719] px-4 py-2.5 rounded-xl border border-[#204b4c]">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Financial Rating</div>
              <div className="text-sm font-extrabold text-emerald-300">AAA Sovereign Grade</div>
            </div>
          </div>
        </div>

        {/* 4 Core Financial KPI Meters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#1c4344]">
          <div className="p-4 rounded-xl bg-[#0a181a] border border-[#204b4c]">
            <span className="text-[10px] uppercase font-bold text-slate-400">Liquid Treasury</span>
            <div className="text-2xl font-black font-mono text-emerald-300 mt-0.5">
              £{currentWeek.cumulative_bank_balance.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-400/90 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Fully solvent capital buffer
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0a181a] border border-[#204b4c]">
            <span className="text-[10px] uppercase font-bold text-slate-400">Weekly Net Surplus</span>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-0.5">
              +£{currentWeek.net_weekly_pnl.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-300 mt-1">
              Inflow £{currentWeek.total_inflow.toLocaleString()} | Out £{currentWeek.total_outflow.toLocaleString()}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0a181a] border border-[#204b4c]">
            <span className="text-[10px] uppercase font-bold text-slate-400">Wage-to-Turnover Ratio</span>
            <div className="text-2xl font-black font-mono text-amber-300 mt-0.5">
              {((currentWeek.player_wages / currentWeek.total_inflow) * 100).toFixed(1)}%
            </div>
            <div className="text-[11px] text-emerald-400 mt-1">
              Benchmark &lt; 30% (Optimal)
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0a181a] border border-[#204b4c]">
            <span className="text-[10px] uppercase font-bold text-slate-400">Season-End Projection</span>
            <div className="text-2xl font-black font-mono text-white mt-0.5">
              £{projectedAnnualSurplus.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-300 mt-1">
              16-week regular season runway
            </div>
          </div>
        </div>
      </div>

      {/* REVENUE VS EXPENDITURE BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Inflow Streams */}
        <div className="bg-[#10272a] p-5 rounded-2xl border border-emerald-600/30 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-extrabold text-white">Weekly Inflow Breakdown</h3>
            </div>
            <span className="text-sm font-black font-mono text-emerald-400">
              £{currentWeek.total_inflow.toLocaleString()}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-200 mb-1">
                <span>Gate Receipts (Home Match)</span>
                <span className="font-mono">£{currentWeek.gate_receipts.toLocaleString()} ({gatePct}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#0a181a]">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${gatePct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-200 mb-1">
                <span>League Sponsorship Grants</span>
                <span className="font-mono">£{currentWeek.sponsors.toLocaleString()} ({sponsorPct}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#0a181a]">
                <div className="h-full rounded-full bg-teal-500" style={{ width: `${sponsorPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-200 mb-1">
                <span>Prize Money & Match Bonuses</span>
                <span className="font-mono">£{currentWeek.prize_money.toLocaleString()} ({prizePct}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#0a181a]">
                <div className="h-full rounded-full bg-amber-500" style={{ width: `${prizePct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-200 mb-1">
                <span>Club Merchandise & Fan Retail</span>
                <span className="font-mono">£{currentWeek.merchandise.toLocaleString()} ({merchPct}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#0a181a]">
                <div className="h-full rounded-full bg-cyan-500" style={{ width: `${merchPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Outflow Streams */}
        <div className="bg-[#10272a] p-5 rounded-2xl border border-rose-600/30 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                <TrendingDown className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-extrabold text-white">Weekly Operational Outflows</h3>
            </div>
            <span className="text-sm font-black font-mono text-rose-400">
              £{currentWeek.total_outflow.toLocaleString()}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-2.5 rounded-xl bg-[#0a181a] border border-[#204b4c] flex justify-between items-center">
              <div>
                <span className="font-bold text-white">14-Man Player Wage Bill</span>
                <div className="text-[11px] text-slate-400">Includes wonderkids & senior contracts</div>
              </div>
              <span className="font-mono font-bold text-rose-300">£{currentWeek.player_wages.toLocaleString()}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0a181a] border border-[#204b4c] flex justify-between items-center">
              <div>
                <span className="font-bold text-white">Backroom Staff Salaries</span>
                <div className="text-[11px] text-slate-400">Head Coach, Physio, Head Scout, Financial Director</div>
              </div>
              <span className="font-mono font-bold text-rose-300">£{currentWeek.staff_wages.toLocaleString()}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0a181a] border border-[#204b4c] flex justify-between items-center">
              <div>
                <span className="font-bold text-white">Ground Maintenance & Pitch Prep</span>
                <div className="text-[11px] text-slate-400">10,000 Capacity stadium upkeep & turf curing</div>
              </div>
              <span className="font-mono font-bold text-rose-300">£{currentWeek.stadium_upkeep.toLocaleString()}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0a181a] border border-[#204b4c] flex justify-between items-center">
              <div>
                <span className="font-bold text-white">Youth Academy Investment</span>
                <div className="text-[11px] text-slate-400">Weekly intake scouting & development</div>
              </div>
              <span className="font-mono font-bold text-slate-400">£0</span>
            </div>
          </div>
        </div>
      </div>

      {/* SENSITIVITY & WAGE INCREASE SIMULATOR */}
      <div className="bg-[#10272a] rounded-2xl border border-[#204b4c] p-5 shadow-xl">
        <h3 className="text-sm font-extrabold text-white mb-2 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>Tactical Financial Stress Test (Wage & Expenditure Simulator)</span>
        </h3>
        <p className="text-xs text-slate-300 mb-4">
          Simulate signing high-wage transfers or upgrading coaching staff to forecast impact on weekly cashflow.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-[#0a181a] p-4 rounded-xl border border-[#204b4c]">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-bold text-slate-200 mb-1">
              <span>Simulated Additional Weekly Wages</span>
              <span className="text-amber-400 font-mono">+£{wageAdjustment.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={wageAdjustment}
              onChange={(e) => setWageAdjustment(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="sm:border-l sm:border-[#204b4c] sm:pl-4 text-xs">
            <span className="text-slate-400 font-semibold">Simulated Net Profit:</span>
            <div className={`text-base font-bold font-mono ${projectedWeeklyProfit > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              £{projectedWeeklyProfit.toLocaleString()} / wk
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
