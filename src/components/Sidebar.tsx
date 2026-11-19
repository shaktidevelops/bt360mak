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
    { id: 'squad' as TabType, label: 'Squad', icon: Users },
    { id: 'player-dossier' as TabType, label: 'Player Dossier', icon: UserSquare2 },
    { id: 'best-xi' as TabType, label: 'Best XI', icon: ShieldAlert },
    { id: 'tactics' as TabType, label: 'Tactics & Pitch', icon: Swords },
    { id: 'training' as TabType, label: 'Training Nets', icon: Target },
    { id: 'youth' as TabType, label: 'Youth Academy', icon: Sparkles },
  ];

  const operationsItems = [
    { id: 'import' as TabType, label: 'Import Battrick', icon: Upload },
    { id: 'finances' as TabType, label: 'Finances', icon: CircleDollarSign },
    { id: 'stadium' as TabType, label: 'Stadium', icon: Building2 },
    { id: 'fixtures' as TabType, label: 'Fixtures', icon: Trophy },
    { id: 'calendar' as TabType, label: 'Calendar', icon: CalendarDays },
    { id: 'staff' as TabType, label: 'Backroom Staff', icon: Briefcase },
    { id: 'records' as TabType, label: 'Club Records', icon: Medal },
    { id: 'database' as TabType, label: 'Database', icon: Database },
  ];

  return (
    <aside className="w-60 bg-gradient-to-b from-[#06241be6] via-[#041d16f2] to-[#031510fa] backdrop-blur-md border-r-2 border-emerald-600/40 p-3 flex flex-col justify-between shrink-0 h-[calc(100vh-65px)] sticky top-[65px] overflow-y-auto shadow-2xl">
      <div className="space-y-4">
        {/* Cricket Operations Section */}
        <div>
          <div className="text-[10px] font-black uppercase tracking-wider mb-1.5 px-2.5 text-emerald-400 flex items-center justify-between">
            <span>Cricket Operations</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm animate-pulse"></span>
          </div>
          <nav className="space-y-0.5">
            {clubhouseItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-lg border border-emerald-400/50 font-black'
                      : 'text-slate-300 hover:text-white hover:bg-emerald-950/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Club Administration Section */}
        <div>
          <div className="text-[10px] font-black uppercase tracking-wider mb-1.5 px-2.5 text-amber-400 flex items-center justify-between">
            <span>Club Administration</span>
            <span className="text-[10px] text-amber-400/80">MGMT</span>
          </div>
          <nav className="space-y-0.5">
            {operationsItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-600 via-amber-700 to-teal-800 text-white shadow-lg border border-amber-400/60 font-black'
                      : 'text-slate-300 hover:text-white hover:bg-emerald-950/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-amber-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Stadium Ground Atmosphere Badge */}
      <div className="p-3 rounded-xl cricket-turf-card border border-emerald-600/50 shadow-inner text-xs mt-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 font-black text-emerald-300">
            <span className="w-2 h-2 rounded-full cricket-ball shrink-0"></span>
            <span>Prabhas Coastal Oval</span>
          </div>
          <span className="text-[10px] text-amber-300 font-mono font-bold">10k Cap</span>
        </div>
        <p className="text-[10px] text-emerald-200/90 leading-tight">
          🏔️ Coastal Mountain backdrop &bull; Hard Turf &bull; 781 Members
        </p>
      </div>
    </aside>
  );
};
