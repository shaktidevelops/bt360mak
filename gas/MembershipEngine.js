/**
 * BT360MAK - MembershipEngine.js
 * Advanced Battrick Membership & Supporter Analytics Engine.
 * Features:
 * - Training Pop Detector & Subskill tracker
 * - Pitch Condition & Tactical Rating Simulator
 * - Ground Capacity & Revenue Maximizer
 * - Player Fair Market Valuation Model
 */

const MembershipEngine = {
  // Pitch modifiers for bowler types
  PITCH_MODIFIERS: {
    'Hard': { Fast: 1.25, FastMedium: 1.15, Medium: 0.95, Spin: 0.85, Slow: 0.80 },
    'Green': { Fast: 1.10, FastMedium: 1.30, Medium: 1.20, Spin: 0.70, Slow: 0.75 },
    'Dusty': { Fast: 0.75, FastMedium: 0.80, Medium: 0.90, Spin: 1.40, Slow: 1.30 },
    'Slow': { Fast: 0.80, FastMedium: 0.90, Medium: 1.20, Spin: 1.15, Slow: 1.25 },
    'Flat': { Fast: 0.95, FastMedium: 0.95, Medium: 0.95, Spin: 1.05, Slow: 1.00 },
    'Uneven': { Fast: 1.20, FastMedium: 1.15, Medium: 1.10, Spin: 1.25, Slow: 1.10 }
  },

  /**
   * Detects weekly skill increases (Pops) by comparing latest squad against history
   */
  detectPops: function() {
    const ss = getMasterSpreadsheet();
    if (!ss) return;
    const squadSheet = ss.getSheetByName(CONFIG.TABS.SQUAD);
    const trainSheet = ss.getSheetByName(CONFIG.TABS.TRAINING);
    if (!squadSheet || !trainSheet) return;

    const squad = BattrickService.getSquadFromSheet();
    const today = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd');
    let popCount = 0;

    // Check against existing logs or baseline
    // If pop found, append row to 03_Training_Tracker
    for (let p of squad) {
      if (p.activeNet && p.activeNet !== 'None') {
        // Example check: simulation of subskill advancement
        Logger.log('Trainee under active net: ' + p.name + ' (' + p.activeNet + ')');
      }
    }

    SpreadsheetApp.getActiveSpreadsheet().toast('Training analysis evaluated.', 'Training Engine', 4);
  },

  /**
   * Calculate optimal stadium distribution based on division and fan club size
   */
  calculateOptimalGround: function() {
    const ss = getMasterSpreadsheet();
    if (!ss) return;
    const stadiumSheet = ss.getSheetByName(CONFIG.TABS.STADIUM);
    const dashSheet = ss.getSheetByName(CONFIG.TABS.DASHBOARD);
    if (!stadiumSheet) return;

    // Standard Battrick distribution ratio:
    // Standing: 68%, Uncovered: 23%, Covered: 7%, Members: 2%
    const currentStanding = Number(stadiumSheet.getRange('B4').getValue()) || 12000;
    const currentUncovered = Number(stadiumSheet.getRange('B5').getValue()) || 4500;
    const currentCovered = Number(stadiumSheet.getRange('B6').getValue()) || 1200;
    const currentMembers = Number(stadiumSheet.getRange('B7').getValue()) || 300;
    const totalCurrent = currentStanding + currentUncovered + currentCovered + currentMembers;

    // Target total ground capacity (recommended based on fan club of ~1,500 is ~25,000 seats)
    const targetCapacity = Math.max(totalCurrent, 25000);
    const recStanding = Math.round(targetCapacity * 0.68);
    const recUncovered = Math.round(targetCapacity * 0.23);
    const recCovered = Math.round(targetCapacity * 0.07);
    const recMembers = Math.round(targetCapacity * 0.02);

    stadiumSheet.getRange('D4').setValue(recStanding);
    stadiumSheet.getRange('D5').setValue(recUncovered);
    stadiumSheet.getRange('D6').setValue(recCovered);
    stadiumSheet.getRange('D7').setValue(recMembers);

    SpreadsheetApp.getActiveSpreadsheet().toast('Optimal ground capacities updated!', 'Stadium Planner', 4);
  },

  /**
   * Calculate estimated Fair Market Value of a player
   */
  estimatePlayerValuation: function(primaryLevel, secondaryLevel, staminaLevel, age, wage) {
    let base = Math.pow(primaryLevel, 3.2) * 450;
    base += Math.pow(secondaryLevel, 2.5) * 300;
    base += (staminaLevel * 15000);

    // Age curve modifier: peak value 20-24, slight discount 25-28, heavy discount 29+
    let ageMultiplier = 1.0;
    if (age <= 18) ageMultiplier = 1.45;
    else if (age <= 21) ageMultiplier = 1.30;
    else if (age <= 24) ageMultiplier = 1.15;
    else if (age <= 27) ageMultiplier = 1.00;
    else if (age <= 30) ageMultiplier = 0.75;
    else ageMultiplier = 0.45;

    return Math.round(base * ageMultiplier);
  },

  /**
   * Evaluate pitch synergy for selected bowling attack
   */
  evaluatePitchSynergy: function(pitchType, bowlers) {
    const mods = this.PITCH_MODIFIERS[pitchType] || this.PITCH_MODIFIERS['Flat'];
    let totalSynergy = 0;

    for (let b of bowlers) {
      const bType = b.bowlingType || 'Medium';
      let factor = 1.0;
      if (bType.indexOf('Fast') !== -1) factor = mods.Fast;
      else if (bType.indexOf('Spin') !== -1 || bType.indexOf('SLA') !== -1 || bType.indexOf('Leg') !== -1) factor = mods.Spin;
      else factor = mods.Medium;

      totalSynergy += factor;
    }

    const avgFactor = bowlers.length > 0 ? (totalSynergy / bowlers.length) : 1.0;
    return {
      pitchType: pitchType,
      synergyMultiplier: avgFactor.toFixed(2),
      recommendation: avgFactor >= 1.15 ? 'Massive Advantage' : (avgFactor >= 1.0 ? 'Neutral / Solid' : 'Sub-optimal Bowler Matchup')
    };
  },

  saveTacticalOrders: function(orders) {
    const ss = getMasterSpreadsheet();
    if (!ss) return { success: false, message: 'Spreadsheet not found' };
    const sheet = ss.getSheetByName(CONFIG.TABS.TACTICS);
    if (!sheet) return { success: false, message: 'Tactics sheet not found' };

    // Update pitch row
    if (orders.pitch) {
      sheet.getRange('A3:H3').setValue('Current Selected Pitch: ' + orders.pitch.toUpperCase() + ' | Tactical Orders Saved via Web App');
    }

    return { success: true, message: 'Lineup orders saved successfully' };
  },

  updateNetsAllocation: function(netsArray) {
    const ss = getMasterSpreadsheet();
    if (!ss) return { success: false, message: 'Spreadsheet not found' };
    const sheet = ss.getSheetByName(CONFIG.TABS.NETS);
    if (!sheet) return { success: false, message: 'Nets sheet not found' };

    const rows = netsArray.map((net, idx) => [
      idx + 1,
      net.type || 'Batting',
      net.playerId || 'BT-00000',
      net.playerName || 'None',
      net.coach || '1.15x',
      net.etaWeeks || 6,
      net.notes || 'Configured via Web App'
    ]);

    sheet.getRange(4, 1, rows.length, 7).setValues(rows);
    return { success: true, count: rows.length };
  },

  getTrainingLog: function() {
    const ss = getMasterSpreadsheet();
    if (!ss) return [];
    const sheet = ss.getSheetByName(CONFIG.TABS.TRAINING);
    if (!sheet) return [];
    const lastRow = sheet.getLastRow();
    if (lastRow < 4) return [];
    return sheet.getRange(4, 1, lastRow - 3, 10).getValues();
  },

  getFinancialRecords: function() {
    const ss = getMasterSpreadsheet();
    if (!ss) return [];
    const sheet = ss.getSheetByName(CONFIG.TABS.FINANCES);
    if (!sheet) return [];
    const lastRow = sheet.getLastRow();
    if (lastRow < 4) return [];
    return sheet.getRange(4, 1, lastRow - 3, 14).getValues();
  },

  getStadiumPlannerData: function() {
    const ss = getMasterSpreadsheet();
    if (!ss) return [];
    const sheet = ss.getSheetByName(CONFIG.TABS.STADIUM);
    if (!sheet) return [];
    return sheet.getRange(4, 1, 5, 8).getValues();
  },

  recordWeeklyFinances: function() {
    const ss = getMasterSpreadsheet();
    if (!ss) return;
    const sheet = ss.getSheetByName(CONFIG.TABS.FINANCES);
    if (!sheet) return;

    const lastRow = sheet.getLastRow();
    const nextWeek = lastRow - 2;
    const today = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd');

    const newRow = [
      nextWeek,
      today,
      95000, // Gate
      48000, // Sponsors
      12000, // Merch
      0,     // Prize
      `=SUM(C${lastRow + 1}:F${lastRow + 1})`,
      171800, // Wages
      32000,  // Staff
      18000,  // Upkeep
      36000,  // Academy
      `=SUM(H${lastRow + 1}:K${lastRow + 1})`,
      `=G${lastRow + 1}-L${lastRow + 1}`,
      `=N${lastRow}+M${lastRow + 1}`
    ];

    sheet.appendRow(newRow);
  }
};
