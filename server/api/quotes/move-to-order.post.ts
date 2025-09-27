import quoteService from "~~/server/services/quote.service";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { quoteId,dataSourceType, ...fields } = body;

  await quoteService.moveToOrder(quoteId, fields, dataSourceType);

  return {
    message: "Quote moved to order successfully",
  };
});