import { OrderStatus } from "#shared/types/enums";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const userId = session.user.id;
  const db = useDb();

  // Fetch Unpaid Orders
  // We alias columns to match camelCase expected by frontend
  const unpaidOrders = await db`
    SELECT 
      id, 
      order_name as "orderName", 
      price, 
      created_at as "createdAt", 
      payment_status as "paymentStatus"
    FROM orders 
    WHERE user_id = ${userId} 
      AND payment_status != 'paid'
      AND status = ${OrderStatus.DELIVERED}
    ORDER BY created_at DESC
  `;

  const unpaidVectors = await db`
    SELECT 
      id, 
      vector_name as "vectorName", 
      price, 
      created_at as "createdAt", 
      payment_status as "paymentStatus"
    FROM vectors 
    WHERE user_id = ${userId} 
      AND payment_status != 'paid'
      AND status = ${OrderStatus.DELIVERED} 
    ORDER BY created_at DESC
  `;

  return {
    orders: unpaidOrders,
    vectors: unpaidVectors
  };
});
