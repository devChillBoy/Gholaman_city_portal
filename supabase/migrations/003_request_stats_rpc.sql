-- =============================================================================
-- RPC Function for Request Statistics
-- =============================================================================
-- This function returns request counts grouped by status in a single query
-- instead of 5 separate COUNT queries
-- =============================================================================

CREATE OR REPLACE FUNCTION get_request_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'all', COUNT(*),
    'pending', COUNT(*) FILTER (WHERE status = 'pending'),
    'in-review', COUNT(*) FILTER (WHERE status = 'in-review'),
    'completed', COUNT(*) FILTER (WHERE status = 'completed'),
    'rejected', COUNT(*) FILTER (WHERE status = 'rejected')
  ) INTO result
  FROM requests;
  
  RETURN result;
END;
$$;

-- Grant execute permission to all users (needed for dashboard)
GRANT EXECUTE ON FUNCTION get_request_stats() TO anon, authenticated;

-- =============================================================================
-- Usage in Supabase Client:
-- const { data, error } = await supabase.rpc('get_request_stats');
-- 
-- Returns: { all: 100, pending: 30, "in-review": 25, completed: 40, rejected: 5 }
-- =============================================================================

