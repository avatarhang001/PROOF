-- ============================================================
-- Add Document Curriculum Support to LearningPath table
-- ============================================================

-- Add columns for document-based curricula
ALTER TABLE "LearningPath" 
ADD COLUMN IF NOT EXISTS "isFromDocument" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "sourceDocument" JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS "documentContent" TEXT DEFAULT NULL;

-- Add index for querying document-based paths
CREATE INDEX IF NOT EXISTS "idx_learning_path_document" 
ON "LearningPath"("userId", "isFromDocument") 
WHERE "isFromDocument" = true;

-- Add documentPathId to Challenge table for linking document-generated challenges
ALTER TABLE "Challenge"
ADD COLUMN IF NOT EXISTS "documentPathId" TEXT REFERENCES "LearningPath"(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS "isFromDocument" BOOLEAN DEFAULT false;

-- Success message
SELECT 'Document curriculum fields added successfully! ✅' as status;
