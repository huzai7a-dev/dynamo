import type { OrderParams } from "~~/shared/types";
import OrderService from "../../services/order.service";
import { ROLE } from "~~/shared/constants";

export default defineEventHandler(async (event) => {
  const { id: userId, role } = event.context.user;
  const { page, limit, order_name, order_number } = getQuery(event);
  const isAdmin = role === ROLE.Admin;

  const orderParams: OrderParams = {
    user_id: userId,
    limit: limit ? Number(limit) : 10,
    page: page ? Number(page) : 1,
    order_number: order_number ? String(order_number) : undefined,
    order_name: order_name ? String(order_name) : undefined,
  };
  try {
    const orders = await OrderService.getOrders(orderParams, isAdmin);

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
