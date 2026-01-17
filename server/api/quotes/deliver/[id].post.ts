import { ROLE } from "~~/shared/constants";
import uploadService, { type BufferItem } from "~~/server/services/upload.service";
import quotesRepository from "~~/server/repositories/quotes.repository";

export default defineEventHandler(async (event) => {
    const { role } = event.context.user;

    // 1. Authorization Check
    if (role !== ROLE.Admin) {
        throw createError({
            statusCode: 403,
            message: "Unauthorized: Only admins can deliver quotes",
        });
    }

    const quoteId = getRouterParam(event, 'id');
    if (!quoteId) {
        throw createError({
            statusCode: 400,
            message: "Quote ID is required",
        });
    }

    // 2. Parse Multipart Form Data
    const formData = await readMultipartFormData(event);
    if (!formData) {
        throw createError({
            statusCode: 400,
            message: "No form data provided",
        });
    }

    // 3. Extract Fields and Files
    const fields: Record<string, string> = {};
    const files: BufferItem[] = [];

    for (const item of formData) {
        if (item.filename) {
            // It's a file
            files.push({
                buffer: item.data, // readMultipartFormData returns Buffer
                filename: item.filename,
                mimetype: item.type,
                fieldName: item.name
            });
        } else {
            // It's a field
            if (item.name) {
                fields[item.name] = item.data.toString();
            }
        }
    }

    // 4. Validate Required Fields
    const stitchCount = fields.stitchCount;
    const turnAroundTime = fields.turnAroundTime;
    const price = parseFloat(fields.price || '0');
    const additionalQuery = fields.additionalQuery || '';

    if (!stitchCount || !turnAroundTime || isNaN(price) || price <= 0) {
        throw createError({
            statusCode: 400,
            message: "Missing or invalid required fields (stitchCount, turnAroundTime, price)",
        });
    }

    try {
        // 5. Upload Files
        const uploadedAssets = await uploadService.uploadBuffers(files, {
            folder: 'quotes_delivery',
            tags: ['quote_delivery', `quote_${quoteId}`]
        });

        // 6. Update Quote in Repository
        await quotesRepository.deliverQuote(parseInt(quoteId), {
            stitchCount: stitchCount, // Keeping as string/number as received
            turnAroundTime,
            price,
            additionalQuery
        }, uploadedAssets);

        return {
            success: true,
            message: "Quote delivered successfully",
        };

    } catch (error: any) {
        console.error("Error in quote delivery endpoint:", error);
        throw createError({
            statusCode: 500,
            message: error.message || "Internal Server Error",
        });
    }
});
