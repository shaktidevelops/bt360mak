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
  staff?: StaffMember[];
  calendar?: CalendarEvent[];
}

export interface SyncResponse {
  success: boolean;
  message: string;
  timestamp?: string;
  raw?: any;
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
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) {
      return { ok: false, message: `HTTP ${response.status}: ${response.statusText}` };
    }
    const data = await response.json();
    return { ok: true, message: 'Google Sheet Web App is online and responding!', details: data };
  } catch (err: any) {
    return { ok: false, message: `Connection test failed: ${err.message || String(err)}` };
  }
}

/**
 * Synchronizes entire state or subset to Google Sheets via Apps Script Web App
 */
export async function syncToGoogleSheets(payload: GoogleSheetsSyncPayload): Promise<SyncResponse> {
  const url = getAppsScriptUrl();
  if (!url) {
    // When no Web App URL is configured yet, gracefully fallback to local cache
    return {
      success: true,
      message: 'Saved to local browser database. Connect Google Apps Script Web App to sync to Google Sheet automatically.'
    };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Apps script handles text/plain avoiding CORS preflight OPTIONS block
      },
      body: JSON.stringify({
        action: 'syncAll',
        ...payload
      })
    });

    const result = await res.json();
    return {
      success: result.status === 'success',
      message: result.message || 'Synced successfully to Google Sheet.',
      timestamp: result.timestamp,
      raw: result
    };
  } catch (err: any) {
    console.warn('Google Sheets sync warning:', err);
    return {
      success: false,
      message: `Google Sheets sync notice: ${err.message || String(err)}`
    };
  }
}

/**
 * Saves squad changes to Google Sheet
 */
export async function saveSquadToGoogleSheets(squad: Player[]): Promise<SyncResponse> {
  const url = getAppsScriptUrl();
  if (!url) return { success: true, message: 'Saved locally.' };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'saveSquad', squad })
    });
    const result = await res.json();
    return {
      success: result.status === 'success',
      message: `Saved ${squad.length} players to Google Sheet.`
    };
  } catch (err: any) {
    console.warn('Google Sheets saveSquad error:', err);
    return { success: false, message: err.message };
  }
}

/**
 * Saves matches to Google Sheet
 */
export async function saveMatchesToGoogleSheets(matches: MatchRecord[]): Promise<SyncResponse> {
  const url = getAppsScriptUrl();
  if (!url) return { success: true, message: 'Saved locally.' };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'saveMatches', matches })
    });
    const result = await res.json();
    return {
      success: result.status === 'success',
      message: `Saved ${matches.length} matches to Google Sheet.`
    };
  } catch (err: any) {
    console.warn('Google Sheets saveMatches error:', err);
    return { success: false, message: err.message };
  }
}

/**
 * Saves club to Google Sheet
 */
export async function saveClubToGoogleSheets(club: Club): Promise<SyncResponse> {
  const url = getAppsScriptUrl();
  if (!url) return { success: true, message: 'Saved locally.' };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'saveClub', club })
    });
    const result = await res.json();
    return {
      success: result.status === 'success',
      message: 'Saved club profile to Google Sheet.'
    };
  } catch (err: any) {
    console.warn('Google Sheets saveClub error:', err);
    return { success: false, message: err.message };
  }
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
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status}: ${res.statusText}` };
    }
    const data = await res.json();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || String(err) };
  }
}

/**
 * Wipes rows 2+ across all 10 tabs in Google Sheet
 */
export async function resetGoogleSheetsDatabase(): Promise<SyncResponse> {
  const url = getAppsScriptUrl();
  if (!url) return { success: true, message: 'Local storage reset completed.' };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'resetAll' })
    });
    const result = await res.json();
    return {
      success: result.status === 'success',
      message: 'All 10 tabs in Google Sheet reset to clean headers.'
    };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
