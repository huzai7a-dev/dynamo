import { QuoteSchema } from "~~/shared/validationSchema";
import QuoteService from "../../services/quote.service"
import { parseMultipart } from "../../utils/multiplart"

export default defineEventHandler(async (event) => {
    // await readValidatedBody(event, (body) => QuoteSchema.parse(body));
    const { id: userId } = event.context.user;

    try {
        const { fields, files } = await parseMultipart(event);
        const { dataSourceType, orderName, vectorName, poNumber, instructions, estimatedPrice, ...quoteData } = fields;
        const title = dataSourceType === 'order' ? orderName : vectorName;
        const payload = {
            title,
            qType: dataSourceType,
            poNumber,
            instructions,
            estimatedPrice,
            quoteData,
        }

        const quote = await QuoteService.createQuote(userId, payload, files)

        return {
            message: 'Quote created successfully',
            data: quote
        }
    } catch (error) {
        console.log(error)
        return createError({
            statusCode: 400,
            data: JSON.stringify(error),
        })
    }
}
)