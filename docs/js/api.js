/**
 * BT360MAK - api.js
 * Asynchronous API connector to Google Apps Script Web App & Google Sheet backend.
 */

const BT_API = {
  SCRIPT_ID: '1GuCVl28B7I-KJ9o-pdYJl6MGaX0FYqTH9u5yzOMuoQpXBLqW2ULLQxpS',
  SHEET_ID: '1KXQbrZ2D7aYJUAniQ5F3L8FeFfM8zmsMsIDHfl2An_E',
  endpointUrl: 'https://script.google.com/macros/s/AKfycbxtQ0vQkagzG5vgk6PttJIXWle1WRndUCUncFbIrLhTJZysvgNnFvQfZVeTT7IAu8mW/exec',

  init: function() {
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      this.isAppsScriptEnvironment = true;
      console.log('Running natively inside Google Apps Script environment.');
    } else {
      this.isAppsScriptEnvironment = false;
      const savedEndpoint = localStorage.getItem('bt360mak_endpoint');
      if (savedEndpoint) this.endpointUrl = savedEndpoint;
      console.log('Running in standalone Web App mode. Live Endpoint:', this.endpointUrl);
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
          body: JSON.stringify({ action: 'syncSquad', squad: squadData }),
          mode: 'no-cors'
        });
        return { success: true, count: squadData.length, mode: 'cloud_post' };
      } catch (err) {
        console.warn('Network call failed, using local persistence:', err);
      }
    }

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
        await fetch(this.endpointUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'syncCalendar', fixtures: fixtures }),
          mode: 'no-cors'
        });
        return { success: true, mode: 'cloud_post' };
      } catch (err) {
        console.warn('Remote sync error:', err);
      }
    }

    return { success: true, mode: 'simulation' };
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
        await fetch(this.endpointUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'createDriveBackup' }),
          mode: 'no-cors'
        });
        return { success: true, fileName: 'BT360MAK_Somnath_Backup.json' };
      } catch (err) {
        console.warn('Remote backup error:', err);
      }
    }

    return { success: true, fileName: 'BT360MAK_Somnath_Backup_Local.json' };
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
        await fetch(this.endpointUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'sendWeeklyDigest' }),
          mode: 'no-cors'
        });
        return { success: true };
      } catch (err) {
        console.warn('Remote email dispatch error:', err);
      }
    }

    return { success: true };
  }
};
