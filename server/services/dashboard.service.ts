import DashboardRepository from "../repositories/dashboard.repository";

class DashboardService {
    private db: ReturnType<typeof useDb>;
    constructor() {
        this.db = useDb();
    }

    async getStats(userId: number, isAdmin: boolean) {
        return await DashboardRepository.getStats(userId, isAdmin);
    }
}

export default new DashboardService();