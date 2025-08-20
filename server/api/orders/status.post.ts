import orderService from "~~/server/services/order.service";
import { ROLE } from "~~/shared/constants";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { role } = event.context.user;

  const { orderId, status } = body;
  const isAdmin = role === ROLE.Admin;

  try {
    const order = await orderService.updateOrderStatus(isAdmin, orderId, status);

    return {
      message: "Order status updated successfully",
      data: order,
    };
  } catch (error) {
    console.log(error);
    return createError({
      statusCode: 400,
      data: JSON.stringify(error),
    });
  }
});