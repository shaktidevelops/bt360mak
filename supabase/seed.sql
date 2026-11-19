-- =====================================================================
-- BT360MAK - Somnath Super Devs (#13108) Real Data Seed
-- Pre-populates PostgreSQL with 100% accurate Club Intelligence
-- =====================================================================

-- 1. Insert Master Club Record
INSERT INTO public.clubs (
    id, name, manager, region, division_fc, division_od, division_t20,
    fan_club_members, fan_mood, sponsor_confidence, morale,
    bank_balance, weekly_wage_bill, stadium_name, stadium_capacity,
    form_avg, coach_quality, its_points
) VALUES (
    '13108',
    'Somnath Super Devs',
    'Devs',
    'Tamil Nadu, India',
    'VIII.17 (#1)',
    'V.62 (#2)',
    'VII.241 (#1)',
    781,
    'Over the Moon 🚀',
    'Ecstatic 💎',
    'Over the Moon',
    1325820,
    7034,
    'Prabhas Coastal Oval (13108)',
    10000,
    'Superb',
    'Competent',
    70
) ON CONFLICT (id) DO UPDATE SET
    bank_balance = EXCLUDED.bank_balance,
    weekly_wage_bill = EXCLUDED.weekly_wage_bill,
    fan_club_members = EXCLUDED.fan_club_members;

-- 2. Insert 14-Man Squad
INSERT INTO public.players (
    id, club_id, name, age, wage, batting_hand, bowling_type,
    batting, bowling, keeping, fielding, consistency, concentration,
    stamina, form, fatigue, leadership, experience, bti, subskill,
    active_net, market_value, tactical_role, is_wonderkid
) VALUES
('6099459', '13108', 'Arjun Ashraf', 21, 284, 'LHB', 'Left-arm Fast Medium', 'abysmal', 'woeful', 'feeble', 'mediocre', 'abysmal', 'mediocre', 'feeble', 'abysmal', 'sublime', 'respectable', 'abysmal', 2664, 6.20, 'Unassigned', 226440, 'Squad Player', false),
('6099472', '13108', 'Issa Baboor', 26, 546, 'RHB', 'Right-arm Fast', 'competent', 'woeful', 'abysmal', 'mediocre', 'woeful', 'competent', 'competent', 'strong', 'sublime', 'respectable', 'feeble', 7440, 6.20, 'Unassigned', 632400, 'Middle Order Batsman', false),
('6099468', '13108', 'Kamadev Battasi', 25, 543, 'RHB', 'Right-arm Finger Spin', 'feeble', 'competent', 'feeble', 'woeful', 'competent', 'woeful', 'competent', 'respectable', 'sublime', 'abysmal', 'woeful', 6665, 6.20, 'Unassigned', 566525, 'Lead Spinner', false),
('6099466', '13108', 'Bhadraksh Hemalatha', 17, 545, 'RHB', 'Right-arm Finger Spin', 'abysmal', 'competent', 'feeble', 'abysmal', 'competent', 'feeble', 'competent', 'superb', 'sublime', 'feeble', 'abysmal', 6989, 6.70, 'Unassigned', 594065, 'Wonderkid Spinner', true),
('6099470', '13108', 'Kamal Hydrose', 25, 538, 'LHB', 'Left-arm Medium', 'woeful', 'competent', 'woeful', 'woeful', 'competent', 'abysmal', 'competent', 'superb', 'sublime', 'woeful', 'feeble', 6085, 6.20, 'Unassigned', 517225, 'Opening Bowler', false),
('6099461', '13108', 'Lalit Kadam', 23, 369, 'RHB', 'Right-arm Fast Medium', 'mediocre', 'woeful', 'woeful', 'feeble', 'woeful', 'feeble', 'abysmal', 'woeful', 'sublime', 'abysmal', 'worthless', 2206, 6.20, 'Unassigned', 187510, 'Squad Player', false),
('6099475', '13108', 'Achintya Kharge', 26, 553, 'RHB', 'Right-arm Medium', 'competent', 'woeful', 'woeful', 'competent', 'woeful', 'competent', 'competent', 'superb', 'sublime', 'competent', 'mediocre', 8436, 6.20, 'Unassigned', 717060, 'Captain & Top Order Batsman', false),
('6099473', '13108', 'Vasant Malla', 28, 544, 'LHB', 'Left-arm Fast Medium', 'competent', 'feeble', 'woeful', 'mediocre', 'abysmal', 'competent', 'competent', 'superb', 'sublime', 'competent', 'feeble', 7468, 6.20, 'Unassigned', 634780, 'Top Order Batsman', false),
('6099476', '13108', 'Ankur Palanisamy', 27, 510, 'RHB', 'Right-arm Finger Spin', 'mediocre', 'woeful', 'competent', 'feeble', 'mediocre', 'woeful', 'competent', 'woeful', 'sublime', 'proficient', 'abysmal', 5601, 6.20, 'Unassigned', 476085, 'Primary Wicketkeeper', false),
('6099471', '13108', 'Nandakishor Ramdhyani', 17, 559, 'LHB', 'Left-arm Medium', 'competent', 'mediocre', 'woeful', 'woeful', 'feeble', 'competent', 'competent', 'mediocre', 'sublime', 'competent', 'abysmal', 6360, 6.70, 'Unassigned', 540600, 'Wonderkid Batter', true),
('6099469', '13108', 'Purumitra Rishi', 29, 549, 'RHB', 'Right-arm Medium', 'feeble', 'competent', 'woeful', 'woeful', 'competent', 'feeble', 'competent', 'superb', 'sublime', 'feeble', 'abysmal', 7286, 6.20, 'Unassigned', 619310, 'Opening Bowler', false),
('6099474', '13108', 'Viplav Sinduvalli', 25, 544, 'LHB', 'Left-arm Medium', 'competent', 'woeful', 'feeble', 'abysmal', 'feeble', 'competent', 'competent', 'superb', 'sublime', 'competent', 'mediocre', 7031, 6.20, 'Unassigned', 597635, 'Top Order Batsman', false),
('6099467', '13108', 'Arvind Somal', 27, 552, 'LHB', 'Left-arm Medium', 'woeful', 'competent', 'feeble', 'woeful', 'competent', 'feeble', 'competent', 'proficient', 'energetic', 'respectable', 'abysmal', 6775, 6.20, 'Unassigned', 575875, 'Opening Bowler', false),
('6099462', '13108', 'Atulya Surya Teja', 24, 398, 'RHB', 'Right-arm Medium', 'mediocre', 'woeful', 'mediocre', 'woeful', 'feeble', 'woeful', 'woeful', 'worthless', 'sublime', 'woeful', 'abysmal', 2813, 6.20, 'Unassigned', 239105, 'Squad Player', false)
ON CONFLICT (id) DO UPDATE SET
    wage = EXCLUDED.wage,
    form = EXCLUDED.form,
    fatigue = EXCLUDED.fatigue,
    subskill = EXCLUDED.subskill,
    market_value = EXCLUDED.market_value;

-- 3. Insert Training Logs
INSERT INTO public.training_logs (club_id, player_id, log_date, skill_trained, previous_level, new_level, subskill, weeks_taken, coach_quality, pop_confirmed)
VALUES
('13108', '6099466', '2026-11-13', 'Bowling', 'Mediocre', 'Competent', 6.05, 7, 'Competent', true),
('13108', '6099471', '2026-11-06', 'Batting', 'Mediocre', 'Competent', 6.08, 8, 'Competent', true);

-- 4. Insert 10 Nets Matrix (Squad Fielding Session - all nets unassigned by default)
INSERT INTO public.nets_matrix (club_id, net_number, training_type, player_id, coach_multiplier, pops_estimated_weeks, notes)
VALUES
('13108', 1, 'Bowling (Finger Spin)', NULL, 1.00, NULL, 'Squad training: Fielding active'),
('13108', 2, 'Batting (Opening Technique)', NULL, 1.00, NULL, 'Squad training: Fielding active'),
('13108', 3, 'Fielding (Slip Catching)', NULL, 1.00, NULL, 'Squad training: Fielding active'),
('13108', 4, 'Wicket Keeping (Glovework)', NULL, 1.00, NULL, 'Squad training: Fielding active'),
('13108', 5, 'Fitness & Stamina', NULL, 1.00, NULL, 'Squad training: Fielding active'),
('13108', 6, 'Batting (Middle Order)', NULL, 1.00, NULL, 'Squad training: Fielding active'),
('13108', 7, 'Bowling (Opening Seam)', NULL, 1.00, NULL, 'Squad training: Fielding active'),
('13108', 8, 'Bowling (Strike Pace)', NULL, 1.00, NULL, 'Squad training: Fielding active'),
('13108', 9, 'Batting (Finisher)', NULL, 1.00, NULL, 'Squad training: Fielding active'),
('13108', 10, 'Open Net (Rotation)', NULL, 1.00, NULL, 'Squad training: Fielding active')
ON CONFLICT (club_id, net_number) DO UPDATE SET
    training_type = EXCLUDED.training_type,
    player_id = EXCLUDED.player_id,
    notes = EXCLUDED.notes;

-- 5. Insert Matches
INSERT INTO public.matches (id, club_id, match_date, match_type, opponent_club, venue, pitch_type, result, status)
VALUES
('M-32232669', '13108', '2026-11-10', 'First Class', 'Whykickamoocows', 'Home (Prabhas Coastal Oval)', 'Hard & Fast', 'WON by 9 Wickets (Somnath 406/2 dec beat Whykickamoocows 166 & 240)', 'completed'),
('M-32217484', '13108', '2026-11-13', 'One Day', 'Nagapatnam CC', 'Away', 'Green', 'WON (OD League Division V.62)', 'completed'),
('M-32217482', '13108', '2026-11-06', 'One Day', 'madgaon CC', 'Home (Prabhas Coastal Oval)', 'Hard & Fast', 'WON (£70,775 Gate Receipts)', 'completed'),
('M-32232666', '13108', '2026-11-03', 'First Class', 'Bhiwani CC', 'Away', 'Dusty', 'WON (FC Division VIII.17)', 'completed'),
('M-32581217', '13108', '2026-11-18', 'BT20 Fr', 'Jeetu Lions from UP', 'Home (Prabhas Coastal Oval)', 'Flat', 'LOST (Competitive Friendly, £5,247 Gate)', 'completed'),
('M-32510940', '13108', '2026-11-24', 'First Class Fr', 'Pitch Punishers', 'Away', 'Hard & Fast', 'Upcoming Friendly Fixture', 'upcoming')
ON CONFLICT (id) DO UPDATE SET
    result = EXCLUDED.result,
    status = EXCLUDED.status;

-- 6. Insert Lineup & Tactics
INSERT INTO public.tactics_lineup (club_id, batting_order, player_id, role, aggression, bowling_order, max_overs)
VALUES
('13108', 1, '6099471', 'Young Opening Batter (LHB)', 'Attacking', '-', NULL),
('13108', 2, '6099472', 'Middle-Order Batter (RHB)', 'Moderate', '-', NULL),
('13108', 3, '6099475', 'Captain & Anchor (RHB)', 'Moderate', '4th Change (RM)', 4),
('13108', 4, '6099473', 'Middle-Order Batter (LHB)', 'Attacking', '-', NULL),
('13108', 5, '6099474', 'Middle-Order Batter (LHB)', 'Attacking', '-', NULL),
('13108', 6, '6099476', 'Primary Wicketkeeper (RHB)', 'Moderate', '-', NULL),
('13108', 7, '6099467', 'All-Rounder (LHB / LM)', 'Defensive', '2nd Bowler', 10),
('13108', 8, '6099468', 'Lead Finger Spinner (RHB)', 'Moderate', '3rd Bowler', 10),
('13108', 9, '6099466', 'Strike Finger Spinner (RHB)', 'Attacking', '1st Change', 10),
('13108', 10, '6099470', 'Opening Bowler (LHB / LM)', 'Defensive', '1st Bowler', 10),
('13108', 11, '6099469', 'Opening Strike Seamer (RHB / RM)', 'Attacking', '2nd Bowler', 10)
ON CONFLICT (club_id, batting_order) DO UPDATE SET
    player_id = EXCLUDED.player_id,
    role = EXCLUDED.role,
    aggression = EXCLUDED.aggression,
    bowling_order = EXCLUDED.bowling_order,
    max_overs = EXCLUDED.max_overs;

-- 7. Insert Financial Ledger
INSERT INTO public.financial_ledger (
    club_id, week_number, record_date, gate_receipts, sponsors, merchandise,
    prize_money, player_wages, staff_wages, stadium_upkeep, youth_academy,
    cumulative_bank_balance
) VALUES
('13108', 1, '2026-11-19', 5247, 22823, 0, 33114, 7034, 12250, 14702, 0, 1325820),
('13108', 2, '2026-11-12', 158703, 22823, 0, 33114, 7034, 12250, 14702, 0, 1298622),
('13108', 3, '2026-11-07', 70775, 22301, 0, 28635, 7034, 12250, 14702, 0, 1139919),
('13108', 4, '2026-11-01', 7196, 22301, 0, 28635, 7034, 12250, 14702, 0, 1048174),
('13108', 5, '2026-10-31', 0, 22301, 0, 50000, 7034, 12250, 14702, 0, 1044998)
ON CONFLICT (club_id, week_number) DO NOTHING;

-- 8. Insert Stadium Tiers (10,000 Capacity)
INSERT INTO public.stadium_tiers (club_id, tier_name, current_seats, optimal_ratio, recommended_seats, ticket_price, expansion_cost_per_seat)
VALUES
('13108', 'Standing Room', 5275, 0.5275, 6000, 5.00, 35.00),
('13108', 'Uncovered Seats', 3270, 0.3270, 4000, 8.00, 48.00),
('13108', 'Covered Seats', 1100, 0.1100, 1500, 14.00, 72.00),
('13108', 'Members Seats', 355, 0.0355, 500, 25.00, 120.00)
ON CONFLICT (club_id, tier_name) DO UPDATE SET
    current_seats = EXCLUDED.current_seats,
    recommended_seats = EXCLUDED.recommended_seats;

-- 9. Insert Backroom Staff (Real Staff from club.asp)
INSERT INTO public.backroom_staff (club_id, role, name, skill_level, weekly_wage)
VALUES
('13108', 'Fielding Coach', 'Devdutt Raman', 'Competent', 2000),
('13108', 'Public Relations Officer (Lead)', 'Shakti Mak', 'Masterclass', 4250),
('13108', 'Financial Advisor (Senior)', 'S. K. Verma', 'Proficient', 3000),
('13108', 'Groundsman', 'Shyamal Dangasela', 'Competent', 2000),
('13108', 'Youth Academy Director', 'Girish Kumble', 'Superb', 1000);
