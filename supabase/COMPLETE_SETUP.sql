-- =====================================================================
-- BT360MAK - Battrick Sovereign Intelligence & SaaS Manager Suite
-- COMPLETE SUPABASE SETUP (DDL + RLS + SEED DATA)
-- Run this entire script in Supabase Dashboard -> SQL Editor -> Click 'Run'
-- =====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Clubs Table (Root tenant entity)
CREATE TABLE IF NOT EXISTS public.clubs (
    id TEXT PRIMARY KEY,                       -- e.g. '13108'
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    manager TEXT NOT NULL,
    region TEXT NOT NULL,
    division_fc TEXT,
    division_od TEXT,
    division_t20 TEXT,
    fan_club_members INT DEFAULT 0,
    fan_mood TEXT DEFAULT 'Content',
    sponsor_confidence TEXT DEFAULT 'Satisfied',
    morale TEXT DEFAULT 'Respectable',
    bank_balance BIGINT DEFAULT 0,
    weekly_wage_bill BIGINT DEFAULT 0,
    stadium_name TEXT,
    stadium_capacity INT DEFAULT 10000,
    form_avg TEXT DEFAULT 'Competent',
    coach_quality TEXT DEFAULT 'Competent',
    its_points INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Players Table (Squad Master with Clean IDs)
CREATE TABLE IF NOT EXISTS public.players (
    id TEXT PRIMARY KEY,                       -- e.g. '6099466' (No 'BT-')
    club_id TEXT NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age INT NOT NULL,
    wage INT NOT NULL,
    batting_hand TEXT NOT NULL,                -- e.g. 'LHB', 'RHB'
    bowling_type TEXT NOT NULL,                -- e.g. 'Right-arm Finger Spin'
    batting TEXT NOT NULL,
    bowling TEXT NOT NULL,
    keeping TEXT NOT NULL,
    fielding TEXT NOT NULL,
    consistency TEXT NOT NULL,
    concentration TEXT NOT NULL,
    stamina TEXT NOT NULL,
    form TEXT NOT NULL,
    fatigue TEXT NOT NULL,
    leadership TEXT NOT NULL,
    experience TEXT NOT NULL,
    bti INT DEFAULT 0,
    subskill NUMERIC(4,2) DEFAULT 6.00,
    active_net TEXT DEFAULT 'Unassigned',
    market_value BIGINT DEFAULT 0,
    tactical_role TEXT,
    is_wonderkid BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Training Logs Table (Pop Tracker)
CREATE TABLE IF NOT EXISTS public.training_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id TEXT NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    player_id TEXT NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    skill_trained TEXT NOT NULL,
    previous_level TEXT NOT NULL,
    new_level TEXT NOT NULL,
    subskill NUMERIC(4,2),
    weeks_taken INT DEFAULT 8,
    coach_quality TEXT DEFAULT 'Competent',
    pop_confirmed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 10-Net Training Facility Matrix
CREATE TABLE IF NOT EXISTS public.nets_matrix (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id TEXT NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    net_number INT NOT NULL CHECK (net_number BETWEEN 1 AND 10),
    training_type TEXT NOT NULL,
    player_id TEXT REFERENCES public.players(id) ON DELETE SET NULL,
    coach_multiplier NUMERIC(3,2) DEFAULT 1.00,
    pops_estimated_weeks INT,
    notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (club_id, net_number)
);

-- 6. Competitive Matches Table
CREATE TABLE IF NOT EXISTS public.matches (
    id TEXT PRIMARY KEY,                       -- e.g. 'M-32217484'
    club_id TEXT NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    match_date DATE NOT NULL,
    match_type TEXT NOT NULL,                  -- 'First Class', 'One Day', 'BT20'
    opponent_club TEXT NOT NULL,
    venue TEXT NOT NULL,
    pitch_type TEXT NOT NULL,                  -- 'Hard', 'Green', 'Dusty', 'Flat', 'Slow'
    result TEXT,
    score_summary TEXT,
    top_performer TEXT,
    status TEXT DEFAULT 'completed',           -- 'completed', 'upcoming'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Lineup & Tactics Orders Table
CREATE TABLE IF NOT EXISTS public.tactics_lineup (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id TEXT NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    batting_order INT NOT NULL CHECK (batting_order BETWEEN 1 AND 11),
    player_id TEXT NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    aggression TEXT DEFAULT 'Moderate',
    bowling_order TEXT DEFAULT '-',
    max_overs INT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (club_id, batting_order)
);

-- 8. Financial Ledger Table (52-Week Cashflow)
CREATE TABLE IF NOT EXISTS public.financial_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id TEXT NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    week_number INT NOT NULL,
    record_date DATE NOT NULL,
    category TEXT DEFAULT 'Home Match Week',
    gate_receipts BIGINT DEFAULT 0,
    sponsors BIGINT DEFAULT 0,
    merchandise BIGINT DEFAULT 0,
    prize_money BIGINT DEFAULT 0,
    total_inflow BIGINT GENERATED ALWAYS AS (gate_receipts + sponsors + merchandise + prize_money) STORED,
    player_wages BIGINT DEFAULT 0,
    staff_wages BIGINT DEFAULT 0,
    stadium_upkeep BIGINT DEFAULT 0,
    youth_academy BIGINT DEFAULT 0,
    total_outflow BIGINT GENERATED ALWAYS AS (player_wages + staff_wages + stadium_upkeep + youth_academy) STORED,
    net_weekly_pnl BIGINT GENERATED ALWAYS AS (
        (gate_receipts + sponsors + merchandise + prize_money) - 
        (player_wages + staff_wages + stadium_upkeep + youth_academy)
    ) STORED,
    cumulative_bank_balance BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (club_id, week_number)
);

-- 9. Stadium Planner Tiers Table
CREATE TABLE IF NOT EXISTS public.stadium_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id TEXT NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    tier_name TEXT NOT NULL,                   -- 'Standing Terraces', 'Uncovered Grandstand', 'Covered Pavilion', 'Members Enclosure'
    current_seats INT NOT NULL,
    optimal_ratio NUMERIC(4,2) NOT NULL,       -- 0.68, 0.23, 0.07, 0.02
    recommended_seats INT NOT NULL,
    ticket_price NUMERIC(6,2) NOT NULL,
    expansion_cost_per_seat NUMERIC(6,2) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (club_id, tier_name)
);

-- 10. Backroom Staff Members Table
CREATE TABLE IF NOT EXISTS public.staff_members (
    id TEXT PRIMARY KEY,
    club_id TEXT NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    name TEXT NOT NULL,
    skill_level TEXT NOT NULL,
    weekly_wage INT NOT NULL,
    impact_description TEXT,
    synergy_bonus TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Club Calendar Events Table
CREATE TABLE IF NOT EXISTS public.calendar_events (
    id TEXT PRIMARY KEY,
    club_id TEXT NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    day_of_week TEXT NOT NULL,
    time TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    details TEXT,
    venue TEXT,
    importance TEXT DEFAULT 'NORMAL',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Cricket Records Hall of Fame Table
CREATE TABLE IF NOT EXISTS public.cricket_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id TEXT NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    category TEXT NOT NULL,                    -- 'BATTING', 'BOWLING', 'PARTNERSHIP', 'TEAM'
    record_name TEXT NOT NULL,
    holder TEXT NOT NULL,
    value TEXT NOT NULL,
    match_context TEXT,
    date TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nets_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tactics_lineup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stadium_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cricket_records ENABLE ROW LEVEL SECURITY;

-- Allow public read access to Somnath Super Devs data
DO $$ BEGIN
    CREATE POLICY "Allow public read access to clubs" ON public.clubs FOR SELECT USING (true);
    CREATE POLICY "Allow public read access to players" ON public.players FOR SELECT USING (true);
    CREATE POLICY "Allow public read access to training_logs" ON public.training_logs FOR SELECT USING (true);
    CREATE POLICY "Allow public read access to nets_matrix" ON public.nets_matrix FOR SELECT USING (true);
    CREATE POLICY "Allow public read access to matches" ON public.matches FOR SELECT USING (true);
    CREATE POLICY "Allow public read access to tactics_lineup" ON public.tactics_lineup FOR SELECT USING (true);
    CREATE POLICY "Allow public read access to financial_ledger" ON public.financial_ledger FOR SELECT USING (true);
    CREATE POLICY "Allow public read access to stadium_tiers" ON public.stadium_tiers FOR SELECT USING (true);
    CREATE POLICY "Allow public read access to staff_members" ON public.staff_members FOR SELECT USING (true);
    CREATE POLICY "Allow public read access to calendar_events" ON public.calendar_events FOR SELECT USING (true);
    CREATE POLICY "Allow public read access to cricket_records" ON public.cricket_records FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Allow authenticated users to update their own club records
DO $$ BEGIN
    CREATE POLICY "Allow authenticated user write on clubs" ON public.clubs FOR ALL TO authenticated USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================================
-- SEED DATA - SOMNATH SUPER DEVS (#13108)
-- =====================================================================

-- 1. Master Club Record
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

-- 2. 14 Real Players (Clean Numeric IDs, No 'BT-')
INSERT INTO public.players (
    id, club_id, name, age, wage, batting_hand, bowling_type,
    batting, bowling, keeping, fielding, consistency, concentration,
    stamina, form, fatigue, leadership, experience, bti, subskill,
    active_net, market_value, tactical_role, is_wonderkid
) VALUES
('6099459', '13108', 'Arjun Ashraf', 21, 284, 'LHB', 'L FM', 'abysmal', 'woeful', 'feeble', 'mediocre', 'abysmal', 'mediocre', 'feeble', 'abysmal', 'sublime', 'respectable', 'abysmal', 2664, 6.20, 'Unassigned', 164240, 'Squad Player', false),
('6099472', '13108', 'Issa Baboor', 26, 546, 'RHB', 'R F', 'competent', 'woeful', 'abysmal', 'mediocre', 'woeful', 'competent', 'competent', 'strong', 'sublime', 'respectable', 'feeble', 7440, 6.20, 'Unassigned', 396900, 'Middle-Order Batter', false),
('6099468', '13108', 'Kamadev Battasi', 25, 543, 'RHB', 'Right-arm Finger Spin', 'feeble', 'competent', 'feeble', 'woeful', 'competent', 'woeful', 'competent', 'respectable', 'sublime', 'abysmal', 'woeful', 6665, 6.20, 'Unassigned', 369025, 'Lead Finger Spinner', false),
('6099466', '13108', 'Bhadraksh Hemalatha', 17, 545, 'RHB', 'Right-arm Finger Spin', 'abysmal', 'competent', 'feeble', 'abysmal', 'competent', 'feeble', 'competent', 'superb', 'sublime', 'feeble', 'abysmal', 6989, 6.70, 'Unassigned', 685557, 'Lead Finger Spinner (Wonderkid)', true),
('6099470', '13108', 'Kamal Hydrose', 25, 538, 'LHB', 'Left-arm Medium', 'woeful', 'competent', 'woeful', 'woeful', 'competent', 'abysmal', 'competent', 'superb', 'sublime', 'woeful', 'feeble', 6085, 6.20, 'Unassigned', 347475, 'Opening Bowler', false),
('6099461', '13108', 'Lalit Kadam', 23, 369, 'RHB', 'R FM', 'mediocre', 'woeful', 'woeful', 'feeble', 'woeful', 'feeble', 'abysmal', 'woeful', 'sublime', 'abysmal', 'worthless', 2206, 6.20, 'Unassigned', 169460, 'Squad Player', false),
('6099475', '13108', 'Achintya Kharge', 26, 553, 'RHB', 'Right-arm Medium', 'competent', 'woeful', 'woeful', 'competent', 'woeful', 'competent', 'competent', 'superb', 'sublime', 'competent', 'mediocre', 8436, 6.20, 'Unassigned', 433510, 'Middle-Order Batter (C)', false),
('6099473', '13108', 'Vasant Malla', 28, 544, 'LHB', 'Left-arm Fast Medium', 'competent', 'feeble', 'woeful', 'mediocre', 'abysmal', 'competent', 'competent', 'superb', 'sublime', 'competent', 'feeble', 7468, 6.20, 'Unassigned', 397380, 'Middle-Order Batter', false),
('6099476', '13108', 'Ankur Palanisamy', 27, 510, 'RHB', 'Right-arm Finger Spin', 'mediocre', 'woeful', 'competent', 'feeble', 'mediocre', 'woeful', 'competent', 'woeful', 'sublime', 'proficient', 'abysmal', 5601, 6.20, 'Unassigned', 323535, 'Primary Wicketkeeper', false),
('6099471', '13108', 'Nandakishor Ramdhyani', 17, 559, 'LHB', 'Left-arm Medium', 'competent', 'mediocre', 'woeful', 'woeful', 'feeble', 'competent', 'competent', 'mediocre', 'sublime', 'competent', 'abysmal', 6360, 6.70, 'Unassigned', 652230, 'Opening Batsman (Wonderkid)', true),
('6099469', '13108', 'Purumitra Rishi', 29, 549, 'RHB', 'Right-arm Medium', 'feeble', 'competent', 'woeful', 'woeful', 'competent', 'feeble', 'competent', 'superb', 'sublime', 'feeble', 'abysmal', 7286, 6.20, 'Unassigned', 392260, 'Opening Bowler', false),
('6099474', '13108', 'Viplav Sinduvalli', 25, 544, 'LHB', 'Left-arm Medium', 'competent', 'woeful', 'feeble', 'abysmal', 'feeble', 'competent', 'competent', 'superb', 'sublime', 'competent', 'mediocre', 7031, 6.20, 'Unassigned', 382085, 'Middle-Order Batter', false),
('6099467', '13108', 'Arvind Somal', 27, 552, 'LHB', 'Left-arm Medium', 'woeful', 'competent', 'feeble', 'woeful', 'competent', 'feeble', 'competent', 'proficient', 'energetic', 'respectable', 'abysmal', 6775, 6.20, 'Unassigned', 375125, 'Opening Bowler', false),
('6099462', '13108', 'Atulya Surya Teja', 24, 398, 'RHB', 'Right-arm Medium', 'mediocre', 'woeful', 'mediocre', 'woeful', 'feeble', 'woeful', 'woeful', 'worthless', 'sublime', 'woeful', 'abysmal', 2813, 6.20, 'Unassigned', 197955, 'Squad Player', false)
ON CONFLICT (id) DO UPDATE SET
    wage = EXCLUDED.wage,
    form = EXCLUDED.form,
    fatigue = EXCLUDED.fatigue,
    subskill = EXCLUDED.subskill,
    market_value = EXCLUDED.market_value;

-- 3. Confirmed Training Pop Logs
INSERT INTO public.training_logs (club_id, player_id, log_date, skill_trained, previous_level, new_level, subskill, weeks_taken, coach_quality, pop_confirmed)
VALUES
('13108', '6099466', '2026-11-13', 'Bowling', 'Mediocre', 'Competent', 6.05, 7, 'Competent', true),
('13108', '6099471', '2026-11-06', 'Batting', 'Mediocre', 'Competent', 6.08, 8, 'Competent', true)
ON CONFLICT DO NOTHING;

-- 4. 10 Nets Matrix (Default: All Unassigned)
INSERT INTO public.nets_matrix (club_id, net_number, training_type, player_id, coach_multiplier, pops_estimated_weeks, notes)
VALUES
('13108', 1, 'Bowling (Finger Spin)', NULL, 1.00, NULL, 'Net open and ready for tactical player assignment'),
('13108', 2, 'Batting (Opening Technique)', NULL, 1.00, NULL, 'Net open and ready for tactical player assignment'),
('13108', 3, 'Fielding (Slip Catching)', NULL, 1.00, NULL, 'Net open and ready for tactical player assignment'),
('13108', 4, 'Wicket Keeping (Glovework)', NULL, 1.00, NULL, 'Net open and ready for tactical player assignment'),
('13108', 5, 'Fitness & Stamina', NULL, 1.00, NULL, 'Net open and ready for tactical player assignment'),
('13108', 6, 'Batting (Middle Order)', NULL, 1.00, NULL, 'Net open and ready for tactical player assignment'),
('13108', 7, 'Bowling (Finger Spin)', NULL, 1.00, NULL, 'Net open and ready for tactical player assignment'),
('13108', 8, 'Bowling (Opening Seam)', NULL, 1.00, NULL, 'Net open and ready for tactical player assignment'),
('13108', 9, 'Bowling (Strike Pace)', NULL, 1.00, NULL, 'Net open and ready for tactical player assignment'),
('13108', 10, 'Batting (Finisher)', NULL, 1.00, NULL, 'Net open and ready for tactical player assignment')
ON CONFLICT (club_id, net_number) DO UPDATE SET
    training_type = EXCLUDED.training_type,
    player_id = EXCLUDED.player_id,
    notes = EXCLUDED.notes;

-- 5. Matches
INSERT INTO public.matches (id, club_id, match_date, match_type, opponent_club, venue, pitch_type, result, score_summary, top_performer, status)
VALUES
('M-32217484', '13108', '2026-11-14', 'First Class', 'Diu CC', 'Home (Prabhas Coastal Oval)', 'Hard', 'WON by 8 Wickets (Somnath 312 & 142/2 beat Diu CC 210 & 240)', 'B. Hemalatha 6/24 & 4/34, A. Kharge 88', 'Bhadraksh Hemalatha (10 Wickets)', 'completed'),
('M-32485077', '13108', '2026-11-16', 'One Day', 'Moyale Mean Green', 'Away Grounds', 'Green', 'WON by 4 Wickets (Somnath 248/6 in 48.2 ov beat Moyale 245 in 50 ov)', 'N. Ramdhyani 94, V. Malla 52*, P. Rishi 3/38', 'Nandakishor Ramdhyani (94 Runs)', 'completed'),
('M-32232666', '13108', '2026-11-11', 'First Class', 'Whykickamoocows', 'Away Grounds', 'Dusty', 'DRAW (Somnath 380 & 195/4 dec vs Whykickamoocows 288 & 160/7)', 'A. Kharge 144, K. Battasi 4/48', 'Achintya Kharge (144 Runs)', 'completed'),
('M-32190812', '13108', '2026-11-09', 'BT20', 'Nagapatnam CC', 'Home (Prabhas Coastal Oval)', 'Flat', 'WON by 34 Runs (Somnath 176/4 in 20 ov beat Nagapatnam 142/9)', 'V. Malla 76* (32b), K. Hydrose 3/16', 'Vasant Malla (76* off 32b)', 'completed'),
('M-32510940', '13108', '2026-11-24', 'First Class', 'Pitch Punishers', 'Away Grounds', 'Hard', 'Upcoming Fixture (FC Division VIII.17)', 'Pitch Scouting: Express Pace Favored (+25%)', 'Opening Pacer: Purumitra Rishi', 'upcoming')
ON CONFLICT (id) DO UPDATE SET
    result = EXCLUDED.result,
    score_summary = EXCLUDED.score_summary,
    top_performer = EXCLUDED.top_performer,
    status = EXCLUDED.status;

-- 6. Financial Ledger (8 Weeks Historical Audit)
INSERT INTO public.financial_ledger (
    club_id, week_number, record_date, category, gate_receipts, sponsors, merchandise,
    prize_money, player_wages, staff_wages, stadium_upkeep, youth_academy,
    cumulative_bank_balance
) VALUES
('13108', 1, '2026-11-18', 'Home Match Week', 126546, 22823, 15128, 33114, 7034, 15650, 14702, 36000, 1320573),
('13108', 2, '2026-11-11', 'Away Match Week', 0, 22823, 8400, 12000, 7034, 15650, 14702, 36000, 1196348),
('13108', 3, '2026-11-04', 'Home Match Week', 122400, 22823, 14200, 25000, 7034, 15650, 14702, 36000, 1226511),
('13108', 4, '2026-10-28', 'Away Match Week', 0, 22823, 7800, 8000, 7034, 15650, 14702, 36000, 1115474),
('13108', 5, '2026-10-21', 'Home Match Week', 118000, 22823, 13500, 28000, 7034, 15650, 14702, 36000, 1150237),
('13108', 6, '2026-10-14', 'Away Match Week', 0, 22823, 6500, 5000, 7034, 15650, 14702, 36000, 1041300),
('13108', 7, '2026-10-07', 'Home Match Week', 125000, 22823, 14800, 35000, 7034, 15650, 14702, 36000, 1080363),
('13108', 8, '2026-09-30', 'Away Match Week', 0, 22823, 7200, 10000, 7034, 15650, 14702, 36000, 956126)
ON CONFLICT (club_id, week_number) DO NOTHING;

-- 7. Stadium Tiers (10,000 Capacity Prabhas Coastal Oval)
INSERT INTO public.stadium_tiers (club_id, tier_name, current_seats, optimal_ratio, recommended_seats, ticket_price, expansion_cost_per_seat)
VALUES
('13108', 'Standing Terraces', 5275, 0.68, 10200, 5.00, 35.00),
('13108', 'Uncovered Grandstand', 3270, 0.23, 3450, 8.00, 48.00),
('13108', 'Covered Pavilion', 1100, 0.07, 1050, 14.00, 72.00),
('13108', 'Members Enclosure', 355, 0.02, 300, 25.00, 120.00)
ON CONFLICT (club_id, tier_name) DO UPDATE SET
    current_seats = EXCLUDED.current_seats,
    recommended_seats = EXCLUDED.recommended_seats;

-- 8. Backroom Staff with Psychological & Science Synergies
INSERT INTO public.staff_members (id, club_id, role, name, skill_level, weekly_wage, impact_description, synergy_bonus)
VALUES
('st-1', '13108', 'Head Coach', 'Devdutt Raman', 'Competent', 4200, 'Primary skill pop accelerator across all 10 nets.', '1.00x Base Multiplier'),
('st-2', '13108', 'Sports Psychologist', 'Dr. Alok Verma', 'Proficient', 3400, 'Accelerates Concentration skill gains and prevents batting collapses during pressure chases.', '+15% Mental Skill Training Absorption'),
('st-3', '13108', 'Lead Physiotherapist', 'Dr. Chetan Bhatt', 'Respectable', 3150, 'Reduces match fatigue by 50% and doubles Stamina recovery rate during fitness sessions.', 'Halves Net-Session Injury Risks'),
('st-4', '13108', 'Chief Scout', 'Girish Kumble', 'Competent', 2500, 'Filters global transfer market listings and assesses real potential on 17yo youth pulls.', 'Reveals True Youth Trainee Potential'),
('st-5', '13108', 'Financial Director', 'Shakti Mak', 'Masterclass', 2400, 'Optimizes commercial sponsorships, merchandise yields, and Prabhas Oval gate pricing.', '+8% Extra Gate Yield Efficiency')
ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    name = EXCLUDED.name,
    weekly_wage = EXCLUDED.weekly_wage,
    impact_description = EXCLUDED.impact_description,
    synergy_bonus = EXCLUDED.synergy_bonus;

-- 9. Club Calendar Events (Weekly Cycle)
INSERT INTO public.calendar_events (id, club_id, date, day_of_week, time, type, title, details, venue, importance)
VALUES
('cal-1', '13108', '2026-11-20', 'Friday', '05:00 UTC', 'TRAINING_POP', 'Friday Weekly Training Pop Update', 'All 10 nets evaluated. Subskill decimal increases awarded and confirmed skill pops announced.', NULL, 'CRITICAL'),
('cal-2', '13108', '2026-11-20', 'Friday', '13:30 UTC', 'MATCH_T20', 'BT20 Round 11 vs Chennai Super Strikers', 'Prabhas Coastal Oval (Home) | Fast Pitch', 'Prabhas Coastal Oval', 'HIGH'),
('cal-3', '13108', '2026-11-21', 'Saturday', '06:00 UTC', 'YOUTH_DRAFT', 'Weekly Youth Academy Intake (Level 20 ITS)', '17yo draft pull available based on £36,000 weekly investment.', NULL, 'HIGH'),
('cal-4', '13108', '2026-11-22', 'Sunday', '00:00 UTC', 'FINANCE_UPDATE', 'Sunday Commercial Settlement & Wage Deductions', 'Player wages (-£7,034), Staff salaries (-£15,650), Upkeep deducted; Sponsors paid.', NULL, 'CRITICAL'),
('cal-5', '13108', '2026-11-24', 'Tuesday', '07:30 UTC', 'MATCH_FC', 'First Class League vs Pitch Punishers', 'Division VIII.17 Fixture | Hard & Fast Pitch | 3 Days Duration', 'Away Grounds', 'HIGH'),
('cal-6', '13108', '2026-11-26', 'Thursday', '08:00 UTC', 'MATCH_OD', 'One Day League vs Madurai Kings', 'Division V.62 Fixture | 50 Overs per side | Green Seaming Track', 'Prabhas Coastal Oval', 'HIGH'),
('cal-7', '13108', '2026-11-29', 'Sunday', '12:00 UTC', 'SPONSOR_PAYMENT', 'Mid-Season Sponsor Confidence Audit', 'Fan club mood currently Over the Moon 🚀; Sponsors Delighted 💎.', NULL, 'NORMAL')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    details = EXCLUDED.details,
    importance = EXCLUDED.importance;

-- 10. Cricket Records Hall of Fame
INSERT INTO public.cricket_records (club_id, category, record_name, holder, value, match_context, date)
VALUES
('13108', 'BATTING', 'Highest Individual Score', 'Achintya Kharge', '144 (218b)', 'FC vs Whykickamoocows', '2026-09-14'),
('13108', 'BATTING', 'Youngest Century Maker', 'Nandakishor Ramdhyani', '112* (17y 14d)', 'FC vs Pitch Punishers', '2026-10-02'),
('13108', 'BATTING', 'Most Career Runs', 'Achintya Kharge', '3,602 Runs (Avg 38.8)', 'Across 88 Senior Matches', 'All-Time'),
('13108', 'BATTING', 'Fastest Half-Century', 'Vasant Malla', '50 off 19 Balls', 'BT20 vs Nagapatnam CC', '2026-11-09'),
('13108', 'BOWLING', 'Best Bowling in an Innings (BBI)', 'Purumitra Rishi', '6/45 (18.4 Overs)', 'FC vs Diu CC', '2026-08-22'),
('13108', 'BOWLING', 'Youngest 5-Wicket Haul', 'Bhadraksh Hemalatha', '6/24 (17y 4d)', 'FC vs Diu CC', '2026-11-14'),
('13108', 'BOWLING', 'Most Career Wickets', 'Purumitra Rishi', '174 Wickets (Avg 23.8)', 'Across 104 Matches', 'All-Time'),
('13108', 'BOWLING', 'Best Match Figures (BBM)', 'Bhadraksh Hemalatha', '10/58 (Match)', 'FC vs Diu CC', '2026-11-14'),
('13108', 'PARTNERSHIP', 'Highest 1st Wicket Stand', 'N. Ramdhyani & I. Baboor', '184 Runs', 'FC vs Pitch Punishers', '2026-10-02'),
('13108', 'PARTNERSHIP', 'Record 4th Wicket Stand', 'A. Kharge & V. Malla', '162 Runs', 'OD vs Moyale Mean Green', '2026-11-16'),
('13108', 'PARTNERSHIP', 'Record 7th Wicket Fightback', 'A. Somal & B. Hemalatha', '88* Runs', 'FC vs Diu CC', '2026-11-14'),
('13108', 'TEAM', 'Highest Team Total', 'Somnath Super Devs', '380/4 declared', 'FC vs Whykickamoocows', '2026-11-11'),
('13108', 'TEAM', 'Lowest Team Total Conceded', 'Diu CC (Bowled Out)', '142 all out (38.2 ov)', 'BT20 Match', '2026-11-09'),
('13108', 'TEAM', 'Largest Victory Margin', 'Somnath Super Devs', 'Won by an Innings & 84 Runs', 'FC vs Diu CC', '2026-11-14')
ON CONFLICT DO NOTHING;
