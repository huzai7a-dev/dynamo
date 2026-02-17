
export default defineEventHandler(async (event) => {
    console.log(event);
    return {
        status: 'success',
        message: 'Webhook endpoint is active'
    };
});