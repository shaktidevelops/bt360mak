/**
 * BT360MAK - Battrick Premium Backend & Manager Engine
 * Google Apps Script Core Controller
 * Script ID: 1GuCVl28B7I-KJ9o-pdYJl6MGaX0FYqTH9u5yzOMuoQpXBLqW2ULLQxpS
 * Google Sheet ID: 1KXQbrZ2D7aYJUAniQ5F3L8FeFfM8zmsMsIDHfl2An_E
 */

const CONFIG = {
  SHEET_ID: '1KXQbrZ2D7aYJUAniQ5F3L8FeFfM8zmsMsIDHfl2An_E',
  SCRIPT_ID: '1GuCVl28B7I-KJ9o-pdYJl6MGaX0FYqTH9u5yzOMuoQpXBLqW2ULLQxpS',
  APP_NAME: 'BT360MAK - Battrick Premium Hub',
  FONT_FAMILY: 'Plus Jakarta Sans',
  VERSION: '1.0.0',
  TABS: {
    DASHBOARD: '01_Dashboard',
    SQUAD: '02_Squad_Master',
    TRAINING: '03_Training_Tracker',
    NETS: '04_Nets_Matrix',
    MATCHES: '05_Match_Archives',
    TACTICS: '06_Lineup_Tactics',
    FINANCES: '07_Financial_Ledger',
    STADIUM: '08_Stadium_Planner',
    SCOUTS: '09_Scout_Transfer',
    SETTINGS: '10_Google_Sync_Config'
  }
};

/**
 * Universal Spreadsheet Resolver (Supports both Container-Bound & Standalone Scripts)
 */
function getMasterSpreadsheet() {
  try {
    if (CONFIG.SHEET_ID) {
      return SpreadsheetApp.openById(CONFIG.SHEET_ID);
    }
  } catch (err) {
    Logger.log('Could not open spreadsheet by ID, falling back to active: ' + err.toString());
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Custom UI Menu when opening the Google Sheet
 */
function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('🏏 BT360MAK Manager')
      .addItem('⚡ Format & Initialize All Sheets (Plus Jakarta Sans)', 'initializeSheetStructure')
      .addSeparator()
      .addItem('🔄 Sync / Import Battrick Club Data', 'triggerBattrickSync')
      .addItem('📈 Calculate Training Pops & Subskills', 'detectTrainingPops')
      .addItem('🏟️ Recalculate Optimal Stadium Capacity', 'recalculateStadiumOptimization')
      .addSeparator()
      .addSubMenu(ui.createMenu('🌐 Google Apps Integrations')
        .addItem('📅 Sync Fixtures to Google Calendar', 'syncFixturesToGoogleCalendar')
        .addItem('💾 Backup Snapshot to Google Drive', 'backupClubDataToDrive')
        .addItem('📧 Send Match & Pop Digest via Gmail', 'sendWeeklyDigestEmail')
        .addItem('📄 Export Executive Report to Google Docs', 'exportSeasonReportToDocs')
      )
      .addSeparator()
      .addItem('⚙️ Install Automatic Background Triggers', 'installAutomatedTriggers')
      .addItem('🚀 Open Web App Dashboard', 'openWebAppModal')
      .addToUi();
  } catch (e) {
    Logger.log('Standalone script execution without active UI: ' + e.toString());
  }
}

/**
 * Web App HTTP GET Handler (Serves HTML frontend or returns JSON API)
 */
function doGet(e) {
  const action = e && e.parameter ? e.parameter.action : null;

  if (action) {
    return handleApiGet(e);
  }

  // Serve Frontend HTML
  const template = HtmlService.createTemplateFromFile('index');
  return template.evaluate()
    .setTitle(CONFIG.APP_NAME)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Web App HTTP POST Handler (Receives updates, scraped data, or API calls)
 */
function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;

    let result = { success: false, message: 'Unknown action' };

    switch (action) {
      case 'syncSquad':
        result = BattrickService.saveSquadData(postData.squad);
        break;
      case 'saveTactics':
        result = MembershipEngine.saveTacticalOrders(postData.orders);
        break;
      case 'updateNets':
        result = MembershipEngine.updateNetsAllocation(postData.nets);
        break;
      case 'syncCalendar':
        result = GoogleAppsConnector.syncCalendarEvents(postData.fixtures);
        break;
      case 'createDriveBackup':
        result = GoogleAppsConnector.createDriveBackup();
        break;
      case 'sendAlertEmail':
        result = GoogleAppsConnector.sendGmailNotification(postData.subject, postData.body);
        break;
      default:
        result = { success: false, message: 'Invalid action: ' + action };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET API Actions
 */
function handleApiGet(e) {
  const action = e.parameter.action;
  let data = {};

  try {
    switch (action) {
      case 'getSquad':
        data = BattrickService.getSquadFromSheet();
        break;
      case 'getClubSummary':
        data = BattrickService.getClubSummary();
        break;
      case 'getTrainingPops':
        data = MembershipEngine.getTrainingLog();
        break;
      case 'getFinances':
        data = MembershipEngine.getFinancialRecords();
        break;
      case 'getStadium':
        data = MembershipEngine.getStadiumPlannerData();
        break;
      default:
        data = { error: 'Invalid API GET action: ' + action };
    }
  } catch (err) {
    data = { error: err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Initialize Google Sheet tabs, typography, and formatting
 */
function initializeSheetStructure() {
  SheetSetup.setupAllSheets();
  const ss = getMasterSpreadsheet();
  if (ss) {
    ss.toast('✅ BT360MAK Sheets successfully formatted with Plus Jakarta Sans & columns trimmed!', 'Ready', 6);
  }
}

/**
 * Trigger Battrick Sync
 */
function triggerBattrickSync() {
  BattrickService.fetchAndSyncClubData();
}

/**
 * Detect weekly training pops
 */
function detectTrainingPops() {
  MembershipEngine.detectPops();
}

/**
 * Recalculate stadium seats
 */
function recalculateStadiumOptimization() {
  MembershipEngine.calculateOptimalGround();
}

/**
 * Google Apps triggers
 */
function syncFixturesToGoogleCalendar() {
  GoogleAppsConnector.syncCalendarEvents();
}

function backupClubDataToDrive() {
  GoogleAppsConnector.createDriveBackup();
}

function sendWeeklyDigestEmail() {
  GoogleAppsConnector.sendWeeklyDigest();
}

function exportSeasonReportToDocs() {
  GoogleAppsConnector.generateSeasonReportDoc();
}

/**
 * Modal to display Web App URL
 */
function openWebAppModal() {
  const html = `
    <div style="font-family:'Plus Jakarta Sans',sans-serif; padding:18px; color:#1e293b;">
      <h2 style="color:#0f766e; margin-top:0;">🏏 BT360MAK Web Dashboard</h2>
      <p>Your Battrick Premium Intelligence Center is connected.</p>
      <div style="margin:20px 0;">
        <a href="${ScriptApp.getService().getUrl() || '#'}" target="_blank" 
           style="background:#0f766e; color:#fff; padding:10px 18px; text-decoration:none; border-radius:6px; font-weight:bold;">
           🚀 Launch Web Dashboard
        </a>
      </div>
      <p style="font-size:12px; color:#64748b;">
        Script ID: ${CONFIG.SCRIPT_ID}<br>
        Sheet ID: ${CONFIG.SHEET_ID}<br>
        Typography: Plus Jakarta Sans
      </p>
    </div>
  `;
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(html).setWidth(480).setHeight(280), 'BT360MAK Web App');
}

/**
 * Background Automation Cron Triggers
 */
function installAutomatedTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }

  // Friday morning training pop detection trigger (Battrick updates nets early Friday)
  ScriptApp.newTrigger('onFridayTrainingTrigger')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.FRIDAY)
    .atHour(8)
    .create();

  // Sunday weekly financial deduction & sponsor sync
  ScriptApp.newTrigger('onSundayFinancialTrigger')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.SUNDAY)
    .atHour(6)
    .create();

  // Automated Google Drive Snapshot every Monday
  ScriptApp.newTrigger('backupClubDataToDrive')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(2)
    .create();

  const ss = getMasterSpreadsheet();
  if (ss) {
    ss.toast('⏰ Automated Weekly Cron Triggers successfully installed!', 'Automations Active', 6);
  }
}

function onFridayTrainingTrigger() {
  detectTrainingPops();
  sendWeeklyDigestEmail();
}

function onSundayFinancialTrigger() {
  MembershipEngine.recordWeeklyFinances();
}
