import OrderService from "../../services/order.service"
import { parseMultipart } from "../../utils/multiplart"

export default defineEventHandler(async (event) => {
    // await readValidatedBody(event, (body) => OrderSchema.parse(body));
    const { id: userId } = event.context.user;

    try {
        const { fields, files } = await parseMultipart(event);

        const order = await OrderService.createOrder(userId, fields, files)

        return {
            message: 'Order created successfully',
            data: order
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