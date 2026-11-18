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

-- 3. Players Table (Squad Master)
CREATE TABLE IF NOT EXISTS public.players (
    id TEXT PRIMARY KEY,                       -- e.g. 'BT-6099466'
    club_id TEXT NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age INT NOT NULL,
    wage INT NOT NULL,
    batting_hand TEXT NOT NULL,                -- e.g. 'LHB', 'RHB'
    bowling_type TEXT NOT NULL,                -- e.g. 'R H finger spin', 'L FM'
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
    active_net TEXT DEFAULT 'None',
    market_value BIGINT DEFAULT 0,
    tactical_role TEXT,
    is_wonderkid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Training Tracker Table
CREATE TABLE IF NOT EXISTS public.training_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id TEXT NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    player_id TEXT NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    skill_trained TEXT NOT NULL,
    previous_level TEXT NOT NULL,
    new_level TEXT NOT NULL,
    subskill NUMERIC(4,2),
    weeks_taken INT DEFAULT 1,
    coach_quality TEXT DEFAULT 'Competent',
    pop_confirmed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Nets Matrix Table (10 Nets Allocation)
CREATE TABLE IF NOT EXISTS public.nets_matrix (
    club_id TEXT NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    net_number INT NOT NULL CHECK (net_number BETWEEN 1 AND 10),
    training_type TEXT NOT NULL,
    player_id TEXT REFERENCES public.players(id) ON DELETE SET NULL,
    coach_multiplier NUMERIC(3,2) DEFAULT 1.00,
    pops_estimated_weeks INT,
    notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (club_id, net_number)
);

-- 6. Match Archives Table
CREATE TABLE IF NOT EXISTS public.matches (
    id TEXT PRIMARY KEY,                       -- e.g. 'M-32217484'
    club_id TEXT NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    match_date DATE NOT NULL,
    match_type TEXT NOT NULL,                  -- 'First Class', 'One Day', 'BT20'
    opponent_club TEXT NOT NULL,
    venue TEXT NOT NULL,                       -- 'Home' or 'Away'
    pitch_type TEXT NOT NULL,                  -- 'Hard', 'Green', 'Dusty', 'Flat', etc.
    result TEXT,
    status TEXT DEFAULT 'completed',           -- 'completed', 'upcoming'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Lineup & Tactics Table
CREATE TABLE IF NOT EXISTS public.tactics_lineup (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id TEXT NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    batting_order INT NOT NULL CHECK (batting_order BETWEEN 1 AND 11),
    player_id TEXT NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    aggression TEXT NOT NULL DEFAULT 'Moderate',
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
    tier_name TEXT NOT NULL,                   -- 'Standing Room', 'Uncovered', 'Covered', 'Members'
    current_seats INT NOT NULL,
    optimal_ratio NUMERIC(4,2) NOT NULL,       -- 0.68, 0.23, 0.07, 0.02
    recommended_seats INT NOT NULL,
    ticket_price NUMERIC(6,2) NOT NULL,
    expansion_cost_per_seat NUMERIC(6,2) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (club_id, tier_name)
);

-- 10. Backroom Staff Table
CREATE TABLE IF NOT EXISTS public.backroom_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id TEXT NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    role TEXT NOT NULL,                        -- 'Head Coach', 'Physio', 'Financial Advisor', etc.
    name TEXT NOT NULL,
    skill_level TEXT NOT NULL,
    weekly_wage INT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES - MODEL B SUBSCRIBER ISOLATION
-- =====================================================================

ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nets_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tactics_lineup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stadium_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backroom_staff ENABLE ROW LEVEL SECURITY;

-- Helper policy function: Allow owner or public read for demo club '13108'
CREATE OR REPLACE FUNCTION public.can_access_club(target_club_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    IF target_club_id = '13108' THEN
        RETURN TRUE;
    END IF;
    
    RETURN EXISTS (
        SELECT 1 FROM public.clubs 
        WHERE id = target_club_id 
        AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Universal Read Policies (Allows reading showcase club 13108 or user's owned club)
DROP POLICY IF EXISTS "Clubs Select Policy" ON public.clubs;
CREATE POLICY "Clubs Select Policy" ON public.clubs FOR SELECT USING (id = '13108' OR user_id = auth.uid() OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Players Select Policy" ON public.players;
CREATE POLICY "Players Select Policy" ON public.players FOR SELECT USING (public.can_access_club(club_id) OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Training Logs Select Policy" ON public.training_logs;
CREATE POLICY "Training Logs Select Policy" ON public.training_logs FOR SELECT USING (public.can_access_club(club_id) OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Nets Matrix Select Policy" ON public.nets_matrix;
CREATE POLICY "Nets Matrix Select Policy" ON public.nets_matrix FOR SELECT USING (public.can_access_club(club_id) OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Matches Select Policy" ON public.matches;
CREATE POLICY "Matches Select Policy" ON public.matches FOR SELECT USING (public.can_access_club(club_id) OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Tactics Select Policy" ON public.tactics_lineup;
CREATE POLICY "Tactics Select Policy" ON public.tactics_lineup FOR SELECT USING (public.can_access_club(club_id) OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Finances Select Policy" ON public.financial_ledger;
CREATE POLICY "Finances Select Policy" ON public.financial_ledger FOR SELECT USING (public.can_access_club(club_id) OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Stadium Select Policy" ON public.stadium_tiers;
CREATE POLICY "Stadium Select Policy" ON public.stadium_tiers FOR SELECT USING (public.can_access_club(club_id) OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Staff Select Policy" ON public.backroom_staff;
CREATE POLICY "Staff Select Policy" ON public.backroom_staff FOR SELECT USING (public.can_access_club(club_id) OR auth.uid() IS NULL);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_players_club ON public.players(club_id);
CREATE INDEX IF NOT EXISTS idx_matches_club ON public.matches(club_id);
CREATE INDEX IF NOT EXISTS idx_training_player ON public.training_logs(player_id);
CREATE INDEX IF NOT EXISTS idx_finances_club_week ON public.financial_ledger(club_id, week_number);

-- =====================================================================
-- SEED DATA: SOMNATH SUPER DEVS (#13108)
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
    'Shakti Mak',
    'Tamil Nadu, India',
    'VIII.17',
    'V.62',
    'VII.241',
    781,
    'Over the Moon 🚀',
    'Delighted 💎',
    'Sublime',
    1320573,
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

-- 2. 14-Man Squad
INSERT INTO public.players (
    id, club_id, name, age, wage, batting_hand, bowling_type,
    batting, bowling, keeping, fielding, consistency, concentration,
    stamina, form, fatigue, leadership, experience, bti, subskill,
    active_net, market_value, tactical_role, is_wonderkid
) VALUES
('BT-6099459', '13108', 'Arjun Ashraf', 21, 284, 'LHB', 'L FM', 'abysmal', 'woeful', 'feeble', 'mediocre', 'abysmal', 'mediocre', 'feeble', 'abysmal', 'sublime', 'respectable', 'abysmal', 2664, 6.20, 'None', 164240, 'Squad Player', false),
('BT-6099472', '13108', 'Issa Baboor', 26, 546, 'RHB', 'R F', 'competent', 'woeful', 'abysmal', 'mediocre', 'woeful', 'competent', 'competent', 'strong', 'sublime', 'respectable', 'feeble', 7440, 6.20, 'None', 396900, 'Middle-Order Batter', false),
('BT-6099468', '13108', 'Kamadev Battasi', 25, 543, 'RHB', 'R H finger spin', 'feeble', 'competent', 'feeble', 'woeful', 'competent', 'woeful', 'competent', 'respectable', 'sublime', 'abysmal', 'woeful', 6665, 6.20, 'None', 369025, 'Lead Finger Spinner', false),
('BT-6099466', '13108', 'Bhadraksh Hemalatha', 17, 545, 'RHB', 'R H finger spin', 'abysmal', 'competent', 'feeble', 'abysmal', 'competent', 'feeble', 'competent', 'superb', 'sublime', 'feeble', 'abysmal', 6989, 6.70, 'Bowling (1)', 685557, 'Lead Finger Spinner (Wonderkid)', true),
('BT-6099470', '13108', 'Kamal Hydrose', 25, 538, 'LHB', 'L M', 'woeful', 'competent', 'woeful', 'woeful', 'competent', 'abysmal', 'competent', 'superb', 'sublime', 'woeful', 'feeble', 6085, 6.20, 'None', 347475, 'Opening Bowler', false),
('BT-6099461', '13108', 'Lalit Kadam', 23, 369, 'RHB', 'R FM', 'mediocre', 'woeful', 'woeful', 'feeble', 'woeful', 'feeble', 'abysmal', 'woeful', 'sublime', 'abysmal', 'worthless', 2206, 6.20, 'Stamina (1)', 169460, 'Squad Player', false),
('BT-6099475', '13108', 'Achintya Kharge', 26, 553, 'RHB', 'R M', 'competent', 'woeful', 'woeful', 'competent', 'woeful', 'competent', 'competent', 'superb', 'sublime', 'competent', 'mediocre', 8436, 6.20, 'Fielding (1)', 433510, 'Middle-Order Batter (C)', false),
('BT-6099473', '13108', 'Vasant Malla', 28, 544, 'LHB', 'L FM', 'competent', 'feeble', 'woeful', 'mediocre', 'abysmal', 'competent', 'competent', 'superb', 'sublime', 'competent', 'feeble', 7468, 6.20, 'None', 397380, 'Middle-Order Batter', false),
('BT-6099476', '13108', 'Ankur Palanisamy', 27, 510, 'RHB', 'R H finger spin', 'mediocre', 'woeful', 'competent', 'feeble', 'mediocre', 'woeful', 'competent', 'woeful', 'sublime', 'proficient', 'abysmal', 5601, 6.20, 'Wicket Keeping (1)', 323535, 'Primary Wicketkeeper', false),
('BT-6099471', '13108', 'Nandakishor Ramdhyani', 17, 559, 'LHB', 'L M', 'competent', 'mediocre', 'woeful', 'woeful', 'feeble', 'competent', 'competent', 'mediocre', 'sublime', 'competent', 'abysmal', 6360, 6.70, 'Batting (1)', 652230, 'Young Top-Order Batter (Wonderkid)', true),
('BT-6099469', '13108', 'Purumitra Rishi', 29, 549, 'RHB', 'R M', 'feeble', 'competent', 'woeful', 'woeful', 'competent', 'feeble', 'competent', 'superb', 'sublime', 'feeble', 'abysmal', 7286, 6.20, 'None', 392260, 'Opening Bowler', false),
('BT-6099474', '13108', 'Viplav Sinduvalli', 25, 544, 'LHB', 'L M', 'competent', 'woeful', 'feeble', 'abysmal', 'feeble', 'competent', 'competent', 'superb', 'sublime', 'competent', 'mediocre', 7031, 6.20, 'None', 382085, 'Middle-Order Batter', false),
('BT-6099467', '13108', 'Arvind Somal', 27, 552, 'LHB', 'L M', 'woeful', 'competent', 'feeble', 'woeful', 'competent', 'feeble', 'competent', 'proficient', 'energetic', 'respectable', 'abysmal', 6775, 6.20, 'None', 375125, 'Opening Bowler', false),
('BT-6099462', '13108', 'Atulya Surya Teja', 24, 398, 'RHB', 'R M', 'mediocre', 'woeful', 'mediocre', 'woeful', 'feeble', 'woeful', 'woeful', 'worthless', 'sublime', 'woeful', 'abysmal', 2813, 6.20, 'None', 197955, 'Squad Player', false)
ON CONFLICT (id) DO UPDATE SET
    wage = EXCLUDED.wage,
    form = EXCLUDED.form,
    fatigue = EXCLUDED.fatigue,
    subskill = EXCLUDED.subskill,
    market_value = EXCLUDED.market_value;

-- 3. Training Logs
INSERT INTO public.training_logs (club_id, player_id, log_date, skill_trained, previous_level, new_level, subskill, weeks_taken, coach_quality, pop_confirmed)
VALUES
('13108', 'BT-6099466', '2026-11-13', 'Bowling', 'Mediocre', 'Competent', 6.05, 7, 'Competent', true),
('13108', 'BT-6099471', '2026-11-06', 'Batting', 'Mediocre', 'Competent', 6.08, 8, 'Competent', true);

-- 4. 10 Nets Matrix
INSERT INTO public.nets_matrix (club_id, net_number, training_type, player_id, coach_multiplier, pops_estimated_weeks, notes)
VALUES
('13108', 1, 'Bowling', 'BT-6099466', 1.00, 7, 'Primary finger spin wonderkid progression'),
('13108', 2, 'Batting', 'BT-6099471', 1.00, 7, 'Primary top-order youth batter development'),
('13108', 3, 'Fielding', 'BT-6099475', 1.00, 5, 'Captain middle-order fielding boost'),
('13108', 4, 'Wicket Keeping', 'BT-6099476', 1.00, 8, 'Primary keeper glovework'),
('13108', 5, 'Fitness / Stamina', 'BT-6099461', 1.00, 4, 'Squad player stamina recovery'),
('13108', 6, 'Open / Available', NULL, 1.00, NULL, 'Ready for next youth pull'),
('13108', 7, 'Open / Available', NULL, 1.00, NULL, 'Ready for squad rotation'),
('13108', 8, 'Open / Available', NULL, 1.00, NULL, 'Available net'),
('13108', 9, 'Open / Available', NULL, 1.00, NULL, 'Available net'),
('13108', 10, 'Open / Available', NULL, 1.00, NULL, 'Available net')
ON CONFLICT (club_id, net_number) DO UPDATE SET
    training_type = EXCLUDED.training_type,
    player_id = EXCLUDED.player_id,
    notes = EXCLUDED.notes;

-- 5. Matches
INSERT INTO public.matches (id, club_id, match_date, match_type, opponent_club, venue, pitch_type, result, status)
VALUES
('M-32217484', '13108', '2026-11-14', 'First Class', 'Diu CC', 'Home (Prabhas Coastal Oval)', 'Hard', 'WON (Somnath 312 & 142/2 beat Diu CC 210 & 240 by 8 wkts)', 'completed'),
('M-32485077', '13108', '2026-11-16', 'One Day', 'Moyale Mean Green', 'Away', 'Green', 'WON (Somnath 248/6 beat Moyale 245 by 4 wkts)', 'completed'),
('M-32232666', '13108', '2026-11-11', 'First Class', 'Whykickamoocows', 'Away', 'Dusty', 'DRAW (Somnath 380 & 195/4 dec vs 288 & 160/7)', 'completed'),
('M-32190812', '13108', '2026-11-09', 'BT20', 'Nagapatnam CC', 'Home (Prabhas Coastal Oval)', 'Flat', 'WON (Somnath 176/4 beat Nagapatnam 142/9 by 34 runs)', 'completed'),
('M-32510940', '13108', '2026-11-24', 'First Class', 'Pitch Punishers', 'Away', 'Hard', 'Upcoming Fixture (FC Friendly)', 'upcoming')
ON CONFLICT (id) DO UPDATE SET
    result = EXCLUDED.result,
    status = EXCLUDED.status;

-- 6. Lineup & Tactics
INSERT INTO public.tactics_lineup (club_id, batting_order, player_id, role, aggression, bowling_order, max_overs)
VALUES
('13108', 1, 'BT-6099471', 'Young Opening Batter (LHB)', 'Attacking', '-', NULL),
('13108', 2, 'BT-6099472', 'Middle-Order Batter (RHB)', 'Moderate', '-', NULL),
('13108', 3, 'BT-6099475', 'Captain & Anchor (RHB)', 'Moderate', '4th Change (RM)', 4),
('13108', 4, 'BT-6099473', 'Middle-Order Batter (LHB)', 'Attacking', '-', NULL),
('13108', 5, 'BT-6099474', 'Middle-Order Batter (LHB)', 'Attacking', '-', NULL),
('13108', 6, 'BT-6099476', 'Primary Wicketkeeper (RHB)', 'Moderate', '-', NULL),
('13108', 7, 'BT-6099467', 'All-Rounder (LHB / LM)', 'Defensive', '2nd Bowler', 10),
('13108', 8, 'BT-6099468', 'Lead Finger Spinner (RHB)', 'Moderate', '3rd Bowler', 10),
('13108', 9, 'BT-6099466', 'Strike Finger Spinner (RHB)', 'Attacking', '1st Change', 10),
('13108', 10, 'BT-6099470', 'Opening Bowler (LHB / LM)', 'Defensive', '1st Bowler', 10),
('13108', 11, 'BT-6099469', 'Opening Strike Seamer (RHB / RM)', 'Attacking', '2nd Bowler', 10)
ON CONFLICT (club_id, batting_order) DO UPDATE SET
    player_id = EXCLUDED.player_id,
    role = EXCLUDED.role,
    aggression = EXCLUDED.aggression,
    bowling_order = EXCLUDED.bowling_order,
    max_overs = EXCLUDED.max_overs;

-- 7. Financial Ledger
INSERT INTO public.financial_ledger (
    club_id, week_number, record_date, gate_receipts, sponsors, merchandise,
    prize_money, player_wages, staff_wages, stadium_upkeep, youth_academy,
    cumulative_bank_balance
) VALUES
('13108', 1, '2026-11-18', 126546, 22823, 15128, 33114, 7034, 12250, 14702, 0, 1320573)
ON CONFLICT (club_id, week_number) DO NOTHING;

-- 8. Stadium Tiers (10,000 Capacity)
INSERT INTO public.stadium_tiers (club_id, tier_name, current_seats, optimal_ratio, recommended_seats, ticket_price, expansion_cost_per_seat)
VALUES
('13108', 'Standing Room', 5275, 0.68, 10200, 5.00, 35.00),
('13108', 'Uncovered Seats', 3270, 0.23, 3450, 8.00, 48.00),
('13108', 'Covered Seats', 1100, 0.07, 1050, 14.00, 72.00),
('13108', 'Members Enclosure', 355, 0.02, 300, 25.00, 120.00)
ON CONFLICT (club_id, tier_name) DO UPDATE SET
    current_seats = EXCLUDED.current_seats,
    recommended_seats = EXCLUDED.recommended_seats;

-- 9. Backroom Staff
INSERT INTO public.backroom_staff (club_id, role, name, skill_level, weekly_wage)
VALUES
('13108', 'Head Coach', 'Devdutt Raman', 'Competent', 4200),
('13108', 'Lead Physiotherapist', 'Dr. Chetan Bhatt', 'Respectable', 3150),
('13108', 'Head Scout', 'Girish Kumble', 'Competent', 2500),
('13108', 'Financial Director', 'Shakti Mak', 'Masterclass', 2400)
ON CONFLICT DO NOTHING;
