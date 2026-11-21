/**
 * Cricket & Battrick Data Formatters
 * Formats verbose Battrick raw strings (e.g. "R H finger spin", "Right-arm Fast Medium")
 * into concise, standard cricket scorecard codes (e.g. "R FS", "L FS", "R FM", "RHB")
 */

export function formatBowlingType(raw?: string): string {
  if (!raw) return '-';
  const clean = raw.trim();
  const lower = clean.toLowerCase();

  if (lower === 'none' || lower === '-' || lower === 'unassigned' || lower === 'n/a') {
    return '-';
  }

  // Determine Bowling Arm (Left vs Right)
  // Handles "Left-arm", "LH", "L H", "L", "left"
  const isLeft = lower.startsWith('l') || lower.includes('left-arm') || lower.includes('left arm') || lower.includes('l h');
  const arm = isLeft ? 'L' : 'R';

  // Finger Spin (Off-spin / orthodox)
  if (lower.includes('finger') || lower.includes('off spin') || lower.includes('off-spin') || lower.includes('orthodox')) {
    return `${arm} FS`;
  }

  // Wrist Spin (Leg-break / un-orthodox / chinaman)
  if (lower.includes('wrist') || lower.includes('leg spin') || lower.includes('leg-spin') || lower.includes('chinaman') || lower.includes('googly')) {
    return `${arm} WS`;
  }

  // Fast-Medium Pace
  if (lower.includes('fast-medium') || lower.includes('fast medium') || lower.includes('fm')) {
    return `${arm} FM`;
  }

  // Slow-Medium Pace
  if (lower.includes('slow-medium') || lower.includes('slow medium') || lower.includes('sm')) {
    return `${arm} SM`;
  }

  // Express Fast Pace
  if (lower.includes('fast') || lower.includes('express')) {
    return `${arm} F`;
  }

  // Medium Pace
  if (lower.includes('medium')) {
    return `${arm} M`;
  }

  // General Spin fallback
  if (lower.includes('spin')) {
    return `${arm} Spin`;
  }

  return clean;
}

export function getBowlingTypeFullName(raw?: string): string {
  const short = formatBowlingType(raw);
  switch (short) {
    case 'R FS': return 'Right-arm Finger Spin (Off-break)';
    case 'L FS': return 'Left-arm Finger Spin (Orthodox)';
    case 'R WS': return 'Right-arm Wrist Spin (Leg-break / Googly)';
    case 'L WS': return 'Left-arm Wrist Spin (Unorthodox / Chinaman)';
    case 'R FM': return 'Right-arm Fast Medium Pace';
    case 'L FM': return 'Left-arm Fast Medium Pace';
    case 'R F':  return 'Right-arm Express Fast Bowler';
    case 'L F':  return 'Left-arm Express Fast Bowler';
    case 'R M':  return 'Right-arm Medium Pace';
    case 'L M':  return 'Left-arm Medium Pace';
    case 'R SM': return 'Right-arm Slow Medium Pace';
    case 'L SM': return 'Left-arm Slow Medium Pace';
    default: return raw || 'None';
  }
}

export function formatBattingHand(raw?: string): string {
  if (!raw) return 'RHB';
  const lower = raw.toLowerCase().trim();
  if (lower.includes('left') || lower.startsWith('l')) return 'LHB';
  return 'RHB';
}

export function getBattingHandFullName(raw?: string): string {
  return formatBattingHand(raw) === 'LHB' ? 'Left-hand Bat' : 'Right-hand Bat';
}
