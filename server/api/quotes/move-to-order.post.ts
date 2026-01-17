import quoteService from "~~/server/services/quote.service";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { quoteId, dataSourceType, ...fields } = body;

  await quoteService.moveQuote(quoteId, fields, dataSourceType);

  return {
    message: "Quote moved to order successfully",
  };
});