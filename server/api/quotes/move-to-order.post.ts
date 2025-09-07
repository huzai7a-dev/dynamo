import quoteService from "~~/server/services/quote.service";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { quoteId } = body;

  await quoteService.moveToOrder(quoteId);

  return {
    message: "Quote moved to order successfully",
  };
});