/**
 * BT360MAK - charts.js
 * Sovereign Vector Visualization Engine
 * Subskill Curves & Somnath Super Devs Weekly Cashflow
 */

const BT_CHARTS = {
  renderProgressionGraph: function(containerId, dataPoints) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = container.clientWidth || 380;
    const height = 180;
    const padding = 28;

    // Real Somnath 17yo Wonderkid Progression (5.0 Mediocre ➔ 6.0 Competent POP)
    const points = dataPoints || [
      { week: 'W1', val: 5.2 },
      { week: 'W2', val: 5.4 },
      { week: 'W3', val: 5.6 },
      { week: 'W4', val: 5.8 },
      { week: 'W5', val: 5.95 },
      { week: 'W6', val: 6.0 }, // POP to Competent!
      { week: 'W7', val: 6.08 }
    ];

    const minVal = 4.8;
    const maxVal = 6.4;

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

      const isPop = pt.val >= 6.0 && points[idx - 1] && points[idx - 1].val < 6.0;
      circlesHtml += `
        <circle cx="${x}" cy="${y}" r="${isPop ? 6 : 4}" fill="${isPop ? '#10b981' : '#38bdf8'}" stroke="#ffffff" stroke-width="2">
          <title>${pt.week}: Level ${pt.val} ${isPop ? '(POP to Competent!)' : ''}</title>
        </circle>
        <text x="${x}" y="${height - 8}" text-anchor="middle" font-size="10" fill="#86efac">${pt.week}</text>
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
        <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="rgba(26,77,68,0.5)" stroke-dasharray="3,3" />
        <line x1="${padding}" y1="${height / 2}" x2="${width - padding}" y2="${height / 2}" stroke="rgba(26,77,68,0.5)" stroke-dasharray="3,3" />
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="rgba(26,77,68,0.8)" />

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

    // Real Somnath Super Devs Weekly Cashflow (£k)
    const data = weeklyRecords || [
      { week: 'W1', in: 126, out: 34 },
      { week: 'W2', in: 110, out: 32 },
      { week: 'W3', in: 135, out: 35 },
      { week: 'W4', in: 122, out: 31 },
      { week: 'W5', in: 126, out: 34 }
    ];

    const maxVal = 160;
    const colWidth = 24;
    let barsHtml = '';

    data.forEach((d, i) => {
      const groupX = padding + (i * ((width - (padding * 2)) / data.length)) + 15;
      const hIn = (d.in / maxVal) * (height - (padding * 2));
      const hOut = (d.out / maxVal) * (height - (padding * 2));

      const yIn = height - padding - hIn;
      const yOut = height - padding - hOut;

      barsHtml += `
        <!-- Inflow Bar (Emerald) -->
        <rect x="${groupX}" y="${yIn}" width="${colWidth / 2}" height="${hIn}" rx="3" fill="#10b981">
          <title>${d.week} Inflow: £${d.in}k</title>
        </rect>
        <!-- Outflow Bar (Cherry) -->
        <rect x="${groupX + (colWidth / 2) + 2}" y="${yOut}" width="${colWidth / 2}" height="${hOut}" rx="3" fill="#f43f5e">
          <title>${d.week} Outflow: £${d.out}k</title>
        </rect>
        <text x="${groupX + (colWidth / 2)}" y="${height - 6}" text-anchor="middle" font-size="10" fill="#86efac">${d.week}</text>
      `;
    });

    const svg = `
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}">
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="rgba(26,77,68,0.8)" />
        ${barsHtml}
      </svg>
    `;
    container.innerHTML = svg;
  }
};
