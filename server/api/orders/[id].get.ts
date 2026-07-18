import orderService from "~~/server/services/order.service";
import { ROLE } from "~~/shared/constants";

export default eventHandler(async (event) => {
    debugger
    try {
        const { role, id: userId } = event.context.user;
        const orderId = getRouterParam(event, 'id');
    
        const isAdmin = role === ROLE.Admin
        const order = await orderService.getOrderDetails(isAdmin, Number(orderId), Number(userId));

        useLogger().info('Order details:', order)
        return {
            message: 'Order fetched successfully',
            data: order
        }
        
    } catch (error) {
        useLogger().error('Failed to fetch order details:', error)
        return createError({
            statusCode: 400,
            message: 'Server Error'
        })    
    }
})