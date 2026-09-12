import invoiceRepository from "~~/server/repositories/invoice.repository";

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event);
    const userId = session.user.id;
    const transactionRef = getRouterParam(event, 'ref');

    if (!transactionRef) {
        throw createError({ statusCode: 400, message: 'Transaction Reference is required' });
    }

    const invoice = await invoiceRepository.getInvoiceDetail(transactionRef, userId);

    if (!invoice) {
        throw createError({ statusCode: 404, message: 'Invoice not found' });
    }

    return invoice;
});
