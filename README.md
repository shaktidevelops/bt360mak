# 🏏 BT360MAK - Battrick Sovereign Intelligence & SaaS Manager Suite

> **GitHub Repository:** [https://github.com/shaktidevelops/bt360mak](https://github.com/shaktidevelops/bt360mak)  
> **Google Apps Script ID:** `1GuCVl28B7I-KJ9o-pdYJl6MGaX0FYqTH9u5yzOMuoQpXBLqW2ULLQxpS`  
> **Google Sheet Master Database:** [1KXQbrZ2D7aYJUAniQ5F3L8FeFfM8zmsMsIDHfl2An_E](https://docs.google.com/spreadsheets/d/1KXQbrZ2D7aYJUAniQ5F3L8FeFfM8zmsMsIDHfl2An_E/edit)  
> **Active Web App Portal:** [https://script.google.com/macros/s/AKfycby_56P0m_Mij_N-zz0K44NntJNyts_8bUtl1VoPZQhlSnUFsCOq-lh33A3B9b9npmA/exec](https://script.google.com/macros/s/AKfycby_56P0m_Mij_N-zz0K44NntJNyts_8bUtl1VoPZQhlSnUFsCOq-lh33A3B9b9npmA/exec)

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

## 🏗️ Architecture & Business Model: Subscriber Isolation (Model B)

**BT360MAK** operates as a commercial-grade SaaS intelligence tool.
Subscribers access only the high-performance frontend portal without any visibility or access to the underlying Apps Script backend algorithms, pricing models, or sheet formulas.

```
 ┌─────────────────────────────────────────────────────────────────┐
 │                   BT360MAK SOVEREIGN FRONTEND                   │
 │  • Single Signature Theme: Sovereign Turf & Gold                │
 │  • Sticky Header (Live Ticking Server Clock & Financial Ticker) │
 │  • Structured 4-Column Luxury Footer                            │
 │  • Multi-Page Ingestion Studio (squad, finances, ground, etc.)  │
 │  • 10 Live Consoles: Command Center, Squad, Tactics, Nets, etc. │
 └────────────────────────────────▲────────────────────────────────┘
                                  │ HTTPS REST / google.script.run
 ┌────────────────────────────────▼────────────────────────────────┐
 │             GOOGLE APPS SCRIPT BACKEND (V8 ENGINE)              │
 │  • Code.js                     • SheetSetup.js (10 Tabs)        │
 │  • BattrickService.js          • MembershipEngine.js            │
 │  • GoogleAppsConnector.js                                       │
 └────────▲────────────────▲────────────────▲────────────────▲─────┘
          │                │                │                │
 ┌────────▼────────┐ ┌─────▼──────┐ ┌───────▼──────┐ ┌───────▼──────┐
 │  GOOGLE SHEETS  │ │   GOOGLE   │ │ GOOGLE DRIVE │ │   GMAIL &    │
 │ Master Database │ │  CALENDAR  │ │ Auto Backups │ │     DOCS     │
 │  (10 Pro Tabs)  │ │  Fixtures  │ │  JSON Dumps  │ │   Digests    │
 └─────────────────┘ └────────────┘ └──────────────┘ └──────────────┘
```

---

## 🎨 Single Signature Theme: Sovereign Turf & Gold
- **Obsidian Turf Palette**: Deep pitch background (`#05100c`) with ambient emerald glows (`#10b981`), trophy gold highlights (`#f59e0b`), and cherry seam red accents (`#f43f5e`).
- **Glassmorphic Cards**: Translucent cards (`rgba(13, 34, 28, 0.78)`) with 1px luminous borders, smooth hover lifts, and glowing status markers.
- **Typography Standards**: Primary text in **Plus Jakarta Sans** (weights 300 to 800) with currencies, ratings, and IDs in **JetBrains Mono**.

---

## ⚡ Multi-Page Ingestion Studio
The Ingestion Studio accepts ANY raw HTML page from Battrick:
1. `squad.asp`: Extracts all 14+ players, ages, wages, BTI, 11 skills, bowling styles, and roles.
2. `finances.asp`: Extracts weekly turnover, gate receipts, sponsor payments, wages, upkeep, and bank balance.
3. `ground.asp`: Extracts stadium capacity by tier (Standing, Uncovered, Covered, Members) and pitch condition.
4. `fixtures.asp` & `matchinfo.asp`: Extracts fixture schedules, match results, and detailed batting/bowling scorecards.
5. `nets.asp`: Extracts 10-net coaching assignments and pop countdowns.

---

## 🛠️ Step-by-Step Setup & Troubleshooting

### 1. Enabling GitHub Pages (Free Hosting)
If GitHub displays *"Upgrade or make this repository public to enable Pages"*:
1. Go to repository **Settings** -> **General**.
2. Scroll to the **Danger Zone** at the bottom.
3. Click **Change repository visibility** -> Select **Make public**.
4. Go to **Pages** in Settings -> Set Source to Branch: `main`, Folder: `/docs` -> Click **Save**.
5. Your portal will be live at: `https://shaktidevelops.github.io/bt360mak/`!

### 2. Google Apps Script 1-Time Authorization
If you see *"Google hasn't verified this app"*:
1. Click the small link **"Advanced"**.
2. Click **"Go to bt360mak (unsafe)"**.
3. Click **"Allow"**.
4. Your script is now fully authorized to synchronize Google Sheets, Drive, and Calendar.

---

## 📁 Repository Directory Structure

```
bt360mak/
├── docs/                          # GitHub Pages Root & Documentation
│   ├── index.html                 # Production Web App Portal
│   ├── css/                       # main.css & themes.css
│   ├── js/                        # app.js, battrickData.js, api.js, charts.js
│   └── conversations/             # Full conversation transcripts & logs
│       ├── transcript.jsonl       # JSONL conversation logs
│       └── SESSION_TRANSCRIPT.md  # Detailed human-readable change log
├── frontend/                      # Development Source Code (Mirrored to docs/)
├── gas/                           # Google Apps Script Backend Project
│   ├── appsscript.json            # Manifest & Scopes
│   ├── Code.js                    # Web App controller & triggers
│   ├── SheetSetup.js              # 10-Tab sheet formatting & formulas
│   ├── BattrickService.js         # Multi-page HTML / XML parser
│   ├── MembershipEngine.js        # Valuation, tactics & pitch formulas
│   ├── GoogleAppsConnector.js     # Sheets, Drive, Calendar, Gmail, Docs
│   └── index.html                 # Bundled standalone web application
├── .clasp.json                    # Google Clasp Script binding configuration
└── README.md                      # Comprehensive Documentation
```
