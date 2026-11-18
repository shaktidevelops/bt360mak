export interface Club {
  id: string;
  name: string;
  manager: string;
  region: string;
  division_fc: string;
  division_od: string;
  division_t20: string;
  fan_club_members: number;
  fan_mood: string;
  sponsor_confidence: string;
  morale: string;
  bank_balance: number;
  weekly_wage_bill: number;
  stadium_name: string;
  stadium_capacity: number;
  form_avg: string;
  coach_quality: string;
  its_points: number;
}

export interface PlayerStats {
  matches: number;
  innings: number;
  runs: number;
  highestScore: string;
  average: number;
  strikeRate: number;
  centuries: number;
  fifties: number;
  fours: number;
  sixes: number;
  oversBowled: number;
  wickets: number;
  bestBowling: string;
  bowlingAverage: number;
  economy: number;
  fiveWickets: number;
  catches: number;
  stumpings: number;
}

export interface Player {
  id: string; // Clean number without "BT-" e.g. "6099466"
  club_id: string;
  name: string;
  age: number;
  wage: number;
  batting_hand: string;
  bowling_type: string;
  batting: string;
  bowling: string;
  keeping: string;
  fielding: string;
  consistency: string;
  concentration: string;
  stamina: string;
  form: string;
  fatigue: string;
  leadership: string;
  experience: string;
  bti: number;
  subskill: number;
  active_net: string;
  market_value: number;
  tactical_role: string;
  is_wonderkid: boolean;
  uniqueRecords: string[];
  statsFC: PlayerStats;
  statsOD: PlayerStats;
  statsT20: PlayerStats;
}

export interface StaffMember {
  id: string;
  role: string;
  name: string;
  skillLevel: string;
  weeklyWage: number;
  impactDescription: string;
  synergyBonus: string;
}

export interface CalendarEvent {
  id: string;
  date: string;
  dayOfWeek: string;
  time: string;
  type: 'MATCH_FC' | 'MATCH_OD' | 'MATCH_T20' | 'TRAINING_POP' | 'FINANCE_UPDATE' | 'YOUTH_DRAFT' | 'SPONSOR_PAYMENT';
  title: string;
  details: string;
  venue?: string;
  importance: 'HIGH' | 'CRITICAL' | 'NORMAL';
}

export interface CricketRecord {
  category: 'BATTING' | 'BOWLING' | 'PARTNERSHIP' | 'TEAM';
  recordName: string;
  holder: string;
  value: string;
  matchContext: string;
  date: string;
}

export interface TrainingLog {
  id: string;
  club_id: string;
  player_id: string;
  log_date: string;
  skill_trained: string;
  previous_level: string;
  new_level: string;
  subskill: number;
  weeks_taken: number;
  coach_quality: string;
  pop_confirmed: boolean;
  player_name?: string;
}

export interface NetAllocation {
  club_id: string;
  net_number: number;
  training_type: string;
  player_id?: string | null;
  coach_multiplier: number;
  pops_estimated_weeks?: number | null;
  notes?: string;
  player_name?: string;
}

export interface MatchRecord {
  id: string;
  club_id: string;
  match_date: string;
  match_type: string;
  opponent_club: string;
  venue: string;
  pitch_type: string;
  result?: string;
  status: 'completed' | 'upcoming';
  scoreSummary?: string;
  topPerformer?: string;
}

export interface FinancialRecord {
  id: string;
  club_id: string;
  week_number: number;
  record_date: string;
  gate_receipts: number;
  sponsors: number;
  merchandise: number;
  prize_money: number;
  total_inflow: number;
  player_wages: number;
  staff_wages: number;
  stadium_upkeep: number;
  youth_academy: number;
  total_outflow: number;
  net_weekly_pnl: number;
  cumulative_bank_balance: number;
  category?: string;
}

export interface StadiumTier {
  id: string;
  club_id: string;
  tier_name: string;
  current_seats: number;
  optimal_ratio: number;
  recommended_seats: number;
  ticket_price: number;
  expansion_cost_per_seat: number;
}
