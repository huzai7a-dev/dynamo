import { z } from 'zod';

const CreateInvoiceSchema = z.object({
    items: z.array(z.object({
        type: z.enum(['order', 'vector']),
        id: z.number()
    })).min(1, "At least one item must be selected")
});

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event);
    const userId = session.user.id;
    const body = await readValidatedBody(event, (body) => CreateInvoiceSchema.parse(body));
    const db = useDb();

    let totalAmount = 0;
    const orderIds = body.items.filter(i => i.type === 'order').map(i => i.id);
    const vectorIds = body.items.filter(i => i.type === 'vector').map(i => i.id);

    // Validate Orders
    if (orderIds.length > 0) {
        // Neon/Postgres doesn't support passing an array directly for IN clause easily with template literals 
        // without helper tools, but we can construct it or use specific syntax if the driver supports it.
        // Typically: WHERE id = ANY(${orderIds})

        const dbOrders = await db`
      SELECT id, user_id as "userId", price, payment_status as "paymentStatus" 
      FROM orders 
      WHERE id = ANY(${orderIds})
    `;

        for (const order of dbOrders) {
            if (order.userId !== userId) {
                throw createError({ statusCode: 403, message: 'Unauthorized access to order' });
            }
            if (order.paymentStatus === 'paid') {
                throw createError({ statusCode: 400, message: `Order #${order.id} is already paid` });
            }
            totalAmount += Number(order.price || 0);
        }

        if (dbOrders.length !== orderIds.length) {
            // Optional: stricter check to ensure all IDs exist
            // throw createError({ statusCode: 404, message: 'Some orders not found' });
        }
    }

    // Validate Vectors
    if (vectorIds.length > 0) {
        const dbVectors = await db`
      SELECT id, user_id as "userId", price, payment_status as "paymentStatus" 
      FROM vectors 
      WHERE id = ANY(${vectorIds})
    `;

        for (const vector of dbVectors) {
            if (vector.userId !== userId) {
                throw createError({ statusCode: 403, message: 'Unauthorized access to vector' });
            }
            if (vector.paymentStatus === 'paid') {
                throw createError({ statusCode: 400, message: `Vector #${vector.id} is already paid` });
            }
            totalAmount += Number(vector.price || 0);
        }

        if (dbVectors.length !== vectorIds.length) {
            // throw createError({ statusCode: 404, message: 'Some vectors not found' });
        }
    }

    const transactionRef = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const amountStr = totalAmount.toFixed(2);
    const itemsJson = JSON.stringify(body.items);

    const [transaction] = await db`
    INSERT INTO payment_transactions (
      transaction_ref, 
      user_id, 
      amount, 
      currency, 
      status, 
      items
    ) VALUES (
      ${transactionRef}, 
      ${userId}, 
      ${amountStr}, 
      'USD', 
      'pending', 
      ${itemsJson}
    )
    RETURNING 
      id, 
      transaction_ref as "transactionRef", 
      status, 
      amount, 
      currency,
      items
  `;

    return transaction;
});
