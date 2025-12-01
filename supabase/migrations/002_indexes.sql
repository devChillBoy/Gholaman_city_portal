-- =============================================================================
-- Database Indexes for Gholaman Municipality Portal
-- =============================================================================
-- Run this script in Supabase SQL Editor
-- =============================================================================

-- -----------------------------------------------------------------------------
-- NEWS TABLE INDEXES
-- -----------------------------------------------------------------------------

-- Index for slug lookup (used in /news/[slug] route)
CREATE INDEX IF NOT EXISTS idx_news_slug 
ON news (slug);

-- Composite index for published news listing (status + published_at)
CREATE INDEX IF NOT EXISTS idx_news_published 
ON news (status, published_at DESC NULLS LAST, created_at DESC);

-- Index for admin news listing (ordered by created_at)
CREATE INDEX IF NOT EXISTS idx_news_created_at 
ON news (created_at DESC);

-- -----------------------------------------------------------------------------
-- REQUESTS TABLE INDEXES
-- -----------------------------------------------------------------------------

-- Index for tracking code lookup (used in /track/[code] route)
-- This is critical for fast tracking code searches
CREATE UNIQUE INDEX IF NOT EXISTS idx_requests_code 
ON requests (code);

-- Index for status filtering (used in dashboard)
CREATE INDEX IF NOT EXISTS idx_requests_status 
ON requests (status);

-- Composite index for dashboard queries (status + created_at)
CREATE INDEX IF NOT EXISTS idx_requests_status_created 
ON requests (status, created_at DESC);

-- Index for service type filtering (if needed in future)
CREATE INDEX IF NOT EXISTS idx_requests_service_type 
ON requests (service_type);

-- Index for created_at ordering (used in recent requests)
CREATE INDEX IF NOT EXISTS idx_requests_created_at 
ON requests (created_at DESC);

-- =============================================================================
-- VERIFY INDEXES
-- =============================================================================
-- Run this to see all indexes on the tables:
-- 
-- SELECT indexname, indexdef 
-- FROM pg_indexes 
-- WHERE tablename IN ('news', 'requests');
-- =============================================================================

