export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event);
    const userId = session.user.id;
    const transactionRef = getRouterParam(event, 'ref');
    const db = useDb();

    if (!transactionRef) {
        throw createError({ statusCode: 400, message: 'Transaction Reference is required' });
    }

    // Fetch Transaction using raw SQL
    const [transaction] = await db`
    SELECT 
      id, 
      transaction_ref as "transactionRef", 
      user_id as "userId",
      amount, 
      currency, 
      status, 
      items, 
      created_at as "createdAt"
    FROM payment_transactions 
    WHERE transaction_ref = ${transactionRef} AND user_id = ${userId}
  `;

    if (!transaction) {
        throw createError({ statusCode: 404, message: 'Invoice not found' });
    }

    // Fetch Items details
    // transaction.items is a JSON array [{ type: 'order', id: 1 }, ... ]
    // We need to fetch details for these items to display them.
    const items = transaction.items as Array<{ type: 'order' | 'vector', id: number }>;
    const orderIds = items.filter(i => i.type === 'order').map(i => i.id);
    const vectorIds = items.filter(i => i.type === 'vector').map(i => i.id);

    let orders = [];
    let vectors = [];

    if (orderIds.length > 0) {
        orders = await db`
      SELECT id, order_name as "name", price, created_at as "date"
      FROM orders
      WHERE id = ANY(${orderIds})
    `;
    }

    if (vectorIds.length > 0) {
        vectors = await db`
      SELECT id, vector_name as "name", price, created_at as "date"
      FROM vectors
      WHERE id = ANY(${vectorIds})
    `;
    }

    // Combine and format
    const detailedItems = items.map(item => {
        if (item.type === 'order') {
            const order = orders.find(o => o.id === item.id);
            return { ...item, ...order, name: order?.name || 'Unknown Order', price: order?.price || 0, date: order?.date };
        } else {
            const vector = vectors.find(v => v.id === item.id);
            return { ...item, ...vector, name: vector?.name || 'Unknown Vector', price: vector?.price || 0, date: vector?.date };
        }
    });

    return {
        ...transaction,
        items: detailedItems
    };
});
