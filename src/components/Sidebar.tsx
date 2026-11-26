import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  ShieldAlert, 
  Swords, 
  Target, 
  Sparkles, 
  CircleDollarSign, 
  Building2, 
  Trophy, 
  CalendarDays, 
  Briefcase, 
  Medal, 
  Database,
  Upload 
} from 'lucide-react';

export type TabType = 
  | 'overview' 
  | 'squad' 
  | 'player-dossier' 
  | 'best-xi' 
  | 'tactics' 
  | 'training' 
  | 'youth' 
  | 'finances' 
  | 'stadium' 
  | 'fixtures' 
  | 'calendar' 
  | 'staff' 
  | 'records' 
  | 'database'
  | 'import';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  squadCount?: number;
  popsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onSelectTab
}) => {
  const clubhouseItems = [
    { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
    { id: 'squad' as TabType, label: 'Squad Roster', icon: Users },
    { id: 'player-dossier' as TabType, label: 'Player Dossier', icon: UserSquare2 },
    { id: 'best-xi' as TabType, label: 'Best XI Lineup', icon: ShieldAlert },
    { id: 'tactics' as TabType, label: 'Tactics & Pitch', icon: Swords },
    { id: 'training' as TabType, label: 'Training Nets', icon: Target },
    { id: 'youth' as TabType, label: 'Youth Academy', icon: Sparkles },
  ];

  const operationsItems = [
    { id: 'import' as TabType, label: 'Import Battrick', icon: Upload },
    { id: 'finances' as TabType, label: 'Finances', icon: CircleDollarSign },
    { id: 'stadium' as TabType, label: 'Stadium Arena', icon: Building2 },
    { id: 'fixtures' as TabType, label: 'Match Fixtures', icon: Trophy },
    { id: 'calendar' as TabType, label: 'Club Calendar', icon: CalendarDays },
    { id: 'staff' as TabType, label: 'Backroom Staff', icon: Briefcase },
    { id: 'records' as TabType, label: 'Club Records', icon: Medal },
    { id: 'database' as TabType, label: 'Database', icon: Database },
  ];

  return (
    <aside className="w-56 bg-white/95 backdrop-blur-md border-r border-slate-200 p-3 flex flex-col justify-between shrink-0 h-[calc(100vh-58px)] sticky top-[58px] self-start overflow-y-auto shadow-xs">
      <div className="space-y-4">
        {/* Cricket Operations Section */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider mb-1.5 px-2.5 text-emerald-700 flex items-center justify-between">
            <span>Cricket Operations</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-xs animate-pulse"></span>
          </div>
          <nav className="space-y-0.5">
            {clubhouseItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md border border-emerald-500 font-bold'
                      : 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Club Administration Section */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider mb-1.5 px-2.5 text-slate-500 flex items-center justify-between">
            <span>Club Administration</span>
            <span className="text-[9px] text-slate-400 font-mono">MGMT</span>
          </div>
          <nav className="space-y-0.5">
            {operationsItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md border border-emerald-500 font-bold'
                      : 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Stadium Ground Atmosphere Badge */}
      <div className="p-3 rounded-xl bg-slate-50 border border-emerald-200 shadow-xs text-xs mt-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 font-bold text-emerald-800">
            <span className="w-2 h-2 rounded-full cricket-ball shrink-0"></span>
            <span>Prabhas Oval</span>
          </div>
          <span className="text-[10px] text-amber-800 font-mono font-bold">10,000 Cap</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-tight">
          Hard Turf Strip &bull; 781 Members &bull; Superb Academy
        </p>
      </div>
    </aside>
  );
};
