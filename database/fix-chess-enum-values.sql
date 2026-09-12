-- Fix ChallengeKind enum to include chess challenge types
-- This migration adds missing enum values for chess challenges

-- Add missing chess challenge kinds to the enum
ALTER TYPE "ChallengeKind" ADD VALUE IF NOT EXISTS 'special-moves';
ALTER TYPE "ChallengeKind" ADD VALUE IF NOT EXISTS 'puzzle';
ALTER TYPE "ChallengeKind" ADD VALUE IF NOT EXISTS 'opening';
ALTER TYPE "ChallengeKind" ADD VALUE IF NOT EXISTS 'position';
ALTER TYPE "ChallengeKind" ADD VALUE IF NOT EXISTS 'endgame';

-- Note: PostgreSQL doesn't allow removing enum values easily.
-- The enum now includes:
-- - checkpoint (existing)
-- - project (existing)
-- - final (existing)
-- - daily (existing)
-- - sponsored (existing)
-- - special-moves (NEW - for chess special moves)
-- - puzzle (NEW - for chess puzzles)
-- - opening (NEW - for chess openings)
-- - position (NEW - for chess position analysis)
-- - endgame (NEW - for chess endgame study)

COMMENT ON TYPE "ChallengeKind" IS 'Challenge types: checkpoint, project, final, daily, sponsored, special-moves, puzzle, opening, position, endgame';
