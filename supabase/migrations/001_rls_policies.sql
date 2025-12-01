-- =============================================================================
-- Row Level Security (RLS) Policies for Gholaman Municipality Portal
-- =============================================================================
-- Run this script in Supabase SQL Editor
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Enable RLS on tables
-- -----------------------------------------------------------------------------

ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- NEWS TABLE POLICIES
-- -----------------------------------------------------------------------------

-- Policy: Anyone can read published news
CREATE POLICY "Public can read published news"
ON news
FOR SELECT
TO anon, authenticated
USING (status = 'published');

-- Policy: Authenticated users can read all news (for admin panel)
CREATE POLICY "Authenticated users can read all news"
ON news
FOR SELECT
TO authenticated
USING (true);

-- Policy: Only authenticated users can insert news
-- (Further admin check should be done in application layer)
CREATE POLICY "Authenticated users can insert news"
ON news
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Only authenticated users can update news
CREATE POLICY "Authenticated users can update news"
ON news
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Only authenticated users can delete news
CREATE POLICY "Authenticated users can delete news"
ON news
FOR DELETE
TO authenticated
USING (true);

-- -----------------------------------------------------------------------------
-- REQUESTS TABLE POLICIES
-- -----------------------------------------------------------------------------

-- Policy: Anyone can read requests (needed for tracking by code)
-- In production, you might want to restrict this to only allow reading by code
CREATE POLICY "Public can read requests"
ON requests
FOR SELECT
TO anon, authenticated
USING (true);

-- Policy: Anyone can create requests (citizens submitting forms)
CREATE POLICY "Public can insert requests"
ON requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy: Only authenticated users can update requests (employees)
CREATE POLICY "Authenticated users can update requests"
ON requests
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Only authenticated users can delete requests
CREATE POLICY "Authenticated users can delete requests"
ON requests
FOR DELETE
TO authenticated
USING (true);

-- =============================================================================
-- NOTES:
-- =============================================================================
-- 1. These policies provide basic protection:
--    - News: Public read for published, full CRUD for authenticated
--    - Requests: Public read/insert, authenticated for update/delete
--
-- 2. For stricter security, consider:
--    - Creating a custom "admin" role in Supabase
--    - Using auth.jwt() claims for role-based policies
--    - Restricting request reads to only match by tracking code
--
-- 3. To add admin-only policies, you can:
--    a) Add admin emails to user metadata
--    b) Create a separate admins table
--    c) Use Supabase custom claims
--
-- Example for admin-only write on news (if using custom claim):
-- CREATE POLICY "Admin can manage news"
-- ON news
-- FOR ALL
-- TO authenticated
-- USING (auth.jwt() ->> 'role' = 'admin')
-- WITH CHECK (auth.jwt() ->> 'role' = 'admin');
-- =============================================================================

