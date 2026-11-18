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
  Database 
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
  | 'database';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  squadCount: number;
  popsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onSelectTab, 
  squadCount, 
  popsCount
}) => {
  const clubhouseItems = [
    { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
    { id: 'squad' as TabType, label: 'Squad', icon: Users, badge: squadCount },
    { id: 'player-dossier' as TabType, label: 'Player Dossier', icon: UserSquare2 },
    { id: 'best-xi' as TabType, label: 'Best XI', icon: ShieldAlert },
    { id: 'tactics' as TabType, label: 'Tactics & Pitch', icon: Swords },
    { id: 'training' as TabType, label: 'Training Nets', icon: Target, badge: `${popsCount} Pops` },
    { id: 'youth' as TabType, label: 'Youth Academy', icon: Sparkles },
  ];

  const operationsItems = [
    { id: 'finances' as TabType, label: 'Finances', icon: CircleDollarSign },
    { id: 'stadium' as TabType, label: 'Stadium Arena', icon: Building2, badge: '10,000' },
    { id: 'fixtures' as TabType, label: 'Fixtures', icon: Trophy },
    { id: 'calendar' as TabType, label: 'Club Calendar', icon: CalendarDays },
    { id: 'staff' as TabType, label: 'Backroom Staff', icon: Briefcase, badge: '5' },
    { id: 'records' as TabType, label: 'Club Records', icon: Medal },
    { id: 'database' as TabType, label: 'Database', icon: Database },
  ];

  return (
    <aside className="w-64 bg-[#061713]/95 border-r border-emerald-800/30 p-3.5 flex flex-col justify-between shrink-0 h-[calc(100vh-65px)] sticky top-[65px] overflow-y-auto">
      <div className="space-y-5">
        {/* Clubhouse Operations Section */}
        <div>
          <div className="text-[10px] font-black uppercase tracking-wider mb-1.5 px-2.5 text-emerald-400">
            Cricket Operations
          </div>
          <nav className="space-y-0.5">
            {clubhouseItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-emerald-950/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        isActive
                          ? 'bg-emerald-900/80 text-white'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Club Administration Section */}
        <div>
          <div className="text-[10px] font-black uppercase tracking-wider mb-1.5 px-2.5 text-amber-400">
            Club Administration
          </div>
          <nav className="space-y-0.5">
            {operationsItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-600 to-teal-700 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-emerald-950/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-amber-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        isActive
                          ? 'bg-amber-900/80 text-white'
                          : 'bg-[#153436] text-amber-300 border border-[#235355]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="p-3 rounded-xl bg-[#0a201a] border border-emerald-800/40 text-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-extrabold text-emerald-300">Somnath Super Devs</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Sovereign Cricket Intelligence Platform.
        </p>
      </div>
    </aside>
  );
};
