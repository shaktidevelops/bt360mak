/**
 * BT360MAK - SheetSetup.js
 * Sovereign Edition - Google Sheets 10-Tab Grid Builder & Plus Jakarta Sans Formatter
 * 100% Real Somnath Super Devs Data Structure
 */

const SheetSetup = {
  PALETTE: {
    HEADER_BG: '#064e3b',       // Emerald Luxury Header
    HEADER_TEXT: '#ffffff',
    SUBHEADER_BG: '#0f766e',    // Deep Teal Subheader
    ZEBRA_LIGHT: '#f8fafc',
    CARD_BG: '#f1f5f9',
    BORDER_COLOR: '#cbd5e1',
    TEXT_MAIN: '#0f172a'
  },

  initializeAllTabs: function(spreadsheet) {
    const ss = spreadsheet || SpreadsheetApp.getActiveSpreadsheet();

    const tabsToBuild = [
      { key: CONFIG.TABS.DASHBOARD, builder: this.buildDashboardTab.bind(this) },
      { key: CONFIG.TABS.SQUAD, builder: this.buildSquadTab.bind(this) },
      { key: CONFIG.TABS.TRAINING, builder: this.buildTrainingTab.bind(this) },
      { key: CONFIG.TABS.NETS, builder: this.buildNetsTab.bind(this) },
      { key: CONFIG.TABS.MATCHES, builder: this.buildMatchesTab.bind(this) },
      { key: CONFIG.TABS.TACTICS, builder: this.buildTacticsTab.bind(this) },
      { key: CONFIG.TABS.FINANCES, builder: this.buildFinancesTab.bind(this) },
      { key: CONFIG.TABS.STADIUM, builder: this.buildStadiumTab.bind(this) },
      { key: CONFIG.TABS.SCOUTS, builder: this.buildScoutsTab.bind(this) },
      { key: CONFIG.TABS.SETTINGS, builder: this.buildSettingsTab.bind(this) }
    ];

    tabsToBuild.forEach(t => {
      let sheet = ss.getSheetByName(t.key);
      if (!sheet) {
        sheet = ss.insertSheet(t.key);
      }
      sheet.clear();
      sheet.clearFormats();
      t.builder(sheet);
      this.stripExtraneousGrid(sheet);
    });

    Logger.log('All 10 tabs cleanly built and populated with real Somnath Super Devs data.');
  },

  stripExtraneousGrid: function(sheet) {
    try {
      const maxRows = sheet.getMaxRows();
      const lastRow = Math.max(sheet.getLastRow(), 15);
      if (maxRows > lastRow + 5) {
        sheet.deleteRows(lastRow + 6, maxRows - (lastRow + 5));
      }

      const maxCols = sheet.getMaxColumns();
      const lastCol = Math.max(sheet.getLastColumn(), 1);
      if (maxCols > lastCol + 1) {
        sheet.deleteColumns(lastCol + 2, maxCols - (lastCol + 1));
      }
    } catch (e) {
      Logger.log('Grid trimming skipped: ' + e.toString());
    }
  },

  // 1. DASHBOARD TAB
  buildDashboardTab: function(sheet) {
    sheet.getRange('A1:H1').merge()
      .setValue('🏏 BT360MAK - SOMNATH SUPER DEVS EXECUTIVE INTELLIGENCE DASHBOARD')
      .setBackground(this.PALETTE.HEADER_BG)
      .setFontColor(this.PALETTE.HEADER_TEXT)
      .setFontSize(14)
      .setFontWeight('bold')
      .setFontFamily(CONFIG.FONT_FAMILY)
      .setHorizontalAlignment('center');
    sheet.setRowHeight(1, 45);

    const kpiDefinitions = [
      { rangeTitle: 'A3:B3', rangeVal: 'A4:B4', title: '🏆 Club Name & Region', val: 'Somnath Super Devs (Tamil Nadu)' },
      { rangeTitle: 'D3:E3', rangeVal: 'D4:E4', title: '👥 Fan Club Morale', val: '781 members (Over the Moon 🚀)' },
      { rangeTitle: 'G3:H3', rangeVal: 'G4:H4', title: '💰 Bank Treasury', val: '£1,320,573' },
      { rangeTitle: 'A6:B6', rangeVal: 'A7:B7', title: '🏟️ Stadium Capacity', val: '10,000 Seats (Prabhas Coastal Oval)' },
      { rangeTitle: 'D6:E6', rangeVal: 'D7:E7', title: '🔥 Squad Form Average', val: 'Superb (Peak Match Form)' },
      { rangeTitle: 'G6:H6', rangeVal: 'G7:H7', title: '📈 Season Wonderkid Pops', val: '2 Confirmed Pops' }
    ];

    kpiDefinitions.forEach(kpi => {
      sheet.getRange(kpi.rangeTitle).merge()
        .setValue(kpi.title)
        .setBackground(this.PALETTE.SUBHEADER_BG)
        .setFontColor('#ffffff')
        .setFontSize(10)
        .setFontWeight('bold')
        .setFontFamily(CONFIG.FONT_FAMILY)
        .setHorizontalAlignment('center');

      sheet.getRange(kpi.rangeVal).merge()
        .setValue(kpi.val)
        .setBackground(this.PALETTE.CARD_BG)
        .setFontColor(this.PALETTE.TEXT_MAIN)
        .setFontSize(12)
        .setFontWeight('bold')
        .setFontFamily(CONFIG.FONT_FAMILY)
        .setHorizontalAlignment('center');
    });

    sheet.getRange('A9:H9').merge()
      .setValue('🌟 Squad Spotlight & Key Trainees')
      .setBackground(this.PALETTE.SUBHEADER_BG)
      .setFontColor('#ffffff')
      .setFontSize(11)
      .setFontWeight('bold')
      .setFontFamily(CONFIG.FONT_FAMILY);

    const headers = ['Player ID', 'Name', 'Age', 'Wage (£)', 'Primary Skill', 'Form', 'Fatigue', 'Market Value (£)'];
    sheet.getRange(10, 1, 1, headers.length).setValues([headers])
      .setBackground('#1e293b')
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setFontFamily(CONFIG.FONT_FAMILY)
      .setHorizontalAlignment('center');

    const spotlightRows = [
      ["='02_Squad_Master'!A4", "='02_Squad_Master'!B4", "='02_Squad_Master'!C4", "='02_Squad_Master'!D4", "='02_Squad_Master'!G4", "='02_Squad_Master'!N4", "='02_Squad_Master'!O4", "='02_Squad_Master'!U4"],
      ["='02_Squad_Master'!A5", "='02_Squad_Master'!B5", "='02_Squad_Master'!C5", "='02_Squad_Master'!D5", "='02_Squad_Master'!G5", "='02_Squad_Master'!N5", "='02_Squad_Master'!O5", "='02_Squad_Master'!U5"],
      ["='02_Squad_Master'!A6", "='02_Squad_Master'!B6", "='02_Squad_Master'!C6", "='02_Squad_Master'!D6", "='02_Squad_Master'!G6", "='02_Squad_Master'!N6", "='02_Squad_Master'!O6", "='02_Squad_Master'!U6"],
      ["='02_Squad_Master'!A7", "='02_Squad_Master'!B7", "='02_Squad_Master'!C7", "='02_Squad_Master'!D7", "='02_Squad_Master'!G7", "='02_Squad_Master'!N7", "='02_Squad_Master'!O7", "='02_Squad_Master'!U7"],
      ["='02_Squad_Master'!A8", "='02_Squad_Master'!B8", "='02_Squad_Master'!C8", "='02_Squad_Master'!D8", "='02_Squad_Master'!G8", "='02_Squad_Master'!N8", "='02_Squad_Master'!O8", "='02_Squad_Master'!U8"],
      ["='02_Squad_Master'!A9", "='02_Squad_Master'!B9", "='02_Squad_Master'!C9", "='02_Squad_Master'!D9", "='02_Squad_Master'!G9", "='02_Squad_Master'!N9", "='02_Squad_Master'!O9", "='02_Squad_Master'!U9"]
    ];
    sheet.getRange(11, 1, spotlightRows.length, headers.length).setValues(spotlightRows);

    for (let c = 1; c <= headers.length; c++) {
      sheet.setColumnWidth(c, 130);
    }
  },

  // 2. SQUAD MASTER TAB (14 Real Players)
  buildSquadTab: function(sheet) {
    sheet.getRange('A1:V1').merge()
      .setValue('🏏 02_SQUAD_MASTER - COMPLETE ROSTER & BT MEMBERSHIP ANALYTICS (SOMNATH SUPER DEVS)')
      .setBackground(this.PALETTE.HEADER_BG)
      .setFontColor(this.PALETTE.HEADER_TEXT)
      .setFontSize(13)
      .setFontWeight('bold')
      .setFontFamily(CONFIG.FONT_FAMILY)
      .setHorizontalAlignment('center');
    sheet.setRowHeight(1, 40);

    const headers = [
      'Player ID', 'Player Name', 'Age', 'Wage (£)', 'Hand', 'Bowling Type',
      'Batting', 'Bowling', 'Keeping', 'Fielding', 'Consistency', 'Concentration',
      'Stamina', 'Form', 'Fatigue', 'Leadership', 'Experience', 'BTI',
      'Est Subskill', 'Active Net', 'Market Value (£)', 'Tactical Role'
    ];

    sheet.getRange(3, 1, 1, headers.length).setValues([headers])
      .setBackground(this.PALETTE.SUBHEADER_BG)
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setFontFamily(CONFIG.FONT_FAMILY)
      .setHorizontalAlignment('center');
    sheet.setRowHeight(3, 34);

    const realSquad = [
      ['BT-6099459', 'Arjun Ashraf', 21, 284, 'LHB', 'L FM', 'abysmal', 'woeful', 'feeble', 'mediocre', 'abysmal', 'mediocre', 'feeble', 'abysmal', 'sublime', 'respectable', 'abysmal', 2664, '6.2', 'None', 164240, 'Squad Player'],
      ['BT-6099472', 'Issa Baboor', 26, 546, 'RHB', 'R F', 'competent', 'woeful', 'abysmal', 'mediocre', 'woeful', 'competent', 'competent', 'strong', 'sublime', 'respectable', 'feeble', 7440, '6.2', 'None', 396900, 'Middle-Order Batter'],
      ['BT-6099468', 'Kamadev Battasi', 25, 543, 'RHB', 'R H finger spin', 'feeble', 'competent', 'feeble', 'woeful', 'competent', 'woeful', 'competent', 'respectable', 'sublime', 'abysmal', 'woeful', 6665, '6.2', 'None', 369025, 'Lead Finger Spinner'],
      ['BT-6099466', 'Bhadraksh Hemalatha', 17, 545, 'RHB', 'R H finger spin', 'abysmal', 'competent', 'feeble', 'abysmal', 'competent', 'feeble', 'competent', 'superb', 'sublime', 'feeble', 'abysmal', 6989, '6.7', 'Bowling (1)', 685557, 'Lead Finger Spinner (Wonderkid)'],
      ['BT-6099470', 'Kamal Hydrose', 25, 538, 'LHB', 'L M', 'woeful', 'competent', 'woeful', 'woeful', 'competent', 'abysmal', 'competent', 'superb', 'sublime', 'woeful', 'feeble', 6085, '6.2', 'None', 347475, 'Opening Bowler'],
      ['BT-6099461', 'Lalit Kadam', 23, 369, 'RHB', 'R FM', 'mediocre', 'woeful', 'woeful', 'feeble', 'woeful', 'feeble', 'abysmal', 'woeful', 'sublime', 'abysmal', 'worthless', 2206, '6.2', 'Stamina (1)', 169460, 'Squad Player'],
      ['BT-6099475', 'Achintya Kharge', 26, 553, 'RHB', 'R M', 'competent', 'woeful', 'woeful', 'competent', 'woeful', 'competent', 'competent', 'superb', 'sublime', 'competent', 'mediocre', 8436, '6.2', 'Fielding (1)', 433510, 'Middle-Order Batter (C)'],
      ['BT-6099473', 'Vasant Malla', 28, 544, 'LHB', 'L FM', 'competent', 'feeble', 'woeful', 'mediocre', 'abysmal', 'competent', 'competent', 'superb', 'sublime', 'competent', 'feeble', 7468, '6.2', 'None', 397380, 'Middle-Order Batter'],
      ['BT-6099476', 'Ankur Palanisamy', 27, 510, 'RHB', 'R H finger spin', 'mediocre', 'woeful', 'competent', 'feeble', 'mediocre', 'woeful', 'competent', 'woeful', 'sublime', 'proficient', 'abysmal', 5601, '6.2', 'Wicket Keeping (1)', 323535, 'Primary Wicketkeeper'],
      ['BT-6099471', 'Nandakishor Ramdhyani', 17, 559, 'LHB', 'L M', 'competent', 'mediocre', 'woeful', 'woeful', 'feeble', 'competent', 'competent', 'mediocre', 'sublime', 'competent', 'abysmal', 6360, '6.7', 'Batting (1)', 652230, 'Young Top-Order Batter (Wonderkid)'],
      ['BT-6099469', 'Purumitra Rishi', 29, 549, 'RHB', 'R M', 'feeble', 'competent', 'woeful', 'woeful', 'competent', 'feeble', 'competent', 'superb', 'sublime', 'feeble', 'abysmal', 7286, '6.2', 'None', 392260, 'Opening Bowler'],
      ['BT-6099474', 'Viplav Sinduvalli', 25, 544, 'LHB', 'L M', 'competent', 'woeful', 'feeble', 'abysmal', 'feeble', 'competent', 'competent', 'superb', 'sublime', 'competent', 'mediocre', 7031, '6.2', 'None', 382085, 'Middle-Order Batter'],
      ['BT-6099467', 'Arvind Somal', 27, 552, 'LHB', 'L M', 'woeful', 'competent', 'feeble', 'woeful', 'competent', 'feeble', 'competent', 'proficient', 'energetic', 'respectable', 'abysmal', 6775, '6.2', 'None', 375125, 'Opening Bowler'],
      ['BT-6099462', 'Atulya Surya Teja', 24, 398, 'RHB', 'R M', 'mediocre', 'woeful', 'mediocre', 'woeful', 'feeble', 'woeful', 'woeful', 'worthless', 'sublime', 'woeful', 'abysmal', 2813, '6.2', 'None', 197955, 'Squad Player']
    ];

    sheet.getRange(4, 1, realSquad.length, headers.length).setValues(realSquad);

    for (let r = 4; r < 4 + realSquad.length; r++) {
      const bg = (r % 2 === 0) ? this.PALETTE.ZEBRA_LIGHT : '#ffffff';
      sheet.getRange(r, 1, 1, headers.length).setBackground(bg);
    }

    sheet.getRange(4, 4, 30, 1).setNumberFormat('£#,##0');
    sheet.getRange(4, 18, 30, 1).setNumberFormat('#,##0');
    sheet.getRange(4, 21, 30, 1).setNumberFormat('£#,##0');

    for (let c = 1; c <= headers.length; c++) {
      sheet.setColumnWidth(c, Math.max(105, sheet.getColumnWidth(c)));
    }
    sheet.setColumnWidth(2, 180);
  },

  // 3. TRAINING TRACKER TAB
  buildTrainingTab: function(sheet) {
    sheet.getRange('A1:J1').merge()
      .setValue('📈 03_TRAINING_TRACKER - WEEKLY SKILL POPS & SUBSKILL PREDICTIONS')
      .setBackground(this.PALETTE.HEADER_BG)
      .setFontColor(this.PALETTE.HEADER_TEXT)
      .setFontSize(13)
      .setFontWeight('bold')
      .setFontFamily(CONFIG.FONT_FAMILY)
      .setHorizontalAlignment('center');

    const headers = [
      'Log Date', 'Player ID', 'Player Name', 'Skill Trained', 'Previous Level',
      'New Level (POP!)', 'Estimated Subskill', 'Weeks Taken', 'Coach Quality', 'Pop Confirmed'
    ];

    sheet.getRange(3, 1, 1, headers.length).setValues([headers])
      .setBackground(this.PALETTE.SUBHEADER_BG)
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setFontFamily(CONFIG.FONT_FAMILY)
      .setHorizontalAlignment('center');

    const realPops = [
      ['2026-11-13', 'BT-6099466', 'Bhadraksh Hemalatha', 'Bowling', 'Mediocre', 'Competent', '6.05', 7, 'Competent', 'YES'],
      ['2026-11-06', 'BT-6099471', 'Nandakishor Ramdhyani', 'Batting', 'Mediocre', 'Competent', '6.08', 8, 'Competent', 'YES']
    ];
    sheet.getRange(4, 1, realPops.length, headers.length).setValues(realPops);

    for (let c = 1; c <= headers.length; c++) {
      sheet.setColumnWidth(c, 135);
    }
  },

  // 4. NETS MATRIX TAB (10 Nets Total)
  buildNetsTab: function(sheet) {
    sheet.getRange('A1:G1').merge()
      .setValue('🎯 04_NETS_MATRIX - WEEKLY NET ALLOCATION (10 NETS TOTAL)')
      .setBackground(this.PALETTE.HEADER_BG)
      .setFontColor(this.PALETTE.HEADER_TEXT)
      .setFontSize(13)
      .setFontWeight('bold')
      .setFontFamily(CONFIG.FONT_FAMILY)
      .setHorizontalAlignment('center');

    const headers = ['Net #', 'Training Type', 'Primary Trainee ID', 'Player Name', 'Coach Multiplier', 'Pops Estimated In (Wks)', 'Notes'];
    sheet.getRange(3, 1, 1, headers.length).setValues([headers])
      .setBackground(this.PALETTE.SUBHEADER_BG)
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setFontFamily(CONFIG.FONT_FAMILY)
      .setHorizontalAlignment('center');

    const nets = [
      [1, 'Bowling', 'BT-6099466', 'Bhadraksh Hemalatha (17yo)', '1.00x (Competent Coach)', 7, 'Primary finger spin wonderkid progression'],
      [2, 'Batting', 'BT-6099471', 'Nandakishor Ramdhyani (17yo)', '1.00x (Competent Coach)', 7, 'Primary top-order youth batter development'],
      [3, 'Fielding', 'BT-6099475', 'Achintya Kharge', '1.00x (Competent Coach)', 5, 'Captain middle-order fielding boost'],
      [4, 'Wicket Keeping', 'BT-6099476', 'Ankur Palanisamy', '1.00x (Competent Coach)', 8, 'Primary keeper glovework'],
      [5, 'Fitness / Stamina', 'BT-6099461', 'Lalit Kadam', '1.00x', 4, 'Squad player stamina recovery'],
      [6, 'Open / Available', '-', 'Unassigned', '-', '-', 'Ready for next youth pull'],
      [7, 'Open / Available', '-', 'Unassigned', '-', '-', 'Ready for squad rotation'],
      [8, 'Open / Available', '-', 'Unassigned', '-', '-', 'Available net'],
      [9, 'Open / Available', '-', 'Unassigned', '-', '-', 'Available net'],
      [10, 'Open / Available', '-', 'Unassigned', '-', '-', 'Available net']
    ];
    sheet.getRange(4, 1, nets.length, headers.length).setValues(nets);

    for (let c = 1; c <= headers.length; c++) {
      sheet.setColumnWidth(c, 155);
    }
  },

  // 5. MATCH ARCHIVES TAB
  buildMatchesTab: function(sheet) {
    sheet.getRange('A1:G1').merge()
      .setValue('📅 05_MATCH_ARCHIVES - FIXTURES, RESULTS & MATCH RATINGS (SOMNATH SUPER DEVS)')
      .setBackground(this.PALETTE.HEADER_BG)
      .setFontColor(this.PALETTE.HEADER_TEXT)
      .setFontSize(13)
      .setFontWeight('bold')
      .setFontFamily(CONFIG.FONT_FAMILY)
      .setHorizontalAlignment('center');

    const headers = ['Match ID', 'Date', 'Type (FC/OD/T20)', 'Opponent Club', 'Venue', 'Pitch Type', 'Result'];
    sheet.getRange(3, 1, 1, headers.length).setValues([headers])
      .setBackground(this.PALETTE.SUBHEADER_BG)
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setFontFamily(CONFIG.FONT_FAMILY)
      .setHorizontalAlignment('center');

    const realMatches = [
      ['M-32217484', '2026-11-14', 'First Class', 'Diu CC', 'Home (Prabhas Coastal Oval)', 'Hard', 'WON (Somnath 312 & 142/2 beat Diu CC 210 & 240 by 8 wkts)'],
      ['M-32485077', '2026-11-16', 'One Day', 'Moyale Mean Green', 'Away', 'Green', 'WON (Somnath 248/6 beat Moyale 245 by 4 wkts)'],
      ['M-32232666', '2026-11-11', 'First Class', 'Whykickamoocows', 'Away', 'Dusty', 'DRAW (Somnath 380 & 195/4 dec vs 288 & 160/7)'],
      ['M-32190812', '2026-11-09', 'BT20', 'Nagapatnam CC', 'Home (Prabhas Coastal Oval)', 'Flat', 'WON (Somnath 176/4 beat Nagapatnam 142/9 by 34 runs)'],
      ['M-32510940', '2026-11-24', 'First Class', 'Pitch Punishers', 'Away', 'Hard', 'Upcoming Fixture (FC Friendly)']
    ];
    sheet.getRange(4, 1, realMatches.length, headers.length).setValues(realMatches);
    for (let c = 1; c <= headers.length; c++) sheet.setColumnWidth(c, 140);
  },

  // 6. LINEUP & TACTICS TAB
  buildTacticsTab: function(sheet) {
    sheet.getRange('A1:G1').merge()
      .setValue('⚔️ 06_LINEUP_TACTICS - MATCH ORDERS & PITCH SYNERGY ENGINE')
      .setBackground(this.PALETTE.HEADER_BG)
      .setFontColor(this.PALETTE.HEADER_TEXT)
      .setFontSize(13)
      .setFontWeight('bold')
      .setFontFamily(CONFIG.FONT_FAMILY)
      .setHorizontalAlignment('center');

    sheet.getRange('A2:G2').merge()
      .setValue('Current Selected Pitch: HARD | Predicted Bounce: High | Seam Advantage: +25% | Spin Assistance: Low')
      .setBackground('#f1f5f9')
      .setFontColor('#0f172a')
      .setFontWeight('bold')
      .setFontFamily(CONFIG.FONT_FAMILY);

    const headers = ['Batting #', 'Player ID', 'Player Name', 'Role', 'Aggression Level', 'Bowling Order', 'Max Overs'];
    sheet.getRange(3, 1, 1, headers.length).setValues([headers])
      .setBackground(this.PALETTE.SUBHEADER_BG)
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setFontFamily(CONFIG.FONT_FAMILY)
      .setHorizontalAlignment('center');

    const lineup = [
      [1, 'BT-6099471', 'Nandakishor Ramdhyani', 'Young Opening Batter (LHB)', 'Attacking', '-', '-'],
      [2, 'BT-6099472', 'Issa Baboor', 'Middle-Order Batter (RHB)', 'Moderate', '-', '-'],
      [3, 'BT-6099475', 'Achintya Kharge', 'Captain & Anchor (RHB)', 'Moderate', '4th Change (RM)', 4],
      [4, 'BT-6099473', 'Vasant Malla', 'Middle-Order Batter (LHB)', 'Attacking', '-', '-'],
      [5, 'BT-6099474', 'Viplav Sinduvalli', 'Middle-Order Batter (LHB)', 'Attacking', '-', '-'],
      [6, 'BT-6099476', 'Ankur Palanisamy', 'Primary Wicketkeeper (RHB)', 'Moderate', '-', '-'],
      [7, 'BT-6099467', 'Arvind Somal', 'All-Rounder (LHB / LM)', 'Defensive', '2nd Bowler', 10],
      [8, 'BT-6099468', 'Kamadev Battasi', 'Lead Finger Spinner (RHB)', 'Moderate', '3rd Bowler', 10],
      [9, 'BT-6099466', 'Bhadraksh Hemalatha', 'Strike Finger Spinner (RHB)', 'Attacking', '1st Change', 10],
      [10, 'BT-6099470', 'Kamal Hydrose', 'Opening Bowler (LHB / LM)', 'Defensive', '1st Bowler', 10],
      [11, 'BT-6099469', 'Purumitra Rishi', 'Opening Strike Seamer (RHB / RM)', 'Attacking', '2nd Bowler', 10]
    ];
    sheet.getRange(4, 1, lineup.length, headers.length).setValues(lineup);
    for (let c = 1; c <= headers.length; c++) sheet.setColumnWidth(c, 140);
  },

  // 7. FINANCIAL LEDGER TAB
  buildFinancesTab: function(sheet) {
    sheet.getRange('A1:N1').merge()
      .setValue('💰 07_FINANCIAL_LEDGER - 52-WEEK CASHFLOW, WAGES & REVENUE PROJECTIONS')
      .setBackground(this.PALETTE.HEADER_BG)
      .setFontColor(this.PALETTE.HEADER_TEXT)
      .setFontSize(13)
      .setFontWeight('bold')
      .setFontFamily(CONFIG.FONT_FAMILY)
      .setHorizontalAlignment('center');

    const headers = [
      'Week #', 'Date', 'Gate Receipts (£)', 'Sponsors (£)', 'Merchandise (£)',
      'Prize Money (£)', 'Total Inflow (£)', 'Player Wages (£)', 'Staff Wages (£)',
      'Stadium Upkeep (£)', 'Youth Academy (£)', 'Total Outflow (£)', 'Net Weekly P&L (£)',
      'Cumulative Bank Balance (£)'
    ];
    sheet.getRange(3, 1, 1, headers.length).setValues([headers])
      .setBackground(this.PALETTE.SUBHEADER_BG)
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setFontFamily(CONFIG.FONT_FAMILY)
      .setHorizontalAlignment('center');

    const initialFinanceRow = [
      1, '2026-11-18', 126546, 22823, 15128, 33114, '=SUM(C4:F4)', 7034, 12250, 14702, 0, '=SUM(H4:K4)', '=G4-L4', 1320573
    ];
    sheet.getRange(4, 1, 1, headers.length).setValues([initialFinanceRow]);

    sheet.getRange(4, 3, 50, headers.length - 2).setNumberFormat('£#,##0');
    for (let c = 1; c <= headers.length; c++) sheet.setColumnWidth(c, 130);
  },

  // 8. STADIUM PLANNER TAB (Prabhas Coastal Oval - 10,000 Capacity)
  buildStadiumTab: function(sheet) {
    sheet.getRange('A1:H1').merge()
      .setValue('🏟️ 08_STADIUM_PLANNER - PRABHAS COASTAL OVAL (10,000 CAPACITY) OPTIMIZATION')
      .setBackground(this.PALETTE.HEADER_BG)
      .setFontColor(this.PALETTE.HEADER_TEXT)
      .setFontSize(13)
      .setFontWeight('bold')
      .setFontFamily(CONFIG.FONT_FAMILY)
      .setHorizontalAlignment('center');

    const headers = [
      'Seating Tier', 'Current Seats', 'Optimal Ratio', 'Recommended Seats',
      'Ticket Price (£)', 'Max Weekly Gate (£)', 'Expansion Cost / Seat (£)', 'Total Upgrade Cost (£)'
    ];
    sheet.getRange(3, 1, 1, headers.length).setValues([headers])
      .setBackground(this.PALETTE.SUBHEADER_BG)
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setFontFamily(CONFIG.FONT_FAMILY)
      .setHorizontalAlignment('center');

    const tiers = [
      ['Standing Room', 5275, '68%', 10200, 5, '=D4*E4', 35, '=(D4-B4)*G4'],
      ['Uncovered Seats', 3270, '23%', 3450, 8, '=D5*E5', 60, '=(D5-B5)*G5'],
      ['Covered Seats', 1100, '7%', 1050, 15, '=D6*E6', 100, '=(D6-B6)*G6'],
      ['Members Enclosure (BT+)', 355, '2%', 300, 35, '=D7*E7', 220, '=(D7-B7)*G7'],
      ['TOTAL CAPACITY', '=SUM(B4:B7)', '100%', '=SUM(D4:D7)', '-', '=SUM(F4:F7)', '-', '=SUM(H4:H7)']
    ];
    sheet.getRange(4, 1, tiers.length, headers.length).setValues(tiers);
    sheet.getRange(8, 1, 1, headers.length).setFontWeight('bold').setBackground('#f1f5f9');

    sheet.getRange(4, 5, 5, 4).setNumberFormat('£#,##0');
    for (let c = 1; c <= headers.length; c++) sheet.setColumnWidth(c, 150);
  },

  // 9. SCOUT & TRANSFER TAB
  buildScoutsTab: function(sheet) {
    sheet.getRange('A1:I1').merge()
      .setValue('🔍 09_SCOUT_TRANSFER - TRANSFER MARKET RADAR & TARGET SHORTLIST')
      .setBackground(this.PALETTE.HEADER_BG)
      .setFontColor(this.PALETTE.HEADER_TEXT)
      .setFontSize(13)
      .setFontWeight('bold')
      .setFontFamily(CONFIG.FONT_FAMILY)
      .setHorizontalAlignment('center');

    const headers = [
      'Player ID', 'Name', 'Age', 'Primary Skill', 'Secondary Focus',
      'Stamina', 'Wage (£)', 'Current Bid (£)', 'Fair Valuation (£)'
    ];
    sheet.getRange(3, 1, 1, headers.length).setValues([headers])
      .setBackground(this.PALETTE.SUBHEADER_BG)
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setFontFamily(CONFIG.FONT_FAMILY)
      .setHorizontalAlignment('center');

    const realTargets = [
      ['BT-6102144', 'Tapan Chander', 18, 'Strong (8)', 'Competent (6)', 'Competent (6)', 640, 45000, 75000],
      ['BT-6088219', 'Hariprasad Nair', 19, 'Proficient (7)', 'Respectable (6)', 'Respectable (6)', 720, 60000, 85000],
      ['BT-6045192', 'Eswar Venkatesh', 24, 'Strong (8)', 'Mediocre (5)', 'Competent (6)', 950, 110000, 95000],
      ['BT-6110984', 'Gautam Shenoy', 17, 'Respectable (6)', 'Competent (6)', 'Strong (8)', 580, 38000, 65000]
    ];
    sheet.getRange(4, 1, realTargets.length, headers.length).setValues(realTargets);
    sheet.getRange(4, 7, realTargets.length, 3).setNumberFormat('£#,##0');
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
      .setFontFamily(CONFIG.FONT_FAMILY)
      .setHorizontalAlignment('center');

    const configRows = [
      ['Setting Key', 'Value', 'Description', 'Status'],
      ['Club ID', '13108', 'Somnath Super Devs Identifier', 'CONNECTED'],
      ['Script ID', CONFIG.SCRIPT_ID, 'Apps Script Engine Identifier', 'DEPLOYED'],
      ['Sheet ID', CONFIG.SHEET_ID, 'Master Database Spreadsheet', 'INITIALIZED'],
      ['Font Family', CONFIG.FONT_FAMILY, 'Design System Standard', 'APPLIED'],
      ['Calendar Auto-Sync', 'TRUE', 'Sync matchdays every Monday', 'ACTIVE'],
      ['Drive Auto-Backup', 'TRUE', 'Weekly JSON backup to Google Drive', 'ACTIVE'],
      ['Gmail Auto-Digest', 'TRUE', 'Dispatches weekly executive digest', 'ACTIVE']
    ];
    sheet.getRange(3, 1, configRows.length, 4).setValues(configRows);
    sheet.getRange(3, 1, 1, 4).setBackground(this.PALETTE.SUBHEADER_BG).setFontColor('#ffffff').setFontWeight('bold');
    for (let c = 1; c <= 4; c++) sheet.setColumnWidth(c, 180);
  }
};
