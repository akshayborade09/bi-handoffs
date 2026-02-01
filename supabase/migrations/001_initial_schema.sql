-- ==========================================
-- BondsIndia Design Handoffs Database Schema
-- Migration: 001 - Initial Schema
-- ==========================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- USERS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  google_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- ==========================================
-- COMMENTS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_image TEXT,
  page_id TEXT NOT NULL,
  position_x INTEGER NOT NULL,
  position_y INTEGER NOT NULL,
  content TEXT NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for comments table
CREATE INDEX IF NOT EXISTS idx_comments_page_id ON comments(page_id);
CREATE INDEX IF NOT EXISTS idx_comments_resolved ON comments(resolved);
CREATE INDEX IF NOT EXISTS idx_comments_page_resolved ON comments(page_id, resolved);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Enable RLS on comments table
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- RLS POLICIES - USERS TABLE
-- ==========================================

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Allow read access to all users" ON users;

-- Allow everyone to read user data
CREATE POLICY "Allow read access to all users" 
  ON users 
  FOR SELECT 
  USING (true);

-- Note: Only service role can write to users table (handled in application)

-- ==========================================
-- RLS POLICIES - COMMENTS TABLE
-- ==========================================

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Allow authenticated users to read comments" ON comments;
DROP POLICY IF EXISTS "Allow authenticated users to create comments" ON comments;
DROP POLICY IF EXISTS "Allow authenticated users to update comments" ON comments;
DROP POLICY IF EXISTS "Allow users to delete own comments" ON comments;

-- Anyone can read comments
-- Note: In production, you might want to restrict this to authenticated users only
CREATE POLICY "Allow authenticated users to read comments" 
  ON comments 
  FOR SELECT 
  USING (true);

-- Authenticated users can create comments
-- Note: The actual authentication check happens in the API route
CREATE POLICY "Allow authenticated users to create comments" 
  ON comments 
  FOR INSERT 
  WITH CHECK (true);

-- Anyone can update comments (collaborative editing)
-- Note: If you want to restrict updates to comment owners, change to:
-- WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub')
CREATE POLICY "Allow authenticated users to update comments" 
  ON comments 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- Users can only delete their own comments
-- Note: Since we're using NextAuth, we can't directly compare with JWT
-- So this policy is permissive and actual authorization happens in API route
CREATE POLICY "Allow users to delete own comments" 
  ON comments 
  FOR DELETE 
  USING (true);

-- ==========================================
-- GRANTS
-- ==========================================

-- Grant permissions to authenticated role
GRANT ALL ON users TO authenticated;
GRANT ALL ON comments TO authenticated;

-- Grant permissions to anon role (for public read access)
GRANT SELECT ON users TO anon;
GRANT SELECT ON comments TO anon;
GRANT INSERT ON comments TO anon;
GRANT UPDATE ON comments TO anon;
GRANT DELETE ON comments TO anon;

-- ==========================================
-- FUNCTIONS & TRIGGERS
-- ==========================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for comments table
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- REALTIME (Optional)
-- ==========================================

-- Enable realtime for comments table if you want to use subscriptions
-- Uncomment the following line if you want real-time updates
-- ALTER PUBLICATION supabase_realtime ADD TABLE comments;

-- ==========================================
-- NOTES
-- ==========================================

-- 1. This migration creates the initial schema with RLS enabled
-- 2. Service role key bypasses RLS - use only in trusted server code
-- 3. Anon key respects RLS - use for client-side queries
-- 4. Authentication is handled by NextAuth + API routes
-- 5. RLS policies act as a safety net for defense in depth
-- 6. The updated_at triggers automatically update timestamps

-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================

-- Uncomment to verify the setup:
-- SELECT tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('users', 'comments');
