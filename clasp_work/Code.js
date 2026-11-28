/**
 * ============================================================================
 * BT360MAK - Battrick Sovereign Intelligence Suite
 * Google Sheets Cloud Database & Relational Persistence Engine
 * ============================================================================
 * Spreadsheet ID: 1KXQbrZ2D7aYJUAniQ5F3L8FeFfM8zmsMsIDHfl2An_E
 * Apps Script ID: 1tS9xWWXRBTlrsysAeF82qyrrFDPfHrchSpYNGmAhSZZD_D-f4nGmP7kz
 * ============================================================================
 */

const SPREADSHEET_ID = "1KXQbrZ2D7aYJUAniQ5F3L8FeFfM8zmsMsIDHfl2An_E";

function getSpreadsheet() {
  try {
    if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
      return SpreadsheetApp.openById(SPREADSHEET_ID);
    }
    return SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {
    return SpreadsheetApp.getActiveSpreadsheet();
  }
}

const SCHEMA = {
  Club: [
    "Club ID", "Club Name", "Manager Name", "Region", "FC Division", 
    "OD Division", "T20 Division", "Bank Balance (£)", "Weekly Wage Bill (£)", 
    "Stadium Name", "Stadium Capacity", "Fan Club Size", "Fan Mood", 
    "Sponsor Confidence", "Team Morale", "Youth Academy Level", 
    "ITS Reserve", "Pitch Condition", "Last Updated"
  ],
  Squad: [
    "Player ID", "Club ID", "Player Name", "Age", "Weekly Wage (£)", "BTI", 
    "Batting Hand", "Bowling Type", "Batting Skill", "Bowling Skill", 
    "Keeping Skill", "Fielding Skill", "Concentration", "Consistency", 
    "Stamina", "Form", "Fatigue", "Leadership", "Experience", 
    "Subskill Info", "Assigned Net", "Player Role", "Wonderkid Trainee", 
    "FC Matches", "FC Runs", "FC Average", "FC 100s", 
    "FC 50s", "FC High Score", "FC Wickets", "FC Bowling Avg", 
    "FC Best Bowling", "OD Runs", "OD Wickets", "T20 Runs", "T20 Wickets", "Last Updated"
  ],
  Matches: [
    "Match ID", "Club ID", "Match Date", "Format", "Opponent Club", 
    "Venue", "Pitch Surface", "Result", "Status", "Score Summary", 
    "Top Performer", "Full JSON Payload", "Concluded Timestamp"
  ],
  Records: [
    "Record ID", "Club ID", "Category", "Record Name", "Holder Player Name", 
    "Record Value", "Match Context", "Date Achieved"
  ],
  Finances: [
    "Week Number", "Club ID", "Week Date", "Gate Receipts (£)", "Sponsors (£)", 
    "Merchandise (£)", "Prize Money (£)", "Total Inflow (£)", "Player Wages (£)", 
    "Staff Wages (£)", "Ground Upkeep (£)", "Youth Academy (£)", 
    "Total Outflow (£)", "Net Profit/Loss (£)", "Bank Balance (£)", 
    "Financial Notes", "Recorded At"
  ],
  Stadium: [
    "Tier ID", "Club ID", "Tier Name", "Current Seats", "Optimal Distribution (%)", 
    "Recommended Seats", "Ticket Price (£)", "Expansion Cost (£)", "Last Upgraded"
  ],
  Nets: [
    "Net Slot #", "Club ID", "Assigned Player ID", "Assigned Player Name", 
    "Primary Training Skill", "Coach Multiplier", 
    "Estimated Weeks to Pop", "Coach Notes", "Last Modified"
  ],
  TrainingLogs: [
    "Log ID", "Club ID", "Player ID", "Player Name", "Skill Popped", 
    "Pop Date", "Previous Level", "New Level", 
    "Weeks Taken", "Coach Quality", "Confirmed"
  ],
  Staff: [
    "Staff ID", "Club ID", "Staff Role", "Staff Name", "Weekly Wage (£)", 
    "Skill Level / Efficiency", "Impact Description", "Synergy Bonus"
  ],
  Calendar: [
    "Event ID", "Club ID", "Event Date", "Day of Week", "Time", "Event Type", 
    "Event Title", "Details", "Venue", "Importance"
  ]
};

function setupBT360Database() {
  const ss = getSpreadsheet();
  const tabNames = Object.keys(SCHEMA);

  tabNames.forEach(function(tabName) {
    let sheet = ss.getSheetByName(tabName);
    if (!sheet) {
      sheet = ss.insertSheet(tabName);
    }

    const headers = SCHEMA[tabName];
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);

    headerRange.setBackground("#064e3b")
               .setFontColor("#FFFFFF")
               .setFontWeight("bold")
               .setFontFamily("Segoe UI")
               .setFontSize(10)
               .setHorizontalAlignment("center")
               .setVerticalAlignment("middle");

    sheet.setRowHeight(1, 38);
    sheet.setFrozenRows(1);

    for (let c = 1; c <= headers.length; c++) {
      try {
        sheet.autoResizeColumn(c);
        const colWidth = sheet.getColumnWidth(c);
        if (colWidth < 120) {
          sheet.setColumnWidth(c, 120);
        } else if (colWidth > 300) {
          sheet.setColumnWidth(c, 300);
        }
      } catch (e) {}
    }
  });

  const sheet1 = ss.getSheetByName("Sheet1");
  if (sheet1 && ss.getSheets().length > 1) {
    try {
      ss.deleteSheet(sheet1);
    } catch (e) {}
  }

  Logger.log("✅ BT360MAK Database setup complete! All 10 tabs formatted successfully.");
  return { status: "success", message: "All 10 tabs formatted with Sovereign Emerald styling." };
}

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "getAllData";
    const ss = getSpreadsheet();

    if (action === "ping") {
      return jsonResponse({
        status: "success",
        connected: true,
        spreadsheetId: ss.getId(),
        spreadsheetName: ss.getName(),
        timestamp: new Date().toISOString()
      });
    }

    if (action === "setup") {
      return jsonResponse(setupBT360Database());
    }

    if (action === "getTab") {
      const tabName = e.parameter.tab || "Squad";
      const sheet = ss.getSheetByName(tabName);
      if (!sheet) {
        return jsonResponse({ status: "error", message: "Tab " + tabName + " not found" });
      }
      const data = getSheetRowsAsObjects(sheet);
      return jsonResponse({ status: "success", tab: tabName, count: data.length, data: data });
    }

    const allData = {
      status: "success",
      timestamp: new Date().toISOString(),
      club: getClubData(ss),
      squad: getSheetRowsAsObjects(ss.getSheetByName("Squad")),
      matches: getSheetRowsAsObjects(ss.getSheetByName("Matches")),
      records: getSheetRowsAsObjects(ss.getSheetByName("Records")),
      finances: getSheetRowsAsObjects(ss.getSheetByName("Finances")),
      stadium: getSheetRowsAsObjects(ss.getSheetByName("Stadium")),
      nets: getSheetRowsAsObjects(ss.getSheetByName("Nets")),
      trainingLogs: getSheetRowsAsObjects(ss.getSheetByName("TrainingLogs")),
      staff: getSheetRowsAsObjects(ss.getSheetByName("Staff")),
      calendar: getSheetRowsAsObjects(ss.getSheetByName("Calendar"))
    };

    return jsonResponse(allData);
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ status: "error", message: "No payload provided." });
    }

    const payload = JSON.parse(e.postData.contents);
    const action = payload.action || "syncAll";
    const ss = getSpreadsheet();

    if (action === "resetAll") {
      const tabNames = Object.keys(SCHEMA);
      tabNames.forEach(function(tab) {
        const sheet = ss.getSheetByName(tab);
        if (sheet && sheet.getLastRow() > 1) {
          sheet.deleteRows(2, sheet.getLastRow() - 1);
        }
      });
      return jsonResponse({ status: "success", message: "All 10 tabs wiped clean to fresh slate." });
    }

    if (action === "setup") {
      return jsonResponse(setupBT360Database());
    }

    if (action === "saveClub" && payload.club) {
      saveClubToSheet(ss, payload.club);
      return jsonResponse({ status: "success", message: "Club details updated." });
    }

    if (action === "saveSquad" && Array.isArray(payload.squad)) {
      saveSquadToSheet(ss, payload.squad);
      return jsonResponse({ status: "success", count: payload.squad.length });
    }

    if (action === "saveMatches" && Array.isArray(payload.matches)) {
      saveMatchesToSheet(ss, payload.matches);
      return jsonResponse({ status: "success", count: payload.matches.length });
    }

    if (action === "syncAll") {
      if (payload.club) saveClubToSheet(ss, payload.club);
      if (Array.isArray(payload.squad)) saveSquadToSheet(ss, payload.squad);
      if (Array.isArray(payload.matches)) saveMatchesToSheet(ss, payload.matches);
      if (Array.isArray(payload.records)) saveRecordsToSheet(ss, payload.records);
      if (Array.isArray(payload.finances)) saveFinancesToSheet(ss, payload.finances);
      if (Array.isArray(payload.stadium)) saveStadiumToSheet(ss, payload.stadium);
      if (Array.isArray(payload.nets)) saveNetsToSheet(ss, payload.nets);
      if (Array.isArray(payload.trainingLogs)) saveTrainingLogsToSheet(ss, payload.trainingLogs);
      if (Array.isArray(payload.staff)) saveStaffToSheet(ss, payload.staff);
      if (Array.isArray(payload.calendar)) saveCalendarToSheet(ss, payload.calendar);

      return jsonResponse({
        status: "success",
        message: "Full synchronization completed successfully across all tabs.",
        timestamp: new Date().toISOString()
      });
    }

    return jsonResponse({ status: "error", message: "Unknown action: " + action });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

function getSheetRowsAsObjects(sheet) {
  if (!sheet || sheet.getLastRow() <= 1) return [];
  const numRows = sheet.getLastRow() - 1;
  const numCols = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, numCols).getValues()[0];
  const rows = sheet.getRange(2, 1, numRows, numCols).getValues();

  return rows.map(function(row) {
    const obj = {};
    headers.forEach(function(header, idx) {
      const key = cleanHeaderKey(header);
      obj[key] = row[idx];
    });
    return obj;
  });
}

function cleanHeaderKey(header) {
  return String(header)
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/[£$]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

function getClubData(ss) {
  const sheet = ss.getSheetByName("Club");
  if (!sheet || sheet.getLastRow() <= 1) return null;
  const rows = getSheetRowsAsObjects(sheet);
  return rows.length > 0 ? rows[0] : null;
}

function saveClubToSheet(ss, club) {
  let sheet = ss.getSheetByName("Club");
  if (!sheet) {
    setupBT360Database();
    sheet = ss.getSheetByName("Club");
  }

  if (sheet.getLastRow() > 1) {
    sheet.deleteRows(2, sheet.getLastRow() - 1);
  }

  const row = [
    club.id || "",
    club.name || "",
    club.manager || "",
    club.region || "",
    club.division_fc || "",
    club.division_od || "",
    club.division_t20 || "",
    club.bank_balance ?? 0,
    club.weekly_wage_bill ?? 0,
    club.stadium_name || "",
    club.stadium_capacity ?? 0,
    club.fan_club_members ?? club.fan_club_size ?? 0,
    club.fan_mood || "",
    club.sponsor_confidence || "",
    club.morale || "",
    club.youth_academy_level || "",
    club.its_points ?? club.its_bank ?? 0,
    club.pitch_condition || club.pitch || "",
    new Date().toISOString()
  ];

  sheet.appendRow(row);
}

function saveSquadToSheet(ss, squad) {
  let sheet = ss.getSheetByName("Squad");
  if (!sheet) {
    setupBT360Database();
    sheet = ss.getSheetByName("Squad");
  }

  if (sheet.getLastRow() > 1) {
    sheet.deleteRows(2, sheet.getLastRow() - 1);
  }

  if (squad.length === 0) return;

  const rows = squad.map(function(p) {
    const fc = p.statsFC || {};
    const od = p.statsOD || {};
    const t20 = p.statsT20 || {};
    return [
      p.id || "",
      p.club_id || "",
      p.name || "",
      p.age || 0,
      p.wage || 0,
      p.bti || 0,
      p.batting_hand || "Right hand batsman",
      p.bowling_type || "Right arm medium",
      p.batting || "worthless",
      p.bowling || "worthless",
      p.keeping || "worthless",
      p.fielding || "worthless",
      p.concentration || "worthless",
      p.consistency || "worthless",
      p.stamina || "worthless",
      p.form || "proficient",
      p.fatigue || "energised",
      p.leadership || "worthless",
      p.experience || "worthless",
      p.subskill ?? p.subskill_info ?? 0,
      p.active_net || p.training_net || "Unassigned",
      p.tactical_role || p.role || "Squad",
      p.is_wonderkid ? "YES" : "NO",
      fc.matches ?? 0,
      fc.runs ?? 0,
      fc.average ?? 0,
      fc.centuries ?? 0,
      fc.fifties ?? 0,
      fc.highestScore ?? "-",
      fc.wickets ?? 0,
      fc.bowlingAverage ?? 0,
      fc.bestBowling ?? "-",
      od.runs ?? 0,
      od.wickets ?? 0,
      t20.runs ?? 0,
      t20.wickets ?? 0,
      new Date().toISOString()
    ];
  });

  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}

function saveMatchesToSheet(ss, matches) {
  let sheet = ss.getSheetByName("Matches");
  if (!sheet) {
    setupBT360Database();
    sheet = ss.getSheetByName("Matches");
  }

  if (sheet.getLastRow() > 1) {
    sheet.deleteRows(2, sheet.getLastRow() - 1);
  }

  if (matches.length === 0) return;

  const rows = matches.map(function(m) {
    return [
      m.id || "",
      m.club_id || "",
      m.match_date || m.date || "",
      m.match_type || m.format || "First Class",
      m.opponent_club || "",
      m.venue || "Home",
      m.pitch_type || m.pitch || "Hard & Fast",
      m.result || "Concluded",
      m.status || "completed",
      m.scoreSummary || m.summary || "",
      m.topPerformer || "",
      m.scorecardData ? JSON.stringify(m.scorecardData) : "",
      new Date().toISOString()
    ];
  });

  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}

function saveRecordsToSheet(ss, records) {
  let sheet = ss.getSheetByName("Records");
  if (!sheet) return;
  if (sheet.getLastRow() > 1) sheet.deleteRows(2, sheet.getLastRow() - 1);
  if (records.length === 0) return;

  const rows = records.map(function(r, idx) {
    return [
      r.id || ("rec-" + (idx + 1)),
      r.club_id || "",
      r.category || "",
      r.recordName || r.record_name || "",
      r.holder || r.player_name || "",
      r.value || r.record_value || "",
      r.matchContext || r.match_context || "",
      r.date || ""
    ];
  });

  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}

function saveFinancesToSheet(ss, finances) {
  let sheet = ss.getSheetByName("Finances");
  if (!sheet) return;
  if (sheet.getLastRow() > 1) sheet.deleteRows(2, sheet.getLastRow() - 1);
  if (finances.length === 0) return;

  const rows = finances.map(function(f) {
    return [
      f.week_number ?? f.week ?? 0,
      f.club_id || "",
      f.record_date || f.date || "",
      f.gate_receipts ?? 0,
      f.sponsors ?? 0,
      f.merchandise ?? 0,
      f.prize_money ?? 0,
      f.total_inflow ?? 0,
      f.player_wages ?? 0,
      f.staff_wages ?? 0,
      f.stadium_upkeep ?? f.upkeep ?? 0,
      f.youth_academy ?? f.academy ?? 0,
      f.total_outflow ?? 0,
      f.net_weekly_pnl ?? f.net_pnl ?? 0,
      f.cumulative_bank_balance ?? f.balance ?? 0,
      f.category || f.notes || "",
      new Date().toISOString()
    ];
  });

  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}

function saveStadiumToSheet(ss, stadium) {
  let sheet = ss.getSheetByName("Stadium");
  if (!sheet) return;
  if (sheet.getLastRow() > 1) sheet.deleteRows(2, sheet.getLastRow() - 1);
  if (stadium.length === 0) return;

  const rows = stadium.map(function(s) {
    return [
      s.id || s.tier_id || "",
      s.club_id || "",
      s.tier_name || s.name || "",
      s.current_seats ?? 0,
      s.optimal_ratio ?? 0,
      s.recommended_seats ?? 0,
      s.ticket_price ?? 0,
      s.expansion_cost_per_seat ?? s.expansion_cost ?? 0,
      new Date().toISOString()
    ];
  });

  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}

function saveNetsToSheet(ss, nets) {
  let sheet = ss.getSheetByName("Nets");
  if (!sheet) return;
  if (sheet.getLastRow() > 1) sheet.deleteRows(2, sheet.getLastRow() - 1);
  if (nets.length === 0) return;

  const rows = nets.map(function(n) {
    return [
      n.net_number || 0,
      n.club_id || "",
      n.player_id || "",
      n.player_name || "Unassigned",
      n.training_type || "",
      n.coach_multiplier ?? 1.0,
      n.pops_estimated_weeks ?? n.pops_forecast ?? "",
      n.notes || "",
      new Date().toISOString()
    ];
  });

  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}

function saveTrainingLogsToSheet(ss, logs) {
  let sheet = ss.getSheetByName("TrainingLogs");
  if (!sheet) return;
  if (sheet.getLastRow() > 1) sheet.deleteRows(2, sheet.getLastRow() - 1);
  if (logs.length === 0) return;

  const rows = logs.map(function(l) {
    return [
      l.id || "",
      l.club_id || "",
      l.player_id || "",
      l.player_name || "",
      l.skill_trained || "",
      l.log_date || "",
      l.previous_level || "",
      l.new_level || "",
      l.weeks_taken ?? 0,
      l.coach_quality || "",
      l.pop_confirmed ? "YES" : "NO"
    ];
  });

  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}

function saveStaffToSheet(ss, staff) {
  let sheet = ss.getSheetByName("Staff");
  if (!sheet) return;
  if (sheet.getLastRow() > 1) sheet.deleteRows(2, sheet.getLastRow() - 1);
  if (staff.length === 0) return;

  const rows = staff.map(function(st) {
    return [
      st.id || "",
      st.club_id || "",
      st.role || "",
      st.name || "",
      st.weeklyWage ?? st.wage ?? 0,
      st.skillLevel || st.efficiency || "",
      st.impactDescription || "",
      st.synergyBonus || ""
    ];
  });

  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}

function saveCalendarToSheet(ss, calendar) {
  let sheet = ss.getSheetByName("Calendar");
  if (!sheet) return;
  if (sheet.getLastRow() > 1) sheet.deleteRows(2, sheet.getLastRow() - 1);
  if (calendar.length === 0) return;

  const rows = calendar.map(function(c) {
    return [
      c.id || "",
      c.club_id || "",
      c.date || "",
      c.dayOfWeek || "",
      c.time || "",
      c.type || "",
      c.title || "",
      c.details || "",
      c.venue || "",
      c.importance || "NORMAL"
    ];
  });

  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
