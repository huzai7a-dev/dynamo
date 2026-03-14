import type { QuoteFieldsRequest, QuoteFilesRequest, QueryParams } from "~~/shared/types";
import type { UploadedAsset } from "./upload.service";
import uploadService from "./upload.service";
import { DataSource } from "~~/shared/types/enums";
import quotesRepository from "../repositories/quotes.repository";
import UserService from "./user.service";
import EmailService, { buildMailAttachments } from "./email.service";
import { generateQuoteConfirmationEmail } from "../templates/quote-confirmation.email";

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
        const quote = await quotesRepository.createQuote(userId, fields, uploaded);
        await this.sendQuoteConfirmationEmail(userId, quote.quote_id, fields, uploaded);
        return quote;
    }

    private async sendQuoteConfirmationEmail(
        userId: string,
        quoteId: number,
        fields: QuoteFieldsRequest,
        uploaded: UploadedAsset[]
    ) {
        try {
            const user = await UserService.getUserById(userId);
            if (!user?.primary_email) return;
            const quoteName = `${fields.title}-QR-${quoteId}`;
            const subject = `Quote Has Been Created — ${quoteName}`;
            const clientHTML = generateQuoteConfirmationEmail({ quoteId, fields, uploaded, user, isAdmin: false, quoteName });
            const adminHTML = generateQuoteConfirmationEmail({ quoteId, fields, uploaded, user, isAdmin: true, quoteName });
            const mailAttachments = buildMailAttachments(uploaded, "attachment", `QR-${quoteId}`);

            await Promise.all([
                EmailService.sendHtmlEmail(user.primary_email, subject, clientHTML, mailAttachments),
                EmailService.sendHtmlEmail(useRuntimeConfig().emailUser as string, quoteName, adminHTML, mailAttachments),
            ]);
        } catch (err) {
            console.error('Quote confirmation email failed:', err);
        }
    }

    async getAllQuotes(quoteParams: QueryParams, isAdmin = false) {
        const {
            user_id,
            limit = 10,
            page = 1,
            order_number,
            order_name,
            customer_name,
            date_from,
            date_to,
            status,
            converted,
        } = quoteParams;

        const values: any[] = [];
        let i = 1; // next $ placeholder index

        const whereConditions: string[] = [];

        if (!isAdmin) {
            whereConditions.push(`q.user_id = $${i++}`);
            values.push(user_id);
        }

        if (order_number) {
            whereConditions.push(`q.id = $${i++}`);
            values.push(order_number);
        }

        if (customer_name) {
            whereConditions.push(`u.contact_name ILIKE $${i++}`);
            values.push(`%${customer_name}%`);
        }

        if (order_name) {
            whereConditions.push(`q.title ILIKE $${i++}`);
            values.push(`%${order_name}%`);
        }

        if (date_from && date_to) {
            whereConditions.push(`q.created_at >= $${i++}::date`);
            whereConditions.push(`q.created_at < ($${i++}::date + interval '1 day')`);
            values.push(date_from, date_to);
        }

        if (status) {
            whereConditions.push(`q.status = $${i++}`);
            values.push(status);
        }

        if (converted) {
            whereConditions.push(`q.is_converted = $${i++}`);
            values.push(true);
        }

        const [totalPage, quotes] = await Promise.all([
            quotesRepository.getTotalPageCount(
                whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '',
                values,
                limit
            ),
            quotesRepository.getQuotesWithFilters(
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
        const quote = await quotesRepository.getQuoteDetails(isAdmin, quoteId, userId);
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

        return await quotesRepository.updateQuoteStatus(quoteId, status);
    }



    async moveQuote(quoteId: number, fields: { price: number, additionalNotes: string }, dataSourceType: DataSource) {
        if (dataSourceType === DataSource.ORDER) {
            return await quotesRepository.moveToOrder(quoteId);
        }
        if (dataSourceType === DataSource.VECTOR) {
            return await quotesRepository.moveToVector(quoteId);
        }
        return
    }
}

export default new QuoteService();