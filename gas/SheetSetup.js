/**
 * BT360MAK - SheetSetup.js
 * Formats, designs, and initializes all 10 Google Sheet tabs with professional styling,
 * formulas, data validation, and conditional formatting.
 */

const SheetSetup = {
  // Color Palette for Sheets (Pitch Green & Executive Dark)
  PALETTE: {
    HEADER_BG: '#064e3b',       // Deep Forest Emerald
    HEADER_TEXT: '#ffffff',     // Crisp White
    SUBHEADER_BG: '#0f766e',    // Teal Dark
    ZEBRA_LIGHT: '#f8fafc',     // Very Light Slate
    ACCENT_BORDER: '#cbd5e1',   // Slate Border
    HIGHLIGHT_GOLD: '#fef08a',  // Subtle Gold
    POSITIVE_BG: '#dcfce7',     // Soft Green
    POSITIVE_TEXT: '#166534',
    WARNING_BG: '#fef3c7',      // Soft Yellow
    WARNING_TEXT: '#92400e',
    NEGATIVE_BG: '#fee2e2',     // Soft Red
    NEGATIVE_TEXT: '#991b1b'
  },

  setupAllSheets: function() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    this.createOrClearTab(ss, CONFIG.TABS.DASHBOARD, this.buildDashboardTab);
    this.createOrClearTab(ss, CONFIG.TABS.SQUAD, this.buildSquadTab);
    this.createOrClearTab(ss, CONFIG.TABS.TRAINING, this.buildTrainingTab);
    this.createOrClearTab(ss, CONFIG.TABS.NETS, this.buildNetsTab);
    this.createOrClearTab(ss, CONFIG.TABS.MATCHES, this.buildMatchesTab);
    this.createOrClearTab(ss, CONFIG.TABS.TACTICS, this.buildTacticsTab);
    this.createOrClearTab(ss, CONFIG.TABS.FINANCES, this.buildFinancesTab);
    this.createOrClearTab(ss, CONFIG.TABS.STADIUM, this.buildStadiumTab);
    this.createOrClearTab(ss, CONFIG.TABS.SCOUTS, this.buildScoutsTab);
    this.createOrClearTab(ss, CONFIG.TABS.SETTINGS, this.buildSettingsTab);

    // Set Dashboard as active
    const dash = ss.getSheetByName(CONFIG.TABS.DASHBOARD);
    if (dash) ss.setActiveSheet(dash);
  },

  createOrClearTab: function(ss, tabName, builderFunction) {
    let sheet = ss.getSheetByName(tabName);
    if (!sheet) {
      sheet = ss.insertSheet(tabName);
    } else {
      sheet.clear();
      sheet.clearFormats();
    }
    // Remove default grid lines style if desired, or keep clean grid
    sheet.setShowGridLines(true);
    builderFunction.call(this, sheet);
  },

  // 1. DASHBOARD TAB
  buildDashboardTab: function(sheet) {
    // Title Banner
    sheet.getRange('A1:H1').merge()
      .setValue('🏏 BT360MAK - BATTRICK EXECUTIVE INTELLIGENCE DASHBOARD')
      .setBackground(this.PALETTE.HEADER_BG)
      .setFontColor(this.PALETTE.HEADER_TEXT)
      .setFontSize(14)
      .setFontWeight('bold')
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');
    sheet.setRowHeight(1, 45);

    // KPI Cards
    const kpis = [
      ['🏆 Club Name', 'Mak Lions CC', '👥 Fan Club', '1,420 (High Flying)', '💰 Bank Balance', '=07_Financial_Ledger!R4'],
      ['🏟️ Stadium Capacity', '=08_Stadium_Planner!B10', '🔥 Form Avg', 'Superb', '📈 Training Pops (S)', '=COUNTA(03_Training_Tracker!A4:A50)']
    ];

    for (let r = 0; r < kpis.length; r++) {
      const rowIdx = 3 + (r * 2);
      for (let c = 0; c < 3; c++) {
        const colStart = 1 + (c * 3);
        const titleCell = sheet.getRange(rowIdx, colStart, 1, 2).merge();
        titleCell.setValue(kpis[r][c * 2])
          .setBackground(this.PALETTE.SUBHEADER_BG)
          .setFontColor('#ffffff')
          .setFontWeight('bold')
          .setFontSize(10)
          .setHorizontalAlignment('center');

        const valCell = sheet.getRange(rowIdx + 1, colStart, 1, 2).merge();
        valCell.setValue(kpis[r][(c * 2) + 1])
          .setBackground(this.PALETTE.ZEBRA_LIGHT)
          .setFontWeight('bold')
          .setFontSize(12)
          .setHorizontalAlignment('center')
          .setBorder(true, true, true, true, false, false, this.PALETTE.ACCENT_BORDER, SpreadsheetApp.BorderStyle.SOLID);
      }
    }

    // Quick Squad Spotlight Header
    sheet.getRange('A8:H8').merge()
      .setValue('🌟 Squad Spotlight & Top Performers')
      .setBackground(this.PALETTE.SUBHEADER_BG)
      .setFontColor('#ffffff')
      .setFontWeight('bold');

    const headers = ['Player ID', 'Name', 'Age', 'Wage ($)', 'Primary Skill', 'Form', 'Fatigue', 'Market Value ($)'];
    sheet.getRange(9, 1, 1, 8).setValues([headers])
      .setBackground('#1e293b')
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    // Sample data rows pointing to squad sheet
    for (let i = 1; i <= 5; i++) {
      const row = 9 + i;
      sheet.getRange(row, 1).setFormula(`=IF(02_Squad_Master!A${i+3}="","",02_Squad_Master!A${i+3})`);
      sheet.getRange(row, 2).setFormula(`=IF(02_Squad_Master!B${i+3}="","",02_Squad_Master!B${i+3})`);
      sheet.getRange(row, 3).setFormula(`=IF(02_Squad_Master!C${i+3}="","",02_Squad_Master!C${i+3})`);
      sheet.getRange(row, 4).setFormula(`=IF(02_Squad_Master!D${i+3}="","",02_Squad_Master!D${i+3})`);
      sheet.getRange(row, 5).setFormula(`=IF(02_Squad_Master!G${i+3}="","",02_Squad_Master!G${i+3})`);
      sheet.getRange(row, 6).setFormula(`=IF(02_Squad_Master!N${i+3}="","",02_Squad_Master!N${i+3})`);
      sheet.getRange(row, 7).setFormula(`=IF(02_Squad_Master!O${i+3}="","",02_Squad_Master!O${i+3})`);
      sheet.getRange(row, 8).setFormula(`=IF(02_Squad_Master!U${i+3}="","",02_Squad_Master!U${i+3})`);
      sheet.getRange(row, 1, 1, 8).setBackground(i % 2 === 0 ? this.PALETTE.ZEBRA_LIGHT : '#ffffff');
    }

    // Set Column Widths
    sheet.setColumnWidth(1, 110);
    sheet.setColumnWidth(2, 170);
    sheet.setColumnWidth(3, 80);
    sheet.setColumnWidth(4, 110);
    sheet.setColumnWidth(5, 140);
    sheet.setColumnWidth(6, 110);
    sheet.setColumnWidth(7, 110);
    sheet.setColumnWidth(8, 140);
  },

  // 2. SQUAD MASTER TAB
  buildSquadTab: function(sheet) {
    sheet.getRange('A1:V1').merge()
      .setValue('🏏 02_SQUAD_MASTER - COMPLETE ROSTER & BT MEMBERSHIP ANALYTICS')
      .setBackground(this.PALETTE.HEADER_BG)
      .setFontColor(this.PALETTE.HEADER_TEXT)
      .setFontSize(13)
      .setFontWeight('bold')
      .setHorizontalAlignment('center');
    sheet.setRowHeight(1, 38);

    const headers = [
      'Player ID', 'Player Name', 'Age', 'Wage ($)', 'Hand', 'Bowling Type',
      'Batting', 'Bowling', 'Keeping', 'Fielding', 'Consistency', 'Concentration',
      'Stamina', 'Form', 'Fatigue', 'Leadership', 'Experience', 'BTI',
      'Est Subskill', 'Active Net', 'Market Value ($)', 'Tactical Role'
    ];

    sheet.getRange(3, 1, 1, headers.length).setValues([headers])
      .setBackground(this.PALETTE.SUBHEADER_BG)
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setHorizontalAlignment('center')
      .setWrap(true);
    sheet.setRowHeight(3, 32);
    sheet.setFrozenRows(3);
    sheet.setFrozenColumns(2);

    // Initial Sample Squad Data representing realistic Battrick players
    const sampleSquad = [
      ['BT-91024', 'Rohit Sharma', 24, 28500, 'RHB', 'None', 'Sensational', 'Feeble', 'Feeble', 'Superb', 'Remarkable', 'Wonderful', 'Superb', 'Superb', 'Revived', 'Proficient', 'Remarkable', 184500, '15.4', 'Batting (2)', 4200000, 'Opening Batsman'],
      ['BT-84920', 'Jasprit Bumrah', 23, 31200, 'RHB', 'Fast', 'Feeble', 'Sensational', 'Abysmal', 'Wonderful', 'Sensational', 'Competent', 'Superb', 'Blissful', 'Energized', 'Competent', 'Wonderful', 192000, '15.7', 'Bowling (2)', 4800000, 'Opening Strike Bowler'],
      ['BT-77412', 'Virat Kohli', 26, 42000, 'RHB', 'RM', 'Exquisite', 'Feeble', 'Abysmal', 'Exceptional', 'Masterclass', 'Miraculous', 'Remarkable', 'Superb', 'Rested', 'Exceptional', 'Sensational', 248000, '16.2', 'None', 6500000, 'Top Order Anchor (C)'],
      ['BT-63201', 'Rishabh Pant', 22, 19400, 'LHB', 'None', 'Exceptional', 'Abysmal', 'Wonderful', 'Proficient', 'Proficient', 'Strong', 'Proficient', 'Superb', 'Revived', 'Respectable', 'Proficient', 132000, '14.3', 'Keeping (1)', 2900000, 'Wicketkeeper Batsman'],
      ['BT-54819', 'Ravindra Jadeja', 25, 26700, 'LHB', 'Slow (SLA)', 'Wonderful', 'Remarkable', 'Abysmal', 'Sensational', 'Exceptional', 'Exceptional', 'Exceptional', 'Superb', 'Rested', 'Proficient', 'Remarkable', 178000, '13.8', 'Fielding (1)', 3800000, 'All-Rounder'],
      ['BT-44129', 'Rashid Khan', 21, 24000, 'RHB', 'Leg Spin', 'Competent', 'Exceptional', 'Abysmal', 'Wonderful', 'Sensational', 'Remarkable', 'Remarkable', 'Blissful', 'Energized', 'Capable', 'Proficient', 165000, '14.8', 'Bowling (2)', 3700000, 'Lead Spinner']
    ];

    sheet.getRange(4, 1, sampleSquad.length, headers.length).setValues(sampleSquad);

    // Apply Zebra striping and formatting
    for (let r = 4; r < 4 + sampleSquad.length; r++) {
      const bg = (r % 2 === 0) ? this.PALETTE.ZEBRA_LIGHT : '#ffffff';
      sheet.getRange(r, 1, 1, headers.length).setBackground(bg);
    }

    // Number formats for currency and numbers
    sheet.getRange(4, 4, 30, 1).setNumberFormat('$#,##0');
    sheet.getRange(4, 18, 30, 1).setNumberFormat('#,##0');
    sheet.getRange(4, 21, 30, 1).setNumberFormat('$#,##0');

    // Auto fit widths with sensible minimums
    for (let c = 1; c <= headers.length; c++) {
      sheet.setColumnWidth(c, Math.max(95, sheet.getColumnWidth(c)));
    }
    sheet.setColumnWidth(2, 160);
  },

  // 3. TRAINING TRACKER TAB
  buildTrainingTab: function(sheet) {
    sheet.getRange('A1:J1').merge()
      .setValue('📈 03_TRAINING_TRACKER - WEEKLY SKILL POPS & SUBSKILL PREDICTIONS')
      .setBackground(this.PALETTE.HEADER_BG)
      .setFontColor(this.PALETTE.HEADER_TEXT)
      .setFontSize(13)
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    const headers = [
      'Log Date', 'Player ID', 'Player Name', 'Skill Trained', 'Previous Level',
      'New Level (POP!)', 'Estimated Subskill', 'Weeks Taken', 'Coach Quality', 'Pop Confirmed'
    ];

    sheet.getRange(3, 1, 1, headers.length).setValues([headers])
      .setBackground(this.PALETTE.SUBHEADER_BG)
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');
    sheet.setFrozenRows(3);

    // Sample Training Pops
    const samplePops = [
      ['2026-11-13', 'BT-91024', 'Rohit Sharma', 'Batting', 'Exceptional', 'Sensational', '15.0', 7, 'Sensational', 'YES'],
      ['2026-11-06', 'BT-84920', 'Jasprit Bumrah', 'Bowling', 'Exceptional', 'Sensational', '15.0', 6, 'Sensational', 'YES'],
      ['2026-10-30', 'BT-63201', 'Rishabh Pant', 'Wicket Keeping', 'Remarkable', 'Wonderful', '13.0', 8, 'Wonderful', 'YES'],
      ['2026-10-23', 'BT-54819', 'Ravindra Jadeja', 'Batting', 'Remarkable', 'Wonderful', '13.0', 9, 'Wonderful', 'YES']
    ];
    sheet.getRange(4, 1, samplePops.length, headers.length).setValues(samplePops);

    for (let c = 1; c <= headers.length; c++) {
      sheet.setColumnWidth(c, 130);
    }
  },

  // 4. NETS MATRIX TAB
  buildNetsTab: function(sheet) {
    sheet.getRange('A1:G1').merge()
      .setValue('🎯 04_NETS_MATRIX - WEEKLY NET ALLOCATION (10 NETS TOTAL)')
      .setBackground(this.PALETTE.HEADER_BG)
      .setFontColor(this.PALETTE.HEADER_TEXT)
      .setFontSize(13)
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    const headers = ['Net #', 'Training Type', 'Primary Trainee ID', 'Player Name', 'Coach Multiplier', 'Pops Estimated In (Wks)', 'Notes'];
    sheet.getRange(3, 1, 1, headers.length).setValues([headers])
      .setBackground(this.PALETTE.SUBHEADER_BG)
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    const nets = [
      [1, 'Batting', 'BT-91024', 'Rohit Sharma', '1.15x (Sensational Coach)', 6, 'Primary top-order batter training'],
      [2, 'Batting', 'BT-91024', 'Rohit Sharma', '1.15x (Sensational Coach)', 6, 'Double net batting allocation'],
      [3, 'Bowling', 'BT-84920', 'Jasprit Bumrah', '1.15x (Sensational Coach)', 5, 'Double net strike bowler training'],
      [4, 'Bowling', 'BT-84920', 'Jasprit Bumrah', '1.15x (Sensational Coach)', 5, 'Aiming for Exquisite pace'],
      [5, 'Wicket Keeping', 'BT-63201', 'Rishabh Pant', '1.05x (Wonderful Coach)', 8, 'Keeping progression'],
      [6, 'Fielding', 'BT-54819', 'Ravindra Jadeja', '1.10x (Exceptional Coach)', 4, 'Boosting all-rounder fielding'],
      [7, 'Bowling', 'BT-44129', 'Rashid Khan', '1.15x (Sensational Coach)', 6, 'Spin maestro development'],
      [8, 'Bowling', 'BT-44129', 'Rashid Khan', '1.15x (Sensational Coach)', 6, 'Second net on Rashid'],
      [9, 'Fitness / Stamina', 'BT-63201', 'Rishabh Pant', '1.00x', 3, 'Stamina pop to Superb'],
      [10, 'General Physio', 'Squad-Wide', 'Injury Prevention', '1.00x', '-', 'Reduces fatigue recovery time']
    ];
    sheet.getRange(4, 1, nets.length, headers.length).setValues(nets);

    for (let c = 1; c <= headers.length; c++) {
      sheet.setColumnWidth(c, 150);
    }
  },

  // 5. MATCH ARCHIVES TAB
  buildMatchesTab: function(sheet) {
    sheet.getRange('A1:N1').merge()
      .setValue('📅 05_MATCH_ARCHIVES - FIXTURES, RESULTS & MATCH RATINGS')
      .setBackground(this.PALETTE.HEADER_BG)
      .setFontColor(this.PALETTE.HEADER_TEXT)
      .setFontSize(13)
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    const headers = [
      'Match ID', 'Date', 'Type (FC/OD/T20)', 'Opponent Club', 'Venue',
      'Pitch Type', 'Result', 'Our Score', 'Opp Score', 'Batting Rating',
      'Bowling Rating', 'Gate Receipts ($)', 'MoM Player', 'Calendar Event ID'
    ];
    sheet.getRange(3, 1, 1, headers.length).setValues([headers])
      .setBackground(this.PALETTE.SUBHEADER_BG)
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    const sampleMatches = [
      ['M-10291', '2026-11-20', 'First Class', 'Emerald Strikers', 'Home', 'Green', 'WON (7 Wkts)', '382 & 140/3', '240 & 280', 'Exceptional', 'Sensational', 94500, 'Jasprit Bumrah', ''],
      ['M-10292', '2026-11-22', 'One Day', 'Kingston Royals', 'Away', 'Dusty', 'WON (42 Runs)', '295/5 (50)', '253 (47.2)', 'Wonderful', 'Remarkable', 0, 'Rohit Sharma', ''],
      ['M-10293', '2026-11-25', 'T20', 'Titan Blasters', 'Home', 'Flat', 'WON (18 Runs)', '212/4 (20)', '194/8 (20)', 'Sensational', 'Wonderful', 68000, 'Virat Kohli', '']
    ];
    sheet.getRange(4, 1, sampleMatches.length, headers.length).setValues(sampleMatches);
    for (let c = 1; c <= headers.length; c++) sheet.setColumnWidth(c, 130);
  },

  // 6. LINEUP & TACTICS TAB
  buildTacticsTab: function(sheet) {
    sheet.getRange('A1:H1').merge()
      .setValue('⚔️ 06_LINEUP_TACTICS - MATCH ORDERS & PITCH SYNERGY ENGINE')
      .setBackground(this.PALETTE.HEADER_BG)
      .setFontColor(this.PALETTE.HEADER_TEXT)
      .setFontSize(13)
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    // Tactical pitch guide
    sheet.getRange('A3:H3').merge()
      .setValue('Current Selected Pitch: HARD | Predicted Bounce: High | Seam Advantage: +22% | Spin Assistance: Low')
      .setBackground('#f1f5f9')
      .setFontColor('#0f172a')
      .setFontWeight('bold');

    const headers = ['Batting #', 'Player ID', 'Player Name', 'Role', 'Aggression Level', 'Bowling Order', 'Max Overs', 'Field Setting'];
    sheet.getRange(5, 1, 1, headers.length).setValues([headers])
      .setBackground(this.PALETTE.SUBHEADER_BG)
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    const lineup = [
      [1, 'BT-91024', 'Rohit Sharma', 'Opening Batsman', 'Attacking', '-', '-', 'Aggressive Ring'],
      [2, 'BT-63201', 'Rishabh Pant', 'Wicketkeeper (WK)', 'Very Attacking', '-', '-', 'Wicketkeeper'],
      [3, 'BT-77412', 'Virat Kohli', 'Anchor Batsman (C)', 'Moderate', '-', '-', 'Deep Cover'],
      [4, 'BT-54819', 'Ravindra Jadeja', 'All-Rounder', 'Attacking', '4th Change', 10, 'Point / Gully'],
      [5, 'BT-44129', 'Rashid Khan', 'Spin Specialist', 'Moderate', '2nd Change', 10, 'Mid-Wicket'],
      [6, 'BT-84920', 'Jasprit Bumrah', 'Opening Strike Bowler', 'Defensive', '1st Bowler', 10, 'Fine Leg']
    ];
    sheet.getRange(6, 1, 1 + lineup.length - 1, headers.length).setValues(lineup);
    for (let c = 1; c <= headers.length; c++) sheet.setColumnWidth(c, 140);
  },

  // 7. FINANCIAL LEDGER TAB
  buildFinancesTab: function(sheet) {
    sheet.getRange('A1:R1').merge()
      .setValue('💰 07_FINANCIAL_LEDGER - 52-WEEK CASHFLOW, WAGES & REVENUE PROJECTIONS')
      .setBackground(this.PALETTE.HEADER_BG)
      .setFontColor(this.PALETTE.HEADER_TEXT)
      .setFontSize(13)
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    const headers = [
      'Week #', 'Date', 'Gate Receipts ($)', 'Sponsors ($)', 'Merchandise ($)',
      'Prize Money ($)', 'Total Inflow ($)', 'Player Wages ($)', 'Staff Wages ($)',
      'Stadium Upkeep ($)', 'Youth Academy ($)', 'Total Outflow ($)', 'Net Weekly P&L ($)',
      'Cumulative Bank Balance ($)'
    ];

    sheet.getRange(3, 1, 1, headers.length).setValues([headers])
      .setBackground(this.PALETTE.SUBHEADER_BG)
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');
    sheet.setFrozenRows(3);

    const initialFinanceRow = [
      1, '2026-11-15', 94500, 48000, 12500, 0, '=SUM(C4:F4)', 171800, 32000, 18000, 36000, '=SUM(H4:K4)', '=G4-L4', 850000
    ];
    sheet.getRange(4, 1, 1, headers.length).setValues([initialFinanceRow]);

    // Apply currency formatting
    sheet.getRange(4, 3, 50, headers.length - 2).setNumberFormat('$#,##0');
    for (let c = 1; c <= headers.length; c++) sheet.setColumnWidth(c, 130);
  },

  // 8. STADIUM PLANNER TAB
  buildStadiumTab: function(sheet) {
    sheet.getRange('A1:H1').merge()
      .setValue('🏟️ 08_STADIUM_PLANNER - OPTIMAL GROUND CAPACITY & TICKET PRICING ENGINE')
      .setBackground(this.PALETTE.HEADER_BG)
      .setFontColor(this.PALETTE.HEADER_TEXT)
      .setFontSize(13)
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    const headers = [
      'Seating Tier', 'Current Seats', 'Optimal Ratio', 'Recommended Seats',
      'Ticket Price ($)', 'Max Weekly Gate ($)', 'Expansion Cost / Seat ($)', 'Total Upgrade Cost ($)'
    ];
    sheet.getRange(3, 1, 1, headers.length).setValues([headers])
      .setBackground(this.PALETTE.SUBHEADER_BG)
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    const tiers = [
      ['Standing Room', 12000, '68%', 17000, 5, '=D4*E4', 35, '=(D4-B4)*G4'],
      ['Uncovered Seats', 4500, '23%', 5750, 8, '=D5*E5', 60, '=(D5-B5)*G5'],
      ['Covered Seats', 1200, '7%', 1750, 15, '=D6*E6', 100, '=(D6-B6)*G6'],
      ['Members Enclosure (BT+)', 300, '2%', 500, 35, '=D7*E7', 220, '=(D7-B7)*G7'],
      ['TOTAL CAPACITY', '=SUM(B4:B7)', '100%', '=SUM(D4:D7)', '-', '=SUM(F4:F7)', '-', '=SUM(H4:H7)']
    ];
    sheet.getRange(4, 1, tiers.length, headers.length).setValues(tiers);
    sheet.getRange(8, 1, 1, headers.length).setFontWeight('bold').setBackground('#f1f5f9');

    sheet.getRange(4, 5, 5, 4).setNumberFormat('$#,##0');
    for (let c = 1; c <= headers.length; c++) sheet.setColumnWidth(c, 150);
  },

  // 9. SCOUT & TRANSFER TAB
  buildScoutsTab: function(sheet) {
    sheet.getRange('A1:J1').merge()
      .setValue('🔍 09_SCOUT_TRANSFER - TRANSFER MARKET RADAR & PLAYER VALUATION ENGINE')
      .setBackground(this.PALETTE.HEADER_BG)
      .setFontColor(this.PALETTE.HEADER_TEXT)
      .setFontSize(13)
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    const headers = [
      'Player ID', 'Name', 'Age', 'Primary Skill', 'Secondary Skill',
      'Stamina', 'Wage ($)', 'Current Bid ($)', 'Fair Valuation ($)', 'Action / Verdict'
    ];
    sheet.getRange(3, 1, 1, headers.length).setValues([headers])
      .setBackground(this.PALETTE.SUBHEADER_BG)
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    const sampleTargets = [
      ['BT-98211', 'David Warner', 25, 'Sensational (15)', 'Remarkable (12)', 'Superb (10)', 34000, 1800000, 2400000, 'UNDERVALUED (BUY)'],
      ['BT-89412', 'Mitchell Starc', 26, 'Exquisite (16)', 'Competent (6)', 'Strong (9)', 41000, 3200000, 3100000, 'FAIR MARKET'],
      ['BT-71203', 'Steve Smith', 28, 'Masterclass (17)', 'Sensational (15)', 'Proficient (8)', 62000, 5400000, 4200000, 'OVERPRICED (PASS)']
    ];
    sheet.getRange(4, 1, sampleTargets.length, headers.length).setValues(sampleTargets);
    for (let c = 1; c <= headers.length; c++) sheet.setColumnWidth(c, 140);
  },

  // 10. GOOGLE SYNC & SYSTEM CONFIG TAB
  buildSettingsTab: function(sheet) {
    sheet.getRange('A1:D1').merge()
      .setValue('⚙️ 10_GOOGLE_SYNC_CONFIG - SYSTEM PREFERENCES & GOOGLE APPS INTEGRATION')
      .setBackground(this.PALETTE.HEADER_BG)
      .setFontColor(this.PALETTE.HEADER_TEXT)
      .setFontSize(13)
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    const headers = ['Configuration Key', 'Value', 'Status / Description', 'Last Updated'];
    sheet.getRange(3, 1, 1, headers.length).setValues([headers])
      .setBackground(this.PALETTE.SUBHEADER_BG)
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    const settings = [
      ['BATTRICK_CLUB_ID', '94120', 'Your official Battrick club numerical identifier', '2026-11-18'],
      ['BATTRICK_SECURITY_CODE', '******', 'Battrick Developer / User Security Token', '2026-11-18'],
      ['GOOGLE_CALENDAR_ID', 'primary', 'Target Google Calendar for match fixtures', 'Connected'],
      ['GMAIL_ALERT_RECIPIENT', Session.getActiveUser().getEmail() || 'admin@battrick.org', 'Destination for weekly training digest & match alerts', 'Active'],
      ['GOOGLE_DRIVE_FOLDER_NAME', 'BT360MAK_Backups', 'Target Drive folder for automated JSON/CSV dumps', 'Ready'],
      ['TRAINING_POP_DAY', 'Friday', 'Weekly training calculation cycle', 'Weekly 08:00 AM IST'],
      ['FINANCIAL_UPDATE_DAY', 'Sunday', 'Weekly sponsor & wage deduction cycle', 'Weekly 06:00 AM IST'],
      ['ACTIVE_THEME', 'Emerald & Gold', 'UI Theme default (Switchable in Web App)', 'Active'],
      ['WEB_APP_URL', ScriptApp.getService().getUrl() || 'Deploy as Web App to generate URL', 'REST & HTML Service endpoint', 'Ready']
    ];
    sheet.getRange(4, 1, settings.length, headers.length).setValues(settings);

    sheet.setColumnWidth(1, 240);
    sheet.setColumnWidth(2, 320);
    sheet.setColumnWidth(3, 300);
    sheet.setColumnWidth(4, 160);
  }
};
