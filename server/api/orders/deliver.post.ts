import { z } from "zod";
import orderService from "~~/server/services/order.service";
import { ROLE } from "~~/shared/constants";

const schema = z.object({
  fields: z.object({
    orderId: z.string(),
    estimateAmount: z.number(),
    notes: z.string(),
  }),
  files: z.array(z.instanceof(File)),
});

export default defineEventHandler(async (event) => {
  // const body = await readValidatedBody(event, schema.parse);
  const { role } = event.context.user;

  if (role !== ROLE.Admin) {
    return createError({
      statusCode: 403,
      statusMessage: 'Only admins can deliver orders'
    });
  }
  try {
    const { fields, files } = await parseMultipart(event);

    const deliver = await orderService.deliverOrder(fields, files);
    return {
      message: 'Order delivered successfully',
      data: deliver
    };
  } catch (error) {
    console.log(error)
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to deliver order",
    });
  }
});
