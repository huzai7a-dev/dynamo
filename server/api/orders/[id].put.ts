import orderService from "~~/server/services/order.service";
import { parseMultipart } from "~~/server/utils/multiplart";

export default defineEventHandler(async (event) => {
  try {
    const orderId = getRouterParam(event, "id") as string;
    const { id: userId } = event.context.user;
    
    if (!userId) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    // Parse multipart form data
    const { fields, files } = await parseMultipart(event);

    // Extract existing attachments that should be kept
    const existingAttachments = fields.existingAttachments || [];
    const existingAttachmentsArray = Array.isArray(existingAttachments) 
      ? existingAttachments 
      : [existingAttachments];

    // Update the order
    const result = await orderService.updateOrder(
      userId,
      parseInt(orderId),
      fields,
      files,
      existingAttachmentsArray
    );

    return {
      message: "Order updated successfully",
      data: result,
    };
  } catch (error: any) {
    console.error("Error updating order:", error);
    
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Internal server error",
    });
  }
});
