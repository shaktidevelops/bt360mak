/**
 * BT360MAK - GoogleAppsConnector.js
 * Deep integration with the Google Workspace Ecosystem:
 * - Google Calendar: Match Fixtures, Training & Financial Reminders
 * - Google Drive: Automated JSON Snapshots & Data Backups
 * - Google Gmail: Match Alerts, Training Pop Digests & Low-Balance Warnings
 * - Google Docs: Executive Tactical & Season Review Document Generator
 */

const GoogleAppsConnector = {
  /**
   * Sync match fixtures to Google Calendar
   */
  syncCalendarEvents: function(fixturesArray) {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const configSheet = ss.getSheetByName(CONFIG.TABS.SETTINGS);
      const calendarId = configSheet ? configSheet.getRange('B6').getValue() : 'primary';
      const cal = CalendarApp.getCalendarById(calendarId) || CalendarApp.getDefaultCalendar();

      if (!cal) {
        return { success: false, message: 'Google Calendar not found' };
      }

      // If no custom array passed, read from 05_Match_Archives
      const matches = fixturesArray || this.getUpcomingMatchesFromSheet();
      let createdCount = 0;

      for (let m of matches) {
        const title = `🏏 Battrick [${m.type}]: ${m.venue === 'Home' ? 'Vs ' : '@ '} ${m.opponent}`;
        const matchDate = new Date(m.date);
        matchDate.setHours(14, 0, 0); // 2:00 PM standard fixture time
        const endDate = new Date(matchDate.getTime() + (m.type === 'T20' ? 3.5 : 7) * 3600 * 1000);

        const description = `Battrick Club Match\nOpponent: ${m.opponent}\nPitch: ${m.pitch || 'Hard'}\nVenue: ${m.venue}\nMatch ID: ${m.id || 'N/A'}\n\nManaged by BT360MAK`;

        // Check if event already exists to prevent duplicate creation
        const existing = cal.getEvents(matchDate, endDate, { search: m.opponent });
        if (existing.length === 0) {
          cal.createEvent(title, matchDate, endDate, {
            description: description,
            location: m.venue === 'Home' ? 'Our Home Ground' : 'Away Stadium'
          });
          createdCount++;
        }
      }

      // Also create weekly Friday Training recurring marker if not exists
      const fridays = cal.getEvents(new Date(), new Date(Date.now() + 7 * 86400000), { search: 'BT360MAK Training Update' });
      if (fridays.length === 0) {
        const nextFriday = new Date();
        nextFriday.setDate(nextFriday.getDate() + ((5 + 7 - nextFriday.getDay()) % 7));
        nextFriday.setHours(8, 0, 0);
        cal.createEvent('📈 BT360MAK: Friday Training Update & Pops', nextFriday, new Date(nextFriday.getTime() + 1800000), {
          description: 'Weekly Battrick training pops update and subskill check.'
        });
      }

      SpreadsheetApp.getActiveSpreadsheet().toast(`Synced ${createdCount} fixtures to Google Calendar!`, 'Google Calendar', 5);
      return { success: true, count: createdCount };
    } catch (e) {
      Logger.log('Calendar Sync Error: ' + e.toString());
      return { success: false, error: e.toString() };
    }
  },

  /**
   * Backup current squad and financial data to a timestamped JSON file in Google Drive
   */
  createDriveBackup: function() {
    try {
      const folderName = 'BT360MAK_Backups';
      const folders = DriveApp.getFoldersByName(folderName);
      let folder;

      if (folders.hasNext()) {
        folder = folders.next();
      } else {
        folder = DriveApp.createFolder(folderName);
      }

      const squad = BattrickService.getSquadFromSheet();
      const clubSummary = BattrickService.getClubSummary();
      const timestamp = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd_HH-mm-ss');

      const payload = {
        club: clubSummary,
        squad: squad,
        backupDate: timestamp,
        system: CONFIG.APP_NAME,
        version: CONFIG.VERSION
      };

      const fileName = `BT360MAK_Backup_${timestamp}.json`;
      const file = folder.createFile(fileName, JSON.stringify(payload, null, 2), MimeType.PLAIN_TEXT);

      SpreadsheetApp.getActiveSpreadsheet().toast(`Snapshot backed up to Google Drive: ${fileName}`, 'Google Drive', 5);
      return { success: true, fileUrl: file.getUrl(), fileName: fileName };
    } catch (e) {
      Logger.log('Drive Backup Error: ' + e.toString());
      return { success: false, error: e.toString() };
    }
  },

  /**
   * Send Weekly Digest Email via Gmail
   */
  sendWeeklyDigest: function() {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const configSheet = ss.getSheetByName(CONFIG.TABS.SETTINGS);
      const recipient = configSheet ? configSheet.getRange('B7').getValue() : Session.getActiveUser().getEmail();

      if (!recipient) return { success: false, message: 'No recipient email configured' };

      const club = BattrickService.getClubSummary();
      const squad = BattrickService.getSquadFromSheet();

      const htmlBody = `
        <div style="font-family:'Segoe UI',Roboto,sans-serif; max-width:620px; margin:0 auto; background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;">
          <div style="background:linear-gradient(135deg, #064e3b, #0f766e); padding:24px; color:#ffffff;">
            <h1 style="margin:0; font-size:22px; letter-spacing:0.5px;">🏏 BT360MAK Executive Club Report</h1>
            <p style="margin:6px 0 0 0; opacity:0.85; font-size:14px;">Battrick Club: <strong>${club.clubName}</strong> | Weekly Intelligence</p>
          </div>
          
          <div style="padding:24px;">
            <h3 style="color:#0f172a; margin-top:0;">📊 Executive Club Overview</h3>
            <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
              <tr style="background:#f8fafc;">
                <td style="padding:8px 12px; font-weight:bold; border-bottom:1px solid #e2e8f0;">Squad Size</td>
                <td style="padding:8px 12px; border-bottom:1px solid #e2e8f0;">${squad.length} Players</td>
              </tr>
              <tr>
                <td style="padding:8px 12px; font-weight:bold; border-bottom:1px solid #e2e8f0;">Weekly Wage Bill</td>
                <td style="padding:8px 12px; border-bottom:1px solid #e2e8f0;">$${club.weeklyWageBill.toLocaleString()}</td>
              </tr>
              <tr style="background:#f8fafc;">
                <td style="padding:8px 12px; font-weight:bold; border-bottom:1px solid #e2e8f0;">Fan Club Mood</td>
                <td style="padding:8px 12px; border-bottom:1px solid #e2e8f0;">${club.fanClub}</td>
              </tr>
              <tr>
                <td style="padding:8px 12px; font-weight:bold; border-bottom:1px solid #e2e8f0;">Next Fixture</td>
                <td style="padding:8px 12px; border-bottom:1px solid #e2e8f0;">${club.nextFixture.type} vs ${club.nextFixture.opponent} (${club.nextFixture.venue})</td>
              </tr>
            </table>

            <h3 style="color:#0f172a;">🎯 Weekly Training Net Highlights</h3>
            <p style="color:#475569; font-size:14px; line-height:1.5;">
              Active Nets: 10 nets running at peak coach efficiency. Check your BT360MAK Dashboard to view newly detected subskills and estimated pops.
            </p>

            <div style="margin-top:25px; text-align:center;">
              <a href="${SpreadsheetApp.getActiveSpreadsheet().getUrl()}" style="background:#0f766e; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:8px; font-weight:bold; display:inline-block;">
                Open BT360MAK Google Sheet
              </a>
            </div>
          </div>
          <div style="background:#f1f5f9; padding:14px; text-align:center; color:#64748b; font-size:12px;">
            Sent by BT360MAK Automation • Script ID: ${CONFIG.SCRIPT_ID}
          </div>
        </div>
      `;

      GmailApp.sendEmail(recipient, `🏏 BT360MAK Weekly Digest - ${club.clubName}`, '', {
        htmlBody: htmlBody
      });

      SpreadsheetApp.getActiveSpreadsheet().toast(`Weekly digest email sent to ${recipient}`, 'Gmail Alert', 5);
      return { success: true };
    } catch (e) {
      Logger.log('Gmail Error: ' + e.toString());
      return { success: false, error: e.toString() };
    }
  },

  /**
   * Generate Season Strategy & Performance Review Document in Google Docs
   */
  generateSeasonReportDoc: function() {
    try {
      const club = BattrickService.getClubSummary();
      const squad = BattrickService.getSquadFromSheet();
      const title = `BT360MAK Season Strategy & Roster Report - ${club.clubName}`;
      const doc = DocumentApp.create(title);
      const body = doc.getBody();

      // Title & Subtitle
      body.insertParagraph(0, title)
        .setHeading(DocumentApp.ParagraphHeading.HEADING_1);
      body.appendParagraph(`Generated: ${new Date().toLocaleDateString()} | Battrick Manager Intelligence Suite`)
        .setItalic(true);

      body.appendHorizontalRule();

      // Chapter 1: Squad Evaluation
      body.appendParagraph('1. Squad Evaluation & Core Assets')
        .setHeading(DocumentApp.ParagraphHeading.HEADING_2);
      
      const squadTable = body.appendTable();
      const headerRow = squadTable.appendTableRow();
      headerRow.appendTableCell('Player Name').setBold(true);
      headerRow.appendTableCell('Age').setBold(true);
      headerRow.appendTableCell('Primary Skill').setBold(true);
      headerRow.appendTableCell('Secondary Skill').setBold(true);
      headerRow.appendTableCell('Wage').setBold(true);

      for (let i = 0; i < Math.min(squad.length, 12); i++) {
        const p = squad[i];
        const r = squadTable.appendTableRow();
        r.appendTableCell(p.name);
        r.appendTableCell(String(p.age));
        r.appendTableCell(p.batting !== 'Abysmal' && p.batting !== 'Feeble' ? 'Bat: ' + p.batting : 'Bowl: ' + p.bowling);
        r.appendTableCell('Field: ' + p.fielding);
        r.appendTableCell('$' + Number(p.wage).toLocaleString());
      }

      // Chapter 2: Strategic Directives
      body.appendParagraph('2. Strategic Directives for Upcoming Season')
        .setHeading(DocumentApp.ParagraphHeading.HEADING_2);
      body.appendListItem('Maintain double-net allocation on high-ceiling prospects under age 22 to accelerate first-team integration.');
      body.appendListItem('Expand Stadium Standing Capacity to capture max gate receipts in high-flying fan mood.');
      body.appendListItem('Ensure pitch selection aligns with bowling attack strengths (e.g. Green pitches for seam attacks, Dusty for spin).');
      body.appendListItem('Monitor fatigue levels and rotate fast bowlers during 3-day First Class matches.');

      doc.saveAndClose();

      SpreadsheetApp.getActiveSpreadsheet().toast(`Google Doc generated: ${title}`, 'Google Docs', 6);
      return { success: true, url: doc.getUrl() };
    } catch (e) {
      Logger.log('Docs Generator Error: ' + e.toString());
      return { success: false, error: e.toString() };
    }
  },

  getUpcomingMatchesFromSheet: function() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.TABS.MATCHES);
    if (!sheet) return [];

    const lastRow = sheet.getLastRow();
    if (lastRow < 4) return [];

    const data = sheet.getRange(4, 1, lastRow - 3, 6).getValues();
    const fixtures = [];
    for (let r of data) {
      if (!r[0]) continue;
      fixtures.push({
        id: r[0],
        date: r[1],
        type: r[2],
        opponent: r[3],
        venue: r[4],
        pitch: r[5]
      });
    }
    return fixtures;
  }
};
