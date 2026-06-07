export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event);
    const userId = session.user.id;
    const db = useDb();

    // Fetch all paid transactions for this user
    const transactions = (await db`
    SELECT 
      id,
      transaction_ref as "transactionRef",
      external_ref as "externalRef",
      external_order_no as "externalOrderNo",
      amount,
      currency,
      status,
      items,
      payment_method as "paymentMethod",
      created_at as "createdAt",
      paid_at as "paidAt",
      updated_at as "updatedAt"
    FROM payment_transactions
    WHERE user_id = ${userId}
      AND status = 'paid'
    ORDER BY paid_at DESC NULLS LAST
  `) as any[];

    // Aggregate stats in a single query for efficiency
    const [stats] = (await db`
    SELECT
      COUNT(*) FILTER (WHERE status = 'paid') as "totalPaid",
      COALESCE(SUM(amount::numeric) FILTER (WHERE status = 'paid'), 0) as "totalAmount",
      MAX(COALESCE(paid_at, updated_at)) FILTER (WHERE status = 'paid') as "latestPaidAt",
      COUNT(*) FILTER (WHERE status IN ('paid', 'refunded')) as "totalSettled"
    FROM payment_transactions
    WHERE user_id = ${userId}
  `) as any[];

    const totalPaid = Number(stats.totalPaid || 0);
    const totalSettled = Number(stats.totalSettled || 0);

    return {
        transactions,
        stats: {
            totalPaidInvoices: totalPaid,
            totalAmountPaid: Number(stats.totalAmount || 0).toFixed(2),
            latestPaidAt: stats.latestPaidAt || null,
            // Success rate: paid / (paid + refunded) — avoid division by zero
            successRate: totalSettled > 0 ? Math.round((totalPaid / totalSettled) * 100) : 100,
        },
    };
});
