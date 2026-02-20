import usersRepository from '~~/server/repositories/users.repository';
import { ROLE } from '~~/shared/constants';
import type { IUser } from '#shared/types';

class SalesmanService {
    async getAllSalesmen() {
        const salesmen = await usersRepository.getAllSalesmen();
        return salesmen.map((s) => ({
            id: s.id,
            label: `${s.contact_name}`,
            value: String(s.id),
        }));
    }

    async getSalesmanDashboard(salesmanId: string, filters: {
        page?: number;
        limit?: number;
        name?: string;
        email?: string;
        date_from?: string;
        date_to?: string;
    } = {}) {
        const [{ clients, pagination }, stats] = await Promise.all([
            usersRepository.getClientsBySalesman(salesmanId, filters),
            usersRepository.getSalesmanStats(salesmanId),
        ]);

        return {
            stats,
            pagination,
            clients: clients.map((c: IUser) => ({
                id: c.id,
                userName: c.user_name,
                contactName: c.contact_name,
                companyName: c.company_name,
                email: c.primary_email,
                phone: c.phone_number,
                location: [c.city, c.state, c.country].filter(Boolean).join(', '),
                registeredAt: c.created_at,
            })),
        };
    }

    isSalesmanRole(role: number) {
        return role === ROLE.Salesman;
    }
}

export default new SalesmanService();
