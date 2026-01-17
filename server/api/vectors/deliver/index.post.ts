import { z } from "zod";
import vectorService from "~~/server/services/vector.service";
import { ROLE } from "~~/shared/constants";

const schema = z.object({
  fields: z.object({
    vectorId: z.string(),
    stitches: z.string().optional(),
    price: z.string().optional(),
    discount: z.string().optional(),
    total_price: z.string().optional(),
    order_category: z.enum(['free', 'paid']).optional(),
    height: z.string().optional(),
    width: z.string().optional(),
    comments: z.string().optional(),
    designer_level: z.string().optional(),
    assign_percentage: z.string().optional(),
    minimum_price: z.string().optional(),
    maximum_price: z.string().optional(),
    thousand_stitches: z.string().optional(),
    normal_delivery: z.string().optional(),
    edit_or_change: z.string().optional(),
    edit_in_stitch_file: z.string().optional(),
    comment_box_1: z.string().optional(),
    comment_box_2: z.string().optional(),
    comment_box_3: z.string().optional(),
    comment_box_4: z.string().optional(),
  }),
  files: z.array(z.instanceof(File)),
});

export default defineEventHandler(async (event) => {
  const { role } = event.context.user;

  if (role !== ROLE.Admin) {
    return createError({
      statusCode: 403,
      statusMessage: 'Only admins can deliver orders'
    });
  }
  
  try {
    const { fields, files } = await parseMultipart(event);

    // Validate required fields
    if (!fields.vectorId) {
      return createError({
        statusCode: 400,
        statusMessage: 'Vector ID is required'
      });
    }

    if (!fields.stitches || !fields.price) {
      return createError({
        statusCode: 400,
        statusMessage: 'Stitches and price are required'
      });
    }

    if (!files || files.length === 0) {
      return createError({
        statusCode: 400,
        statusMessage: 'At least one attachment is required'
      });
    }

    const deliver = await vectorService.deliverVector(fields, files);
    return {
      message: 'Vector delivered successfully',
      data: deliver
    };
  } catch (error) {
    console.log(error)
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to deliver vector",
    });
  }
});
