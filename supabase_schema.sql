-- ⚔️ FACE-OFF — V1.0 Supabase / PostgreSQL Production Schema

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT NOT NULL,
    bio TEXT DEFAULT 'Ready for the arena ⚔️',
    rating INTEGER DEFAULT 1000 NOT NULL,
    provisional_matches INTEGER DEFAULT 0 NOT NULL,
    wins INTEGER DEFAULT 0 NOT NULL,
    losses INTEGER DEFAULT 0 NOT NULL,
    streak INTEGER DEFAULT 0 NOT NULL,
    max_streak INTEGER DEFAULT 0 NOT NULL,
    battle_credits INTEGER DEFAULT 1 NOT NULL,
    pending_votes_count INTEGER DEFAULT 0 NOT NULL,
    total_votes_cast INTEGER DEFAULT 0 NOT NULL,
    judge_agreements INTEGER DEFAULT 0 NOT NULL,
    player_xp INTEGER DEFAULT 0 NOT NULL,
    judge_xp INTEGER DEFAULT 0 NOT NULL,
    visibility TEXT DEFAULT 'PUBLIC' CHECK (visibility IN ('PUBLIC', 'MATCH_ONLY', 'HIDDEN')),
    is_age_verified BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. MATCHES TABLE
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_a_id UUID NOT NULL REFERENCES public.profiles(id),
    player_b_id UUID NOT NULL REFERENCES public.profiles(id),
    status TEXT DEFAULT 'WAITING_FOR_VOTES' CHECK (status IN ('WAITING_FOR_VOTES', 'COMPLETED', 'CANCELLED')),
    votes_a INTEGER DEFAULT 0 NOT NULL,
    votes_b INTEGER DEFAULT 0 NOT NULL,
    total_votes INTEGER DEFAULT 0 NOT NULL,
    winner_id UUID REFERENCES public.profiles(id),
    rating_delta_a INTEGER,
    rating_delta_b INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    resolved_at TIMESTAMPTZ
);

-- 3. VOTES TABLE
CREATE TABLE IF NOT EXISTS public.votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    judge_id UUID NOT NULL REFERENCES public.profiles(id),
    voted_for_id UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_judge_match UNIQUE (judge_id, match_id)
);

-- 4. REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id),
    target_user_id UUID NOT NULL REFERENCES public.profiles(id),
    reason TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. BLOCKS TABLE
CREATE TABLE IF NOT EXISTS public.blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blocker_id UUID NOT NULL REFERENCES public.profiles(id),
    blocked_user_id UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_block UNIQUE (blocker_id, blocked_user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;

-- Policies for public reading of profiles and matches
CREATE POLICY "Public Profiles Read" ON public.profiles FOR SELECT USING (visibility = 'PUBLIC' OR visibility = 'MATCH_ONLY');
CREATE POLICY "Public Matches Read" ON public.matches FOR SELECT USING (TRUE);
