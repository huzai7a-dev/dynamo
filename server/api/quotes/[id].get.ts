import orderService from "~~/server/services/order.service";
import vectorService from "~~/server/services/vector.service";
import { ROLE } from "~~/shared/constants";

export default eventHandler(async (event) => {
    debugger
    try {
        const { role, id: userId } = event.context.user;
        const orderId = getRouterParam(event, 'id');
        const data_source_type = getQuery(event).type;
    
        const isAdmin = role === ROLE.Admin

        let   quote = null;
        if(data_source_type === DataSource.ORDER) {
            quote = await orderService.getOrderDetails(isAdmin, Number(orderId), Number(userId));
        }
        if(data_source_type === DataSource.VECTOR) {
            quote = await vectorService.getVectorDetails(Number(orderId), isAdmin, Number(userId));
        }

        return {
            message: 'Quote fetched successfully',
            data: quote
        }
        
    } catch (error) {
        console.log(error, 'error')
        return createError({
            statusCode: 400,
            message: 'Server Error'
        })    
    }
})