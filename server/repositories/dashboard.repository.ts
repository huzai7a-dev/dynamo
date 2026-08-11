class DashboardRepository {
    private db: ReturnType<typeof useDb>;
    constructor() {
        this.db = useDb();
    }

    async getStats(userId: number, isAdmin: boolean) {
        const stats = {
            orders: 0,
            quotes: 0,
            vectors: 0,
            amount: 0,
        }
        if (isAdmin) {
            stats.orders = Number((await this.db`SELECT COUNT(*) FROM orders WHERE metadata->>'type' = ${DataSource.ORDER}` as any[])[0]?.count || 0);
            stats.quotes = Number((await this.db`SELECT COUNT(*) FROM orders WHERE metadata->>'type' = ${DataSource.QUOTE}` as any[])[0]?.count || 0);
            stats.vectors = Number((await this.db`SELECT COUNT(*) FROM vectors` as any[])[0]?.count || 0);
            // stats.amount = await this.db`SELECT SUM(amount) FROM orders`;
        } else {
            stats.orders = Number((await this.db`SELECT COUNT(*) FROM orders WHERE user_id = ${userId}` as any[])[0]?.count || 0);
            stats.quotes = Number((await this.db`SELECT COUNT(*) FROM quotes WHERE user_id = ${userId}` as any[])[0]?.count || 0);
            stats.vectors = Number((await this.db`SELECT COUNT(*) FROM vectors WHERE user_id = ${userId}` as any[])[0]?.count || 0);
            stats.amount = Number((await this.db`
                SELECT COALESCE(SUM(price), 0) AS total FROM (
                    SELECT price FROM orders WHERE user_id = ${userId} AND payment_status = ${PaymentStatus.PAYABLE}
                    UNION ALL
                    SELECT price FROM vectors WHERE user_id = ${userId} AND payment_status = ${PaymentStatus.PAYABLE}
                ) AS combined
            ` as any[])[0]?.total || 0);
        }
        return stats;
    }
}

export default new DashboardRepository();