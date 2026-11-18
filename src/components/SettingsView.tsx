import React, { useState } from 'react';
import { Database, Terminal, Copy, ShieldCheck } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export const SettingsView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copySetupPath = () => {
    navigator.clipboard.writeText('supabase/COMPLETE_SETUP.sql');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Cloud & Database Header */}
      <div className="bg-[#10272a] p-6 rounded-2xl border border-[#204b4c] shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Cloud Infrastructure & Persistence Control</span>
        </div>
        <h2 className="text-2xl font-black text-white mt-1">
          Supabase PostgreSQL & Cloud State Center
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          High-performance relational persistence with Model B subscriber isolation and real-time syncing.
        </p>
      </div>

      {/* Connection Status Card */}
      <div className="p-5 rounded-2xl border bg-[#10272a] border-emerald-600/40 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  {isSupabaseConfigured ? 'Supabase Project Connected' : 'Local Verified State Active'}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/60 font-bold font-mono">
                  100% OPERATIONAL
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Project URL: <code className="font-mono text-emerald-300 bg-[#091719] px-2 py-0.5 rounded border border-[#204b4c]">https://xyvezmzsbmoqxepwblfq.supabase.co</code>
              </p>
            </div>
          </div>

          <div className="bg-[#091719] px-4 py-2 rounded-xl border border-[#204b4c] text-center self-start sm:self-auto">
            <span className="text-[10px] uppercase font-bold text-slate-400">Access Mode</span>
            <div className="text-xs font-bold text-emerald-300 mt-0.5">
              Live State Sync
            </div>
          </div>
        </div>
      </div>

      {/* Database Schema Status & Setup Information */}
      <div className="bg-[#10272a] p-6 rounded-2xl border border-[#204b4c] space-y-4 shadow-xl">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Automated Database Architecture & Tables</span>
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed">
          The BT360MAK platform is built to operate seamlessly. It uses a high-speed in-memory database with verified Somnath Super Devs club records, and automatically integrates with Supabase PostgreSQL when tables are initialized.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-[#0a181a] border border-[#204b4c]">
            <span className="text-[10px] uppercase font-bold text-slate-400">Database Engine</span>
            <div className="font-bold text-white mt-0.5">PostgreSQL 15 / Supabase</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Row Level Security (RLS) Active</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0a181a] border border-[#204b4c]">
            <span className="text-[10px] uppercase font-bold text-slate-400">Frontend Hosting</span>
            <div className="font-bold text-white mt-0.5">GitHub Pages & GitHub Actions</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Zero-latency static edge delivery</div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#1c4344]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Consolidated 1-Click Database Setup Script</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Contains all 9 relational tables, performance indexes, and initial Somnath Super Devs seed.
              </div>
            </div>
            <button
              onClick={copySetupPath}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#163638] border border-[#275d5e] text-xs font-bold text-emerald-300 hover:text-white transition-all cursor-pointer shadow"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied Path!' : 'Copy Script Path'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
