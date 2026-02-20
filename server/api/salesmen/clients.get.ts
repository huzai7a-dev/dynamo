import salesmanService from '~~/server/services/salesman.service';
import { ROLE } from '~~/shared/constants';

// GET /api/salesmen/clients  –  returns the authenticated salesman's clients + stats (protected)
export default eventHandler(async (event) => {
    const user = event.context.user;

    if (!user) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
    }

    if (user.role !== ROLE.Salesman) {
        throw createError({ statusCode: 403, statusMessage: 'Access denied. Salesman role required.' });
    }

    const query = getQuery(event);
    const filters = {
        page: query.page ? Number(query.page) : 1,
        limit: query.limit ? Number(query.limit) : 10,
        name: query.name as string | undefined,
        email: query.email as string | undefined,
        date_from: query.date_from as string | undefined,
        date_to: query.date_to as string | undefined,
    };

    try {
        const data = await salesmanService.getSalesmanDashboard(String(user.id), filters);
        return { success: true, data };
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message ?? 'Failed to fetch clients',
        });
    }
});
