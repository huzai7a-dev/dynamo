import quotesRepository from "~~/server/repositories/quotes.repository";

export default defineEventHandler(async (event) => {
    const { user } = event.context;
    if (!user) {
        throw createError({ statusCode: 401, message: "Unauthorized" });
    }

    const body = await readBody(event);
    const { quoteId, reason } = body;

    if (!quoteId || !reason) {
        throw createError({ statusCode: 400, message: "Missing quoteId or reason" });
    }

    try {
        await quotesRepository.rejectQuote(Number(quoteId), reason);
        return { success: true, message: "Quote rejected successfully" };
    } catch (error: any) {
        console.error("Error rejecting quote:", error);
        throw createError({
            statusCode: 500,
            message: error.message || "Failed to reject quote"
        });
    }
});
