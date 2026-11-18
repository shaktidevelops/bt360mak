# 🏏 BT360MAK - Battrick Premium Backend & Manager Intelligence Suite

> **GitHub Repository:** [https://github.com/shaktidevelops/bt360mak](https://github.com/shaktidevelops/bt360mak)  
> **Google Apps Script ID:** `1GuCVl28B7I-KJ9o-pdYJl6MGaX0FYqTH9u5yzOMuoQpXBLqW2ULLQxpS`  
> **Google Sheet Master Database:** [1KXQbrZ2D7aYJUAniQ5F3L8FeFfM8zmsMsIDHfl2An_E](https://docs.google.com/spreadsheets/d/1KXQbrZ2D7aYJUAniQ5F3L8FeFfM8zmsMsIDHfl2An_E/edit)

---

## 🌟 Executive Summary & Architecture

**BT360MAK** is an enterprise-grade analytics, tactical planning, and squad management system designed for **Battrick** cricket managers. It unlocks full **Battrick Membership (Supporter)** features and synchronizes your club data across the entire Google Workspace ecosystem.

```
 ┌────────────────────────────────────────────────────────┐
 │                   BT360MAK FRONTEND                    │
 │  • 5 Premium Themes (Emerald, Cyber, Royal, etc.)      │
 │  • Separate Modular Files (HTML, CSS, JS, Charts)      │
 │  • 8 Real-time Tactical & Analytics Screens            │
 └───────────────────────────▲────────────────────────────┘
                             │ REST / google.script.run
 ┌───────────────────────────▼────────────────────────────┐
 │         GOOGLE APPS SCRIPT BACKEND (V8 ENGINE)         │
 │  • Code.js              • SheetSetup.js                │
 │  • BattrickService.js   • MembershipEngine.js          │
 │  • GoogleAppsConnector.js                              │
 └───────▲───────────────▲───────────────▲──────────────▲─┘
         │               │               │              │
 ┌───────▼───────┐ ┌─────▼─────┐ ┌───────▼──────┐ ┌─────▼─────┐
 │ GOOGLE SHEETS │ │ GOOGLE    │ │ GOOGLE DRIVE │ │ GMAIL &   │
 │ Master Ledger │ │ CALENDAR  │ │ Auto Backups │ │ DOCS      │
 │ (10 Pro Tabs) │ │ Fixtures  │ │ JSON Dumps   │ │ Digests   │
 └───────────────┘ └───────────┘ └──────────────┘ └───────────┘
```

---

## 🎨 5 Signature Themes

1. **Pitch Emerald & Gold (Classic Luxury)**: Deep lawn green, pitch markings, warm gold trim.
2. **Cyber Midnight / Neon Arena**: Obsidian dark mode with glowing neon cyan (`#00f2fe`) and hot pink badges.
3. **Royal Pavilion (Lord's Navy & Crimson)**: Elite navy blue with rich crimson accents and crisp typography.
4. **Sunset Matchday (Amber Blaze)**: Warm dark charcoal with radiant amber and sunset copper gradients.
5. **Clean Pro Light (Modern Executive SaaS)**: Pristine white, crisp slate borders, and vibrant teal highlights.

---

## 👑 BT Membership Features Implemented

1. **Training Pop Tracker & Subskill Estimator**:
   - Detects Friday morning skill level increases.
   - Computes hidden subskill progression (e.g. `14.3 -> 15.0`).
   - Forecasts exact weeks remaining until next pop based on coach multiplier and nets count.
2. **Tactical Pitch Synergy Engine**:
   - Analyzes pitch conditions (`Hard`, `Green`, `Dusty`, `Slow`, `Flat`, `Uneven`).
   - Calculates bowler synergy modifiers (e.g., +25% bounce boost for express pace on Hard pitches, +40% turn on Dusty).
   - Simulates predicted match ratings across Top Order, Middle Order, Seam, and Spin.
3. **Stadium Architect & Optimum Capacity Model**:
   - Calculates mathematically optimal ground ratios (`68% Standing`, `23% Uncovered`, `7% Covered`, `2% Members Enclosure`).
   - Dynamic ticket price optimizer and expansion ROI calculator.
4. **Transfer Market Radar & Fair Value Model**:
   - Multi-variable valuation formula evaluating primary skill, consistency, concentration, stamina, wage, and age discount curves.
5. **Youth Academy (ITS) Simulator**:
   - Calculates weekly investment yields ($0 to $36,000) for scouting 17-year-old prospects.

---

## 🌐 Google Workspace Connections

| Google App | Integration Purpose | Automation Frequency |
| :--- | :--- | :--- |
| **Google Sheets** | Master database with 10 formatted analytical tabs | Real-time 2-way sync |
| **Google Calendar** | Fixture calendar events (FC, OD, T20) + Friday Pop alarms | Auto-synced on schedule |
| **Google Drive** | Timestamped JSON snapshots backed up in `BT360MAK_Backups` | Weekly Monday 2:00 AM |
| **Google Gmail** | HTML matchday executive digests & pop alerts | Weekly Friday 8:00 AM |
| **Google Docs** | One-click Season Strategy & Review document generator | On demand via menu |

---

## 📁 Repository Directory Structure

```
bt360mak/
├── gas/                           # Google Apps Script Backend
│   ├── appsscript.json            # Manifest & OAuth Scopes
│   ├── Code.js                    # Web App controller, routing, triggers
│   ├── SheetSetup.js              # 10-Tab sheet formatting & formulas
│   ├── BattrickService.js         # XML / HTML parser & ingestion
│   ├── MembershipEngine.js        # Pops, subskills, tactics & stadium
│   └── GoogleAppsConnector.js     # Sheets, Drive, Calendar, Gmail, Docs
├── frontend/                      # Standalone & Web App UI
│   ├── index.html                 # 8 Screens & Responsive Layout
│   ├── css/
│   │   ├── main.css               # Core styling, cards, tables, modals
│   │   └── themes.css             # 5 Custom live-switchable themes
│   └── js/
│       ├── battrickData.js        # Default club state & pitch models
│       ├── api.js                 # GAS / REST API client connector
│       ├── charts.js              # Lightweight SVG graphs
│       └── app.js                 # UI logic, state, tabs & calculators
└── README.md                      # Comprehensive Documentation
```

---

## 🚀 Setup & Deployment Guide

### Step 1: Initialize Google Sheet
1. Open your Google Sheet: `https://docs.google.com/spreadsheets/d/1KXQbrZ2D7aYJUAniQ5F3L8FeFfM8zmsMsIDHfl2An_E/edit`
2. Open **Extensions > Apps Script** (Script ID: `1GuCVl28B7I-KJ9o-pdYJl6MGaX0FYqTH9u5yzOMuoQpXBLqW2ULLQxpS`).
3. Copy the files in `gas/` into your Apps Script editor (`Code.js`, `SheetSetup.js`, `BattrickService.js`, `MembershipEngine.js`, `GoogleAppsConnector.js`, `appsscript.json`).
4. Reload the Google Sheet. You will see the new menu: **🏏 BT360MAK Manager**.
5. Click **⚡ Format & Initialize All Sheets** to automatically generate and format all 10 tabs with formulas, colors, and structure.

### Step 2: Deploy Web App
1. In the Apps Script editor, click **Deploy > New Deployment**.
2. Select **Web app**.
3. Set **Execute as:** `Me` and **Who has access:** `Anyone`.
4. Click **Deploy** and copy your Web App URL.
5. In `frontend/index.html` or in the Settings tab, paste your Web App URL for live 2-way synchronization.
