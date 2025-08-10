import type { OrderParams } from "~~/shared/types";
import OrderService from "../../services/order.service";

export default defineEventHandler(async (event) => {
  const { id: userId } = event.context.user;
  const { page, limit } = getQuery(event);

  const orderParams: OrderParams = {
    user_id: userId,
    limit: limit ? Number(limit) : 10,
    page: page ? Number(page) : 1,
  };
  try {
    const orders = await OrderService.getOrders(orderParams);

    return {
      message: "Order created successfully",
      data: orders,
    };
  } catch (error) {
    console.log(error);
    return createError({
      statusCode: 400,
      data: JSON.stringify(error),
    });
  }
});
