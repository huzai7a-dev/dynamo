import quoteService from "~~/server/services/quote.service";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { quoteId, dataSourceType } = body;

  await quoteService.moveQuote(quoteId, dataSourceType);

  return {
    message: "Quote moved to order successfully",
  };
});