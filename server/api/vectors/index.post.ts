import { parseMultipart } from "../../utils/multiplart"
import VectorService from "../../services/vector.service"

export default defineEventHandler(async (event) => {
    // await readValidatedBody(event, (body) => OrderSchema.parse(body));
    const { id: userId } = event.context.user;

    try {
        const { fields, files } = await parseMultipart(event);

        const order = await VectorService.createVector(userId, fields, files)

        return {
            message: 'Vector created successfully',
            data: order
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