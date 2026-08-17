-- Create urls table
CREATE TABLE IF NOT EXISTS public.urls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    short_code VARCHAR(20) NOT NULL UNIQUE,
    original_url TEXT NOT NULL,
    custom_alias VARCHAR(30) UNIQUE,
    click_count INTEGER NOT NULL DEFAULT 0,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_urls_short_code ON public.urls(short_code);
CREATE INDEX IF NOT EXISTS idx_urls_custom_alias ON public.urls(custom_alias);
CREATE INDEX IF NOT EXISTS idx_urls_user_id ON public.urls(user_id);

-- Trigger to update 'updated_at' automatically
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_urls_modtime
    BEFORE UPDATE ON public.urls
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.urls ENABLE ROW LEVEL SECURITY;

-- For Phase 2/3 (Before Auth is fully configured), allow everything if needed, 
-- or since backend uses service_role key, it will bypass RLS anyway.
-- These are basic placeholder policies for when Anon/Authenticated access is used.
CREATE POLICY "Enable read access for all users" ON public.urls FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.urls FOR INSERT WITH CHECK (true);
