-- =====================================================================
-- BT360MAK - Battrick Sovereign Intelligence & SaaS Manager Suite
-- Supabase Database Migration (PostgreSQL DDL + RLS Policies)
-- Replaces Google Sheets 10-Tab Master & Apps Script Controller
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
    -- Allow read for default showcase club (13108) or user's assigned club
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

-- Universal Read Policies
CREATE POLICY "Clubs Select Policy" ON public.clubs FOR SELECT USING (id = '13108' OR user_id = auth.uid());
CREATE POLICY "Players Select Policy" ON public.players FOR SELECT USING (public.can_access_club(club_id));
CREATE POLICY "Training Logs Select Policy" ON public.training_logs FOR SELECT USING (public.can_access_club(club_id));
CREATE POLICY "Nets Matrix Select Policy" ON public.nets_matrix FOR SELECT USING (public.can_access_club(club_id));
CREATE POLICY "Matches Select Policy" ON public.matches FOR SELECT USING (public.can_access_club(club_id));
CREATE POLICY "Tactics Select Policy" ON public.tactics_lineup FOR SELECT USING (public.can_access_club(club_id));
CREATE POLICY "Finances Select Policy" ON public.financial_ledger FOR SELECT USING (public.can_access_club(club_id));
CREATE POLICY "Stadium Select Policy" ON public.stadium_tiers FOR SELECT USING (public.can_access_club(club_id));
CREATE POLICY "Staff Select Policy" ON public.backroom_staff FOR SELECT USING (public.can_access_club(club_id));

-- Write Policies (Only Authenticated Club Owner)
CREATE POLICY "Clubs Modify Policy" ON public.clubs FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Players Modify Policy" ON public.players FOR ALL USING (EXISTS (SELECT 1 FROM public.clubs WHERE id = players.club_id AND user_id = auth.uid()));
CREATE POLICY "Training Modify Policy" ON public.training_logs FOR ALL USING (EXISTS (SELECT 1 FROM public.clubs WHERE id = training_logs.club_id AND user_id = auth.uid()));
CREATE POLICY "Nets Modify Policy" ON public.nets_matrix FOR ALL USING (EXISTS (SELECT 1 FROM public.clubs WHERE id = nets_matrix.club_id AND user_id = auth.uid()));
CREATE POLICY "Matches Modify Policy" ON public.matches FOR ALL USING (EXISTS (SELECT 1 FROM public.clubs WHERE id = matches.club_id AND user_id = auth.uid()));
CREATE POLICY "Tactics Modify Policy" ON public.tactics_lineup FOR ALL USING (EXISTS (SELECT 1 FROM public.clubs WHERE id = tactics_lineup.club_id AND user_id = auth.uid()));
CREATE POLICY "Finances Modify Policy" ON public.financial_ledger FOR ALL USING (EXISTS (SELECT 1 FROM public.clubs WHERE id = financial_ledger.club_id AND user_id = auth.uid()));
CREATE POLICY "Stadium Modify Policy" ON public.stadium_tiers FOR ALL USING (EXISTS (SELECT 1 FROM public.clubs WHERE id = stadium_tiers.club_id AND user_id = auth.uid()));
CREATE POLICY "Staff Modify Policy" ON public.backroom_staff FOR ALL USING (EXISTS (SELECT 1 FROM public.clubs WHERE id = backroom_staff.club_id AND user_id = auth.uid()));

-- =====================================================================
-- PERFORMANCE INDEXES
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_players_club ON public.players(club_id);
CREATE INDEX IF NOT EXISTS idx_matches_club ON public.matches(club_id);
CREATE INDEX IF NOT EXISTS idx_training_player ON public.training_logs(player_id);
CREATE INDEX IF NOT EXISTS idx_finances_club_week ON public.financial_ledger(club_id, week_number);
