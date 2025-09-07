import type { QuoteFieldsRequest, QuoteFilesRequest, QueryParams } from "~~/shared/types";
import type { UploadedAsset } from "./upload.service";
import uploadService from "./upload.service";
import orderRepository from "../repositories/order.respository";
import { DataSource } from "~~/shared/types/enums";

class QuoteService {

    async createQuote(userId: string, fields: QuoteFieldsRequest, files: QuoteFilesRequest) {
        const attachmentsInput = (files || []).filter(
            (f: any) => f.fieldName === "attachments" || f.fieldName == null
        );

        let uploaded: UploadedAsset[] = [];
        if (attachmentsInput.length) {
            uploaded = await uploadService.uploadBuffers(attachmentsInput, {
                folder: "orders",
                tags: ["order"],
            });
        }

          return await orderRepository.createOrder(userId, fields, uploaded, {type: DataSource.QUOTE});
    }

    async getQuotes(isAdmin: boolean, queryParams: QueryParams) {
        const {
            user_id,
            limit = 10,
            page = 1,
            order_number,
            order_name,
            customer_name,
            date_from,
            date_to,
        } = queryParams;

        const values: any[] = [];
        let i = 1; // next $ placeholder index

        // Build WHERE conditions
        const whereConditions: string[] = [];
        whereConditions.push(`o.metadata->>'type' = '${DataSource.QUOTE}'`);
        // Only non-admins are restricted to their own orders
        if (!isAdmin) {
            whereConditions.push(`o.user_id = $${i++}`);
            values.push(user_id);
        }

        if (order_number) {
            whereConditions.push(`o.id = $${i++}`);
            values.push(order_number);
        }

        if (customer_name) {
            whereConditions.push(`u.contact_name ILIKE $${i++}`);
            values.push(`%${customer_name}%`);
        }

        if (order_name) {
            whereConditions.push(`o.order_name ILIKE $${i++}`);
            values.push(`%${order_name}%`);
        }

        if (date_from && date_to) {
            whereConditions.push(`o.created_at >= $${i++}::date`);
            whereConditions.push(`o.created_at < ($${i++}::date + interval '1 day')`);
            values.push(date_from, date_to);
        }

        // Get total page count and quotes data from repository
        const [totalPage, quotes] = await Promise.all([
            orderRepository.getTotalPageCount(
                whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '',
                values,
                limit
            ),
            orderRepository.getOrdersWithFilters(
                whereConditions,
                values,
                isAdmin,
                limit,
                (page - 1) * limit
            )
        ]);

        return {
            quotes,
            pagination: {
                totalPage,
                currentPage: page,
            },
        };
    }

    async getQuoteDetails(isAdmin: boolean, quoteId: number, userId: number) {
        const quote = await orderRepository.getOrderDetails(isAdmin, quoteId, userId);
        return quote;
    }

    async updateQuoteStatus(isAdmin: boolean, quoteId: number, status: QuoteStatus) {
        const AdminActions = [QuoteStatus.ACCEPTED, QuoteStatus.REJECTED]
        const UserActions = [QuoteStatus.PROCEED]

        if (!isAdmin) {
            if (!UserActions.includes(status)) {
                throw new Error("You are not authorized to update this quote status");
            }
        }

        if (isAdmin) {
            if (!AdminActions.includes(status)) {
                throw new Error("You are not authorized to update this quote status");
            }
        }

        await orderRepository.updateOrderStatus(quoteId, status);
        return
    }

    async moveToOrder(quoteId: number, fields: { price: number, additionalNotes: string }) {
        await orderRepository.moveToOrder(quoteId, fields);
        return
    }
}

export default new QuoteService();