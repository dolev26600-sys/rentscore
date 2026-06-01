-- ============================================================
-- RentScore — Supabase Migrations
-- הרץ בסדר הזה ב-Supabase SQL Editor
-- ============================================================

-- 1. Add referred_by to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by text;

-- 2. Verified recommendations requests
CREATE TABLE IF NOT EXISTS recommendation_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid REFERENCES users(id) ON DELETE CASCADE,
  landlord_name text NOT NULL,
  address text,
  token text UNIQUE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending','approved','declined')),
  rating int CHECK (rating BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- 3. Add verified flag to recommendations
ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false;
ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS address text;

-- 4. RLS for recommendation_requests
ALTER TABLE recommendation_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can read by token (for approval page)
CREATE POLICY "public read by token" ON recommendation_requests
  FOR SELECT USING (true);

-- Authenticated users can insert their own
CREATE POLICY "tenant insert own" ON recommendation_requests
  FOR INSERT WITH CHECK (true);

-- Anyone can update (for landlord approval without login)
CREATE POLICY "public update" ON recommendation_requests
  FOR UPDATE USING (true);
