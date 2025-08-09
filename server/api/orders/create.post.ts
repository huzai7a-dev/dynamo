import OrderService from "../../services/order.service"
import { parseMultipart } from "../../utils/multiplart"

export default defineEventHandler(async (event)=> {

    try {
        const { fields, files } = await parseMultipart(event);

        const response = await OrderService.createOrder(fields, files)
        
        return {
            message: 'Order created successfully',
            data: response
        }
    } catch (error) {
        console.log(error)
        return createError({
            statusCode: 400,
            data: JSON.stringify(error),
        })
    }
   }
)