/**
 * One-time cleanup script: removes ghost payment_transactions rows that were
 * created by the OLD invoice flow (before payment_status was ever set to 'invoiced').
 *
 * These rows exist because the old code created a new transaction every time
 * "Generate Invoice" was clicked, but never updated the orders/vectors.
 *
 * After this runs:
 *  - All payment_transactions with status='pending' are deleted
 *  - All orders/vectors with payment_status='invoiced' are reset to 'pending'
 *    (in case any stale 'invoiced' marks exist from partial new-code runs)
 *
 * Run: npx tsx scripts/cleanup-ghost-invoices.ts
 */

import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

const db = neon(process.env.DATABASE_URL!);

async function main() {
    console.log('--- Ghost Invoice Cleanup ---\n');

    // 1. Count existing pending transactions
    const [countRow] = await db`
    SELECT COUNT(*) as count FROM payment_transactions WHERE status = 'pending'
  `;
    console.log(`Found ${countRow.count} pending transaction(s) to delete.`);

    // 2. Show them so user can confirm
    const rows = await db`
    SELECT id, transaction_ref, amount, items, created_at 
    FROM payment_transactions 
    WHERE status = 'pending'
    ORDER BY created_at DESC
  `;
    console.table(rows.map(r => ({
        id: r.id,
        ref: r.transaction_ref,
        amount: r.amount,
        item_count: Array.isArray(r.items) ? r.items.length : JSON.parse(r.items as string).length,
        created_at: r.created_at,
    })));

    if (Number(countRow.count) === 0) {
        console.log('\nNothing to clean up. Exiting.');
        return;
    }

    // 3. Reset any orders with payment_status='invoiced' back to 'pending'
    const ordersReset = await db`
    UPDATE orders SET payment_status = 'pending', updated_at = NOW()
    WHERE payment_status = 'invoiced'
    RETURNING id
  `;
    console.log(`\nReset ${ordersReset.length} order(s) from 'invoiced' → 'pending'.`);

    // 4. Reset any vectors with payment_status='invoiced' back to 'pending'
    const vectorsReset = await db`
    UPDATE vectors SET payment_status = 'pending', updated_at = NOW()
    WHERE payment_status = 'invoiced'
    RETURNING id
  `;
    console.log(`Reset ${vectorsReset.length} vector(s) from 'invoiced' → 'pending'.`);

    // 5. Delete all pending transactions
    const deleted = await db`
    DELETE FROM payment_transactions WHERE status = 'pending' RETURNING id
  `;
    console.log(`Deleted ${deleted.length} ghost transaction(s).`);

    console.log('\n✅ Cleanup complete. The unpaid invoices page should now be empty.');
    console.log('   You can now test the full flow from scratch.\n');
}

main().catch(err => {
    console.error('Cleanup failed:', err);
    process.exit(1);
});
