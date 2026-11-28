import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  Trash2, 
  Table, 
  ShieldCheck, 
  Database,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  DEFAULT_SPREADSHEET_ID, 
  DEFAULT_APPS_SCRIPT_PROJECT_ID, 
  GOOGLE_SHEET_URL, 
  APPS_SCRIPT_EDITOR_URL, 
  getAppsScriptUrl, 
  setAppsScriptUrl, 
  isGoogleSheetsConfigured, 
  pingGoogleSheets, 
  syncToGoogleSheets 
} from '../lib/googleSheetsService';
import { 
  Club, 
  Player, 
  MatchRecord, 
  CricketRecord, 
  FinancialRecord, 
  StadiumTier, 
  NetAllocation, 
  StaffMember, 
  CalendarEvent 
} from '../types/database';

interface SettingsViewProps {
  club?: Club;
  squad?: Player[];
  matches?: MatchRecord[];
  records?: CricketRecord[];
  finances?: FinancialRecord[];
  stadiumTiers?: StadiumTier[];
  nets?: NetAllocation[];
  staff?: StaffMember[];
  calendar?: CalendarEvent[];
  onResetAllData?: () => void;
}

const DATABASE_TABS = [
  { name: 'Club', description: 'Club identity, divisions, treasury, fan mood, ITS & stadium metadata', cols: 19 },
  { name: 'Squad', description: 'Player roster, BTI, 11 skills, stamina, form, leadership & career stats', cols: 36 },
  { name: 'Matches', description: 'Match history, scores, opponents, pitch surface, player figures & scorecard JSON', cols: 16 },
  { name: 'Records', description: 'Club records for individual batting, bowling, partnerships & milestones', cols: 9 },
  { name: 'Finances', description: '4-week financial ledger with gate receipts, sponsors, wages & upkeep', cols: 17 },
  { name: 'Stadium', description: 'Seating tiers (Standing, Uncovered, Covered, Members) & expansion math', cols: 9 },
  { name: 'Nets', description: '10-Net facility allocations, primary/secondary training & coach impact', cols: 10 },
  { name: 'TrainingLogs', description: 'Historical skill pops, level progression & coach efficiency logs', cols: 11 },
  { name: 'Staff', description: 'Backroom coaching staff, PR officers, groundsmen & physio contracts', cols: 8 },
  { name: 'Calendar', description: 'Match schedules, training pop cycles, financial updates & cup fixtures', cols: 9 }
];

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  club, 
  squad = [], 
  matches = [], 
  records = [], 
  finances = [], 
  stadiumTiers = [], 
  nets = [], 
  staff = [], 
  calendar = [], 
  onResetAllData 
}) => {
  const [webAppUrl, setWebAppUrlState] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [resetDone, setResetDone] = useState(false);

  useEffect(() => {
    setWebAppUrlState(getAppsScriptUrl());
  }, []);

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setAppsScriptUrl(webAppUrl);
    setSyncStatus('Apps Script Web App URL saved successfully!');
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await pingGoogleSheets();
      setTestResult(res);
    } catch (e: any) {
      setTestResult({ ok: false, message: e.message || String(e) });
    } finally {
      setIsTesting(false);
    }
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await syncToGoogleSheets({
        club,
        squad,
        matches,
        records,
        finances,
        stadium: stadiumTiers,
        nets,
        staff,
        calendar
      });
      setSyncStatus(res.message);
    } catch (e: any) {
      setSyncStatus(`Sync error: ${e.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const copyScriptPath = () => {
    navigator.clipboard.writeText('google-apps-script/Code.gs');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copySheetId = () => {
    navigator.clipboard.writeText(DEFAULT_SPREADSHEET_ID);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm("100% FRESH START CONFIRMATION:\n\nAre you sure you want to completely wipe all project data (all matches, statistics, records, finances, and import history) to make it 100% fresh?\n\nYou can then upload your own team's HTML files from the start.")) {
      onResetAllData?.();
      setResetDone(true);
      setTimeout(() => setResetDone(false), 5000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Google Sheets Database Banner */}
      <div className="sovereign-card p-6 rounded-2xl border-emerald-500/40 shadow-xl bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800">
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Cloud Database & Relational Persistence Center</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 mt-1">
          Google Sheets Relational Cloud Database
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
          High-performance relational persistence powered 100% by Google Sheets and Google Apps Script. 
          Zero external database dependencies. All 10 Battrick operational domains are formatted with structured tabs, 
          indexes, and instant bidirectional sync.
        </p>
      </div>

      {/* Target Spreadsheet & Apps Script Status Card */}
      <div className="sovereign-card p-6 rounded-2xl border-slate-200 shadow-md space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300">
              <ShieldCheck className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  Target Google Sheet Connected
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold font-mono">
                  ACTIVE DATABASE
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5">
                <span>Spreadsheet ID:</span>
                <code className="font-mono text-emerald-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{DEFAULT_SPREADSHEET_ID}</code>
                <button
                  type="button"
                  onClick={copySheetId}
                  className="p-1 rounded text-slate-500 hover:text-emerald-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Copy Spreadsheet ID"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={GOOGLE_SHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Open Google Sheet</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <a
              href={APPS_SCRIPT_EDITOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Database className="w-4 h-4" />
              <span>Open Apps Script</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>

        {/* Apps Script Web App Deployment Settings */}
        <form onSubmit={handleSaveUrl} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>Google Apps Script Web App Endpoint</span>
              {isGoogleSheetsConfigured() && (
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-mono font-bold">
                  Configured
                </span>
              )}
            </label>
            <span className="text-[11px] text-slate-500 font-medium">
              Deployed from Project: <strong className="font-mono text-slate-700">{DEFAULT_APPS_SCRIPT_PROJECT_ID}</strong>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              value={webAppUrl}
              onChange={(e) => setWebAppUrlState(e.target.value)}
              placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
            >
              Save URL
            </button>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 text-emerald-900 text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
            </button>
          </div>

          {testResult && (
            <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              testResult.ok 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}>
              {testResult.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />}
              <span>{testResult.message}</span>
            </div>
          )}

          {syncStatus && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{syncStatus}</span>
            </div>
          )}
        </form>

        {/* Sync Controls */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            Current live state: <strong className="text-slate-900">{squad.length} Players</strong>, <strong className="text-slate-900">{matches.length} Matches</strong>, <strong className="text-slate-900">{records.length} Records</strong>.
          </div>
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Synchronizing State...' : 'Sync All State to Google Sheet Now'}</span>
          </button>
        </div>
      </div>

      {/* 10 Google Sheet Tabs Schema Architecture */}
      <div className="sovereign-card p-6 rounded-2xl border-slate-200 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Table className="w-4 h-4 text-emerald-600" />
              <span>10 Formatted Google Sheet Tabs & Relational Schemas</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Formatted with emerald headers (#064e3b), frozen top rows, auto column widths, and proper data types.
            </p>
          </div>

          <button
            onClick={copyScriptPath}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold text-slate-800 transition-all cursor-pointer shadow-xs self-start sm:self-auto shrink-0"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedCode ? 'Copied Code Path!' : 'Copy Code.gs Path'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {DATABASE_TABS.map((tab) => (
            <div key={tab.name} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-emerald-800">
                  {tab.name}
                </span>
                <span className="text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  {tab.cols} cols
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                {tab.description}
              </p>
            </div>
          ))}
        </div>

        {/* 3-Step Setup Quick Guide */}
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs">
          <div className="font-bold text-emerald-950 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>How to initialize or refresh all 10 tabs in your Google Sheet:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-emerald-900 leading-relaxed pl-1">
            <li>Click <strong>Open Apps Script</strong> above to open project <code className="font-mono bg-emerald-100 px-1 rounded">{DEFAULT_APPS_SCRIPT_PROJECT_ID}</code>.</li>
            <li>Paste the contents of <code className="font-mono bg-emerald-100 px-1 rounded">google-apps-script/Code.gs</code> and run <code className="font-mono bg-emerald-100 px-1 rounded">setupBT360Database</code> to format all 10 tabs instantly.</li>
            <li>Click <strong>Deploy &gt; New deployment &gt; Web app</strong> (Execute as: <em>Me</em>, Access: <em>Anyone</em>), copy the Web App URL, and paste it into the endpoint box above.</li>
          </ol>
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
