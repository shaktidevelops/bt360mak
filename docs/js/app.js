/**
 * BT360MAK - app.js
 * Master Client Controller: Navigation, Theme Engine, State, Interactive Calculators & Modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  BT_APP.init();
});

const BT_APP = {
  currentTheme: 'emerald',
  currentTab: 'dashboard',
  squad: [],

  init: function() {
    this.squad = [...BT_DATA.squad];
    BT_API.init();
    this.setupTheme();
    this.setupNavigation();
    this.renderDashboard();
    this.renderSquadTable();
    this.renderNetsTable();
    this.renderStadiumTable();
    this.renderScoutTargets();
    this.setupTacticsEngine();
    this.setupYouthCalculator();
    this.setupModals();
    this.setupGoogleAppsSync();
    console.log('BT360MAK Frontend initialized successfully.');
  },

  /* 1. THEME ENGINE */
  setupTheme: function() {
    const savedTheme = localStorage.getItem('bt360mak_theme') || 'emerald';
    this.setTheme(savedTheme);

    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
      themeSelect.value = savedTheme;
      themeSelect.addEventListener('change', (e) => {
        this.setTheme(e.target.value);
      });
    }
  },

  setTheme: function(themeName) {
    this.currentTheme = themeName;
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('bt360mak_theme', themeName);
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) themeSelect.value = themeName;
  },

  /* 2. NAVIGATION & TABS */
  setupNavigation: function() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tabTarget = item.getAttribute('data-tab');
        this.switchTab(tabTarget);
      });
    });
  },

  switchTab: function(tabId) {
    this.currentTab = tabId;

    // Update active nav link
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Update active panel
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    const activePanel = document.getElementById(`panel-${tabId}`);
    if (activePanel) activePanel.classList.add('active');

    // Update Topbar Title
    const titles = {
      dashboard: 'Executive Command Center',
      squad: 'Squad Roster & BT Membership Analytics',
      tactics: 'Tactical Warfare & Pitch Synergy Engine',
      training: 'Training Matrix & Youth Academy Hub',
      finance: 'Financial Ledger & Stadium Architecture',
      scout: 'Transfer Market Radar & Valuation Engine',
      google: 'Google Apps Workspace Integrations',
      settings: 'Club Configuration & System Preferences'
    };
    const titleEl = document.getElementById('pageTitle');
    if (titleEl && titles[tabId]) titleEl.innerText = titles[tabId];

    // Trigger re-render of visual graphs if needed
    if (tabId === 'dashboard') {
      BT_CHARTS.renderProgressionGraph('dashboardProgressionChart');
      BT_CHARTS.renderCashflowBars('dashboardCashflowChart');
    }
  },

  /* 3. DASHBOARD RENDER */
  renderDashboard: function() {
    const club = BT_DATA.club;
    document.getElementById('dashClubName').innerText = club.name;
    document.getElementById('dashDivision').innerText = club.division;
    document.getElementById('dashFanClub').innerText = club.fanClub;
    document.getElementById('dashBank').innerText = '$' + club.bankBalance.toLocaleString();
    document.getElementById('dashWage').innerText = '$' + club.weeklyWageBill.toLocaleString();

    // Render Recent Pops Ticker
    const popsList = document.getElementById('dashPopsList');
    if (popsList) {
      popsList.innerHTML = BT_DATA.trainingPops.map(pop => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--border-color);">
          <div>
            <strong>${pop.player}</strong>
            <span style="font-size:11px; color:var(--text-muted); margin-left:6px;">(${pop.skill})</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:11px; color:var(--text-muted);">${pop.oldVal} ➔</span>
            <span class="badge badge-pop">${pop.newVal}</span>
          </div>
        </div>
      `).join('');
    }

    setTimeout(() => {
      BT_CHARTS.renderProgressionGraph('dashboardProgressionChart');
      BT_CHARTS.renderCashflowBars('dashboardCashflowChart');
    }, 100);
  },

  /* 4. SQUAD TABLE & MEMBERSHIP ANALYTICS */
  renderSquadTable: function(filterList) {
    const tableBody = document.getElementById('squadTableBody');
    if (!tableBody) return;

    const players = filterList || this.squad;

    tableBody.innerHTML = players.map(p => {
      const batBadge = this.getSkillBadge(p.batting);
      const bowlBadge = this.getSkillBadge(p.bowling);
      const keepBadge = this.getSkillBadge(p.keeping);
      const fieldBadge = this.getSkillBadge(p.fielding);

      return `
        <tr>
          <td><span style="font-family:monospace; font-weight:bold; color:var(--accent);">${p.id}</span></td>
          <td>
            <a href="#" class="player-link" data-id="${p.id}" style="color:var(--text-main); font-weight:700; text-decoration:none;">
              ${p.name}
            </a>
            <div style="font-size:10px; color:var(--text-muted);">${p.role} • ${p.hand}</div>
          </td>
          <td>${p.age}</td>
          <td><strong>$${Number(p.wage).toLocaleString()}</strong></td>
          <td>${p.bowlingType}</td>
          <td>${batBadge}</td>
          <td>${bowlBadge}</td>
          <td>${keepBadge}</td>
          <td>${fieldBadge}</td>
          <td>${p.form}</td>
          <td>${p.fatigue}</td>
          <td>${p.activeNet !== 'None' ? `<span class="badge badge-pop">${p.activeNet}</span>` : '<span style="color:var(--text-muted);">-</span>'}</td>
          <td><strong>$${Number(p.marketValue).toLocaleString()}</strong></td>
          <td>
            <button class="btn btn-secondary btn-inspect" data-id="${p.id}" style="padding:4px 8px; font-size:10px;">
              🔍 Inspect
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach inspect click handlers
    document.querySelectorAll('.btn-inspect, .player-link').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const pId = btn.getAttribute('data-id');
        this.openPlayerModal(pId);
      });
    });

    // Update squad counter badge
    const countBadge = document.getElementById('squadCountBadge');
    if (countBadge) countBadge.innerText = `${players.length} Players`;
  },

  getSkillBadge: function(skillName) {
    const s = (skillName || '').toLowerCase();
    let badgeClass = 'badge-skill-competent';
    if (s.includes('sensational') || s.includes('quality') || s.includes('remarkable')) badgeClass = 'badge-skill-sensational';
    else if (s.includes('exquisite') || s.includes('miraculous') || s.includes('legendary')) badgeClass = 'badge-skill-exquisite';
    else if (s.includes('masterclass')) badgeClass = 'badge-skill-masterclass';
    else if (s.includes('superb') || s.includes('wonderful') || s.includes('exceptional')) badgeClass = 'badge-skill-superb';

    return `<span class="badge ${badgeClass}">${skillName}</span>`;
  },

  /* 5. PLAYER DEEP-DIVE MODAL */
  openPlayerModal: function(playerId) {
    const player = this.squad.find(p => p.id === playerId);
    if (!player) return;

    document.getElementById('modalPlayerName').innerText = `${player.name} (${player.id})`;
    document.getElementById('modalPlayerRole').innerText = `${player.role} | Age ${player.age} | ${player.hand} | Bowling: ${player.bowlingType}`;
    document.getElementById('modalPlayerWage').innerText = '$' + Number(player.wage).toLocaleString();
    document.getElementById('modalPlayerValue').innerText = '$' + Number(player.marketValue).toLocaleString();
    document.getElementById('modalPlayerBti').innerText = Number(player.bti).toLocaleString();
    document.getElementById('modalPlayerSubskill').innerText = player.subskill || '15.0';

    // Populate skill grid in modal
    const skillGrid = document.getElementById('modalSkillGrid');
    if (skillGrid) {
      skillGrid.innerHTML = `
        <div class="kpi-card" style="padding:10px;">
          <div class="kpi-header">Batting</div>
          <div style="font-weight:700;">${player.batting}</div>
        </div>
        <div class="kpi-card" style="padding:10px;">
          <div class="kpi-header">Bowling</div>
          <div style="font-weight:700;">${player.bowling}</div>
        </div>
        <div class="kpi-card" style="padding:10px;">
          <div class="kpi-header">Wicket Keeping</div>
          <div style="font-weight:700;">${player.keeping}</div>
        </div>
        <div class="kpi-card" style="padding:10px;">
          <div class="kpi-header">Fielding</div>
          <div style="font-weight:700;">${player.fielding}</div>
        </div>
        <div class="kpi-card" style="padding:10px;">
          <div class="kpi-header">Consistency</div>
          <div style="font-weight:700;">${player.consistency}</div>
        </div>
        <div class="kpi-card" style="padding:10px;">
          <div class="kpi-header">Concentration</div>
          <div style="font-weight:700;">${player.concentration}</div>
        </div>
        <div class="kpi-card" style="padding:10px;">
          <div class="kpi-header">Stamina</div>
          <div style="font-weight:700;">${player.stamina}</div>
        </div>
        <div class="kpi-card" style="padding:10px;">
          <div class="kpi-header">Experience</div>
          <div style="font-weight:700;">${player.experience}</div>
        </div>
      `;
    }

    const modal = document.getElementById('playerModal');
    if (modal) modal.classList.add('active');

    setTimeout(() => {
      BT_CHARTS.renderProgressionGraph('playerModalProgressionGraph');
    }, 150);
  },

  /* 6. TACTICAL PITCH ENGINE */
  setupTacticsEngine: function() {
    const pitchSelect = document.getElementById('tacticsPitchSelect');
    if (!pitchSelect) return;

    pitchSelect.addEventListener('change', (e) => {
      const selected = e.target.value;
      this.updatePitchView(selected);
    });
    this.updatePitchView('Hard');
  },

  updatePitchView: function(pitchKey) {
    const pitch = BT_DATA.pitchTypes[pitchKey] || BT_DATA.pitchTypes['Hard'];
    const descEl = document.getElementById('pitchDescription');
    const stripEl = document.getElementById('tacticalPitchStrip');
    const bonusesEl = document.getElementById('pitchBonusesList');

    if (descEl) descEl.innerText = pitch.desc;
    if (stripEl) {
      stripEl.className = `pitch-strip ${pitch.colorClass}`;
    }

    if (bonusesEl) {
      bonusesEl.innerHTML = Object.entries(pitch.bowlerBonus).map(([type, bonus]) => {
        const isPos = bonus.startsWith('+');
        return `
          <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid var(--border-color); font-size:12px;">
            <span>${type} Bowlers</span>
            <strong style="color:${isPos ? 'var(--success)' : 'var(--danger)'};">${bonus}</strong>
          </div>
        `;
      }).join('');
    }
  },

  /* 7. TRAINING & NETS */
  renderNetsTable: function() {
    const tableBody = document.getElementById('netsTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = BT_DATA.nets.map(net => `
      <tr>
        <td><strong>Net #${net.net}</strong></td>
        <td><span class="badge badge-skill-sensational">${net.type}</span></td>
        <td><strong>${net.name}</strong> <span style="font-size:10px; color:var(--text-muted);">(${net.playerId})</span></td>
        <td>${net.coach}</td>
        <td><strong>${net.etaWeeks} Weeks</strong></td>
      </tr>
    `).join('');
  },

  /* 8. YOUTH ACADEMY (ITS) CALCULATOR */
  setupYouthCalculator: function() {
    const itsSlider = document.getElementById('itsSlider');
    const itsValDisplay = document.getElementById('itsValueDisplay');
    const itsOutcome = document.getElementById('itsOutcome');

    if (itsSlider && itsValDisplay) {
      itsSlider.addEventListener('input', (e) => {
        const val = Number(e.target.value);
        itsValDisplay.innerText = '$' + val.toLocaleString() + ' / week';

        if (val === 36000) {
          itsOutcome.innerHTML = '🌟 <strong>Maximum Investment (Level 20 ITS)</strong>: Guarantees 17yo pulls with Proficient/Strong primary skills and Exceptional potential!';
        } else if (val >= 24000) {
          itsOutcome.innerHTML = '⚡ <strong>High Investment</strong>: Solid 17yo pulls with Respectable to Proficient primary skills.';
        } else if (val >= 12000) {
          itsOutcome.innerHTML = '⚠️ <strong>Moderate Investment</strong>: Competent to Respectable prospects with mixed consistency.';
        } else {
          itsOutcome.innerHTML = '❌ <strong>Low / Minimum</strong>: Mediocre pulls; rarely first-team standard.';
        }
      });
    }
  },

  /* 9. STADIUM CAPACITY PLANNER */
  renderStadiumTable: function() {
    const body = document.getElementById('stadiumTableBody');
    if (!body) return;

    body.innerHTML = BT_DATA.stadium.map(s => {
      const diff = s.rec - s.current;
      const upgradeCost = diff * s.cost;
      const weeklyGate = s.rec * s.price;

      return `
        <tr>
          <td><strong>${s.tier}</strong></td>
          <td>${s.current.toLocaleString()}</td>
          <td>${s.ratio}</td>
          <td><strong style="color:var(--accent);">${s.rec.toLocaleString()}</strong></td>
          <td>$${s.price}</td>
          <td>$${weeklyGate.toLocaleString()}</td>
          <td>$${upgradeCost.toLocaleString()}</td>
        </tr>
      `;
    }).join('');
  },

  /* 10. SCOUT TARGETS */
  renderScoutTargets: function() {
    const body = document.getElementById('scoutTableBody');
    if (!body) return;

    const targets = [
      { id: 'BT-98211', name: 'David Warner', age: 25, primary: 'Sensational (15)', secondary: 'Remarkable (12)', wage: 34000, bid: 1800000, fair: 2400000, verdict: 'UNDERVALUED (BUY)' },
      { id: 'BT-89412', name: 'Mitchell Starc', age: 26, primary: 'Exquisite (16)', secondary: 'Competent (6)', wage: 41000, bid: 3200000, fair: 3100000, verdict: 'FAIR MARKET' },
      { id: 'BT-71203', name: 'Steve Smith', age: 28, primary: 'Masterclass (17)', secondary: 'Sensational (15)', wage: 62000, bid: 5400000, fair: 4200000, verdict: 'OVERPRICED (PASS)' }
    ];

    body.innerHTML = targets.map(t => `
      <tr>
        <td><span style="font-family:monospace; color:var(--accent);">${t.id}</span></td>
        <td><strong>${t.name}</strong></td>
        <td>${t.age}</td>
        <td>${t.primary}</td>
        <td>${t.secondary}</td>
        <td>$${t.wage.toLocaleString()}</td>
        <td>$${t.bid.toLocaleString()}</td>
        <td><strong>$${t.fair.toLocaleString()}</strong></td>
        <td><span class="badge ${t.verdict.includes('BUY') ? 'badge-pop' : 'badge-skill-competent'}">${t.verdict}</span></td>
      </tr>
    `).join('');
  },

  /* 11. GOOGLE APPS SYNC CONTROLS */
  setupGoogleAppsSync: function() {
    // Calendar Sync Button
    const btnSyncCal = document.getElementById('btnSyncCalendar');
    if (btnSyncCal) {
      btnSyncCal.addEventListener('click', async () => {
        btnSyncCal.disabled = true;
        btnSyncCal.innerText = 'Syncing...';
        const res = await BT_API.syncGoogleCalendar();
        this.showToast('✅ Google Calendar match fixtures synced!');
        btnSyncCal.disabled = false;
        btnSyncCal.innerText = '📅 Sync Fixtures Now';
      });
    }

    // Drive Backup Button
    const btnDriveBackup = document.getElementById('btnDriveBackup');
    if (btnDriveBackup) {
      btnDriveBackup.addEventListener('click', async () => {
        btnDriveBackup.disabled = true;
        btnDriveBackup.innerText = 'Backing up...';
        const res = await BT_API.backupToGoogleDrive();
        this.showToast(`💾 Snapshot backed up to Google Drive: ${res.fileName || 'Success'}`);
        btnDriveBackup.disabled = false;
        btnDriveBackup.innerText = '💾 Trigger Drive Backup';
      });
    }

    // Gmail Alert Button
    const btnGmail = document.getElementById('btnSendGmail');
    if (btnGmail) {
      btnGmail.addEventListener('click', async () => {
        btnGmail.disabled = true;
        btnGmail.innerText = 'Sending...';
        const res = await BT_API.sendGmailDigest();
        this.showToast('📧 Weekly digest dispatched to connected Gmail!');
        btnGmail.disabled = false;
        btnGmail.innerText = '📧 Send Weekly Digest';
      });
    }
  },

  /* 12. MODAL CONTROLS */
  setupModals: function() {
    document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target === el || el.classList.contains('modal-close')) {
          document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        }
      });
    });

    const btnOpenImport = document.getElementById('btnOpenImportModal');
    if (btnOpenImport) {
      btnOpenImport.addEventListener('click', () => {
        const importModal = document.getElementById('importModal');
        if (importModal) importModal.classList.add('active');
      });
    }

    // Squad Search & Filter
    const searchInput = document.getElementById('squadSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = this.squad.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.id.toLowerCase().includes(query) ||
          p.role.toLowerCase().includes(query) ||
          p.batting.toLowerCase().includes(query) ||
          p.bowling.toLowerCase().includes(query)
        );
        this.renderSquadTable(filtered);
      });
    }
  },

  showToast: function(message) {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.backgroundColor = 'var(--bg-card)';
    toast.style.color = 'var(--text-main)';
    toast.style.border = '1px solid var(--accent)';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.4)';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '8px';
    toast.style.fontWeight = 'bold';
    toast.style.fontSize = '13px';
    toast.style.zIndex = '9999';
    toast.style.animation = 'fadeIn 0.2s ease';
    toast.innerText = message;

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};
