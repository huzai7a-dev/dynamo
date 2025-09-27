import type { QuoteFieldsRequest, QuoteFilesRequest, QueryParams } from "~~/shared/types";
import type { UploadedAsset } from "./upload.service";
import uploadService from "./upload.service";
import orderRepository from "../repositories/order.respository";
import { DataSource } from "~~/shared/types/enums";
import vectorRepository from "../repositories/vector.repository";
import vectorService from "./vector.service";
import orderService from "./order.service";

class QuoteService {

    async createQuote(userId: string, fields: QuoteFieldsRequest, files: QuoteFilesRequest) {
        const dataSourceType = fields.dataSourceType;
        const attachmentsInput = (files || []).filter(
            (f: any) => f.fieldName === "attachments" || f.fieldName == null
        );

        let uploaded: UploadedAsset[] = [];
        if (attachmentsInput.length) {
            uploaded = await uploadService.uploadBuffers(attachmentsInput, {
                folder: `${dataSourceType}s`,
                tags: [dataSourceType],
            });
        }

        if (dataSourceType === DataSource.ORDER)
            return await orderRepository.createOrder(userId, fields, uploaded, { type: DataSource.QUOTE });

        if (dataSourceType === DataSource.VECTOR)
            return await vectorRepository.createVector(userId, fields, uploaded, { type: DataSource.QUOTE });
    }

    async getOrderQuotes(isAdmin: boolean, queryParams: QueryParams) {
        const quotes = await orderService.getOrders(queryParams, isAdmin, DataSource.QUOTE);
        return {
            quotes: quotes.orders,
            pagination: quotes.pagination,
        };
    }
    
    async getVectorQuotes(isAdmin: boolean, queryParams: QueryParams) {
        const quotes = await vectorService.getVectors(isAdmin, queryParams, DataSource.QUOTE);
        return {
            quotes: quotes.vectors,
            pagination: quotes.pagination,
        };
    }

    async getQuoteDetails(isAdmin: boolean, quoteId: number, userId: number) {
        const quote = await orderRepository.getOrderDetails(isAdmin, quoteId, userId);
        return quote;
    }

    async updateQuoteStatus(isAdmin: boolean, quoteId: number, status: QuoteStatus, dataSourceType: DataSource) {
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

        if (dataSourceType === DataSource.ORDER)
            await orderRepository.updateOrderStatus(quoteId, status);
        if (dataSourceType === DataSource.VECTOR)
            await vectorRepository.updateVectorStatus(quoteId, status);
        return
    }

    async moveToOrder(quoteId: number, fields: { price: number, additionalNotes: string }, dataSourceType: DataSource) {
        if (dataSourceType === DataSource.ORDER)
            await orderRepository.moveToOrder(quoteId, fields);
        if (dataSourceType === DataSource.VECTOR)
            await vectorRepository.moveToOrder(quoteId, fields);
        return
    }
}

export default new QuoteService();