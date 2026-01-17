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
            // stats.amount = await this.db`SELECT SUM(amount) FROM orders WHERE user_id = ${userId}`;
        }
        return stats;
    }
}

export default new DashboardRepository();