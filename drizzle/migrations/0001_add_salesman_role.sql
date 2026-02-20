-- Migration: Add Salesman Role
-- Description: Adds 'salesman' to user_role enum, inserts role into roles table, and creates performance indexes

-- Step 1: Add 'salesman' to user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'salesman';

-- Step 2: Insert salesman role into roles table
INSERT INTO roles (role_name) 
VALUES ('salesman') 
ON CONFLICT (role_name) DO NOTHING;

-- Step 3: Create index for faster salesman queries (only index rows where sales_man is not null)
CREATE INDEX IF NOT EXISTS idx_users_sales_man ON users(sales_man) 
WHERE sales_man IS NOT NULL;

-- Step 4: Create index for role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Verification queries (run these after migration):
-- 1. Check enum values:
--    SELECT enumlabel FROM pg_enum WHERE enumtypid = 'user_role'::regtype ORDER BY enumsortorder;
--
-- 2. Check roles table:
--    SELECT * FROM roles ORDER BY role_id;
--
-- 3. Check indexes:
--    SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'users' AND indexname IN ('idx_users_sales_man', 'idx_users_role');
