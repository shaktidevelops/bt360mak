# 🏏 BT360MAK - Battrick Sovereign Intelligence & Cricket Manager Suite

> **GitHub Repository:** [https://github.com/shaktidevelops/bt360mak](https://github.com/shaktidevelops/bt360mak)  
> **Live Production Portal:** [https://shaktidevelops.github.io/bt360mak/](https://shaktidevelops.github.io/bt360mak/)  
> **Supabase Project:** `xyvezmzsbmoqxepwblfq` ([https://xyvezmzsbmoqxepwblfq.supabase.co](https://xyvezmzsbmoqxepwblfq.supabase.co))  
> **Club Identity:** Somnath Super Devs (#13108) &bull; Lead Tactician: Shakti Mak  

---

## 🏠 Work From Home Quickstart Guide

When you continue work on your home machine, run these commands:

### 1. Clone or Pull the Latest Code
```bash
# If cloning for the first time:
git clone https://github.com/shaktidevelops/bt360mak.git
cd bt360mak

# If already cloned on your home PC:
git pull origin main
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Local Development Server
```bash
npm run dev
```
> Open your browser at **`http://localhost:5173/`**.

### 4. Optional: Supabase Environment Configuration
The application is pre-configured with fallback verified club records. To link live Supabase credentials on your home computer, copy `.env.example` to `.env.local`:
```env
VITE_SUPABASE_URL=https://xyvezmzsbmoqxepwblfq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5dmV6bXpzYm1vcXhlcHdibGZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ5ODIzMjcsImV4cCI6MjExMDU1ODMyN30.0Ar8Rh--jI7GP0q1ki2fOnE4soJmYGmAtgWha1RrMLw
```

---

## 🌟 Executive Club Profile: Somnath Super Devs (#13108)

| Metric | Club Value | Context / Standing |
| :--- | :--- | :--- |
| **Manager** | Shakti Mak | Lead Tactician |
| **Region** | Tamil Nadu, India | Indian Domestic Circuit |
| **Leagues** | FC: `VIII.17` \| OD: `V.62` \| T20: `VII.241` | Active Competing Divisions |
| **Bank Balance** | `£1,320,573` | Strong Liquid Capital Buffer |
| **Weekly Wage Bill** | `£7,034` | Optimal (5.5% of Matchday Inflow) |
| **Fan Club** | `781 members` | Mood: **Over the Moon 🚀** |
| **Team Morale** | Sublime | Maximum Dressing Room Cohesion |
| **Stadium** | Prabhas Coastal Oval (`10,000 Capacity`) | Standing: 5,275 \| Uncovered: 3,270 \| Covered: 1,100 \| Members: 355 |
| **Pitch Condition** | Hard & Fast (+25% Pace Boost) | Favors Express Pace & Carry |
| **Wonderkids (17yo)** | Bhadraksh Hemalatha & Nandakishor Ramdhyani | Active Friday Training Pop Trainees |

---

## 🏏 14 Dedicated Clubhouse Operations Modules

| # | Screen | Description |
| :---: | :--- | :--- |
| 1 | **Overview** | Executive command center, upcoming fixture scout report, season MVPs, and backroom staff status. |
| 2 | **Squad** | Master player roster with clean numeric IDs (e.g. `6099466`), BTI talent ratings, subskills, market values, and 1-click dossier navigation. |
| 3 | **Player Dossier** | Comprehensive Battrick career statistics (FC, OD, T20 batting & bowling tables, averages, strike rates, 100s, 50s, 5w hauls) and unique club milestones. |
| 4 | **Best XI** | Tactical starting lineup generator with Captaincy (Leadership + Experience) and Wicketkeeper efficiency calculators. |
| 5 | **Tactics & Pitch** | Pitch condition synergy matrix (Hard, Green, Dusty, Flat, Slow) and **5-phase authentic cricket bowling spells** (New ball seam, 1st change, middle spin, reverse swing, death overs). |
| 6 | **Training Nets** | 10-net player development matrix defaulting to **Unassigned**, with Sports Psychologist (+15% mental focus), Physio, and Coach multiplier synergies. |
| 7 | **Youth Academy** | Individual Training Scheme (ITS) investment slider (£0–£36,000/wk) and interactive Saturday Youth Draft Pull simulator. |
| 8 | **Finances** | 52-week commercial ledger with Week and Category filters, gate receipts, sponsorship audit, and tactical wage stress-test simulator. |
| 9 | **Stadium Arena** | Prabhas Coastal Oval seating optimizer adhering to Battrick ratios (**68% Standing, 23% Uncovered, 7% Covered, 2% Members**) and expansion ROI calculators. |
| 10 | **Fixtures** | Competitive First Class, One Day, and BT20 scorecards, results, and upcoming match orders. |
| 11 | **Club Calendar** | 7-day domestic schedule tracking Friday Skill Pops, Saturday Youth Drafts, Sunday Financial Settlements, and matchdays. |
| 12 | **Backroom Staff** | Science department roster: Sports Psychologist, Lead Physiotherapist, Head Coach, Chief Scout, and Financial Director. |
| 13 | **Club Records** | Clubhouse Hall of Fame batting, bowling, partnership, and team records authenticated from scorecards. |
| 14 | **Database** | Supabase PostgreSQL connectivity console and 1-click database synchronization. |

---

## ⚡ 1-Click Database Setup (Supabase)

To initialize your Supabase PostgreSQL database:
1. Open the **SQL Editor** in your [Supabase Dashboard](https://supabase.com/dashboard/project/xyvezmzsbmoqxepwblfq/sql).
2. Open [`supabase/COMPLETE_SETUP.sql`](supabase/COMPLETE_SETUP.sql).
3. Paste and click **Run**.
4. This instantly creates all 12 relational tables, Row Level Security policies, performance indexes, and seeds the Somnath Super Devs data.

---

## 📦 Building for Production & GitHub Pages

To compile the latest build into the `/docs` folder for GitHub Pages:
```bash
npm run build
git add .
git commit -m "deploy: update production build"
git push origin main
```
> GitHub Pages serves directly from `/docs` on the `main` branch.
