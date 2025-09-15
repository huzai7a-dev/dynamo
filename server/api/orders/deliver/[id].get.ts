import orderService from "~~/server/services/order.service";

export default eventHandler(async (event) => {
    const orderId = getRouterParam(event, 'id');
    try {
        const delivery = await orderService.getDeliveryDetails(Number(orderId));
        return delivery;
        
    } catch (error) {
        return createError({
            statusCode: 400,
            message: 'Server Error'
        })
    }
})