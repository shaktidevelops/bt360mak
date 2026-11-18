# 🏏 BT360MAK - Battrick Sovereign Intelligence & SaaS Manager Suite

> **GitHub Repository:** [https://github.com/shaktidevelops/bt360mak](https://github.com/shaktidevelops/bt360mak)  
> **Supabase Project:** `xyvezmzsbmoqxepwblfq` ([https://xyvezmzsbmoqxepwblfq.supabase.co](https://xyvezmzsbmoqxepwblfq.supabase.co))  
> **Production Frontend:** Hosted on GitHub Pages via automated GitHub Actions CI/CD  
> **Legacy Google Sheet Database:** [1KXQbrZ2D7aYJUAniQ5F3L8FeFfM8zmsMsIDHfl2An_E](https://docs.google.com/spreadsheets/d/1KXQbrZ2D7aYJUAniQ5F3L8FeFfM8zmsMsIDHfl2An_E/edit)

---

## 🌟 Club Profile: Somnath Super Devs (#13108)

| Metric | Club Value | Context / Standing |
| :--- | :--- | :--- |
| **Manager** | Shakti Mak | Lead Tactician |
| **Region** | Tamil Nadu, India | Indian Domestic Circuit |
| **Leagues** | FC: `VIII.17` \| OD: `V.62` \| T20: `VII.241` | Active Competing Divisions |
| **Bank Balance** | `£1,320,573` | Strong Liquid Capital Surplus |
| **Weekly Wage Bill** | `£7,034` | Highly Optimal (5.5% of Weekly Inflow) |
| **Fan Club** | `781 members` | Mood: **Over the Moon 🚀** |
| **Stadium** | Prabhas Coastal Oval (`10,000 Capacity`) | Standing: 5,275 \| Uncovered: 3,270 \| Covered: 1,100 \| Members: 355 |
| **Pitch Condition** | Hard & Fast (+25% Pace Boost) | Favors Express Seamers |
| **Wonderkids (17yo)** | Bhadraksh Hemalatha & Nandakishor Ramdhyani | Active Friday Training Pop Trainees |

---

## 🚀 Modern v2.0 Architecture: Supabase PostgreSQL + GitHub Pages

```
 ┌─────────────────────────────────────────────────────────────────┐
 │               BT360MAK SOVEREIGN REACT 19 FRONTEND              │
 │  • Built with Vite + TypeScript + Tailwind CSS v4 + Lucide      │
 │  • Static Edge Deployment via GitHub Pages & GitHub Actions     │
 │  • Real-time Clubhouse Consoles: Dashboard, Squad, Tactics,     │
 │    10-Net Training, 52-Week Finances & 10k Stadium Planner      │
 └────────────────────────────────┬────────────────────────────────┘
                                  │ HTTPS REST / Realtime WebSockets
 ┌────────────────────────────────▼────────────────────────────────┐
 │                 SUPABASE POSTGRESQL DATABASE                    │
 │  • Row Level Security (RLS) for Model B Subscriber Isolation    │
 │  • Relational Schema: clubs, players, training_logs, nets,      │
 │    matches, tactics_lineup, financial_ledger, stadium_tiers     │
 │  • High-Speed Performance Indexes & Generated P&L Columns       │
 └─────────────────────────────────────────────────────────────────┘
```

---

## ⚡ 1-Click Database Setup (Supabase)

To initialize your Supabase PostgreSQL database:
1. Open the **SQL Editor** in your [Supabase Dashboard](https://supabase.com/dashboard/project/xyvezmzsbmoqxepwblfq/sql).
2. Open [`supabase/COMPLETE_SETUP.sql`](supabase/COMPLETE_SETUP.sql) in this repository.
3. Paste and click **Run**.
4. This instantly creates all 9 relational tables, indexes, Row Level Security policies, and seeds all 14 Somnath Super Devs players and club statistics.

---

## 🎨 Signature Theme: Sovereign Turf & Gold
- **Obsidian Turf Palette**: Deep pitch background (`#041512`) with ambient emerald glows (`#10b981`), trophy gold highlights (`#f59e0b`), and clean slate borders.
- **Glassmorphic Cards**: Translucent consoles with 1px luminous borders, smooth hover lifts, and glowing status beacons.
- **Typography Standards**: Primary text in **Plus Jakarta Sans** with currencies, ratings, and IDs in **JetBrains Mono**.

---

## 📁 Repository Directory Structure

```
bt360mak/
├── .github/workflows/deploy.yml   # Automated GitHub Pages CI/CD workflow
├── supabase/                      # Database Schema & Migrations
│   ├── COMPLETE_SETUP.sql         # Single 1-Click Setup Script (DDL + RLS + Seed)
│   ├── migrations/                # Schema DDL & Row Level Security policies
│   └── seed.sql                   # Somnath Super Devs real data seed
├── src/                           # Modern Vite + React 19 Frontend
│   ├── components/                # Modular Clubhouse Consoles
│   │   ├── Header.tsx             # Live clock & Financial Ticker
│   │   ├── Sidebar.tsx            # Navigation
│   │   ├── DashboardView.tsx      # Executive Intelligence Console
│   │   ├── SquadView.tsx          # 14-Man Squad Grid with Valuations
│   │   ├── TacticsView.tsx        # Pitch Synergy Simulator
│   │   ├── TrainingView.tsx       # 10-Net Matrix & Friday Pop Tracker
│   │   ├── FinancesView.tsx       # 52-Week Cashflow & 10k Stadium Planner
│   │   ├── MatchesView.tsx        # Match Center & Archives
│   │   └── SettingsView.tsx       # Cloud & Supabase Config
│   ├── lib/                       # Supabase client & fallback data
│   ├── types/                     # Strict TypeScript interfaces
│   ├── App.tsx                    # Main App Controller
│   └── main.tsx                   # Entry point
├── dist/                          # Production Build Distribution
├── docs/                          # Legacy GitHub Pages Portal
├── frontend/                      # Legacy Vanilla Frontend
├── gas/                           # Legacy Google Apps Script Backend
├── package.json                   # Modern Node dependencies
├── vite.config.ts                 # Vite bundler configuration
└── README.md                      # Comprehensive Documentation
```
