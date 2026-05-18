import { OrderStatus } from "#shared/types/enums";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const userId = session.user.id;
  const db = useDb();

  // Unified query combining Orders and Vectors into a single flat list
  // Excludes items that are already paid or currently on a pending invoice ('invoiced')
  const allUnpaid = await db`
    SELECT 
      'order' as type, 
      id, 
      order_name as name, 
      po_number as "poNumber",
      price, 
      created_at as "createdAt",
      is_from_quote as "isFromQuote"
    FROM orders 
    WHERE user_id = ${userId} 
      AND payment_status NOT IN ('paid', 'invoiced')
      AND status = ${OrderStatus.DELIVERED}
    
    UNION ALL
    
    SELECT 
      'vector' as type, 
      id, 
      vector_name as name, 
      po_number as "poNumber",
      price, 
      created_at as "createdAt",
      is_from_quote as "isFromQuote"
    FROM vectors 
    WHERE user_id = ${userId} 
      AND payment_status NOT IN ('paid', 'invoiced')
      AND status = ${OrderStatus.DELIVERED}
      
    ORDER BY "createdAt" DESC
  `;

  // Calculate total amount on the server for UI convenience
  const totalAmount = allUnpaid.reduce((sum, item) => sum + Number(item.price || 0), 0);

  return {
    items: allUnpaid,
    totalAmount: totalAmount.toFixed(2),
    count: allUnpaid.length
  };
});

