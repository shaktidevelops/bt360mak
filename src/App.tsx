import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Sidebar, TabType } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { SquadView } from './components/SquadView';
import { PlayerProfileView } from './components/PlayerProfileView';
import { TacticsView } from './components/TacticsView';
import { TrainingView } from './components/TrainingView';
import { YouthView } from './components/YouthView';
import { FinancesView } from './components/FinancesView';
import { StadiumView } from './components/StadiumView';
import { MatchesView } from './components/MatchesView';
import { CalendarView } from './components/CalendarView';
import { StaffView } from './components/StaffView';
import { RecordsView } from './components/RecordsView';
import { SettingsView } from './components/SettingsView';
import { ImportView } from './components/ImportView';
import { 
  fallbackClub, 
  fallbackSquad, 
  fallbackTrainingLogs, 
  fallbackNets, 
  fallbackMatches, 
  fallbackStadiumTiers, 
  fallbackFinances,
  fallbackStaff,
  fallbackCalendar,
  fallbackRecords
} from './lib/mockData';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { 
  Club, 
  Player, 
  TrainingLog, 
  NetAllocation, 
  MatchRecord, 
  StadiumTier, 
  FinancialRecord,
  StaffMember,
  CalendarEvent,
  CricketRecord 
} from './types/database';

export function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('overview');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | undefined>(undefined);

  const [club, setClub] = useState<Club>(() => {
    try {
      const saved = localStorage.getItem('bt360_club');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fan_mood) parsed.fan_mood = String(parsed.fan_mood).replace(/[^\x20-\x7E]/g, '').trim();
        if (parsed.sponsor_confidence) parsed.sponsor_confidence = String(parsed.sponsor_confidence).replace(/[^\x20-\x7E]/g, '').trim();
        if (parsed.morale) parsed.morale = String(parsed.morale).replace(/[^\x20-\x7E]/g, '').trim();
        return parsed;
      }
      return fallbackClub;
    } catch {
      return fallbackClub;
    }
  });

  const [squad, setSquad] = useState<Player[]>(() => {
    try {
      const saved = localStorage.getItem('bt360_squad');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If parsed contains legacy dummy players (e.g. Bhadraksh Hemalatha or ID 6099466), clean slate
        if (Array.isArray(parsed) && parsed.some((p: Player) => p.id === '6099466' || p.id === 'BT-6099466' || p.name === 'Bhadraksh Hemalatha')) {
          localStorage.setItem('bt360_squad', '[]');
          return [];
        }
        return parsed;
      }
      return fallbackSquad;
    } catch {
      return fallbackSquad;
    }
  });

  const [trainingLogs, setTrainingLogs] = useState<TrainingLog[]>(fallbackTrainingLogs);

  const [nets, setNets] = useState<NetAllocation[]>(() => {
    try {
      const saved = localStorage.getItem('bt360_nets');
      return saved ? JSON.parse(saved) : fallbackNets;
    } catch {
      return fallbackNets;
    }
  });

  const [matches, setMatches] = useState<MatchRecord[]>(() => {
    try {
      const saved = localStorage.getItem('bt360_matches');
      return saved ? JSON.parse(saved) : fallbackMatches;
    } catch {
      return fallbackMatches;
    }
  });

  const [stadiumTiers, setStadiumTiers] = useState<StadiumTier[]>(() => {
    try {
      const saved = localStorage.getItem('bt360_stadiumTiers');
      return saved ? JSON.parse(saved) : fallbackStadiumTiers;
    } catch {
      return fallbackStadiumTiers;
    }
  });

  const [finances, setFinances] = useState<FinancialRecord[]>(() => {
    try {
      const saved = localStorage.getItem('bt360_finances');
      return saved ? JSON.parse(saved) : fallbackFinances;
    } catch {
      return fallbackFinances;
    }
  });

  const [staff, setStaff] = useState<StaffMember[]>(fallbackStaff);
  const [calendar, setCalendar] = useState<CalendarEvent[]>(fallbackCalendar);

  const [records, setRecords] = useState<CricketRecord[]>(() => {
    try {
      const saved = localStorage.getItem('bt360_records');
      return saved ? JSON.parse(saved) : fallbackRecords;
    } catch {
      return fallbackRecords;
    }
  });

  // LocalStorage synchronizers
  useEffect(() => {
    try {
      localStorage.setItem('bt360_squad', JSON.stringify(squad));
    } catch (e) {
      console.warn('LocalStorage squad write error', e);
    }
  }, [squad]);

  useEffect(() => {
    try {
      localStorage.setItem('bt360_matches', JSON.stringify(matches));
    } catch (e) {
      console.warn('LocalStorage matches write error', e);
    }
  }, [matches]);

  useEffect(() => {
    try {
      localStorage.setItem('bt360_records', JSON.stringify(records));
    } catch (e) {
      console.warn('LocalStorage records write error', e);
    }
  }, [records]);

  // Fetch from Supabase if credentials are provided and tables exist
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const fetchLiveClubData = async () => {
      try {
        const { data: clubData } = await supabase.from('clubs').select('*').eq('id', '13108').single();
        if (clubData) setClub(clubData);

        const { data: tiersData } = await supabase.from('stadium_tiers').select('*').eq('club_id', '13108');
        if (tiersData && tiersData.length > 0) setStadiumTiers(tiersData);

        const { data: staffData } = await supabase.from('staff_members').select('*').eq('club_id', '13108');
        if (staffData && staffData.length > 0) setStaff(staffData);

        const { data: calData } = await supabase.from('calendar_events').select('*').eq('club_id', '13108');
        if (calData && calData.length > 0) setCalendar(calData);
      } catch (err) {
        console.warn('Supabase live query notice:', err);
      }
    };

    fetchLiveClubData();
  }, []);

  // 1-Click Browser Bookmarklet & Cross-Window Ingest Listener
  useEffect(() => {
    if (window.opener) {
      try {
        window.opener.postMessage('BT360_READY', '*');
      } catch (e) {
        console.warn('Opener postMessage notice:', e);
      }
    }

    const handleIncomingMessage = (event: MessageEvent) => {
      if (event.data && (event.data.type === 'BT360_ONE_CLICK_IMPORT' || event.data.type === 'BT360_IMPORT_HTML') && event.data.html) {
        setCurrentTab('import');
        window.dispatchEvent(new CustomEvent('bt360:bookmarklet-import', { detail: event.data }));
      }
    };

    window.addEventListener('message', handleIncomingMessage);
    return () => window.removeEventListener('message', handleIncomingMessage);
  }, []);

  const handleFactoryReset = async () => {
    try {
      localStorage.setItem('bt360_matches', '[]');
      localStorage.setItem('bt360_records', '[]');
      localStorage.setItem('bt360_finances', '[]');
      localStorage.setItem('bt360_squad', '[]');
      localStorage.setItem('bt360_recent_imports', '[]');
      localStorage.removeItem('bt360_nets');
      localStorage.removeItem('bt360_stadiumTiers');
      localStorage.removeItem('bt360_club');

      setMatches([]);
      setRecords([]);
      setFinances([]);
      setSquad([]);
      setTrainingLogs([]);

      if (isSupabaseConfigured) {
        try {
          await supabase.from('matches').delete().eq('club_id', club.id);
          await supabase.from('cricket_records').delete().eq('club_id', club.id);
          await supabase.from('players').delete().eq('club_id', club.id);
        } catch (sErr) {
          console.warn('Supabase reset error', sErr);
        }
      }
    } catch (err) {
      console.warn('Reset error:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col cricket-stadium-canvas text-slate-900">
      {/* Immersive Cricket Sport Header */}
      <Header club={club} onOpenImport={() => setCurrentTab('import')} />

      {/* Main Workspace: Navigation Sidebar + Console Stage */}
      <div className="flex flex-1 min-h-[calc(100vh-58px)]">
        <Sidebar 
          currentTab={currentTab} 
          onSelectTab={setCurrentTab}
          squadCount={squad.length}
          popsCount={trainingLogs.length}
        />

        <main className="flex-1 p-5 lg:p-7 w-full min-w-0 max-w-[1600px] mx-auto overflow-y-auto">
          {currentTab === 'overview' && (
            <DashboardView 
              club={club} 
              squad={squad} 
              onNavigate={(tab) => setCurrentTab(tab)} 
              onSelectPlayer={(pid) => setSelectedPlayerId(pid)}
            />
          )}

          {currentTab === 'squad' && (
            <SquadView 
              squad={squad} 
              onViewDossier={(pid) => {
                setSelectedPlayerId(pid);
                setCurrentTab('player-dossier');
              }}
              onNavigateToImport={() => setCurrentTab('import')}
            />
          )}

          {currentTab === 'player-dossier' && (
            <PlayerProfileView 
              squad={squad} 
              selectedPlayerId={selectedPlayerId} 
              matches={matches}
            />
          )}

          {currentTab === 'best-xi' && (
            <TacticsView squad={squad} mode="best-xi" initialTab="lineup" />
          )}

          {currentTab === 'tactics' && (
            <TacticsView squad={squad} mode="tactics" initialTab="pitch" />
          )}

          {currentTab === 'training' && (
            <TrainingView 
              logs={trainingLogs} 
              nets={nets} 
              squad={squad} 
            />
          )}

          {currentTab === 'youth' && (
            <YouthView 
              squad={squad} 
              onPromotePlayer={(newPlayer) => {
                setSquad(prev => [newPlayer, ...prev]);
                setSelectedPlayerId(newPlayer.id);
              }}
            />
          )}

          {currentTab === 'finances' && (
            <FinancesView finances={finances} />
          )}

          {currentTab === 'stadium' && (
            <StadiumView tiers={stadiumTiers} />
          )}

          {currentTab === 'fixtures' && (
            <MatchesView 
              matches={matches} 
              onNavigateToImport={() => setCurrentTab('import')}
            />
          )}

          {currentTab === 'calendar' && (
            <CalendarView events={calendar} />
          )}

          {currentTab === 'staff' && (
            <StaffView staff={staff} />
          )}

          {currentTab === 'records' && (
            <RecordsView 
              records={records} 
              onNavigateToImport={() => setCurrentTab('import')}
            />
          )}

          {currentTab === 'database' && (
            <SettingsView onResetAllData={handleFactoryReset} />
          )}

          {currentTab === 'import' && (
            <ImportView 
              club={club} 
              squad={squad} 
              matches={matches}
              records={records}
              onResetAllData={handleFactoryReset}
              onImportSquad={(newSquad) => {
                setSquad(newSquad);
              }}
              onImportClub={(newClub) => {
                setClub(newClub);
              }}
              onImportFinances={(newFinances) => {
                setFinances(newFinances);
              }}
              onImportMatches={(newMatches) => {
                setMatches(newMatches);
              }}
              onImportRecords={(newRecords) => {
                setRecords(newRecords);
              }}
              onImportStadium={(newTiers) => {
                setStadiumTiers(newTiers);
              }}
              onImportNets={(newNets) => {
                setNets(newNets);
              }}
            />
          )}
        </main>
      </div>

      {/* Sovereign Intelligence Suite Footer */}
      <Footer club={club} />
    </div>
  );
}

export default App;
