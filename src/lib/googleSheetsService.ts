/**
 * ============================================================================
 * BT360MAK - Google Sheets Cloud Database Service
 * Direct Google Sheets + Google Apps Script Web App sync
 * ============================================================================
 * Target Spreadsheet: 1KXQbrZ2D7aYJUAniQ5F3L8FeFfM8zmsMsIDHfl2An_E
 * Apps Script ID:     1tS9xWWXRBTlrsysAeF82qyrrFDPfHrchSpYNGmAhSZZD_D-f4nGmP7kz
 * ============================================================================
 */

import { 
  Club, 
  Player, 
  MatchRecord, 
  FinancialRecord, 
  StadiumTier, 
  NetAllocation, 
  TrainingLog,
  StaffMember, 
  CalendarEvent, 
  CricketRecord 
} from '../types/database';

export const DEFAULT_SPREADSHEET_ID = '1KXQbrZ2D7aYJUAniQ5F3L8FeFfM8zmsMsIDHfl2An_E';
export const DEFAULT_APPS_SCRIPT_PROJECT_ID = '1tS9xWWXRBTlrsysAeF82qyrrFDPfHrchSpYNGmAhSZZD_D-f4nGmP7kz';
export const DEFAULT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwv2J4_o84OolvO43bhWnwU-FTQPl-W61JaUDRwxwg2fX4TVmp_YtSBoQSJLRngzEuJDg/exec';

export const GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${DEFAULT_SPREADSHEET_ID}/edit`;
export const APPS_SCRIPT_EDITOR_URL = `https://script.google.com/d/${DEFAULT_APPS_SCRIPT_PROJECT_ID}/edit`;

const STORAGE_KEY_WEB_APP_URL = 'bt360_google_apps_script_url';

/**
 * Gets configured Google Apps Script Web App URL from localStorage or env
 */
export function getAppsScriptUrl(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_WEB_APP_URL);
    if (saved && saved.trim() !== '') return saved.trim();
  } catch (e) {
    // ignore
  }
  return import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || DEFAULT_WEB_APP_URL;
}

/**
 * Sets user-provided Google Apps Script Web App URL
 */
export function setAppsScriptUrl(url: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_WEB_APP_URL, url.trim());
  } catch (e) {
    console.warn('Failed to save Apps Script URL to localStorage', e);
  }
}

/**
 * Checks whether Google Sheets sync endpoint is configured
 */
export function isGoogleSheetsConfigured(): boolean {
  const url = getAppsScriptUrl();
  return Boolean(url && url.startsWith('https://script.google.com/macros/s/'));
}

export interface GoogleSheetsSyncPayload {
  club?: Club;
  squad?: Player[];
  matches?: MatchRecord[];
  records?: CricketRecord[];
  finances?: FinancialRecord[];
  stadium?: StadiumTier[];
  nets?: NetAllocation[];
  trainingLogs?: TrainingLog[];
  staff?: StaffMember[];
  calendar?: CalendarEvent[];
}

export interface SyncResponse {
  success: boolean;
  message: string;
  timestamp?: string;
  raw?: any;
}

async function postToAppsScript(payload: Record<string, any>): Promise<SyncResponse> {
  const url = getAppsScriptUrl();
  if (!url) {
    return {
      success: true,
      message: 'Saved to local browser database. Configure Google Apps Script Web App URL to sync to Google Sheet.'
    };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    if (text.trim().startsWith('<')) {
      return {
        success: false,
        message: 'Apps Script Web App returned a Google login page. In Apps Script, open Deploy > Manage deployments > Edit and set "Who has access" to "Anyone".'
      };
    }

    const result = JSON.parse(text);
    return {
      success: result.status === 'success',
      message: result.message || 'Synced successfully to Google Sheet.',
      timestamp: result.timestamp,
      raw: result
    };
  } catch (err: any) {
    const rawMsg = err?.message || String(err);
    const isCorsOrFetch = rawMsg.includes('Failed to fetch') || rawMsg.includes('NetworkError');
    return {
      success: false,
      message: isCorsOrFetch
        ? 'Google Sheet Web App blocked browser access (CORS/Auth). Open Apps Script > Deploy > Manage deployments > Edit > set "Who has access" to "Anyone" and click Deploy.'
        : `Google Sheets sync notice: ${rawMsg}`
    };
  }
}

/**
 * Pings Google Apps Script Web App to verify connectivity
 */
export async function pingGoogleSheets(): Promise<{ ok: boolean; message: string; details?: any }> {
  const url = getAppsScriptUrl();
  if (!url) {
    return { 
      ok: false, 
      message: 'Apps Script Web App URL is not set yet. Please deploy Apps Script and enter the URL.' 
    };
  }

  try {
    const response = await fetch(`${url}?action=ping`, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'Accept': 'application/json' }
    });
    const text = await response.text();
    if (text.trim().startsWith('<')) {
      return {
        ok: false,
        message: 'Web App requires "Who has access: Anyone" in Apps Script Deploy > Manage deployments.'
      };
    }
    const data = JSON.parse(text);
    return { ok: true, message: `Connected to Google Sheet "${data.spreadsheetName || 'bt360mak'}"!`, details: data };
  } catch (err: any) {
    const msg = err?.message || String(err);
    return {
      ok: false,
      message: msg.includes('Failed to fetch')
        ? 'Browser blocked by Google Apps Script auth redirect. Open Apps Script > Deploy > Manage deployments > Edit > set "Who has access" to "Anyone".'
        : `Connection test failed: ${msg}`
    };
  }
}

/**
 * Synchronizes entire state or subset to Google Sheets via Apps Script Web App
 */
export async function syncToGoogleSheets(payload: GoogleSheetsSyncPayload): Promise<SyncResponse> {
  return postToAppsScript({ action: 'syncAll', ...payload });
}

/**
 * Saves squad changes to Google Sheet
 */
export async function saveSquadToGoogleSheets(squad: Player[]): Promise<SyncResponse> {
  return postToAppsScript({ action: 'saveSquad', squad });
}

/**
 * Saves matches to Google Sheet
 */
export async function saveMatchesToGoogleSheets(matches: MatchRecord[]): Promise<SyncResponse> {
  return postToAppsScript({ action: 'saveMatches', matches });
}

/**
 * Saves club to Google Sheet
 */
export async function saveClubToGoogleSheets(club: Club): Promise<SyncResponse> {
  return postToAppsScript({ action: 'saveClub', club });
}

/**
 * Fetches all data from Google Sheet
 */
export async function fetchAllFromGoogleSheets(): Promise<{ success: boolean; data?: any; error?: string }> {
  const url = getAppsScriptUrl();
  if (!url) {
    return { success: false, error: 'Google Apps Script Web App URL is not set.' };
  }

  try {
    const res = await fetch(`${url}?action=getAllData`, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'Accept': 'application/json' }
    });
    const text = await res.text();
    if (text.trim().startsWith('<')) {
      return { success: false, error: 'Apps Script Web App requires "Who has access: Anyone" in Deploy > Manage deployments.' };
    }
    const data = JSON.parse(text);
    return { success: true, data };
  } catch (err: any) {
    const msg = err?.message || String(err);
    return {
      success: false,
      error: msg.includes('Failed to fetch')
        ? 'Web App blocked by Google auth redirect. Set "Who has access: Anyone" in Apps Script Deploy > Manage deployments.'
        : msg
    };
  }
}

/**
 * Wipes rows 2+ across all 10 tabs in Google Sheet
 */
export async function resetGoogleSheetsDatabase(): Promise<SyncResponse> {
  return postToAppsScript({ action: 'resetAll' });
}
