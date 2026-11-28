# 🏏 BT360MAK - Battrick Sovereign Intelligence & Cricket Manager Suite

> **GitHub Repository:** [https://github.com/shaktidevelops/bt360mak](https://github.com/shaktidevelops/bt360mak)  
> **Live Production Portal:** [https://shaktidevelops.github.io/bt360mak/](https://shaktidevelops.github.io/bt360mak/)  
> **Google Sheet Database:** [1KXQbrZ2D7aYJUAniQ5F3L8FeFfM8zmsMsIDHfl2An_E](https://docs.google.com/spreadsheets/d/1KXQbrZ2D7aYJUAniQ5F3L8FeFfM8zmsMsIDHfl2An_E/edit)  
> **Google Apps Script Backend:** [1tS9xWWXRBTlrsysAeF82qyrrFDPfHrchSpYNGmAhSZZD_D-f4nGmP7kz](https://script.google.com/d/1tS9xWWXRBTlrsysAeF82qyrrFDPfHrchSpYNGmAhSZZD_D-f4nGmP7kz/edit)  

---

## 🏠 Quickstart Guide

When you continue work on your machine, run these commands:

### 1. Clone or Pull the Latest Code
```bash
# If cloning for the first time:
git clone https://github.com/shaktidevelops/bt360mak.git
cd bt360mak

# If already cloned on your PC:
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

### 4. Google Sheets Database Configuration
The application uses Google Sheet `1KXQbrZ2D7aYJUAniQ5F3L8FeFfM8zmsMsIDHfl2An_E` as its live relational database.
To configure automatic live synchronization via Google Apps Script Web App:
1. Open Google Apps Script project: [1tS9xWWXRBTlrsysAeF82qyrrFDPfHrchSpYNGmAhSZZD_D-f4nGmP7kz](https://script.google.com/d/1tS9xWWXRBTlrsysAeF82qyrrFDPfHrchSpYNGmAhSZZD_D-f4nGmP7kz/edit).
2. Paste the code from `google-apps-script/Code.gs` and run `setupBT360Database` to format all 10 tabs with emerald headers.
3. Click **Deploy > New deployment > Web app** (Execute as: *Me*, Access: *Anyone*).
4. Copy the deployment URL into the **Database** screen inside BT360MAK or in `.env.local`:
```env
VITE_GOOGLE_SHEET_ID=1KXQbrZ2D7aYJUAniQ5F3L8FeFfM8zmsMsIDHfl2An_E
VITE_GOOGLE_APPS_SCRIPT_ID=1tS9xWWXRBTlrsysAeF82qyrrFDPfHrchSpYNGmAhSZZD_D-f4nGmP7kz
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
```

---

## 🏏 14 Dedicated Clubhouse Operations Modules

| # | Screen | Description |
| :---: | :--- | :--- |
| 1 | **Overview** | Executive command center, upcoming fixture scout report, season MVPs, and backroom staff status. |
| 2 | **Squad** | Master player roster with clean numeric IDs, BTI talent ratings, subskills, market values, and 1-click dossier navigation. |
| 3 | **Player Dossier** | Comprehensive Battrick career statistics (Domestic & Friendly tabs, Recent Matches section, averages, strike rates, 100s, 50s, 5w hauls). |
| 4 | **Best XI** | Tactical starting lineup generator with Captaincy (Leadership + Experience) and Wicketkeeper efficiency calculators. |
| 5 | **Tactics & Pitch** | Pitch condition synergy matrix (Hard, Green, Dusty, Flat, Slow) and authentic cricket bowling spells. |
| 6 | **Training Nets** | 10-net player development matrix, with Sports Psychologist (+15% mental focus), Physio, and Coach multiplier synergies. |
| 7 | **Youth Academy** | Individual Training Scheme (ITS) investment slider (£0–£36,000/wk) and interactive Saturday Youth Draft Pull simulator. |
| 8 | **Finances** | 52-week commercial ledger with Week and Category filters, gate receipts, sponsorship audit, and tactical wage stress-test simulator. |
| 9 | **Stadium Arena** | Seating optimizer adhering to Battrick ratios (**68% Standing, 23% Uncovered, 7% Covered, 2% Members**) and expansion ROI calculators. |
| 10 | **Fixtures** | Competitive First Class, One Day, and BT20 scorecards, results, and upcoming match orders. |
| 11 | **Club Calendar** | 7-day domestic schedule tracking Friday Skill Pops, Saturday Youth Drafts, Sunday Financial Settlements, and matchdays. |
| 12 | **Backroom Staff** | Science department roster: Sports Psychologist, Lead Physiotherapist, Head Coach, Chief Scout, and Financial Director. |
| 13 | **Club Records** | Clubhouse Hall of Fame batting, bowling, partnership, and team records authenticated from scorecards. |
| 14 | **Database** | Google Sheets relational database console, live sheet link, 10 formatted tabs overview, and 1-click synchronization. |

---

## ⚡ 10 Google Sheet Database Tabs

The database structure in Google Sheet `1KXQbrZ2D7aYJUAniQ5F3L8FeFfM8zmsMsIDHfl2An_E`:
1. `Club`: Identity, divisions, treasury, fan mood, ITS bank, stadium metadata.
2. `Squad`: Full player roster with 11 core skills, BTI, wage, age, and career statistics.
3. `Matches`: Concluded match scorecards, opponents, surfaces, player performances, and JSON payloads.
4. `Records`: Batting, bowling, and milestone records.
5. `Finances`: Inflows, outflows, weekly wages, gate receipts, and net P&L.
6. `Stadium`: Seating tiers and capacity distribution.
7. `Nets`: 10-net training facility allocations.
8. `TrainingLogs`: Friday training pops and skill progressions.
9. `Staff`: Backroom personnel and weekly payroll.
10. `Calendar`: Club events, fixtures, and financial settlements.

---

## 📦 Building for Production & GitHub Pages

To compile the latest build into the `/dist` / `/docs` folder for GitHub Pages:
```bash
npm run build
git add .
git commit -m "feat: complete migration to Google Sheets database"
git push origin main
```
