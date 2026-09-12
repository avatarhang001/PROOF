-- ============================================================================
-- Chess Tables Schema
-- ============================================================================
-- Creates tables for chess curriculum: puzzles, positions, games, and progress
-- Run after complete-migration.sql
-- ============================================================================

-- Drop existing tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS "ChessUserProgress" CASCADE;
DROP TABLE IF EXISTS "ChessGameAnalysis" CASCADE;
DROP TABLE IF EXISTS "ChessOpeningRepertoire" CASCADE;
DROP TABLE IF EXISTS "ChessPuzzleAttempt" CASCADE;
DROP TABLE IF EXISTS "ChessPuzzle" CASCADE;
DROP TABLE IF EXISTS "ChessPosition" CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS chess_puzzle_difficulty CASCADE;
DROP TYPE IF EXISTS chess_puzzle_theme CASCADE;
DROP TYPE IF EXISTS chess_position_type CASCADE;

-- ============================================================================
-- Enums
-- ============================================================================

-- Puzzle difficulty levels
CREATE TYPE chess_puzzle_difficulty AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');

-- Tactical themes
CREATE TYPE chess_puzzle_theme AS ENUM (
  'fork', 'pin', 'skewer', 'discovery', 'deflection', 'decoy',
  'removal-of-defender', 'interference', 'x-ray', 'windmill', 'zwischenzug',
  'back-rank', 'greek-gift', 'smothered-mate', 'double-attack',
  'trapped-piece', 'clearance', 'attraction', 'undermining'
);

-- Position types
CREATE TYPE chess_position_type AS ENUM (
  'puzzle', 'opening', 'middlegame', 'endgame', 
  'study', 'game-analysis', 'exercise'
);

-- ============================================================================
-- Core Tables
-- ============================================================================

-- Chess positions (FEN + metadata)
CREATE TABLE "ChessPosition" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "fen" TEXT NOT NULL,
  "type" chess_position_type NOT NULL DEFAULT 'puzzle',
  "description" TEXT,
  "sideToMove" TEXT NOT NULL CHECK ("sideToMove" IN ('w', 'b')),
  "evaluation" DECIMAL(5,2), -- Stockfish centipawn evaluation
  "metadata" JSONB DEFAULT '{}'::JSONB, -- { difficulty, themes, tags, etc }
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Chess puzzles (tactical problems)
CREATE TABLE "ChessPuzzle" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "positionId" TEXT NOT NULL REFERENCES "ChessPosition"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "difficulty" chess_puzzle_difficulty NOT NULL DEFAULT 'beginner',
  "themes" chess_puzzle_theme[] NOT NULL DEFAULT ARRAY[]::chess_puzzle_theme[],
  "solution" TEXT[] NOT NULL, -- Array of moves in algebraic notation
  "solutionExplanation" TEXT,
  "hints" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "rating" INTEGER DEFAULT 1200, -- Puzzle rating (like ELO)
  "popularity" INTEGER DEFAULT 0, -- Number of attempts
  "successRate" DECIMAL(5,2) DEFAULT 0, -- Percentage solved correctly
  "topicSlug" TEXT, -- Links to curriculum topic (e.g., 'fundamental-tactics')
  "source" TEXT, -- Where puzzle came from (e.g., 'lichess', 'manual', 'game-123')
  "metadata" JSONB DEFAULT '{}'::JSONB,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Puzzle attempts (user performance tracking)
CREATE TABLE "ChessPuzzleAttempt" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "puzzleId" TEXT NOT NULL REFERENCES "ChessPuzzle"("id") ON DELETE CASCADE,
  "moves" TEXT[] NOT NULL, -- Moves played by user
  "correct" BOOLEAN NOT NULL,
  "hintsUsed" INTEGER DEFAULT 0,
  "timeSpentMs" INTEGER, -- Time spent solving (milliseconds)
  "attemptNumber" INTEGER DEFAULT 1, -- nth attempt at this puzzle
  "score" INTEGER, -- Points earned (0-100)
  "feedback" TEXT, -- Generated feedback
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Opening repertoire (personalized opening study)
CREATE TABLE "ChessOpeningRepertoire" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL, -- e.g., "Sicilian Najdorf"
  "color" TEXT NOT NULL CHECK ("color" IN ('white', 'black')),
  "eco" TEXT, -- ECO code (e.g., "B90")
  "moves" TEXT[] NOT NULL, -- Opening moves sequence
  "fen" TEXT, -- Resulting position FEN
  "notes" TEXT, -- User notes about the opening
  "practiceCount" INTEGER DEFAULT 0,
  "accuracy" DECIMAL(5,2) DEFAULT 0,
  "lastPracticed" TIMESTAMPTZ,
  "metadata" JSONB DEFAULT '{}'::JSONB,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE("userId", "name", "color")
);

-- Game analysis (saved analyzed games)
CREATE TABLE "ChessGameAnalysis" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "pgn" TEXT NOT NULL, -- Full game in PGN format
  "whitePlayer" TEXT,
  "blackPlayer" TEXT,
  "result" TEXT CHECK ("result" IN ('1-0', '0-1', '1/2-1/2', '*')),
  "date" DATE,
  "event" TEXT,
  "analysis" JSONB DEFAULT '{}'::JSONB, -- { mistakes, blunders, good moves, etc }
  "userColor" TEXT CHECK ("userColor" IN ('white', 'black', 'observer')),
  "userRating" INTEGER,
  "opponentRating" INTEGER,
  "notes" TEXT, -- User analysis notes
  "topicSlug" TEXT, -- Related curriculum topic
  "metadata" JSONB DEFAULT '{}'::JSONB,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- User chess progress (overall stats and progress)
CREATE TABLE "ChessUserProgress" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL UNIQUE REFERENCES "User"("id") ON DELETE CASCADE,
  "puzzleRating" INTEGER DEFAULT 1200, -- Tactical rating
  "puzzlesSolved" INTEGER DEFAULT 0,
  "puzzlesAttempted" INTEGER DEFAULT 0,
  "averageAccuracy" DECIMAL(5,2) DEFAULT 0,
  "strongThemes" chess_puzzle_theme[] DEFAULT ARRAY[]::chess_puzzle_theme[],
  "weakThemes" chess_puzzle_theme[] DEFAULT ARRAY[]::chess_puzzle_theme[],
  "gamesAnalyzed" INTEGER DEFAULT 0,
  "openingsLearned" INTEGER DEFAULT 0,
  "currentStreak" INTEGER DEFAULT 0, -- Consecutive days with practice
  "longestStreak" INTEGER DEFAULT 0,
  "lastPracticeDate" DATE,
  "statistics" JSONB DEFAULT '{}'::JSONB, -- Detailed stats
  "achievements" TEXT[] DEFAULT ARRAY[]::TEXT[], -- Chess-specific achievements
  "metadata" JSONB DEFAULT '{}'::JSONB,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Indexes for Performance
-- ============================================================================

-- Position indexes
CREATE INDEX idx_chess_position_fen ON "ChessPosition"("fen");
CREATE INDEX idx_chess_position_type ON "ChessPosition"("type");
CREATE INDEX idx_chess_position_side ON "ChessPosition"("sideToMove");

-- Puzzle indexes
CREATE INDEX idx_chess_puzzle_difficulty ON "ChessPuzzle"("difficulty");
CREATE INDEX idx_chess_puzzle_themes ON "ChessPuzzle" USING GIN("themes");
CREATE INDEX idx_chess_puzzle_topic ON "ChessPuzzle"("topicSlug");
CREATE INDEX idx_chess_puzzle_rating ON "ChessPuzzle"("rating");
CREATE INDEX idx_chess_puzzle_popularity ON "ChessPuzzle"("popularity" DESC);

-- Attempt indexes
CREATE INDEX idx_chess_attempt_user ON "ChessPuzzleAttempt"("userId");
CREATE INDEX idx_chess_attempt_puzzle ON "ChessPuzzleAttempt"("puzzleId");
CREATE INDEX idx_chess_attempt_correct ON "ChessPuzzleAttempt"("correct");
CREATE INDEX idx_chess_attempt_created ON "ChessPuzzleAttempt"("createdAt" DESC);
CREATE INDEX idx_chess_attempt_user_puzzle ON "ChessPuzzleAttempt"("userId", "puzzleId");

-- Repertoire indexes
CREATE INDEX idx_chess_repertoire_user ON "ChessOpeningRepertoire"("userId");
CREATE INDEX idx_chess_repertoire_color ON "ChessOpeningRepertoire"("color");
CREATE INDEX idx_chess_repertoire_eco ON "ChessOpeningRepertoire"("eco");

-- Analysis indexes
CREATE INDEX idx_chess_analysis_user ON "ChessGameAnalysis"("userId");
CREATE INDEX idx_chess_analysis_topic ON "ChessGameAnalysis"("topicSlug");
CREATE INDEX idx_chess_analysis_created ON "ChessGameAnalysis"("createdAt" DESC);

-- Progress indexes
CREATE INDEX idx_chess_progress_user ON "ChessUserProgress"("userId");
CREATE INDEX idx_chess_progress_rating ON "ChessUserProgress"("puzzleRating" DESC);
CREATE INDEX idx_chess_progress_streak ON "ChessUserProgress"("currentStreak" DESC);

-- ============================================================================
-- Triggers
-- ============================================================================

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_chess_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_chess_position_timestamp
  BEFORE UPDATE ON "ChessPosition"
  FOR EACH ROW
  EXECUTE FUNCTION update_chess_timestamp();

CREATE TRIGGER update_chess_puzzle_timestamp
  BEFORE UPDATE ON "ChessPuzzle"
  FOR EACH ROW
  EXECUTE FUNCTION update_chess_timestamp();

CREATE TRIGGER update_chess_repertoire_timestamp
  BEFORE UPDATE ON "ChessOpeningRepertoire"
  FOR EACH ROW
  EXECUTE FUNCTION update_chess_timestamp();

CREATE TRIGGER update_chess_analysis_timestamp
  BEFORE UPDATE ON "ChessGameAnalysis"
  FOR EACH ROW
  EXECUTE FUNCTION update_chess_timestamp();

CREATE TRIGGER update_chess_progress_timestamp
  BEFORE UPDATE ON "ChessUserProgress"
  FOR EACH ROW
  EXECUTE FUNCTION update_chess_timestamp();

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================

ALTER TABLE "ChessPosition" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChessPuzzle" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChessPuzzleAttempt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChessOpeningRepertoire" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChessGameAnalysis" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChessUserProgress" ENABLE ROW LEVEL SECURITY;

-- Positions and Puzzles: Public read, admin write
CREATE POLICY chess_position_public_read ON "ChessPosition"
  FOR SELECT USING (true);

CREATE POLICY chess_puzzle_public_read ON "ChessPuzzle"
  FOR SELECT USING (true);

-- Attempts: Users can only see their own
CREATE POLICY chess_attempt_user_read ON "ChessPuzzleAttempt"
  FOR SELECT USING (auth.uid()::TEXT = "userId");

CREATE POLICY chess_attempt_user_insert ON "ChessPuzzleAttempt"
  FOR INSERT WITH CHECK (auth.uid()::TEXT = "userId");

-- Repertoire: Users can manage their own
CREATE POLICY chess_repertoire_user_all ON "ChessOpeningRepertoire"
  FOR ALL USING (auth.uid()::TEXT = "userId");

-- Analysis: Users can manage their own
CREATE POLICY chess_analysis_user_all ON "ChessGameAnalysis"
  FOR ALL USING (auth.uid()::TEXT = "userId");

-- Progress: Users can view and update their own
CREATE POLICY chess_progress_user_all ON "ChessUserProgress"
  FOR ALL USING (auth.uid()::TEXT = "userId");

-- ============================================================================
-- Helper Functions
-- ============================================================================

-- Function to get random puzzles by criteria
CREATE OR REPLACE FUNCTION get_random_puzzles(
  p_difficulty chess_puzzle_difficulty DEFAULT NULL,
  p_themes chess_puzzle_theme[] DEFAULT NULL,
  p_count INTEGER DEFAULT 10
)
RETURNS SETOF "ChessPuzzle"
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM "ChessPuzzle"
  WHERE 
    (p_difficulty IS NULL OR "difficulty" = p_difficulty)
    AND (p_themes IS NULL OR "themes" && p_themes)
  ORDER BY RANDOM()
  LIMIT p_count;
END;
$$;

-- Function to update puzzle statistics after attempt
CREATE OR REPLACE FUNCTION update_puzzle_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE "ChessPuzzle"
  SET 
    "popularity" = "popularity" + 1,
    "successRate" = (
      SELECT ROUND(
        (COUNT(*) FILTER (WHERE "correct" = true)::DECIMAL / COUNT(*)) * 100, 
        2
      )
      FROM "ChessPuzzleAttempt"
      WHERE "puzzleId" = NEW."puzzleId"
    ),
    "updatedAt" = NOW()
  WHERE "id" = NEW."puzzleId";
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_puzzle_stats_trigger
  AFTER INSERT ON "ChessPuzzleAttempt"
  FOR EACH ROW
  EXECUTE FUNCTION update_puzzle_stats();

-- Function to update user progress after attempt
CREATE OR REPLACE FUNCTION update_user_chess_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_puzzle_themes chess_puzzle_theme[];
BEGIN
  -- Get puzzle themes
  SELECT "themes" INTO v_puzzle_themes
  FROM "ChessPuzzle"
  WHERE "id" = NEW."puzzleId";
  
  -- Update or insert user progress
  INSERT INTO "ChessUserProgress" ("userId", "puzzlesSolved", "puzzlesAttempted")
  VALUES (NEW."userId", CASE WHEN NEW."correct" THEN 1 ELSE 0 END, 1)
  ON CONFLICT ("userId") DO UPDATE SET
    "puzzlesSolved" = "ChessUserProgress"."puzzlesSolved" + CASE WHEN NEW."correct" THEN 1 ELSE 0 END,
    "puzzlesAttempted" = "ChessUserProgress"."puzzlesAttempted" + 1,
    "averageAccuracy" = ROUND(
      ("ChessUserProgress"."puzzlesSolved"::DECIMAL + CASE WHEN NEW."correct" THEN 1 ELSE 0 END) / 
      ("ChessUserProgress"."puzzlesAttempted" + 1) * 100,
      2
    ),
    "lastPracticeDate" = CURRENT_DATE,
    "updatedAt" = NOW();
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_user_progress_trigger
  AFTER INSERT ON "ChessPuzzleAttempt"
  FOR EACH ROW
  EXECUTE FUNCTION update_user_chess_progress();

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE "ChessPosition" IS 'Chess positions (FEN format) for puzzles and exercises';
COMMENT ON TABLE "ChessPuzzle" IS 'Tactical puzzles with solutions and metadata';
COMMENT ON TABLE "ChessPuzzleAttempt" IS 'User attempts at solving puzzles';
COMMENT ON TABLE "ChessOpeningRepertoire" IS 'User personalized opening repertoire';
COMMENT ON TABLE "ChessGameAnalysis" IS 'Analyzed games (PGN format) with annotations';
COMMENT ON TABLE "ChessUserProgress" IS 'User overall chess progress and statistics';

-- ============================================================================
-- Success Message
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Chess tables created successfully!';
  RAISE NOTICE '📊 Created 6 tables: ChessPosition, ChessPuzzle, ChessPuzzleAttempt, ChessOpeningRepertoire, ChessGameAnalysis, ChessUserProgress';
  RAISE NOTICE '🔐 Row Level Security enabled on all tables';
  RAISE NOTICE '⚡ Performance indexes created';
  RAISE NOTICE '🎯 Helper functions and triggers configured';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Next step: Run chess-seed-puzzles.sql to populate initial puzzles';
END $$;
