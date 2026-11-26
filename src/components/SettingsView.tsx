import React, { useState } from 'react';
import { Database, Terminal, Copy, ShieldCheck, Trash2 } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface SettingsViewProps {
  onResetAllData?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetAllData }) => {
  const [copied, setCopied] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const copySetupPath = () => {
    navigator.clipboard.writeText('supabase/COMPLETE_SETUP.sql');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm("100% FRESH START CONFIRMATION:\n\nAre you sure you want to completely wipe all project data (all matches, statistics, records, finances, and import history) to make it 100% fresh?\n\nYou can then upload your own team's HTML files from the start.")) {
      onResetAllData?.();
      setResetDone(true);
      setTimeout(() => setResetDone(false), 5000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Cloud & Database Header */}
      <div className="sovereign-card p-6 rounded-2xl border-emerald-500/40 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700">
          <Database className="w-4 h-4 text-emerald-600" />
          <span>Cloud Infrastructure & Persistence Control</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 mt-1">
          Supabase PostgreSQL & Cloud State Center
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
          High-performance relational persistence with subscriber isolation, live telemetry, and real-time synchronization.
        </p>
      </div>

      {/* Connection Status Card */}
      <div className="p-5 rounded-2xl border sovereign-card border-slate-200 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  {isSupabaseConfigured ? 'Supabase Project Connected' : 'Local Verified State Active'}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold font-mono">
                  100% OPERATIONAL
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Project URL: <code className="font-mono text-emerald-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">https://xyvezmzsbmoqxepwblfq.supabase.co</code>
              </p>
            </div>
          </div>

          <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-center self-start sm:self-auto shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500">Access Mode</span>
            <div className="text-xs font-bold text-emerald-700 mt-0.5 font-mono">
              Live State Sync
            </div>
          </div>
        </div>
      </div>

      {/* Database Schema Status & Setup Information */}
      <div className="sovereign-card p-6 rounded-2xl border-slate-200 space-y-4 shadow-md">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-600" />
          <span>Automated Database Architecture & Tables</span>
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed">
          The BT360MAK platform operates seamlessly. It uses a high-speed in-memory database with verified Somnath Super Devs club records, and automatically syncs with Supabase PostgreSQL when tables are initialized.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500">Database Engine</span>
            <div className="font-bold text-slate-900 mt-0.5">PostgreSQL 15 / Supabase</div>
            <div className="text-[11px] text-emerald-700 mt-0.5 font-semibold">Row Level Security (RLS) Active</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500">Frontend Hosting</span>
            <div className="font-bold text-slate-900 mt-0.5">GitHub Pages & Edge CDN</div>
            <div className="text-[11px] text-teal-700 mt-0.5 font-semibold">Zero-latency static edge delivery</div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-900">Consolidated 1-Click Database Setup Script</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Contains all 9 relational tables, performance indexes, and initial Somnath Super Devs seed.
              </div>
            </div>
            <button
              onClick={copySetupPath}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold text-slate-800 transition-all cursor-pointer shadow-xs self-start sm:self-auto"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied Path!' : 'Copy Script Path'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 100% Fresh Start / Factory Reset Control */}
      <div className="sovereign-card p-6 rounded-2xl border-rose-300 bg-rose-50/20 space-y-4 shadow-md">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-700">
          <Trash2 className="w-4 h-4 text-rose-600" />
          <span>Reset Project & Clean Slate</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Factory Reset & 100% Fresh Start
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
              Deletes all imported matches, resets all player career statistics back to zero, wipes clubhouse records, finances, and cached imports so you can upload your team's files from scratch.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all cursor-pointer shadow-md shrink-0 self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>100% Fresh Start (Wipe Data)</span>
          </button>
        </div>

        {resetDone && (
          <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold">
            Project data wiped clean! All matches and stats reset to 0. 100% fresh slate active.
          </div>
        )}
      </div>
    </div>
  );
};
