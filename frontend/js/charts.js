/**
 * BT360MAK - charts.js
 * High-performance lightweight vector/canvas visualization engine.
 * Renders:
 * 1. Player Subskill Growth Curves
 * 2. Financial Cashflow Bars
 * 3. Tactical Pitch Synergy Radar
 */

const BT_CHARTS = {
  renderProgressionGraph: function(containerId, dataPoints) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = container.clientWidth || 380;
    const height = 180;
    const padding = 28;

    const points = dataPoints || [
      { week: 'W1', val: 14.1 },
      { week: 'W2', val: 14.3 },
      { week: 'W3', val: 14.5 },
      { week: 'W4', val: 14.7 },
      { week: 'W5', val: 14.9 },
      { week: 'W6', val: 15.0 }, // POP!
      { week: 'W7', val: 15.2 }
    ];

    const minVal = 13.5;
    const maxVal = 15.5;

    let pathD = '';
    let circlesHtml = '';

    points.forEach((pt, idx) => {
      const x = padding + (idx * ((width - (padding * 2)) / (points.length - 1)));
      const y = height - padding - ((pt.val - minVal) / (maxVal - minVal) * (height - (padding * 2)));

      if (idx === 0) {
        pathD += `M ${x} ${y}`;
      } else {
        pathD += ` L ${x} ${y}`;
      }

      const isPop = pt.val >= 15.0 && points[idx - 1] && points[idx - 1].val < 15.0;
      circlesHtml += `
        <circle cx="${x}" cy="${y}" r="${isPop ? 6 : 4}" fill="${isPop ? '#10b981' : '#38bdf8'}" stroke="#ffffff" stroke-width="2">
          <title>${pt.week}: Level ${pt.val} ${isPop ? '(POP!)' : ''}</title>
        </circle>
        <text x="${x}" y="${height - 8}" text-anchor="middle" font-size="10" fill="var(--text-muted)">${pt.week}</text>
      `;
    });

    const svg = `
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow:visible;">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#38bdf8" />
            <stop offset="100%" stop-color="#10b981" />
          </linearGradient>
        </defs>
        <!-- Grid horizontal lines -->
        <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="var(--border-color)" stroke-dasharray="3,3" />
        <line x1="${padding}" y1="${height / 2}" x2="${width - padding}" y2="${height / 2}" stroke="var(--border-color)" stroke-dasharray="3,3" />
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="var(--border-color)" />

        <path d="${pathD}" fill="none" stroke="url(#lineGrad)" stroke-width="3" stroke-linecap="round" />
        ${circlesHtml}
      </svg>
    `;

    container.innerHTML = svg;
  },

  renderCashflowBars: function(containerId, weeklyRecords) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = 170;
    const padding = 24;

    const data = weeklyRecords || [
      { week: 'W1', in: 155, out: 140 },
      { week: 'W2', in: 178, out: 142 },
      { week: 'W3', in: 145, out: 145 },
      { week: 'W4', in: 210, out: 152 },
      { week: 'W5', in: 185, out: 148 }
    ];

    const maxVal = 240;
    const colWidth = 24;
    let barsHtml = '';

    data.forEach((d, i) => {
      const groupX = padding + (i * ((width - (padding * 2)) / data.length)) + 15;
      const hIn = (d.in / maxVal) * (height - (padding * 2));
      const hOut = (d.out / maxVal) * (height - (padding * 2));

      const yIn = height - padding - hIn;
      const yOut = height - padding - hOut;

      barsHtml += `
        <!-- Inflow Bar (Green) -->
        <rect x="${groupX}" y="${yIn}" width="${colWidth / 2}" height="${hIn}" rx="3" fill="#10b981">
          <title>${d.week} Inflow: $${d.in}k</title>
        </rect>
        <!-- Outflow Bar (Rose) -->
        <rect x="${groupX + (colWidth / 2) + 2}" y="${yOut}" width="${colWidth / 2}" height="${hOut}" rx="3" fill="#f43f5e">
          <title>${d.week} Outflow: $${d.out}k</title>
        </rect>
        <text x="${groupX + (colWidth / 2)}" y="${height - 6}" text-anchor="middle" font-size="10" fill="var(--text-muted)">${d.week}</text>
      `;
    });

    const svg = `
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}">
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="var(--border-color)" />
        ${barsHtml}
      </svg>
    `;
    container.innerHTML = svg;
  }
};
