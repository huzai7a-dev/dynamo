import salesmanService from '~~/server/services/salesman.service';

// GET /api/salesmen  –  returns list of salesmen for the registration dropdown (public)
export default eventHandler(async () => {
    try {
        const salesmen = await salesmanService.getAllSalesmen();
        return { success: true, data: salesmen };
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message ?? 'Failed to fetch salesmen',
        });
    }
});
