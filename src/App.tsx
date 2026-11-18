import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, TabType } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { SquadView } from './components/SquadView';
import { TacticsView } from './components/TacticsView';
import { TrainingView } from './components/TrainingView';
import { FinancesView } from './components/FinancesView';
import { StadiumView } from './components/StadiumView';
import { MatchesView } from './components/MatchesView';
import { SettingsView } from './components/SettingsView';
import { 
  fallbackClub, 
  fallbackSquad, 
  fallbackTrainingLogs, 
  fallbackNets, 
  fallbackMatches, 
  fallbackStadiumTiers, 
  fallbackFinances 
} from './lib/mockData';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Club, Player, TrainingLog, NetAllocation, MatchRecord, StadiumTier, FinancialRecord } from './types/database';

export function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [club, setClub] = useState<Club>(fallbackClub);
  const [squad, setSquad] = useState<Player[]>(fallbackSquad);
  const [trainingLogs, setTrainingLogs] = useState<TrainingLog[]>(fallbackTrainingLogs);
  const [nets, setNets] = useState<NetAllocation[]>(fallbackNets);
  const [matches, setMatches] = useState<MatchRecord[]>(fallbackMatches);
  const [stadiumTiers, setStadiumTiers] = useState<StadiumTier[]>(fallbackStadiumTiers);
  const [finances, setFinances] = useState<FinancialRecord[]>(fallbackFinances);

  // Fetch from Supabase if credentials are provided and tables exist
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const fetchLiveClubData = async () => {
      try {
        const { data: clubData } = await supabase.from('clubs').select('*').eq('id', '13108').single();
        if (clubData) setClub(clubData);

        const { data: squadData } = await supabase.from('players').select('*').eq('club_id', '13108');
        if (squadData && squadData.length > 0) setSquad(squadData);

        const { data: logsData } = await supabase.from('training_logs').select('*').eq('club_id', '13108');
        if (logsData && logsData.length > 0) setTrainingLogs(logsData);

        const { data: netsData } = await supabase.from('nets_matrix').select('*').eq('club_id', '13108');
        if (netsData && netsData.length > 0) setNets(netsData);

        const { data: matchesData } = await supabase.from('matches').select('*').eq('club_id', '13108');
        if (matchesData && matchesData.length > 0) setMatches(matchesData);

        const { data: tiersData } = await supabase.from('stadium_tiers').select('*').eq('club_id', '13108');
        if (tiersData && tiersData.length > 0) setStadiumTiers(tiersData);

        const { data: finData } = await supabase.from('financial_ledger').select('*').eq('club_id', '13108');
        if (finData && finData.length > 0) setFinances(finData);
      } catch (err) {
        console.warn('Supabase query fallback to verified local records:', err);
      }
    };

    fetchLiveClubData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b181a] text-slate-100">
      {/* Elevated Luxury Header with Custom SVG Crest */}
      <Header club={club} />

      {/* Main Workspace: Navigation Sidebar + Console Stage */}
      <div className="flex flex-1">
        <Sidebar 
          currentTab={currentTab} 
          onSelectTab={setCurrentTab}
          squadCount={squad.length}
          popsCount={trainingLogs.length}
        />

        <main className="flex-1 p-6 max-w-7xl overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardView 
              club={club} 
              squad={squad} 
              onNavigate={(tab) => setCurrentTab(tab)} 
            />
          )}
          {currentTab === 'squad' && <SquadView squad={squad} />}
          {currentTab === 'tactics' && <TacticsView squad={squad} />}
          {currentTab === 'training' && <TrainingView logs={trainingLogs} nets={nets} squad={squad} />}
          {currentTab === 'finances' && <FinancesView finances={finances} />}
          {currentTab === 'stadium' && <StadiumView tiers={stadiumTiers} />}
          {currentTab === 'matches' && <MatchesView matches={matches} />}
          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}

export default App;
