import type { 
  Club, 
  Player, 
  TrainingLog, 
  NetAllocation, 
  MatchRecord, 
  StadiumTier, 
  FinancialRecord, 
  StaffMember, 
  CalendarEvent, 
  CricketRecord 
} from '../types/database';

export const fallbackClub: Club = {
  id: '13108',
  name: 'Somnath Super Devs',
  manager: 'Devs',
  region: 'Tamil Nadu, India',
  division_fc: 'VIII.17 (#1)',
  division_od: 'V.62 (#2)',
  division_t20: 'VII.241 (#1)',
  fan_club_members: 781,
  fan_mood: 'Over the Moon',
  sponsor_confidence: 'Ecstatic',
  morale: 'Over the Moon',
  bank_balance: 1325820,
  weekly_wage_bill: 7034,
  stadium_name: 'Prabhas Coastal Oval (13108)',
  stadium_capacity: 10000,
  form_avg: 'Superb',
  coach_quality: 'Competent',
  its_points: 70
};

// 100% Fresh Slate: Squad starts empty awaiting real Battrick squad.asp ingestion
export const fallbackSquad: Player[] = [];

// 10 Training Nets Facility
export const fallbackNets: NetAllocation[] = [
  { club_id: '13108', net_number: 1, training_type: 'Bowling (Finger Spin)', player_id: null, player_name: 'Unassigned', coach_multiplier: 1.00, pops_estimated_weeks: null, notes: 'Net unassigned' },
  { club_id: '13108', net_number: 2, training_type: 'Batting (Opening Technique)', player_id: null, player_name: 'Unassigned', coach_multiplier: 1.00, pops_estimated_weeks: null, notes: 'Net unassigned' },
  { club_id: '13108', net_number: 3, training_type: 'Fielding (Slip Catching)', player_id: null, player_name: 'Unassigned', coach_multiplier: 1.00, pops_estimated_weeks: null, notes: 'Net unassigned' },
  { club_id: '13108', net_number: 4, training_type: 'Wicket Keeping (Glovework)', player_id: null, player_name: 'Unassigned', coach_multiplier: 1.00, pops_estimated_weeks: null, notes: 'Net unassigned' },
  { club_id: '13108', net_number: 5, training_type: 'Fitness & Stamina', player_id: null, player_name: 'Unassigned', coach_multiplier: 1.00, pops_estimated_weeks: null, notes: 'Net unassigned' },
  { club_id: '13108', net_number: 6, training_type: 'Batting (Middle Order)', player_id: null, player_name: 'Unassigned', coach_multiplier: 1.00, pops_estimated_weeks: null, notes: 'Net unassigned' },
  { club_id: '13108', net_number: 7, training_type: 'Bowling (Opening Seam)', player_id: null, player_name: 'Unassigned', coach_multiplier: 1.00, pops_estimated_weeks: null, notes: 'Net unassigned' },
  { club_id: '13108', net_number: 8, training_type: 'Bowling (Strike Pace)', player_id: null, player_name: 'Unassigned', coach_multiplier: 1.00, pops_estimated_weeks: null, notes: 'Net unassigned' },
  { club_id: '13108', net_number: 9, training_type: 'Batting (Finisher)', player_id: null, player_name: 'Unassigned', coach_multiplier: 1.00, pops_estimated_weeks: null, notes: 'Net unassigned' },
  { club_id: '13108', net_number: 10, training_type: 'Open Net (Rotation)', player_id: null, player_name: 'Unassigned', coach_multiplier: 1.00, pops_estimated_weeks: null, notes: 'Net unassigned' }
];

// Backroom Staff
export const fallbackStaff: StaffMember[] = [
  { id: 'st-1', role: 'Fielding Coach', name: 'Devdutt Raman', skillLevel: 'Competent', weeklyWage: 2000, impactDescription: 'Direct multiplier on team ground fielding, throwing, and slip catching.', synergyBonus: '1.15x Catching Efficiency' },
  { id: 'st-2', role: 'Public Relations Officer (Lead)', name: 'Shakti Mak', skillLevel: 'Masterclass', weeklyWage: 4250, impactDescription: 'Lead of 5 PR Officers. Maintains sponsor confidence and drives weekly fan signups.', synergyBonus: '+15 Members per Week' },
  { id: 'st-3', role: 'Financial Advisor (Senior)', name: 'S. K. Verma', skillLevel: 'Proficient', weeklyWage: 3000, impactDescription: 'Lead of 3 Financial Advisors. Manages treasury yield and weekly interest calculations.', synergyBonus: 'Maximizes Compound Interest' },
  { id: 'st-4', role: 'Groundsman', name: 'Shyamal Dangasela', skillLevel: 'Competent', weeklyWage: 2000, impactDescription: 'Groundsman for Prabhas Coastal Oval. Prepares default Hard & Fast pitch.', synergyBonus: '+25% Express Pace Bonus' },
  { id: 'st-5', role: 'Youth Academy Director', name: 'Girish Kumble', skillLevel: 'Superb', weeklyWage: 1000, impactDescription: 'Superb Academy condition. Holds 70 unallocated Intensive Training Sessions (ITS).', synergyBonus: 'Top-Tier Youth Potential' }
];

// Calendar
export const fallbackCalendar: CalendarEvent[] = [
  { id: 'cal-1', date: '2026-11-20', dayOfWeek: 'Friday', time: '04:30 UTC', type: 'MATCH_OD', title: 'OD League Round 12', details: 'One Day Division V.62 fixture. Standings: #2 in V.62.', venue: 'Prabhas Coastal Oval', importance: 'HIGH' },
  { id: 'cal-2', date: '2026-11-21', dayOfWeek: 'Saturday', time: '05:00 UTC', type: 'TRAINING_POP', title: 'Saturday Training & Financial Updates', details: 'All training nets evaluated, pops announced, weekly staff/player wages deducted.', importance: 'CRITICAL' },
  { id: 'cal-3', date: '2026-11-21', dayOfWeek: 'Saturday', time: '06:00 UTC', type: 'YOUTH_DRAFT', title: 'Saturday Youth Academy Pull (70 ITS Bank)', details: 'Superb Academy condition ready for 17yo draft pull.', importance: 'HIGH' },
  { id: 'cal-4', date: '2026-11-24', dayOfWeek: 'Tuesday', time: '07:30 UTC', type: 'MATCH_FC', title: 'FC Match Day', details: 'Orders must be submitted 20 minutes prior.', venue: 'Prabhas Coastal Oval', importance: 'HIGH' },
  { id: 'cal-5', date: '2026-11-27', dayOfWeek: 'Friday', time: '04:30 UTC', type: 'MATCH_OD', title: 'OD League Round 13', details: 'One Day League matchday.', venue: 'Prabhas Coastal Oval', importance: 'HIGH' },
  { id: 'cal-6', date: '2026-11-28', dayOfWeek: 'Saturday', time: '05:00 UTC', type: 'FINANCE_UPDATE', title: 'Weekly Financial Accounting Settlement', details: 'Sponsor payment credited; staff salaries and wages deducted.', importance: 'CRITICAL' }
];

// 100% Fresh Slate: Matches, Records, Finances, and Training Logs start completely empty
export const fallbackRecords: CricketRecord[] = [];
export const fallbackTrainingLogs: TrainingLog[] = [];
export const fallbackMatches: MatchRecord[] = [];
export const fallbackFinances: FinancialRecord[] = [];

// Stadium Dimensions from ground.asp
export const fallbackStadiumTiers: StadiumTier[] = [
  { id: 'st-1', club_id: '13108', tier_name: 'Standing Room', current_seats: 5275, optimal_ratio: 0.5275, recommended_seats: 6000, ticket_price: 5.00, expansion_cost_per_seat: 35.00 },
  { id: 'st-2', club_id: '13108', tier_name: 'Uncovered Seats', current_seats: 3270, optimal_ratio: 0.3270, recommended_seats: 4000, ticket_price: 8.00, expansion_cost_per_seat: 48.00 },
  { id: 'st-3', club_id: '13108', tier_name: 'Covered Seats', current_seats: 1100, optimal_ratio: 0.1100, recommended_seats: 1500, ticket_price: 14.00, expansion_cost_per_seat: 72.00 },
  { id: 'st-4', club_id: '13108', tier_name: 'Members Seats', current_seats: 355, optimal_ratio: 0.0355, recommended_seats: 500, ticket_price: 25.00, expansion_cost_per_seat: 120.00 }
];
