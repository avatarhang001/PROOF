-- Add ALL missing columns to match code expectations
-- Run this against your Supabase database
-- This is the complete fix for all schema mismatches

-- 1. Add columns to ChallengeAttempt
ALTER TABLE "ChallengeAttempt" 
ADD COLUMN IF NOT EXISTS "typingMeta" JSONB,
ADD COLUMN IF NOT EXISTS "typed" BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS "skillSlug" TEXT;

-- 2. Add columns to Evaluation
ALTER TABLE "Evaluation"
ADD COLUMN IF NOT EXISTS "evaluator" JSONB,
ADD COLUMN IF NOT EXISTS "meta" JSONB;

-- 3. Add columns to UserSkill
ALTER TABLE "UserSkill"
ADD COLUMN IF NOT EXISTS "updatedScoreAt" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "skillSlug" TEXT;

-- Make skillId nullable (code uses skillSlug directly)
ALTER TABLE "UserSkill"
ALTER COLUMN "skillId" DROP NOT NULL;

-- 4. Add columns to SkillProof
ALTER TABLE "SkillProof"
ADD COLUMN IF NOT EXISTS "evaluationId" TEXT;

-- Success message
SELECT 'All missing columns added successfully! ✅' as status;
