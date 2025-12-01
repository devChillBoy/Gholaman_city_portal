-- =============================================================================
-- Diagnostic script to check RLS policies and auth status
-- Run this in Supabase SQL Editor to verify RLS setup
-- =============================================================================

-- 1. Check if RLS is enabled on news table
SELECT 
    schemaname,
    tablename,
    rowsecurity as "rls_enabled"
FROM pg_tables 
WHERE tablename = 'news';

-- 2. List all RLS policies on news table
SELECT 
    policyname,
    cmd as "operation",
    permissive,
    roles,
    qual as "using_clause",
    with_check
FROM pg_policies 
WHERE tablename = 'news';

-- 3. Create a diagnostic function to check current auth (run once)
CREATE OR REPLACE FUNCTION check_auth_status()
RETURNS TABLE (
    current_user_id uuid,
    current_role text,
    current_claims jsonb
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY SELECT 
        auth.uid() as current_user_id,
        auth.role() as current_role,
        auth.jwt() as current_claims;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION check_auth_status() TO authenticated;
GRANT EXECUTE ON FUNCTION check_auth_status() TO anon;

-- =============================================================================
-- If the policies query returns EMPTY, you need to apply the RLS policies!
-- Run the contents of 001_rls_policies.sql
-- =============================================================================

