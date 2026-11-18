import React from 'react';
import { LayoutDashboard, Users, Swords, Target, CircleDollarSign, Calendar, Settings } from 'lucide-react';

export type TabType = 'dashboard' | 'squad' | 'tactics' | 'training' | 'finances' | 'matches' | 'settings';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  squadCount: number;
  popsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, squadCount, popsCount }) => {
  const navItems = [
    { id: 'dashboard' as TabType, label: 'Command Center', icon: LayoutDashboard },
    { id: 'squad' as TabType, label: '14-Man Squad', icon: Users, badge: squadCount },
    { id: 'tactics' as TabType, label: 'Tactics & Pitch', icon: Swords },
    { id: 'training' as TabType, label: '10-Net Training', icon: Target, badge: `${popsCount} Pops` },
    { id: 'finances' as TabType, label: 'Finances & Stadium', icon: CircleDollarSign },
    { id: 'matches' as TabType, label: 'Match Center', icon: Calendar },
    { id: 'settings' as TabType, label: 'Supabase & Cloud', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#031512]/90 border-r border-emerald-950/60 p-4 flex flex-col justify-between shrink-0 h-[calc(100vh-65px)] sticky top-[65px]">
      <div className="space-y-6">
        <div>
          <div className="text-[11px] font-bold text-emerald-400/80 uppercase tracking-wider mb-2.5 px-3">
            Clubhouse Consoles
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-950/40'
                      : 'text-slate-400 hover:text-white hover:bg-emerald-950/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-emerald-900/60 text-emerald-100'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
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

      <div className="p-3.5 rounded-xl bg-[#020e0c] border border-emerald-900/40 text-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-emerald-300">BT360 Sovereign Suite</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          PostgreSQL Database Model B Active. High-speed static edge hosting on GitHub.
        </p>
      </div>
    </aside>
  );
};
