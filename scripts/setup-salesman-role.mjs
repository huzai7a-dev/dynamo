import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function setupSalesmanRole() {
    try {
        console.log('🚀 Setting up salesman role...\n');

        // Step 1: Insert salesman role into roles table
        console.log('📝 Inserting salesman role into roles table...');
        await sql`
      INSERT INTO roles (role_name) 
      VALUES ('salesman') 
      ON CONFLICT (role_name) DO NOTHING
    `;
        console.log('✅ Salesman role inserted\n');

        // Step 2: Create index for faster salesman queries
        console.log('📊 Creating index for sales_man queries...');
        await sql`
      CREATE INDEX IF NOT EXISTS idx_users_sales_man ON users(sales_man) 
      WHERE sales_man IS NOT NULL
    `;
        console.log('✅ Index idx_users_sales_man created\n');

        // Step 3: Create index for role-based queries
        console.log('📊 Creating index for role queries...');
        await sql`
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)
    `;
        console.log('✅ Index idx_users_role created\n');

        // Verification
        console.log('🔍 Verifying setup...\n');

        const roles = await sql`SELECT * FROM roles ORDER BY role_id`;
        console.log('Roles in database:');
        console.table(roles);

        const indexes = await sql`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'users' 
      AND indexname IN ('idx_users_sales_man', 'idx_users_role')
    `;
        console.log('\nIndexes created:');
        console.table(indexes);

        console.log('\n✅ Salesman role setup complete!');
    } catch (error) {
        console.error('❌ Error setting up salesman role:', error);
        process.exit(1);
    }
}

setupSalesmanRole();
