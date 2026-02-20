-- Complete the salesman role setup
-- Run this SQL in your database console or using a migration tool

-- Step 1: Insert salesman role into roles table
INSERT INTO roles (role_name) 
VALUES ('salesman') 
ON CONFLICT (role_name) DO NOTHING;

-- Step 2: Create index for faster salesman queries
CREATE INDEX IF NOT EXISTS idx_users_sales_man ON users(sales_man) 
WHERE sales_man IS NOT NULL;

-- Step 3: Create index for role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Verification queries:
-- Check roles table:
SELECT * FROM roles ORDER BY role_id;

-- Check indexes:
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'users' 
AND indexname IN ('idx_users_sales_man', 'idx_users_role');
