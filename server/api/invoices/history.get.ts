export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event);
    const userId = session.user.id;
    const db = useDb();

    // Parse query params
    const query = getQuery(event);
    const search = (query.search as string || '').trim();
    const statusFilter = (query.status as string || 'all').toLowerCase();
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
    const offset = (page - 1) * limit;

    // Status filter (only allow known statuses)
    const validStatuses = ['paid', 'pending', 'refunded'];
    const hasStatus = statusFilter !== 'all' && validStatuses.includes(statusFilter);

    // Using parameterized queries with neon tagged template in separate branches
    let countResult: any;

    if (search) {
        if (hasStatus) {
            [countResult] = (await db`
                SELECT COUNT(*) as total
                FROM payment_transactions
                WHERE user_id = ${userId}
                  AND transaction_ref ILIKE ${'%' + search + '%'}
                  AND status = ${statusFilter}
            `) as any[];
        } else {
            [countResult] = (await db`
                SELECT COUNT(*) as total
                FROM payment_transactions
                WHERE user_id = ${userId}
                  AND transaction_ref ILIKE ${'%' + search + '%'}
            `) as any[];
        }
    } else {
        if (hasStatus) {
            [countResult] = (await db`
                SELECT COUNT(*) as total
                FROM payment_transactions
                WHERE user_id = ${userId}
                  AND status = ${statusFilter}
            `) as any[];
        } else {
            [countResult] = (await db`
                SELECT COUNT(*) as total
                FROM payment_transactions
                WHERE user_id = ${userId}
            `) as any[];
        }
    }

    const totalCount = Number(countResult?.total || 0);
    const totalPage = Math.ceil(totalCount / limit) || 1;

    // Fetch paginated transactions
    let transactions: any[] = [];

    if (search) {
        if (hasStatus) {
            transactions = (await db`
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
                  AND transaction_ref ILIKE ${'%' + search + '%'}
                  AND status = ${statusFilter}
                ORDER BY created_at DESC
                LIMIT ${limit} OFFSET ${offset}
            `) as any[];
        } else {
            transactions = (await db`
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
                  AND transaction_ref ILIKE ${'%' + search + '%'}
                ORDER BY created_at DESC
                LIMIT ${limit} OFFSET ${offset}
            `) as any[];
        }
    } else {
        if (hasStatus) {
            transactions = (await db`
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
                  AND status = ${statusFilter}
                ORDER BY created_at DESC
                LIMIT ${limit} OFFSET ${offset}
            `) as any[];
        } else {
            transactions = (await db`
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
                ORDER BY created_at DESC
                LIMIT ${limit} OFFSET ${offset}
            `) as any[];
        }
    }

    return {
        transactions,
        pagination: {
            currentPage: page,
            totalPage,
            totalCount,
            limit,
        },
    };
});

