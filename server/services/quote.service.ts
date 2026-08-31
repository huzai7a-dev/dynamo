import type { QuoteFieldsRequest, QuoteFilesRequest, QueryParams } from "~~/shared/types";
import type { UploadedAsset } from "./upload.service";
import uploadService from "./upload.service";
import { DataSource, EmailAccount, QuoteStatus } from "~~/shared/types/enums";
import quotesRepository from "../repositories/quotes.repository";
import AttachmentsRepository from "../repositories/attachments.repository";
import UserService from "./user.service";
import EmailService, { buildMailAttachments } from "./email.service";
import { generateQuoteConfirmationEmail } from "../templates/quote-confirmation.email";
import { generateQuoteUpdatedEmail } from "../templates/quote-updated.email";
import { getEmailUser } from "../utils/email";
import { diffFields, type FieldChange } from "../utils/diff";

const QUOTE_FIELD_MAP = [
    { key: "title", label: "Title" },
    { key: "po_number", label: "PO Number" },
    { key: "instructions", label: "Instructions" },
    { key: "estimated_price", label: "Estimated Price" },
];

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
        runInBackground(this.sendQuoteConfirmationEmail(userId, quote.quote_id, fields, uploaded));
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
                EmailService.sendHtmlEmail(getEmailUser(EmailAccount.ADMIN_ACC), quoteName, adminHTML, mailAttachments),
                EmailService.sendHtmlEmail(getEmailUser(EmailAccount.ORDER_ACC), quoteName, adminHTML, mailAttachments)
            ]);
        } catch (err) {
            useLogger().error('Quote confirmation email failed:', err);
        }
    }

    async updateQuote(userId: string, quoteId: number, fields: QuoteFieldsRequest, files: QuoteFilesRequest, existingAttachments: string[]) {
        const quote = await quotesRepository.findById(quoteId);
        const isUserQuote = quote?.user_id !== userId;

        if (!quote || isUserQuote) {
            throw new Error("Quote not found or access denied");
        }

        if (quote.status === QuoteStatus.PROCEED) {
            throw new Error("Cannot edit a quote that has already been converted");
        }

        const attachmentsInput = (files || []).filter(
            (f: any) => f.fieldName === "attachments" || f.fieldName == null
        );

        let uploaded: UploadedAsset[] = [];
        if (attachmentsInput.length) {
            uploaded = await uploadService.uploadBuffers(attachmentsInput, {
                folder: `${fields.dataSourceType || quote.q_type}s`,
                tags: [fields.dataSourceType || quote.q_type],
            });
        }

        // OrderForm/VectorForm don't expose an estimatedPrice input, so fall
        // back to the existing value rather than nulling out the price.
        const fieldsWithPrice = {
            ...fields,
            estimatedPrice: fields.estimatedPrice ?? quote.estimated_price,
        };

        const updatedQuote = await quotesRepository.updateQuoteFields(quoteId, fieldsWithPrice);
        await AttachmentsRepository.updateExistingQuoteAttachments(quoteId, existingAttachments);
        await AttachmentsRepository.addNewQuoteAttachments(quoteId, uploaded);

        const changes = diffFields(quote, updatedQuote, QUOTE_FIELD_MAP);
        if (changes.length > 0) {
            runInBackground(this.sendQuoteUpdatedEmail(userId, quoteId, changes));
        }

        return updatedQuote;
    }

    private async sendQuoteUpdatedEmail(userId: string, quoteId: number, changes: FieldChange[]) {
        try {
            const user = await UserService.getUserById(userId);
            if (!user?.primary_email) return;
            const quote = await quotesRepository.findById(quoteId);
            const quoteName = `${quote?.title}-QR-${quoteId}`;
            const subject = `Quote Has Been Updated — ${quoteName}`;
            const clientHTML = generateQuoteUpdatedEmail({ quoteId, changes, user, isAdmin: false, quoteName });
            const adminHTML = generateQuoteUpdatedEmail({ quoteId, changes, user, isAdmin: true, quoteName });

            await Promise.all([
                EmailService.sendHtmlEmail(user.primary_email, subject, clientHTML),
                EmailService.sendHtmlEmail(getEmailUser(EmailAccount.ADMIN_ACC), quoteName, adminHTML),
                EmailService.sendHtmlEmail(getEmailUser(EmailAccount.ORDER_ACC), quoteName, adminHTML)
            ]);
        } catch (err) {
            useLogger().error('Quote update email failed:', err);
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

    async moveQuote(quoteId: number, dataSourceType: DataSource) {
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