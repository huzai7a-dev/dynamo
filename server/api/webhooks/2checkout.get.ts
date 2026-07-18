
export default defineEventHandler(async (event) => {
    useLogger().info('2Checkout webhook health-check hit');
    return {
        status: 'success',
        message: 'Webhook endpoint is active'
    };
});