import quoteService from "~~/server/services/quote.service";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { quoteId, ...fields } = body;

  await quoteService.moveToOrder(quoteId, fields);

  return {
    message: "Quote moved to order successfully",
  };
});