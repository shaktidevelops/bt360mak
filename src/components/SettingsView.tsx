import React, { useState } from 'react';
import { Database, Key, CheckCircle, ExternalLink, Copy, ShieldCheck } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export const SettingsView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyMigrationPath = () => {
    navigator.clipboard.writeText('supabase/migrations/20261118_initial_schema.sql');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-[#06201b]/50 p-5 rounded-xl border border-emerald-900/40">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">10_Supabase & Cloud Migration Console</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Connect your live Supabase project to activate PostgreSQL persistence, RLS subscriber isolation, and real-time syncing.
        </p>
      </div>

      {/* Connection Status Card */}
      <div className={`p-5 rounded-xl border ${
        isSupabaseConfigured 
          ? 'bg-emerald-950/30 border-emerald-800/60' 
          : 'bg-[#031512] border-amber-900/50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isSupabaseConfigured ? 'bg-emerald-900/60 text-emerald-300' : 'bg-amber-900/60 text-amber-300'}`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {isSupabaseConfigured ? 'Supabase Database Connected' : 'Running in Local Static Preview Mode'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isSupabaseConfigured
                  ? 'All reads and writes are securely routed to PostgreSQL with Model B tenant isolation.'
                  : 'Currently serving verified Somnath Super Devs data from local seed.'}
              </p>
            </div>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-bold font-mono ${
            isSupabaseConfigured 
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' 
              : 'bg-amber-950 text-amber-300 border border-amber-800'
          }`}>
            {isSupabaseConfigured ? 'STATUS: ACTIVE' : 'STATUS: READY FOR KEYS'}
          </span>
        </div>
      </div>

      {/* Quick Setup Checklist */}
      <div className="bg-[#031512]/90 p-5 rounded-xl border border-emerald-900/40 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-emerald-400" />
          <span>Migration Checklist & Activation Instructions</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-[#06201b]/40 border border-emerald-950">
            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <div className="font-bold text-white">Step 1: PostgreSQL DDL Migration Ready</div>
              <div className="text-slate-400 mt-0.5">
                The complete SQL migration has been created in your repo at <code className="text-emerald-300 bg-emerald-950 px-1 py-0.5 rounded font-mono">supabase/migrations/20261118_initial_schema.sql</code>.
              </div>
              <button
                onClick={copyMigrationPath}
                className="mt-2 flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#031512] border border-emerald-900/60 text-[11px] text-emerald-300 hover:text-white transition-all cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Copied Path!' : 'Copy Migration File Path'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-[#06201b]/40 border border-emerald-950">
            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <div className="font-bold text-white">Step 2: Real Data Seed Ready</div>
              <div className="text-slate-400 mt-0.5">
                The seed file <code className="text-emerald-300 bg-emerald-950 px-1 py-0.5 rounded font-mono">supabase/seed.sql</code> contains 100% accurate initial records for Somnath Super Devs (#13108).
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-[#06201b]/40 border border-emerald-950">
            <ExternalLink className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <div className="font-bold text-white">Step 3: Connect Supabase Credentials</div>
              <div className="text-slate-400 mt-0.5 leading-relaxed">
                Create a project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline">supabase.com</a>. Paste your Project URL and Anon Public Key in a <code className="text-amber-300 bg-amber-950/80 px-1 py-0.5 rounded font-mono">.env.local</code> file locally or in GitHub Repository Secrets.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
