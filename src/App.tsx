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
import { EMPTY_STATS } from './lib/matchStatsEngine';
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
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('6099466');

  const [club, setClub] = useState<Club>(() => {
    try {
      const saved = localStorage.getItem('bt360_club');
      return saved ? JSON.parse(saved) : fallbackClub;
    } catch {
      return fallbackClub;
    }
  });

  const [squad, setSquad] = useState<Player[]>(() => {
    try {
      const saved = localStorage.getItem('bt360_squad');
      return saved ? JSON.parse(saved) : fallbackSquad;
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

        const { data: squadData } = await supabase.from('players').select('*').eq('club_id', '13108');
        if (squadData && squadData.length > 0) {
          const cleanSquad = squadData.map(p => ({
            ...p,
            id: String(p.id).replace(/^BT-/, ''),
            club_id: String(p.club_id).replace(/^BT-/, '')
          }));
          setSquad(cleanSquad);
        }

        const { data: logsData } = await supabase.from('training_logs').select('*').eq('club_id', '13108');
        if (logsData && logsData.length > 0) {
          const cleanLogs = logsData.map(l => ({
            ...l,
            player_id: String(l.player_id).replace(/^BT-/, '')
          }));
          setTrainingLogs(cleanLogs);
        }

        const { data: netsData } = await supabase.from('nets_matrix').select('*').eq('club_id', '13108');
        if (netsData && netsData.length > 0) {
          const cleanNets = netsData.map(n => ({
            ...n,
            player_id: n.player_id ? String(n.player_id).replace(/^BT-/, '') : null
          }));
          setNets(cleanNets);
        }

        // Only load matches from Supabase if the user has not established their local storage state,
        // and filter out empty seed rows lacking scorecardData.
        const localMatches = localStorage.getItem('bt360_matches');
        if (localMatches === null) {
          const { data: matchesData } = await supabase.from('matches').select('*').eq('club_id', '13108');
          if (matchesData && matchesData.length > 0) {
            const valid = matchesData.filter(m => m.scorecardData);
            if (valid.length > 0) setMatches(valid);
          }
        }

        const { data: tiersData } = await supabase.from('stadium_tiers').select('*').eq('club_id', '13108');
        if (tiersData && tiersData.length > 0) setStadiumTiers(tiersData);

        const { data: finData } = await supabase.from('financial_ledger').select('*').eq('club_id', '13108');
        if (finData && finData.length > 0) setFinances(finData);

        const { data: staffData } = await supabase.from('staff_members').select('*').eq('club_id', '13108');
        if (staffData && staffData.length > 0) setStaff(staffData);

        const { data: calData } = await supabase.from('calendar_events').select('*').eq('club_id', '13108');
        if (calData && calData.length > 0) setCalendar(calData);

        const { data: recData } = await supabase.from('cricket_records').select('*').eq('club_id', '13108');
        if (recData && recData.length > 0) setRecords(recData);
      } catch (err) {
        console.warn('Supabase live query fallback to verified club records:', err);
      }
    };

    fetchLiveClubData();
  }, []);

  const handleFactoryReset = async () => {
    try {
      localStorage.removeItem('bt360_matches');
      localStorage.removeItem('bt360_records');
      localStorage.removeItem('bt360_finances');
      localStorage.removeItem('bt360_recent_imports');
      localStorage.removeItem('bt360_squad');
      localStorage.removeItem('bt360_nets');
      localStorage.removeItem('bt360_stadiumTiers');
      localStorage.removeItem('bt360_club');

      localStorage.setItem('bt360_matches', '[]');
      localStorage.setItem('bt360_records', '[]');
      localStorage.setItem('bt360_finances', '[]');

      const resetSquad: Player[] = squad.map(p => ({
        ...p,
        statsFC: { ...EMPTY_STATS },
        statsOD: { ...EMPTY_STATS },
        statsT20: { ...EMPTY_STATS }
      }));

      setMatches([]);
      setRecords([]);
      setFinances([]);
      setSquad(resetSquad);

      if (isSupabaseConfigured) {
        try {
          await supabase.from('matches').delete().eq('club_id', club.id);
          await supabase.from('cricket_records').delete().eq('club_id', club.id);
          await supabase.from('players').upsert(resetSquad);
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
