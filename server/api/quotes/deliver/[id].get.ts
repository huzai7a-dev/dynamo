import quotesRepository from "~~/server/repositories/quotes.repository";
import { ROLE } from "~~/shared/constants";

export default defineEventHandler(async (event) => {
    try {
        const quoteId = getRouterParam(event, 'id');
        if (!quoteId) {
            throw createError({
                statusCode: 400,
                message: "Quote ID is required"
            });
        }

        // Optional: specific role checks here if needed, consistent with other endpoints
        // For now allowing authenticated users to fetch details (assuming middleware handles auth)
        // Usually delivery details should be visible to the user who owns the quote too.

        const details = await quotesRepository.getDeliveryDetails(parseInt(quoteId));

        if (!details) {
            throw createError({
                statusCode: 404,
                message: "Delivery details not found"
            });
        }

        return {
            success: true,
            data: details
        };

    } catch (error: any) {
        console.error("Error fetching delivery details:", error);
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || "Internal Server Error"
        });
    }
});
