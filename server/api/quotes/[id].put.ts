import quoteService from "~~/server/services/quote.service";
import { parseMultipart } from "~~/server/utils/multiplart";

export default defineEventHandler(async (event) => {
  try {
    const quoteId = getRouterParam(event, "id") as string;
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

    // OrderForm/VectorForm submit orderName/vectorName + type-specific fields
    // (requiredFormat, width, fabric, ...) — same shape as quote creation, so
    // apply the same title/quoteData mapping used in index.post.ts.
    const { dataSourceType, orderName, vectorName, poNumber, instructions, estimatedPrice, existingAttachments: _existingAttachments, ...quoteData } = fields;
    const title = dataSourceType === "order" ? orderName : vectorName;

    const payload = {
      dataSourceType,
      title,
      poNumber,
      instructions,
      estimatedPrice,
      quoteData,
    };

    // Update the quote
    const result = await quoteService.updateQuote(
      userId,
      parseInt(quoteId),
      payload as any,
      files,
      existingAttachmentsArray
    );

    return {
      message: "Quote updated successfully",
      data: result,
    };
  } catch (error: any) {
    useLogger().error("Error updating quote:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Internal server error",
    });
  }
});
