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
import { AppTheme } from './Header';

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
  theme: AppTheme;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onSelectTab, 
  squadCount, 
  popsCount,
  theme
}) => {
  const isLight = theme === 'light';

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
    <aside className={`w-68 border-r p-4 flex flex-col justify-between shrink-0 h-[calc(100vh-65px)] sticky top-[65px] overflow-y-auto transition-colors ${
      isLight 
        ? 'bg-white border-slate-200' 
        : theme === 'midnight'
        ? 'bg-[#091124] border-[#1c2c54]'
        : 'bg-[#0a1a1c] border-[#204b4c]'
    }`}>
      <div className="space-y-6">
        {/* Clubhouse Section */}
        <div>
          <div className="text-[11px] font-black uppercase tracking-wider mb-2 px-3 text-emerald-600 dark:text-emerald-400">
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
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                      : isLight
                      ? 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                      : 'text-slate-300 hover:text-white hover:bg-[#122e30]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                        isActive
                          ? 'bg-emerald-900/80 text-white'
                          : isLight
                          ? 'bg-emerald-100 text-emerald-800'
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

        {/* Administration Section */}
        <div>
          <div className="text-[11px] font-black uppercase tracking-wider mb-2 px-3 text-amber-600 dark:text-amber-400">
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
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-600 to-teal-700 text-white shadow-md'
                      : isLight
                      ? 'text-slate-600 hover:text-amber-700 hover:bg-amber-50'
                      : 'text-slate-300 hover:text-white hover:bg-[#122e30]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-amber-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                        isActive
                          ? 'bg-amber-900/80 text-white'
                          : isLight
                          ? 'bg-amber-100 text-amber-800'
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
      <div className={`p-3.5 rounded-xl border text-xs ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0e2427] border-[#204b4c]'
      }`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className={`font-black ${isLight ? 'text-emerald-800' : 'text-emerald-300'}`}>
            Somnath Super Devs
          </span>
        </div>
        <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
          Tamil Nadu, India | Sovereign Cricket Intelligence Suite.
        </p>
      </div>
    </aside>
  );
};
