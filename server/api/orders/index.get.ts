import type { QueryParams } from "~~/shared/types";
import OrderService from "../../services/order.service";
import { ROLE } from "~~/shared/constants";

export default defineEventHandler(async (event) => {
  const { id: userId, role } = event.context.user;
  const { page, limit, order_name, order_number, date_from, date_to, status, is_free, is_paid } = getQuery(event);
  const isAdmin = role === ROLE.Admin;

  const orderParams: QueryParams = {
    user_id: userId,
    limit: limit ? Number(limit) : 10,
    page: page ? Number(page) : 1,
    order_number: order_number ? String(order_number) : undefined,
    order_name: order_name ? String(order_name) : undefined,
    date_from: date_from ? String(date_from) : undefined,
    date_to: date_to ? String(date_to) : undefined,
    status: status ? String(status) : undefined,
    is_free: is_free ? Boolean(is_free) : undefined,
    is_paid: is_paid ? Boolean(is_paid) : undefined,
  };
  try {
    const orders = await OrderService.getOrders(orderParams, isAdmin);

    return {
      message: "Orders retrieved successfully",
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
