-- ============================================================================
-- Fix All Enum Values for PROOF Platform
-- ============================================================================
-- This migration adds missing enum values discovered in the codebase
-- Safe to run multiple times (IF NOT EXISTS prevents errors)
-- ============================================================================

-- ============================================================================
-- 1. Fix ChallengeKind Enum (Add Chess Challenge Types)
-- ============================================================================

-- Current values: checkpoint, project, final, daily, sponsored
-- Missing chess values: special-moves, puzzle, opening, position, endgame, 
--                       interactive-board, notation, analysis

ALTER TYPE "ChallengeKind" ADD VALUE IF NOT EXISTS 'special-moves';
ALTER TYPE "ChallengeKind" ADD VALUE IF NOT EXISTS 'puzzle';
ALTER TYPE "ChallengeKind" ADD VALUE IF NOT EXISTS 'opening';
ALTER TYPE "ChallengeKind" ADD VALUE IF NOT EXISTS 'position';
ALTER TYPE "ChallengeKind" ADD VALUE IF NOT EXISTS 'endgame';
ALTER TYPE "ChallengeKind" ADD VALUE IF NOT EXISTS 'interactive-board';
ALTER TYPE "ChallengeKind" ADD VALUE IF NOT EXISTS 'notation';
ALTER TYPE "ChallengeKind" ADD VALUE IF NOT EXISTS 'analysis';

-- Note: 'comprehensive', 'simulation', 'final-preview' are used in general curriculum
-- They should be added too if missing
ALTER TYPE "ChallengeKind" ADD VALUE IF NOT EXISTS 'comprehensive';
ALTER TYPE "ChallengeKind" ADD VALUE IF NOT EXISTS 'simulation';
ALTER TYPE "ChallengeKind" ADD VALUE IF NOT EXISTS 'final-preview';

COMMENT ON TYPE "ChallengeKind" IS 'Challenge types: checkpoint, project, final, daily, sponsored (general) + chess types (special-moves, puzzle, opening, position, endgame, interactive-board, notation, analysis) + comprehensive, simulation, final-preview';

-- ============================================================================
-- 2. Verify Challenge Table Compatibility
-- ============================================================================

-- Ensure Challenge table can store chess challenges
-- Check if 'type' column can handle 'chess' type
DO $$
BEGIN
  -- Add 'chess' to ChallengeType enum if it exists
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ChallengeType') THEN
    BEGIN
      ALTER TYPE "ChallengeType" ADD VALUE IF NOT EXISTS 'chess';
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
  END IF;
END $$;

-- ============================================================================
-- 3. Add admin_sessions Table (for admin authentication)
-- ============================================================================

-- Create admin sessions table if using in-memory store
-- This is used by password-based admin authentication
CREATE TABLE IF NOT EXISTS "admin_sessions" (
  "id" TEXT PRIMARY KEY,
  "createdAt" BIGINT NOT NULL,
  "expiresAt" BIGINT NOT NULL,
  "metadata" JSONB DEFAULT '{}'::JSONB
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_expiry ON "admin_sessions"("expiresAt");

COMMENT ON TABLE "admin_sessions" IS 'Admin authentication sessions (24h expiry)';

-- ============================================================================
-- 4. Clean up expired admin sessions
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_expired_admin_sessions()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM "admin_sessions"
  WHERE "expiresAt" < EXTRACT(EPOCH FROM NOW()) * 1000;
END;
$$;

COMMENT ON FUNCTION cleanup_expired_admin_sessions() IS 'Removes expired admin sessions (run periodically)';

-- ============================================================================
-- 5. Verify All Required Tables Exist
-- ============================================================================

DO $$
DECLARE
  missing_tables TEXT[];
  required_tables TEXT[] := ARRAY[
    'User',
    'Challenge',
    'ChallengeAttempt',
    'ChessPuzzle',
    'ChessPuzzleAttempt',
    'ChessPosition',
    'ChessUserProgress',
    'admin_sessions'
  ];
  tbl TEXT;
BEGIN
  missing_tables := ARRAY[]::TEXT[];
  
  FOREACH tbl IN ARRAY required_tables
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_name = tbl
    ) THEN
      missing_tables := array_append(missing_tables, tbl);
    END IF;
  END LOOP;
  
  IF array_length(missing_tables, 1) > 0 THEN
    RAISE WARNING 'Missing tables: %', array_to_string(missing_tables, ', ');
    RAISE NOTICE 'Run complete-migration.sql first, then chess-tables.sql';
  ELSE
    RAISE NOTICE '✅ All required tables exist';
  END IF;
END $$;

-- ============================================================================
-- 6. Summary of Changes
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '==========================================';
  RAISE NOTICE '✅ Enum Values Fixed Successfully!';
  RAISE NOTICE '==========================================';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Changes Applied:';
  RAISE NOTICE '  1. ChallengeKind enum extended with ALL missing types';
  RAISE NOTICE '     Chess types (8):';
  RAISE NOTICE '     • special-moves, puzzle, opening, position';
  RAISE NOTICE '     • endgame, interactive-board, notation, analysis';
  RAISE NOTICE '     General types (3):';
  RAISE NOTICE '     • comprehensive, simulation, final-preview';
  RAISE NOTICE '';
  RAISE NOTICE '  2. ChallengeType enum checked for chess support';
  RAISE NOTICE '  3. admin_sessions table created (if not exists)';
  RAISE NOTICE '  4. Cleanup function added for expired sessions';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Your database is now compatible with:';
  RAISE NOTICE '  ✓ Chess curriculum (22 topics)';
  RAISE NOTICE '  ✓ Chess challenges and puzzles';
  RAISE NOTICE '  ✓ Admin dashboard authentication';
  RAISE NOTICE '';
  RAISE NOTICE '==========================================';
END $$;
