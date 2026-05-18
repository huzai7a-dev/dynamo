export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event);
    const userId = session.user.id;
    const transactionRef = getRouterParam(event, 'ref');
    const db = useDb();

    if (!transactionRef) {
        throw createError({ statusCode: 400, message: 'Transaction reference is required' });
    }

    // Fetch and verify the transaction belongs to this user
    const [transaction] = await db`
    SELECT 
      id,
      transaction_ref as "transactionRef",
      user_id as "userId",
      status,
      items
    FROM payment_transactions
    WHERE transaction_ref = ${transactionRef} AND user_id = ${userId}
  `;

    if (!transaction) {
        throw createError({ statusCode: 404, message: 'Invoice not found' });
    }

    if (transaction.status === 'paid') {
        throw createError({ statusCode: 400, message: 'Cannot revert a paid invoice' });
    }

    // Parse the items to get order and vector IDs
    const items = transaction.items as Array<{ type: 'order' | 'vector'; id: number }>;
    const orderIds = items.filter(i => i.type === 'order').map(i => i.id);
    const vectorIds = items.filter(i => i.type === 'vector').map(i => i.id);

    // Reset payment_status back to 'pending' for both orders and vectors (normalized)
    if (orderIds.length > 0) {
        await db`
      UPDATE orders
      SET payment_status = 'pending', updated_at = NOW()
      WHERE id = ANY(${orderIds}) AND user_id = ${userId}
    `;
    }

    if (vectorIds.length > 0) {
        await db`
      UPDATE vectors
      SET payment_status = 'pending', updated_at = NOW()
      WHERE id = ANY(${vectorIds}) AND user_id = ${userId}
    `;
    }

    // Delete the transaction
    await db`
    DELETE FROM payment_transactions
    WHERE transaction_ref = ${transactionRef} AND user_id = ${userId}
  `;

    return { success: true, message: 'Invoice reverted successfully' };
});
