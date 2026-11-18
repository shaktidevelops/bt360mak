import type { Club, Player, TrainingLog, NetAllocation, MatchRecord, StadiumTier, FinancialRecord } from '../types/database';

export const fallbackClub: Club = {
  id: '13108',
  name: 'Somnath Super Devs',
  manager: 'Shakti Mak',
  region: 'Tamil Nadu, India',
  division_fc: 'VIII.17',
  division_od: 'V.62',
  division_t20: 'VII.241',
  fan_club_members: 781,
  fan_mood: 'Over the Moon 🚀',
  sponsor_confidence: 'Delighted 💎',
  morale: 'Sublime',
  bank_balance: 1320573,
  weekly_wage_bill: 7034,
  stadium_name: 'Prabhas Coastal Oval (13108)',
  stadium_capacity: 10000,
  form_avg: 'Superb',
  coach_quality: 'Competent',
  its_points: 70
};

export const fallbackSquad: Player[] = [
  { id: 'BT-6099459', club_id: '13108', name: 'Arjun Ashraf', age: 21, wage: 284, batting_hand: 'LHB', bowling_type: 'L FM', batting: 'abysmal', bowling: 'woeful', keeping: 'feeble', fielding: 'mediocre', consistency: 'abysmal', concentration: 'mediocre', stamina: 'feeble', form: 'abysmal', fatigue: 'sublime', leadership: 'respectable', experience: 'abysmal', bti: 2664, subskill: 6.20, active_net: 'None', market_value: 164240, tactical_role: 'Squad Player', is_wonderkid: false },
  { id: 'BT-6099472', club_id: '13108', name: 'Issa Baboor', age: 26, wage: 546, batting_hand: 'RHB', bowling_type: 'R F', batting: 'competent', bowling: 'woeful', keeping: 'abysmal', fielding: 'mediocre', consistency: 'woeful', concentration: 'competent', stamina: 'competent', form: 'strong', fatigue: 'sublime', leadership: 'respectable', experience: 'feeble', bti: 7440, subskill: 6.20, active_net: 'None', market_value: 396900, tactical_role: 'Middle-Order Batter', is_wonderkid: false },
  { id: 'BT-6099468', club_id: '13108', name: 'Kamadev Battasi', age: 25, wage: 543, batting_hand: 'RHB', bowling_type: 'R H finger spin', batting: 'feeble', bowling: 'competent', keeping: 'feeble', fielding: 'woeful', consistency: 'competent', concentration: 'woeful', stamina: 'competent', form: 'respectable', fatigue: 'sublime', leadership: 'abysmal', experience: 'woeful', bti: 6665, subskill: 6.20, active_net: 'None', market_value: 369025, tactical_role: 'Lead Finger Spinner', is_wonderkid: false },
  { id: 'BT-6099466', club_id: '13108', name: 'Bhadraksh Hemalatha', age: 17, wage: 545, batting_hand: 'RHB', bowling_type: 'R H finger spin', batting: 'abysmal', bowling: 'competent', keeping: 'feeble', fielding: 'abysmal', consistency: 'competent', concentration: 'feeble', stamina: 'competent', form: 'superb', fatigue: 'sublime', leadership: 'feeble', experience: 'abysmal', bti: 6989, subskill: 6.70, active_net: 'Bowling (1)', market_value: 685557, tactical_role: 'Lead Finger Spinner (Wonderkid)', is_wonderkid: true },
  { id: 'BT-6099470', club_id: '13108', name: 'Kamal Hydrose', age: 25, wage: 538, batting_hand: 'LHB', bowling_type: 'L M', batting: 'woeful', bowling: 'competent', keeping: 'woeful', fielding: 'woeful', consistency: 'competent', concentration: 'abysmal', stamina: 'competent', form: 'superb', fatigue: 'sublime', leadership: 'woeful', experience: 'feeble', bti: 6085, subskill: 6.20, active_net: 'None', market_value: 347475, tactical_role: 'Opening Bowler', is_wonderkid: false },
  { id: 'BT-6099461', club_id: '13108', name: 'Lalit Kadam', age: 23, wage: 369, batting_hand: 'RHB', bowling_type: 'R FM', batting: 'mediocre', bowling: 'woeful', keeping: 'woeful', fielding: 'feeble', consistency: 'woeful', concentration: 'feeble', stamina: 'abysmal', form: 'woeful', fatigue: 'sublime', leadership: 'abysmal', experience: 'worthless', bti: 2206, subskill: 6.20, active_net: 'Stamina (1)', market_value: 169460, tactical_role: 'Squad Player', is_wonderkid: false },
  { id: 'BT-6099475', club_id: '13108', name: 'Achintya Kharge', age: 26, wage: 553, batting_hand: 'RHB', bowling_type: 'R M', batting: 'competent', bowling: 'woeful', keeping: 'woeful', fielding: 'competent', consistency: 'woeful', concentration: 'competent', stamina: 'competent', form: 'superb', fatigue: 'sublime', leadership: 'competent', experience: 'mediocre', bti: 8436, subskill: 6.20, active_net: 'Fielding (1)', market_value: 433510, tactical_role: 'Middle-Order Batter (C)', is_wonderkid: false },
  { id: 'BT-6099473', club_id: '13108', name: 'Vasant Malla', age: 28, wage: 544, batting_hand: 'LHB', bowling_type: 'L FM', batting: 'competent', bowling: 'feeble', keeping: 'woeful', fielding: 'mediocre', consistency: 'abysmal', concentration: 'competent', stamina: 'competent', form: 'superb', fatigue: 'sublime', leadership: 'competent', experience: 'feeble', bti: 7468, subskill: 6.20, active_net: 'None', market_value: 397380, tactical_role: 'Middle-Order Batter', is_wonderkid: false },
  { id: 'BT-6099476', club_id: '13108', name: 'Ankur Palanisamy', age: 27, wage: 510, batting_hand: 'RHB', bowling_type: 'R H finger spin', batting: 'mediocre', bowling: 'woeful', keeping: 'competent', fielding: 'feeble', consistency: 'mediocre', concentration: 'woeful', stamina: 'competent', form: 'woeful', fatigue: 'sublime', leadership: 'proficient', experience: 'abysmal', bti: 5601, subskill: 6.20, active_net: 'Wicket Keeping (1)', market_value: 323535, tactical_role: 'Primary Wicketkeeper', is_wonderkid: false },
  { id: 'BT-6099471', club_id: '13108', name: 'Nandakishor Ramdhyani', age: 17, wage: 559, batting_hand: 'LHB', bowling_type: 'L M', batting: 'competent', bowling: 'mediocre', keeping: 'woeful', fielding: 'woeful', consistency: 'feeble', concentration: 'competent', stamina: 'competent', form: 'mediocre', fatigue: 'sublime', leadership: 'competent', experience: 'abysmal', bti: 6360, subskill: 6.70, active_net: 'Batting (1)', market_value: 652230, tactical_role: 'Young Top-Order Batter (Wonderkid)', is_wonderkid: true },
  { id: 'BT-6099469', club_id: '13108', name: 'Purumitra Rishi', age: 29, wage: 549, batting_hand: 'RHB', bowling_type: 'R M', batting: 'feeble', bowling: 'competent', keeping: 'woeful', fielding: 'woeful', consistency: 'competent', concentration: 'feeble', stamina: 'competent', form: 'superb', fatigue: 'sublime', leadership: 'feeble', experience: 'abysmal', bti: 7286, subskill: 6.20, active_net: 'None', market_value: 392260, tactical_role: 'Opening Bowler', is_wonderkid: false },
  { id: 'BT-6099474', club_id: '13108', name: 'Viplav Sinduvalli', age: 25, wage: 544, batting_hand: 'LHB', bowling_type: 'L M', batting: 'competent', bowling: 'woeful', keeping: 'feeble', fielding: 'abysmal', consistency: 'feeble', concentration: 'competent', stamina: 'competent', form: 'superb', fatigue: 'sublime', leadership: 'competent', experience: 'mediocre', bti: 7031, subskill: 6.20, active_net: 'None', market_value: 382085, tactical_role: 'Middle-Order Batter', is_wonderkid: false },
  { id: 'BT-6099467', club_id: '13108', name: 'Arvind Somal', age: 27, wage: 552, batting_hand: 'LHB', bowling_type: 'L M', batting: 'woeful', bowling: 'competent', keeping: 'feeble', fielding: 'woeful', consistency: 'competent', concentration: 'feeble', stamina: 'competent', form: 'proficient', fatigue: 'energetic', leadership: 'respectable', experience: 'abysmal', bti: 6775, subskill: 6.20, active_net: 'None', market_value: 375125, tactical_role: 'Opening Bowler', is_wonderkid: false },
  { id: 'BT-6099462', club_id: '13108', name: 'Atulya Surya Teja', age: 24, wage: 398, batting_hand: 'RHB', bowling_type: 'R M', batting: 'mediocre', bowling: 'woeful', keeping: 'mediocre', fielding: 'woeful', consistency: 'feeble', concentration: 'woeful', stamina: 'woeful', form: 'worthless', fatigue: 'sublime', leadership: 'woeful', experience: 'abysmal', bti: 2813, subskill: 6.20, active_net: 'None', market_value: 197955, tactical_role: 'Squad Player', is_wonderkid: false }
];

export const fallbackTrainingLogs: TrainingLog[] = [
  { id: 'tr-1', club_id: '13108', player_id: 'BT-6099466', player_name: 'Bhadraksh Hemalatha', log_date: '2026-11-13', skill_trained: 'Bowling', previous_level: 'Mediocre', new_level: 'Competent', subskill: 6.05, weeks_taken: 7, coach_quality: 'Competent', pop_confirmed: true },
  { id: 'tr-2', club_id: '13108', player_id: 'BT-6099471', player_name: 'Nandakishor Ramdhyani', log_date: '2026-11-06', skill_trained: 'Batting', previous_level: 'Mediocre', new_level: 'Competent', subskill: 6.08, weeks_taken: 8, coach_quality: 'Competent', pop_confirmed: true }
];

export const fallbackNets: NetAllocation[] = [
  { club_id: '13108', net_number: 1, training_type: 'Bowling', player_id: 'BT-6099466', player_name: 'Bhadraksh Hemalatha (17yo)', coach_multiplier: 1.00, pops_estimated_weeks: 7, notes: 'Primary finger spin wonderkid progression' },
  { club_id: '13108', net_number: 2, training_type: 'Batting', player_id: 'BT-6099471', player_name: 'Nandakishor Ramdhyani (17yo)', coach_multiplier: 1.00, pops_estimated_weeks: 7, notes: 'Primary top-order youth batter development' },
  { club_id: '13108', net_number: 3, training_type: 'Fielding', player_id: 'BT-6099475', player_name: 'Achintya Kharge', coach_multiplier: 1.00, pops_estimated_weeks: 5, notes: 'Captain middle-order fielding boost' },
  { club_id: '13108', net_number: 4, training_type: 'Wicket Keeping', player_id: 'BT-6099476', player_name: 'Ankur Palanisamy', coach_multiplier: 1.00, pops_estimated_weeks: 8, notes: 'Primary keeper glovework' },
  { club_id: '13108', net_number: 5, training_type: 'Fitness / Stamina', player_id: 'BT-6099461', player_name: 'Lalit Kadam', coach_multiplier: 1.00, pops_estimated_weeks: 4, notes: 'Squad player stamina recovery' },
  { club_id: '13108', net_number: 6, training_type: 'Open / Available', player_id: null, player_name: 'Unassigned', coach_multiplier: 1.00, pops_estimated_weeks: null, notes: 'Ready for next youth pull' },
  { club_id: '13108', net_number: 7, training_type: 'Open / Available', player_id: null, player_name: 'Unassigned', coach_multiplier: 1.00, pops_estimated_weeks: null, notes: 'Ready for squad rotation' },
  { club_id: '13108', net_number: 8, training_type: 'Open / Available', player_id: null, player_name: 'Unassigned', coach_multiplier: 1.00, pops_estimated_weeks: null, notes: 'Available net' },
  { club_id: '13108', net_number: 9, training_type: 'Open / Available', player_id: null, player_name: 'Unassigned', coach_multiplier: 1.00, pops_estimated_weeks: null, notes: 'Available net' },
  { club_id: '13108', net_number: 10, training_type: 'Open / Available', player_id: null, player_name: 'Unassigned', coach_multiplier: 1.00, pops_estimated_weeks: null, notes: 'Available net' }
];

export const fallbackMatches: MatchRecord[] = [
  { id: 'M-32217484', club_id: '13108', match_date: '2026-11-14', match_type: 'First Class', opponent_club: 'Diu CC', venue: 'Home (Prabhas Coastal Oval)', pitch_type: 'Hard', result: 'WON (Somnath 312 & 142/2 beat Diu CC 210 & 240 by 8 wkts)', status: 'completed' },
  { id: 'M-32485077', club_id: '13108', match_date: '2026-11-16', match_type: 'One Day', opponent_club: 'Moyale Mean Green', venue: 'Away', pitch_type: 'Green', result: 'WON (Somnath 248/6 beat Moyale 245 by 4 wkts)', status: 'completed' },
  { id: 'M-32232666', club_id: '13108', match_date: '2026-11-11', match_type: 'First Class', opponent_club: 'Whykickamoocows', venue: 'Away', pitch_type: 'Dusty', result: 'DRAW (Somnath 380 & 195/4 dec vs 288 & 160/7)', status: 'completed' },
  { id: 'M-32190812', club_id: '13108', match_date: '2026-11-09', match_type: 'BT20', opponent_club: 'Nagapatnam CC', venue: 'Home (Prabhas Coastal Oval)', pitch_type: 'Flat', result: 'WON (Somnath 176/4 beat Nagapatnam 142/9 by 34 runs)', status: 'completed' },
  { id: 'M-32510940', club_id: '13108', match_date: '2026-11-24', match_type: 'First Class', opponent_club: 'Pitch Punishers', venue: 'Away', pitch_type: 'Hard', result: 'Upcoming Fixture (FC Friendly)', status: 'upcoming' }
];

export const fallbackStadiumTiers: StadiumTier[] = [
  { id: 'st-1', club_id: '13108', tier_name: 'Standing Room', current_seats: 5275, optimal_ratio: 0.68, recommended_seats: 10200, ticket_price: 5.00, expansion_cost_per_seat: 35.00 },
  { id: 'st-2', club_id: '13108', tier_name: 'Uncovered Seats', current_seats: 3270, optimal_ratio: 0.23, recommended_seats: 3450, ticket_price: 8.00, expansion_cost_per_seat: 48.00 },
  { id: 'st-3', club_id: '13108', tier_name: 'Covered Seats', current_seats: 1100, optimal_ratio: 0.07, recommended_seats: 1050, ticket_price: 14.00, expansion_cost_per_seat: 72.00 },
  { id: 'st-4', club_id: '13108', tier_name: 'Members Enclosure', current_seats: 355, optimal_ratio: 0.02, recommended_seats: 300, ticket_price: 25.00, expansion_cost_per_seat: 120.00 }
];

export const fallbackFinances: FinancialRecord[] = [
  { id: 'fin-1', club_id: '13108', week_number: 1, record_date: '2026-11-18', gate_receipts: 126546, sponsors: 22823, merchandise: 15128, prize_money: 33114, total_inflow: 197611, player_wages: 7034, staff_wages: 12250, stadium_upkeep: 14702, youth_academy: 0, total_outflow: 33986, net_weekly_pnl: 163625, cumulative_bank_balance: 1320573 }
];
