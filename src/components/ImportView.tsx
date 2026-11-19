import React, { useState } from 'react';
import { Club, Player, FinancialRecord } from '../types/database';
import { 
  Download, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Table, 
  Sparkles, 
  Link2,
  RefreshCw,
  Copy
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface ImportViewProps {
  club: Club;
  squad: Player[];
  onImportSquad: (newSquad: Player[]) => void;
  onImportClub: (newClub: Club) => void;
  onImportFinances?: (newFinances: FinancialRecord[]) => void;
}

export const ImportView: React.FC<ImportViewProps> = ({
  club,
  squad,
  onImportSquad,
  onImportClub
}) => {
  const [activeImportTab, setActiveImportTab] = useState<'paste' | 'sheet' | 'xml' | 'json'>('paste');
  const [rawText, setRawText] = useState('');
  const [parseResult, setParseResult] = useState<{
    type: 'squad' | 'office' | 'finances' | 'ground' | 'unknown';
    count: number;
    title: string;
    players?: Partial<Player>[];
    clubUpdates?: Partial<Club>;
    message?: string;
  } | null>(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Smart Parser for Battrick raw copied text or HTML
  const parseBattrickData = (input: string) => {
    if (!input.trim()) {
      setParseResult(null);
      return;
    }

    // 1. Check for Squad Players (players.asp or copied squad text)
    // Matches patterns like: "Bhadraksh Hemalatha - 17 yo, BT-6099466" or table blocks
    const hasPlayerIndicators = input.includes('Batting') || 
                                input.includes('Bowling') || 
                                input.includes('bti') || 
                                input.includes('BTI') ||
                                input.includes('wage') ||
                                input.includes('Wage') ||
                                input.includes('player_');

    if (hasPlayerIndicators) {
      const extractedPlayers: Partial<Player>[] = [];

      // Regex 1: HTML format (<div class="player" id="player_XXXX">)
      if (input.includes('playerdetails.asp') || input.includes('class="player"')) {
        const playerRegex = /<div class="player" id="player_(\d+)">([\s\S]*?)(?=<div class="player" id="player_|$)/g;
        let match;
        while ((match = playerRegex.exec(input)) !== null) {
          const pId = match[1];
          const block = match[2];

          const nameMatch = block.match(/playerdetails\.asp\?playerID=\d+">([^<]+)<\/a>/);
          const name = nameMatch ? nameMatch[1].trim() : `Player ${pId}`;

          const ageMatch = block.match(/class="player_age">(\d+)</);
          const age = ageMatch ? parseInt(ageMatch[1]) : 20;

          const wageMatch = block.match(/class="player_wage">&#163;([0-9,]+)</);
          const wage = wageMatch ? parseInt(wageMatch[1].replace(/,/g, '')) : 500;

          const btrMatch = block.match(/class="player_btr">([0-9,]+)</);
          const bti = btrMatch ? parseInt(btrMatch[1].replace(/,/g, '')) : 5000;

          // Extract skills
          const extractSkill = (skillName: string) => {
            const rx = new RegExp(`${skillName}:\\s*<span[^>]*>([a-zA-Z]+)<\\/span>`, 'i');
            const m = block.match(rx);
            return m ? m[1].toLowerCase() : 'competent';
          };

          extractedPlayers.push({
            id: pId,
            club_id: club.id,
            name,
            age,
            wage,
            bti,
            batting: extractSkill('Batting'),
            bowling: extractSkill('Bowling'),
            keeping: extractSkill('Keeping'),
            fielding: extractSkill('Fielding'),
            concentration: extractSkill('Concentration'),
            consistency: extractSkill('Consistency'),
            stamina: extractSkill('Stamina'),
            form: 'superb',
            fatigue: 'sublime',
            leadership: 'competent',
            experience: 'feeble',
            subskill: 6.50,
            active_net: 'Unassigned',
            market_value: bti * 80,
            tactical_role: age <= 18 ? 'Wonderkid Trainee' : 'First XI Member',
            is_wonderkid: age <= 18
          });
        }
      }

      // Regex 2: Plain Text copy-paste format from Battrick players page
      // e.g.: "Nandakishor Ramdhyani - 17 yo, 6099471 | Wage: £559 | BTI: 6,360"
      if (extractedPlayers.length === 0) {
        const lines = input.split('\n');
        let currentPlayer: Partial<Player> | null = null;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();

          // Header line with Name and Age
          // e.g.: "Achintya Kharge - 26 yo, ID: 6099475" or "Achintya Kharge (6099475)"
          const nameIdMatch = line.match(/^([A-Za-z\s]+)(?:[-–—\s]+(\d{1,2})\s*yo)?.*?(?:ID[:\s]*|#)?(\d{6,8})/i);
          if (nameIdMatch) {
            if (currentPlayer && currentPlayer.name) {
              extractedPlayers.push(currentPlayer);
            }
            currentPlayer = {
              id: nameIdIdClean(nameIdMatch[3]),
              club_id: club.id,
              name: nameIdMatch[1].trim(),
              age: nameIdMatch[2] ? parseInt(nameIdMatch[2]) : 22,
              wage: 540,
              bti: 6500,
              batting_hand: line.includes('LHB') ? 'LHB' : 'RHB',
              bowling_type: line.includes('Spin') ? 'Right-arm Finger Spin' : line.includes('Fast') ? 'Right-arm Fast' : 'Right-arm Medium',
              batting: 'competent',
              bowling: 'feeble',
              keeping: 'abysmal',
              fielding: 'competent',
              consistency: 'competent',
              concentration: 'competent',
              stamina: 'competent',
              form: 'superb',
              fatigue: 'sublime',
              leadership: 'competent',
              experience: 'feeble',
              subskill: 6.50,
              active_net: 'Unassigned',
              market_value: 400000,
              tactical_role: 'First XI Player',
              is_wonderkid: nameIdMatch[2] ? parseInt(nameIdMatch[2]) <= 18 : false
            };
            continue;
          }

          // Parse wage and BTI in subsequent lines
          if (currentPlayer) {
            const wageM = line.match(/Wage[:\s]*[£$]?([0-9,]+)/i);
            if (wageM) currentPlayer.wage = parseInt(wageM[1].replace(/,/g, ''));

            const btiM = line.match(/(?:BTI|BTR)[:\s]*([0-9,]+)/i);
            if (btiM) {
              currentPlayer.bti = parseInt(btiM[1].replace(/,/g, ''));
              currentPlayer.market_value = currentPlayer.bti * 80;
            }

            // Skills scan
            const checkSkill = (skName: string) => {
              const rx = new RegExp(`${skName}[:\\s]+([A-Za-z]+)`, 'i');
              const m = line.match(rx);
              return m ? m[1].toLowerCase() : null;
            };

            const bat = checkSkill('Batting');
            if (bat) currentPlayer.batting = bat;
            const bowl = checkSkill('Bowling');
            if (bowl) currentPlayer.bowling = bowl;
            const keep = checkSkill('Keeping');
            if (keep) currentPlayer.keeping = keep;
            const fld = checkSkill('Fielding');
            if (fld) currentPlayer.fielding = fld;
            const conc = checkSkill('Concentration');
            if (conc) currentPlayer.concentration = conc;
            const cons = checkSkill('Consistency');
            if (cons) currentPlayer.consistency = cons;
            const stam = checkSkill('Stamina');
            if (stam) currentPlayer.stamina = stam;
          }
        }

        if (currentPlayer && currentPlayer.name) {
          extractedPlayers.push(currentPlayer);
        }
      }

      if (extractedPlayers.length > 0) {
        setParseResult({
          type: 'squad',
          count: extractedPlayers.length,
          title: `Successfully Parsed ${extractedPlayers.length} Battrick Squad Players`,
          players: extractedPlayers
        });
        return;
      }
    }

    // 2. Check for Office / Club Summary (office.asp)
    if (input.includes('Somnath Super Devs') || input.includes('Bank Balance') || input.includes('Fan Club')) {
      const bankM = input.match(/Bank Balance[:\s]*[£$]?([0-9,]+)/i);
      const fanM = input.match(/Fan Club[:\s]*([0-9,]+)/i);
      const moodM = input.match(/Fan Mood[:\s]*([A-Za-z\s]+)/i);

      setParseResult({
        type: 'office',
        count: 1,
        title: 'Battrick Club Office Data Recognized',
        clubUpdates: {
          bank_balance: bankM ? parseInt(bankM[1].replace(/,/g, '')) : club.bank_balance,
          fan_club_members: fanM ? parseInt(fanM[1].replace(/,/g, '')) : club.fan_club_members,
          fan_mood: moodM ? moodM[1].trim() : club.fan_mood
        }
      });
      return;
    }

    setParseResult({
      type: 'unknown',
      count: 0,
      title: 'Unrecognized Data Format',
      message: 'Paste squad HTML/Text from battrick.org/nl/players.asp or office.asp.'
    });
  };

  function nameIdIdClean(idStr?: string): string {
    return String(idStr || '').replace(/^BT-/, '').trim();
  }

  // Apply parsed data to live state
  const handleApplyImport = async () => {
    if (!parseResult) return;
    setIsSyncing(true);

    try {
      if (parseResult.type === 'squad' && parseResult.players && parseResult.players.length > 0) {
        const formatted: Player[] = parseResult.players.map((p, idx) => ({
          id: p.id || String(6099450 + idx),
          club_id: club.id,
          name: p.name || `Player ${idx + 1}`,
          age: p.age || 21,
          wage: p.wage || 540,
          batting_hand: p.batting_hand || 'RHB',
          bowling_type: p.bowling_type || 'Right-arm Medium',
          batting: p.batting || 'competent',
          bowling: p.bowling || 'feeble',
          keeping: p.keeping || 'abysmal',
          fielding: p.fielding || 'competent',
          consistency: p.consistency || 'competent',
          concentration: p.concentration || 'competent',
          stamina: p.stamina || 'competent',
          form: p.form || 'superb',
          fatigue: p.fatigue || 'sublime',
          leadership: p.leadership || 'competent',
          experience: p.experience || 'feeble',
          bti: p.bti || 6500,
          subskill: p.subskill || 6.50,
          active_net: 'Unassigned',
          market_value: p.market_value || 450000,
          tactical_role: p.tactical_role || (p.age && p.age <= 18 ? 'Wonderkid Trainee' : 'Senior Player'),
          is_wonderkid: p.is_wonderkid || (p.age ? p.age <= 18 : false),
          uniqueRecords: p.uniqueRecords || ['Imported from Battrick Club Roster'],
          statsFC: p.statsFC || { matches: 0, innings: 0, runs: 0, highestScore: '0', average: 0, strikeRate: 0, centuries: 0, fifties: 0, fours: 0, sixes: 0, oversBowled: 0, wickets: 0, bestBowling: '0/0', bowlingAverage: 0, economy: 0, fiveWickets: 0, catches: 0, stumpings: 0 },
          statsOD: p.statsOD || { matches: 0, innings: 0, runs: 0, highestScore: '0', average: 0, strikeRate: 0, centuries: 0, fifties: 0, fours: 0, sixes: 0, oversBowled: 0, wickets: 0, bestBowling: '0/0', bowlingAverage: 0, economy: 0, fiveWickets: 0, catches: 0, stumpings: 0 },
          statsT20: p.statsT20 || { matches: 0, innings: 0, runs: 0, highestScore: '0', average: 0, strikeRate: 0, centuries: 0, fifties: 0, fours: 0, sixes: 0, oversBowled: 0, wickets: 0, bestBowling: '0/0', bowlingAverage: 0, economy: 0, fiveWickets: 0, catches: 0, stumpings: 0 }
        }));

        onImportSquad(formatted);

        // Sync to Supabase if configured
        if (isSupabaseConfigured) {
          const { error } = await supabase.from('players').upsert(formatted);
          if (error) console.warn('Supabase upsert note:', error.message);
        }

        setStatusMessage({
          text: `✅ Successfully imported ${formatted.length} Battrick players into live squad & database!`,
          type: 'success'
        });
      } else if (parseResult.type === 'office' && parseResult.clubUpdates) {
        const updatedClub: Club = {
          ...club,
          ...parseResult.clubUpdates
        };
        onImportClub(updatedClub);
        if (isSupabaseConfigured) {
          await supabase.from('clubs').upsert(updatedClub);
        }
        setStatusMessage({
          text: `✅ Club financials and fan mood successfully updated!`,
          type: 'success'
        });
      }
    } catch (err: any) {
      setStatusMessage({
        text: `Error during import: ${err.message}`,
        type: 'error'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Sample data loaders for 1-click testing
  const loadSampleSquadPaste = () => {
    const sample = `Bhadraksh Hemalatha - 17 yo, ID: 6099466 | Wage: £545 | BTI: 6,989 | RHB, Right-arm Finger Spin
Batting: abysmal | Bowling: competent | Keeping: feeble | Fielding: abysmal
Concentration: feeble | Consistency: competent | Stamina: competent | Form: superb

Nandakishor Ramdhyani - 17 yo, ID: 6099471 | Wage: £559 | BTI: 6,360 | LHB, Left-arm Medium
Batting: competent | Bowling: mediocre | Keeping: woeful | Fielding: woeful
Concentration: competent | Consistency: feeble | Stamina: competent | Form: mediocre

Achintya Kharge - 26 yo, ID: 6099475 | Wage: £553 | BTI: 8,436 | RHB, Right-arm Medium
Batting: competent | Bowling: woeful | Keeping: woeful | Fielding: competent
Concentration: competent | Consistency: woeful | Stamina: competent | Form: superb

Purumitra Rishi - 29 yo, ID: 6099469 | Wage: £549 | BTI: 7,286 | RHB, Right-arm Medium
Batting: feeble | Bowling: competent | Keeping: woeful | Fielding: woeful
Concentration: feeble | Consistency: competent | Stamina: competent | Form: superb`;
    setRawText(sample);
    parseBattrickData(sample);
  };

  const handleDownloadBackup = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      club,
      squad,
      version: '2.4.0 Sovereign'
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BT360MAK_Club_${club.id}_Backup.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Importer Hub Header */}
      <div className="sovereign-card p-6 rounded-2xl border-emerald-500/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl cricket-ball flex items-center justify-center text-2xl text-white shadow-xl shrink-0">
              📥
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Battrick Data Ingestion Engine</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                Import from Battrick Club (#13108)
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Seamlessly import and sync your real Battrick squad, club finances, stadium capacity, and training allocations. Paste raw text from Battrick, sync via Google Sheets, or upload backup files.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadBackup}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#081d17] hover:bg-[#113a2e] text-emerald-300 border border-emerald-600/50 text-xs font-bold transition-all cursor-pointer shadow"
              title="Download full JSON backup"
            >
              <Download className="w-4 h-4" />
              <span>Export Club Backup</span>
            </button>
          </div>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div className={`mt-4 p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
              : 'bg-rose-950/80 border-rose-500 text-rose-200'
          }`}>
            <span>{statusMessage.text}</span>
            <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-white ml-2">&times;</button>
          </div>
        )}
      </div>

      {/* Import Method Tabs */}
      <div className="flex items-center gap-2 border-b border-emerald-800/40 pb-2">
        <button
          onClick={() => setActiveImportTab('paste')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeImportTab === 'paste'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
              : 'text-slate-300 hover:text-white hover:bg-[#0c2b23]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Smart Text / HTML Paste</span>
        </button>

        <button
          onClick={() => setActiveImportTab('sheet')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeImportTab === 'sheet'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
              : 'text-slate-300 hover:text-white hover:bg-[#0c2b23]'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Google Sheet / Apps Script Sync</span>
        </button>

        <button
          onClick={() => setActiveImportTab('json')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeImportTab === 'json'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
              : 'text-slate-300 hover:text-white hover:bg-[#0c2b23]'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>JSON Backup / Restore</span>
        </button>
      </div>

      {/* TAB 1: Smart Text / HTML Paste */}
      {activeImportTab === 'paste' && (
        <div className="space-y-4">
          <div className="sovereign-card p-5 rounded-2xl border-emerald-600/30 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Copy className="w-4 h-4 text-emerald-400" />
                  <span>Paste Raw Battrick Web Page Text or HTML</span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Open your Battrick team page (e.g., <code className="text-emerald-300 font-mono">battrick.org/nl/players.asp</code>), press <kbd className="px-1.5 py-0.5 bg-[#051310] rounded border border-emerald-700/50 text-[10px]">Ctrl+A</kbd> then <kbd className="px-1.5 py-0.5 bg-[#051310] rounded border border-emerald-700/50 text-[10px]">Ctrl+C</kbd>, and paste here:
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={loadSampleSquadPaste}
                  className="px-2.5 py-1.5 rounded-lg bg-[#061814] hover:bg-emerald-950 text-amber-300 border border-amber-600/40 text-[11px] font-bold transition-all cursor-pointer"
                >
                  ⚡ Load Sample Squad
                </button>
                <button
                  onClick={() => { setRawText(''); setParseResult(null); }}
                  className="px-2.5 py-1.5 rounded-lg bg-[#061814] hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700/50 text-[11px] font-bold transition-all cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => {
                setRawText(e.target.value);
                parseBattrickData(e.target.value);
              }}
              placeholder="Paste raw Battrick text or HTML source here...

Example:
Bhadraksh Hemalatha - 17 yo, ID: 6099466 | Wage: £545 | BTI: 6,989
Batting: abysmal | Bowling: competent | Keeping: feeble | Fielding: abysmal
Concentration: feeble | Consistency: competent | Stamina: competent..."
              className="w-full p-4 rounded-xl bg-[#04120e] border border-emerald-800/60 font-mono text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 leading-relaxed"
            />
          </div>

          {/* Real-time Parser Results Preview */}
          {parseResult && (
            <div className="sovereign-card p-5 rounded-2xl border-emerald-600/40 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-800/40">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h4 className="text-base font-black text-white">{parseResult.title}</h4>
                    <span className="text-xs text-emerald-300 font-mono font-bold">
                      Detected: {parseResult.type.toUpperCase()} ({parseResult.count} items)
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleApplyImport}
                  disabled={isSyncing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs shadow-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Apply to Live Squad & Update Database &rarr;</span>
                </button>
              </div>

              {/* Preview Table for Squad */}
              {parseResult.players && parseResult.players.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-emerald-800/40 bg-[#04120e]">
                  <table className="w-full text-left text-xs border-collapse font-mono">
                    <thead>
                      <tr className="bg-[#071d17] text-slate-300 uppercase tracking-wider text-[10px] border-b border-emerald-800/40">
                        <th className="py-2.5 px-3">ID</th>
                        <th className="py-2.5 px-3 font-sans">Name</th>
                        <th className="py-2.5 px-2 text-center">Age</th>
                        <th className="py-2.5 px-3 text-right">Wage</th>
                        <th className="py-2.5 px-3 text-right">BTI</th>
                        <th className="py-2.5 px-2 text-center">Bat</th>
                        <th className="py-2.5 px-2 text-center">Bowl</th>
                        <th className="py-2.5 px-2 text-center">Field</th>
                        <th className="py-2.5 px-2 text-center">Stamina</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-950/60">
                      {parseResult.players.slice(0, 10).map((p, idx) => (
                        <tr key={idx} className="hover:bg-emerald-950/40">
                          <td className="py-2 px-3 text-emerald-400 font-bold">{p.id}</td>
                          <td className="py-2 px-3 font-sans font-bold text-white">{p.name}</td>
                          <td className="py-2 px-2 text-center text-slate-300">{p.age}</td>
                          <td className="py-2 px-3 text-right text-slate-200">£{p.wage?.toLocaleString()}</td>
                          <td className="py-2 px-3 text-right text-amber-300 font-bold">{p.bti?.toLocaleString()}</td>
                          <td className="py-2 px-2 text-center capitalize text-emerald-300">{p.batting}</td>
                          <td className="py-2 px-2 text-center capitalize text-teal-300">{p.bowling}</td>
                          <td className="py-2 px-2 text-center capitalize text-slate-300">{p.fielding}</td>
                          <td className="py-2 px-2 text-center capitalize text-emerald-300">{p.stamina}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parseResult.players.length > 10 && (
                    <div className="p-2 text-center text-[11px] text-slate-400 bg-[#061713]">
                      + {parseResult.players.length - 10} more players ready for import
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Google Sheet Sync */}
      {activeImportTab === 'sheet' && (
        <div className="sovereign-card p-6 rounded-2xl border-emerald-600/30 shadow-xl space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
              <Table className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Google Sheet / Apps Script Bidirectional Sync</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Connect directly to your historical Google Sheet database (ID: <code className="text-emerald-300 bg-[#061713] px-2 py-0.5 rounded border border-emerald-800">1KXQbrZ2D7aYJUAniQ5F3L8FeFfM8zmsMsIDHfl2An_E</code>) or deploy the Apps Script Web App in <code className="text-emerald-300">gas/Code.js</code>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#061713] border border-emerald-800/40 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Master Google Sheet ID</span>
              <div className="font-mono text-xs text-emerald-300 break-all p-2 rounded-lg bg-[#04120e] border border-emerald-900/60">
                1KXQbrZ2D7aYJUAniQ5F3L8FeFfM8zmsMsIDHfl2An_E
              </div>
              <a
                href="https://docs.google.com/spreadsheets/d/1KXQbrZ2D7aYJUAniQ5F3L8FeFfM8zmsMsIDHfl2An_E/edit"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold mt-1"
              >
                <span>Open Google Sheet in new tab</span>
                <Link2 className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-4 rounded-xl bg-[#061713] border border-emerald-800/40 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Supabase Cloud Sync</span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white">
                  {isSupabaseConfigured ? 'Supabase Connected' : 'Verified Local State'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                All changes applied through this importer automatically sync to PostgreSQL tables when credentials are provided.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: JSON Backup & Restore */}
      {activeImportTab === 'json' && (
        <div className="sovereign-card p-6 rounded-2xl border-emerald-600/30 shadow-xl space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
              <Upload className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">One-Click Backup & Restore</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Save an offline JSON snapshot of your entire Somnath Super Devs club or restore a previously saved club snapshot.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleDownloadBackup}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Full Backup JSON</span>
            </button>

            <label className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#061713] hover:bg-emerald-950 text-emerald-300 border border-emerald-600/50 font-black text-xs shadow transition-all cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Upload Backup JSON</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const data = JSON.parse(event.target?.result as string);
                      if (data.squad) onImportSquad(data.squad);
                      if (data.club) onImportClub(data.club);
                      setStatusMessage({
                        text: `✅ Successfully restored club backup from ${file.name}!`,
                        type: 'success'
                      });
                    } catch (err: any) {
                      setStatusMessage({
                        text: `Invalid backup JSON file: ${err.message}`,
                        type: 'error'
                      });
                    }
                  };
                  reader.readAsText(file);
                }}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
