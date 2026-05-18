export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event);
    const userId = session.user.id;
    const db = useDb();

    // Fetch all pending (unpaid) transactions for this user
    const transactions = await db`
    SELECT 
      id,
      transaction_ref as "transactionRef",
      amount,
      currency,
      status,
      items,
      created_at as "createdAt"
    FROM payment_transactions
    WHERE user_id = ${userId}
      AND status = 'pending'
    ORDER BY created_at DESC
  `;

    return { transactions };
});
