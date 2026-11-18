import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Swords, 
  Target, 
  CircleDollarSign, 
  Building2, 
  Calendar, 
  Database 
} from 'lucide-react';

export type TabType = 
  | 'dashboard' 
  | 'squad' 
  | 'tactics' 
  | 'training' 
  | 'finances' 
  | 'stadium' 
  | 'matches' 
  | 'settings';

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
    { id: 'dashboard' as TabType, label: 'Command Center', icon: LayoutDashboard },
    { id: 'squad' as TabType, label: 'Squad & Player Intel', icon: Users, badge: squadCount },
    { id: 'tactics' as TabType, label: 'Match Strategy & Best XI', icon: Swords },
    { id: 'training' as TabType, label: 'Player Development & Nets', icon: Target, badge: `${popsCount} Pops` },
  ];

  const operationsItems = [
    { id: 'finances' as TabType, label: 'Financial Operations & Treasury', icon: CircleDollarSign },
    { id: 'stadium' as TabType, label: 'Prabhas Coastal Oval Arena', icon: Building2, badge: '10,000' },
    { id: 'matches' as TabType, label: 'Match Calendar & Fixtures', icon: Calendar },
    { id: 'settings' as TabType, label: 'Cloud & Database Hub', icon: Database },
  ];

  return (
    <aside className="w-68 bg-[#091a1c]/95 border-r border-[#204b4c] p-4 flex flex-col justify-between shrink-0 h-[calc(100vh-65px)] sticky top-[65px] overflow-y-auto">
      <div className="space-y-6">
        {/* Clubhouse Section */}
        <div>
          <div className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider mb-2 px-3">
            Tactical & Squad Operations
          </div>
          <nav className="space-y-1">
            {clubhouseItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/50'
                      : 'text-slate-300 hover:text-white hover:bg-[#122e30]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-emerald-900/80 text-white'
                          : 'bg-[#153436] text-emerald-300 border border-[#235355]'
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
          <div className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wider mb-2 px-3">
            Commercial & Infrastructure
          </div>
          <nav className="space-y-1">
            {operationsItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-600 to-teal-700 text-white shadow-lg shadow-amber-950/40'
                      : 'text-slate-300 hover:text-white hover:bg-[#122e30]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-amber-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
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
      <div className="p-3 rounded-xl bg-[#0e2427] border border-[#204b4c] text-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-emerald-300">Somnath Super Devs</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          High-performance tactical intelligence platform. Model B multi-tenant SaaS architecture.
        </p>
      </div>
    </aside>
  );
};
