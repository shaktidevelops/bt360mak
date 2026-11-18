/**
 * BT360MAK - api.js
 * Asynchronous API connector to Google Apps Script Web App & Google Sheet backend.
 */

const BT_API = {
  SCRIPT_ID: '1GuCVl28B7I-KJ9o-pdYJl6MGaX0FYqTH9u5yzOMuoQpXBLqW2ULLQxpS',
  SHEET_ID: '1KXQbrZ2D7aYJUAniQ5F3L8FeFfM8zmsMsIDHfl2An_E',
  endpointUrl: '',

  init: function() {
    // Check if running inside Google Apps Script iframe
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      this.isAppsScriptEnvironment = true;
      console.log('Running inside Google Apps Script environment.');
    } else {
      this.isAppsScriptEnvironment = false;
      this.endpointUrl = localStorage.getItem('bt360mak_endpoint') || '';
      console.log('Running in standalone Web App mode.');
    }
  },

  setEndpoint: function(url) {
    this.endpointUrl = url;
    localStorage.setItem('bt360mak_endpoint', url);
  },

  syncSquad: async function(squadData) {
    if (this.isAppsScriptEnvironment) {
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .doPost({ postData: { contents: JSON.stringify({ action: 'syncSquad', squad: squadData }) } });
      });
    }

    if (this.endpointUrl) {
      try {
        const response = await fetch(this.endpointUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'syncSquad', squad: squadData })
        });
        return await response.json();
      } catch (err) {
        console.warn('Network call failed, using local persistence:', err);
      }
    }

    // Local fallback
    localStorage.setItem('bt360mak_local_squad', JSON.stringify(squadData));
    return { success: true, count: squadData.length, mode: 'local' };
  },

  syncGoogleCalendar: async function(fixtures) {
    if (this.isAppsScriptEnvironment) {
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .syncFixturesToGoogleCalendar();
      });
    }

    if (this.endpointUrl) {
      try {
        const response = await fetch(this.endpointUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'syncCalendar', fixtures: fixtures })
        });
        return await response.json();
      } catch (err) {
        console.warn('Remote sync error:', err);
      }
    }

    return { success: true, count: fixtures ? fixtures.length : 3, mode: 'simulation' };
  },

  backupToGoogleDrive: async function() {
    if (this.isAppsScriptEnvironment) {
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .backupClubDataToDrive();
      });
    }

    if (this.endpointUrl) {
      try {
        const response = await fetch(this.endpointUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'createDriveBackup' })
        });
        return await response.json();
      } catch (err) {
        console.warn('Drive backup error:', err);
      }
    }

    return { success: true, fileName: `BT360MAK_Snapshot_${new Date().toISOString().slice(0, 10)}.json`, mode: 'simulation' };
  },

  sendGmailDigest: async function() {
    if (this.isAppsScriptEnvironment) {
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .sendWeeklyDigestEmail();
      });
    }

    if (this.endpointUrl) {
      try {
        const response = await fetch(this.endpointUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'sendAlertEmail', subject: 'BT360MAK Digest', body: 'Digest Triggered' })
        });
        return await response.json();
      } catch (err) {
        console.warn('Gmail error:', err);
      }
    }

    return { success: true, mode: 'simulation' };
  }
};
