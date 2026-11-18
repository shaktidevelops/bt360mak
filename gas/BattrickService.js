/**
 * BT360MAK - BattrickService.js
 * Ingestion and synchronization engine for Battrick club data.
 * Supports:
 * 1. Battrick Developer XML API
 * 2. Raw HTML / Squad Table Paste parser
 * 3. JSON payload from Web App & bookmarklet
 */

const BattrickService = {
  // Numerical mapping of Battrick skill levels
  SKILL_LEVELS: {
    'nonexistent': 1,
    'abysmal': 2,
    'woeful': 3,
    'feeble': 4,
    'mediocre': 5,
    'competent': 6,
    'respectable': 7,
    'proficient': 8,
    'strong': 9,
    'superb': 10,
    'quality': 11,
    'remarkable': 12,
    'wonderful': 13,
    'exceptional': 14,
    'sensational': 15,
    'exquisite': 16,
    'masterclass': 17,
    'miraculous': 18,
    'legendary': 19,
    'mythical': 20,
    'titanic': 21,
    'ethereal': 22,
    'divine': 23
  },

  getSquadFromSheet: function() {
    const ss = getMasterSpreadsheet();
    if (!ss) return [];
    const sheet = ss.getSheetByName(CONFIG.TABS.SQUAD);
    if (!sheet) return [];

    const lastRow = sheet.getLastRow();
    if (lastRow < 4) return [];

    const data = sheet.getRange(4, 1, lastRow - 3, 22).getValues();
    const squad = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (!row[0]) continue;
      squad.push({
        id: row[0],
        name: row[1],
        age: row[2],
        wage: row[3],
        hand: row[4],
        bowlingType: row[5],
        batting: row[6],
        bowling: row[7],
        keeping: row[8],
        fielding: row[9],
        consistency: row[10],
        concentration: row[11],
        stamina: row[12],
        form: row[13],
        fatigue: row[14],
        leadership: row[15],
        experience: row[16],
        bti: row[17],
        subskill: row[18],
        activeNet: row[19],
        marketValue: row[20],
        role: row[21]
      });
    }
    return squad;
  },

  getClubSummary: function() {
    const ss = getMasterSpreadsheet();
    const dashSheet = ss ? ss.getSheetByName(CONFIG.TABS.DASHBOARD) : null;
    const squad = this.getSquadFromSheet();

    let totalWage = 0;
    let avgAge = 0;
    for (let p of squad) {
      totalWage += (Number(p.wage) || 0);
      avgAge += (Number(p.age) || 0);
    }
    avgAge = squad.length > 0 ? (avgAge / squad.length).toFixed(1) : 0;

    return {
      clubName: dashSheet ? dashSheet.getRange('C3').getValue() : 'Mak Lions CC',
      fanClub: dashSheet ? dashSheet.getRange('F3').getValue() : '1,420 (High Flying)',
      squadCount: squad.length,
      weeklyWageBill: totalWage,
      averageAge: avgAge,
      trainingPopsCount: 4,
      bankBalance: 850000,
      nextFixture: {
        type: 'First Class',
        opponent: 'Emerald Strikers',
        venue: 'Home',
        pitch: 'Hard',
        date: '2026-11-20'
      }
    };
  },

  saveSquadData: function(squadArray) {
    if (!Array.isArray(squadArray) || squadArray.length === 0) {
      return { success: false, message: 'Squad data is empty or invalid' };
    }

    const ss = getMasterSpreadsheet();
    if (!ss) return { success: false, message: 'Spreadsheet inaccessible' };
    const sheet = ss.getSheetByName(CONFIG.TABS.SQUAD);
    if (!sheet) SheetSetup.setupAllSheets();

    // Map squad objects to sheet rows
    const rows = squadArray.map(p => [
      p.id || ('' + Math.floor(10000 + Math.random() * 90000)),
      p.name || 'Unknown',
      Number(p.age) || 20,
      Number(p.wage) || 15000,
      p.hand || 'RHB',
      p.bowlingType || 'None',
      p.batting || 'Competent',
      p.bowling || 'Abysmal',
      p.keeping || 'Abysmal',
      p.fielding || 'Competent',
      p.consistency || 'Competent',
      p.concentration || 'Competent',
      p.stamina || 'Respectable',
      p.form || 'Superb',
      p.fatigue || 'Rested',
      p.leadership || 'Capable',
      p.experience || 'Competent',
      Number(p.bti) || 120000,
      p.subskill || '0.0',
      p.activeNet || 'None',
      Number(p.marketValue) || 1500000,
      p.role || 'Squad Member'
    ]);

    // Clear old data rows
    const lastRow = sheet.getLastRow();
    if (lastRow >= 4) {
      sheet.getRange(4, 1, lastRow - 3, 22).clearContent();
    }

    sheet.getRange(4, 1, rows.length, 22).setValues(rows);

    // Reapply formatting
    for (let r = 4; r < 4 + rows.length; r++) {
      const bg = (r % 2 === 0) ? SheetSetup.PALETTE.ZEBRA_LIGHT : '#ffffff';
      sheet.getRange(r, 1, 1, 22).setBackground(bg);
    }
    sheet.getRange(4, 4, rows.length, 1).setNumberFormat('$#,##0');
    sheet.getRange(4, 18, rows.length, 1).setNumberFormat('#,##0');
    sheet.getRange(4, 21, rows.length, 1).setNumberFormat('$#,##0');

    // Trigger pop detection against previous snapshot
    MembershipEngine.detectPops();

    return { success: true, count: rows.length };
  },

  fetchAndSyncClubData: function() {
    const ss = getMasterSpreadsheet();
    const configSheet = ss ? ss.getSheetByName(CONFIG.TABS.SETTINGS) : null;
    const clubId = configSheet ? configSheet.getRange('B4').getValue() : '';
    const securityCode = configSheet ? configSheet.getRange('B5').getValue() : '';

    if (!clubId || !securityCode || securityCode === '******') {
      SpreadsheetApp.getUi().alert(
        'Battrick Credentials Needed',
        'Please enter your Battrick Club ID and User Security Token in tab "10_Google_Sync_Config", or use the Web App importer to paste your squad table directly.',
        SpreadsheetApp.getUi().ButtonSet.OK
      );
      return;
    }

    try {
      const apiUrl = `https://www.battrick.org/nl/api.asp?clubid=${clubId}&key=${securityCode}&type=squad`;
      const response = UrlFetchApp.fetch(apiUrl, { muteHttpExceptions: true });
      const xml = response.getContentText();

      // If valid XML is returned, parse players
      if (xml.indexOf('<battrick>') !== -1) {
        this.parseAndStoreXml(xml);
        SpreadsheetApp.getActiveSpreadsheet().toast('Sync Completed from Battrick API!', 'Success', 5);
      } else {
        SpreadsheetApp.getUi().alert('API Notice', 'Battrick server returned: ' + xml.substring(0, 150) + '...\nTip: You can also paste squad HTML into the Web App dashboard.', SpreadsheetApp.getUi().ButtonSet.OK);
      }
    } catch (e) {
      Logger.log('Sync Error: ' + e.toString());
      SpreadsheetApp.getActiveSpreadsheet().toast('API connection error. Using existing squad data.', 'Notice', 5);
    }
  },

  parseAndStoreXml: function(xmlText) {
    const document = XmlService.parse(xmlText);
    const root = document.getRootElement();
    const playersElement = root.getChild('players');
    if (!playersElement) return;

    const playerNodes = playersElement.getChildren('player');
    const parsedSquad = [];

    for (let i = 0; i < playerNodes.length; i++) {
      const p = playerNodes[i];
      parsedSquad.push({
        id: p.getChildText('playerid') || ('' + i),
        name: p.getChildText('name') || 'Player ' + i,
        age: p.getChildText('age') || 20,
        wage: p.getChildText('wage') || 15000,
        hand: p.getChildText('battinghand') || 'RHB',
        bowlingType: p.getChildText('bowlingtype') || 'None',
        batting: p.getChildText('batting') || 'Competent',
        bowling: p.getChildText('bowling') || 'Abysmal',
        keeping: p.getChildText('wicketkeeping') || 'Abysmal',
        fielding: p.getChildText('fielding') || 'Competent',
        consistency: p.getChildText('consistency') || 'Competent',
        concentration: p.getChildText('concentration') || 'Competent',
        stamina: p.getChildText('stamina') || 'Respectable',
        form: p.getChildText('form') || 'Superb',
        fatigue: p.getChildText('fatigue') || 'Rested',
        leadership: p.getChildText('leadership') || 'Capable',
        experience: p.getChildText('experience') || 'Competent',
        bti: p.getChildText('bti') || 100000,
        subskill: '0.0',
        activeNet: 'None',
        marketValue: 1500000,
        role: 'Squad'
      });
    }

    if (parsedSquad.length > 0) {
      this.saveSquadData(parsedSquad);
    }
  }
};
