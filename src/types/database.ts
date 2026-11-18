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
  created_at?: string;
  updated_at?: string;
}

export interface Player {
  id: string;
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
}

export interface TacticsLineup {
  id: string;
  club_id: string;
  batting_order: number;
  player_id: string;
  role: string;
  aggression: string;
  bowling_order: string;
  max_overs?: number | null;
  player_name?: string;
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
