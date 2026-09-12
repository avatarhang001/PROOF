-- Add isAdmin field to User table for analytics access control
-- Run this migration to add the admin flag to existing users

-- For Supabase PostgreSQL
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN DEFAULT FALSE;

-- Create index for admin queries
CREATE INDEX IF NOT EXISTS idx_user_isadmin ON "User"("isAdmin") WHERE "isAdmin" = TRUE;

-- Optional: Grant admin access to specific users
-- UPDATE "User" SET "isAdmin" = TRUE WHERE username = 'your_admin_username';
-- UPDATE "User" SET "isAdmin" = TRUE WHERE "walletAddress" = 'your_admin_wallet_address';

COMMENT ON COLUMN "User"."isAdmin" IS 'Admin flag for analytics dashboard access';
