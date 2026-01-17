import quoteService from "~~/server/services/quote.service";
import { ROLE } from "~~/shared/constants";

export default eventHandler(async (event) => {
    try {
        const { role, id: userId } = event.context.user;
        const quoteId = getRouterParam(event, 'id');
        const isAdmin = role === ROLE.Admin

        const quote = await quoteService.getQuoteDetails(isAdmin, Number(quoteId), Number(userId));

        return {
            message: 'Quote fetched successfully',
            data: quote
        }

    } catch (error) {
        console.log(error, 'error')
        return createError({
            statusCode: 400,
            message: 'Server Error'
        })
    }
})