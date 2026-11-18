import React, { useState } from 'react';
import { FinancialRecord } from '../types/database';
import { 
  CircleDollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ShieldCheck, 
  DollarSign, 
  Filter, 
  Calendar,
  Layers
} from 'lucide-react';

interface FinancesViewProps {
  finances: FinancialRecord[];
}

export const FinancesView: React.FC<FinancesViewProps> = ({ finances }) => {
  const [selectedWeek, setSelectedWeek] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [wageAdjustment, setWageAdjustment] = useState<number>(0);

  // Filter financial ledger
  const filteredFinances = finances.filter(f => {
    const matchesWeek = selectedWeek === 'ALL' || f.week_number.toString() === selectedWeek;
    const matchesCat = selectedCategory === 'ALL' || f.category === selectedCategory;
    return matchesWeek && matchesCat;
  });

  const latestRecord = finances[0] || {
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
    staff_wages: 15650,
    stadium_upkeep: 14702,
    youth_academy: 36000,
    total_outflow: 73386,
    net_weekly_pnl: 124225,
    cumulative_bank_balance: 1320573,
    category: 'Home Match Week'
  };

  const projectedWeeklyProfit = latestRecord.net_weekly_pnl - wageAdjustment;
  const projectedAnnualSurplus = latestRecord.cumulative_bank_balance + (projectedWeeklyProfit * 16);

  // Aggregate metrics across filtered data
  const totalFilteredInflow = filteredFinances.reduce((acc, f) => acc + f.total_inflow, 0);
  const totalFilteredOutflow = filteredFinances.reduce((acc, f) => acc + f.total_outflow, 0);
  const totalFilteredNet = filteredFinances.reduce((acc, f) => acc + f.net_weekly_pnl, 0);

  const gatePct = Math.round((latestRecord.gate_receipts / latestRecord.total_inflow) * 100);
  const sponsorPct = Math.round((latestRecord.sponsors / latestRecord.total_inflow) * 100);
  const merchPct = Math.round((latestRecord.merchandise / latestRecord.total_inflow) * 100);
  const prizePct = Math.round((latestRecord.prize_money / latestRecord.total_inflow) * 100);

  return (
    <div className="space-y-6">
      {/* Financial Operations Header */}
      <div className="bg-[#0e2c24] p-6 rounded-2xl border border-emerald-600/30 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
              <CircleDollarSign className="w-4 h-4 text-emerald-400" />
              <span>Commercial Intelligence & Financial Treasury</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Somnath Super Devs Financial Control Center
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              52-week cashflow audit, wage cap compliance, Prabhas Oval gate receipts, and revenue stream distribution for active domestic campaigns.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#061713] px-4 py-2.5 rounded-xl border border-emerald-800/40">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Financial Rating</div>
              <div className="text-sm font-extrabold text-emerald-300">AAA Sovereign Grade</div>
            </div>
          </div>
        </div>

        {/* 4 Core Financial KPI Meters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-4 border-t border-emerald-800/40">
          <div className="p-4 rounded-xl bg-[#061713] border border-emerald-800/40">
            <span className="text-[10px] uppercase font-bold text-slate-400">Liquid Treasury</span>
            <div className="text-2xl font-black font-mono text-emerald-300 mt-0.5">
              £{latestRecord.cumulative_bank_balance.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-400/90 mt-1 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3 h-3" /> Fully solvent capital buffer
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#061713] border border-emerald-800/40">
            <span className="text-[10px] uppercase font-bold text-slate-400">Latest Weekly Net P&L</span>
            <div className={`text-2xl font-black font-mono mt-0.5 ${latestRecord.net_weekly_pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {latestRecord.net_weekly_pnl >= 0 ? '+' : ''}£{latestRecord.net_weekly_pnl.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-300 mt-1">
              Inflow £{latestRecord.total_inflow.toLocaleString()} | Out £{latestRecord.total_outflow.toLocaleString()}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#061713] border border-emerald-800/40">
            <span className="text-[10px] uppercase font-bold text-slate-400">Wage-to-Turnover Ratio</span>
            <div className="text-2xl font-black font-mono text-amber-300 mt-0.5">
              {((latestRecord.player_wages / latestRecord.total_inflow) * 100).toFixed(1)}%
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 font-semibold">
              Benchmark &lt; 30% (Optimal)
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#061713] border border-emerald-800/40">
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

      {/* FILTER & AUDIT TOOLBAR */}
      <div className="bg-[#0e2c24] p-4 rounded-2xl border border-emerald-600/30 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-black uppercase text-white">Ledger Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Week Selector */}
          <div className="flex items-center gap-2 bg-[#061713] px-3 py-1.5 rounded-xl border border-emerald-800/40 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-semibold">Week:</span>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="bg-transparent text-emerald-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#0c241e]">All Weeks ({finances.length})</option>
              {finances.map(f => (
                <option key={f.id} value={f.week_number.toString()} className="bg-[#0c241e]">
                  Week {f.week_number} ({f.record_date})
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 bg-[#061713] px-3 py-1.5 rounded-xl border border-emerald-800/40 text-xs">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-semibold">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-emerald-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#0c241e]">All Categories</option>
              <option value="Home Match Week" className="bg-[#0c241e]">Home Match Week (Gate Inflow)</option>
              <option value="Away Match Week" className="bg-[#0c241e]">Away Match Week</option>
            </select>
          </div>

          {/* Filter summary badge */}
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 bg-[#061713] px-3 py-1.5 rounded-xl border border-emerald-800/40">
            <span>In: <strong className="text-emerald-300">£{totalFilteredInflow.toLocaleString()}</strong></span>
            <span className="text-emerald-800">|</span>
            <span>Out: <strong className="text-rose-300">£{totalFilteredOutflow.toLocaleString()}</strong></span>
            <span className="text-emerald-800">|</span>
            <span>Net: <strong className={totalFilteredNet >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              {totalFilteredNet >= 0 ? '+' : ''}£{totalFilteredNet.toLocaleString()}
            </strong></span>
          </div>
        </div>
      </div>

      {/* HISTORICAL FINANCIAL LEDGER TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-emerald-600/30 bg-[#0e2c24] shadow-2xl">
        <div className="p-4 bg-[#071d18] border-b border-emerald-800/40 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase text-emerald-400 flex items-center gap-2">
            <CircleDollarSign className="w-4 h-4" />
            <span>52-Week Comprehensive Financial Ledger & P&L Statement</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-300">
            Showing {filteredFinances.length} of {finances.length} Records
          </span>
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#061713] text-slate-300 font-bold border-b border-emerald-800/40 uppercase tracking-wider text-[10px]">
              <th className="py-3 px-3 text-center">Wk</th>
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3 text-right">Gate (£)</th>
              <th className="py-3 px-3 text-right">Sponsors (£)</th>
              <th className="py-3 px-3 text-right">Merch (£)</th>
              <th className="py-3 px-3 text-right">Prize (£)</th>
              <th className="py-3 px-3 text-right text-emerald-300 font-black">Total In (£)</th>
              <th className="py-3 px-3 text-right">Player Wages</th>
              <th className="py-3 px-3 text-right">Staff Wages</th>
              <th className="py-3 px-3 text-right">Upkeep</th>
              <th className="py-3 px-3 text-right">Academy</th>
              <th className="py-3 px-3 text-right text-rose-300 font-black">Total Out (£)</th>
              <th className="py-3 px-3 text-right font-black">Net P&L (£)</th>
              <th className="py-3 px-4 text-right font-black">Treasury (£)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-950/60 font-mono">
            {filteredFinances.map((rec) => {
              const isProfit = rec.net_weekly_pnl >= 0;
              return (
                <tr key={rec.id} className="hover:bg-[#12362b]/70 transition-colors">
                  <td className="py-3 px-3 text-center font-bold text-white">
                    {rec.week_number}
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-300 whitespace-nowrap">
                    {rec.record_date}
                  </td>
                  <td className="py-3 px-3 font-sans whitespace-nowrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      rec.category === 'Home Match Week'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/60'
                        : 'bg-[#061713] text-slate-400 border border-emerald-800/40'
                    }`}>
                      {rec.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-200">
                    £{rec.gate_receipts.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300">
                    £{rec.sponsors.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300">
                    £{rec.merchandise.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-amber-300">
                    £{rec.prize_money.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-300 font-black">
                    £{rec.total_inflow.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300">
                    £{rec.player_wages.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300">
                    £{rec.staff_wages.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300">
                    £{rec.stadium_upkeep.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300">
                    £{rec.youth_academy.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-rose-300 font-black">
                    £{rec.total_outflow.toLocaleString()}
                  </td>
                  <td className={`py-3 px-3 text-right font-black ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isProfit ? '+' : ''}£{rec.net_weekly_pnl.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-white font-black whitespace-nowrap">
                    £{rec.cumulative_bank_balance.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* REVENUE VS EXPENDITURE BREAKDOWN & SENSITIVITY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Inflow Streams */}
        <div className="bg-[#0e2c24] p-5 rounded-2xl border border-emerald-600/30 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-extrabold text-white">Latest Matchday Inflow Distribution</h3>
            </div>
            <span className="text-sm font-black font-mono text-emerald-400">
              £{latestRecord.total_inflow.toLocaleString()}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-200 mb-1">
                <span>Gate Receipts (Prabhas Coastal Oval)</span>
                <span className="font-mono">£{latestRecord.gate_receipts.toLocaleString()} ({gatePct}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#061713]">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${gatePct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-200 mb-1">
                <span>League Sponsorship Grants</span>
                <span className="font-mono">£{latestRecord.sponsors.toLocaleString()} ({sponsorPct}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#061713]">
                <div className="h-full rounded-full bg-teal-500" style={{ width: `${sponsorPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-200 mb-1">
                <span>Prize Money & Match Bonuses</span>
                <span className="font-mono">£{latestRecord.prize_money.toLocaleString()} ({prizePct}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#061713]">
                <div className="h-full rounded-full bg-amber-500" style={{ width: `${prizePct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-200 mb-1">
                <span>Club Merchandise & Fan Retail</span>
                <span className="font-mono">£{latestRecord.merchandise.toLocaleString()} ({merchPct}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#061713]">
                <div className="h-full rounded-full bg-cyan-500" style={{ width: `${merchPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Wage & Outflow Simulator */}
        <div className="bg-[#0e2c24] p-5 rounded-2xl border border-emerald-600/30 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-extrabold text-white">Wage & Transfer Budget Stress-Test</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Simulate signing marquee players or expanding staff to forecast weekly treasury solvency impact.
            </p>

            <div className="bg-[#061713] p-4 rounded-xl border border-emerald-800/40 space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-200 mb-1">
                  <span>Additional Simulated Weekly Wages:</span>
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

              <div className="pt-2 border-t border-emerald-800/40 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">Simulated Net Profit / Wk:</span>
                <span className={`text-base font-black font-mono ${projectedWeeklyProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {projectedWeeklyProfit >= 0 ? '+' : ''}£{projectedWeeklyProfit.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-800/40 text-center">
            <span className="text-[11px] text-slate-400">
              Active Weekly Wage Cap: <strong className="text-white">£45,000</strong> &bull; Current Bill: <strong className="text-emerald-400">£{latestRecord.player_wages.toLocaleString()}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
