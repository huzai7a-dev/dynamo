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

    // transaction.items is a JSON array [{ type: 'order', id: 1 }, ... ]
    const items = transaction.items as Array<{ type: 'order' | 'vector', id: number }>;
    const orderIds = items.filter(i => i.type === 'order').map(i => i.id);
    const vectorIds = items.filter(i => i.type === 'vector').map(i => i.id);

    let orders: any[] = [];
    let vectors: any[] = [];

    if (orderIds.length > 0) {
        orders = await db`
      SELECT
        id,
        order_name as "name",
        price::float as price,
        created_at as "date"
      FROM orders
      WHERE id = ANY(${orderIds})
    `;
    }

    if (vectorIds.length > 0) {
        // Cast id to int so Neon returns a JS number (bigserial is returned as a
        // string by the driver by default, which breaks strict === comparison with
        // the JS-number IDs stored in the payment_transactions JSONB items array).
        vectors = await db`
      SELECT
        id::int as id,
        vector_name as "name",
        price::float as price,
        created_at as "date"
      FROM vectors
      WHERE id = ANY(${vectorIds})
    `;
    }

    // Combine and format.
    // id::int in the SQL above guarantees vectors.id comes back as a JS number,
    // so strict === works correctly for both orders (integer) and vectors (bigserial).
    const detailedItems = items.map(item => {
        if (item.type === 'order') {
            const order = orders.find(o => o.id === item.id);
            return {
                ...item,
                name: order?.name || 'Unknown Order',
                price: order?.price ?? 0,
                date: order?.date || null,
            };
        } else {
            const vector = vectors.find(v => v.id === item.id);
            return {
                ...item,
                name: vector?.name || 'Unknown Vector',
                price: vector?.price ?? 0,
                date: vector?.date || null,
            };
        }
    });

    return {
        ...transaction,
        items: detailedItems
    };
});
