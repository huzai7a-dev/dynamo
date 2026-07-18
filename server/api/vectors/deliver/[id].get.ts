import vectorService from "~~/server/services/vector.service";

export default eventHandler(async (event) => {
    const vectorId = getRouterParam(event, 'id');
    try {
        const delivery = await vectorService.getDeliveryDetails(Number(vectorId));
        return delivery;
        
    } catch (error) {
        useLogger().error("Failed to fetch vector delivery details:", error)
        return createError({
            statusCode: 400,
            message: 'Server Error'
        })
    }
})