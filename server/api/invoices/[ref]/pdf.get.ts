import invoiceRepository from "~~/server/repositories/invoice.repository";
import invoicePdfService from "~~/server/services/invoice-pdf.service";

const statusLabel = (status: string) => {
  if (status === "paid") return "Paid";
  if (status === "refunded") return "Refunded";
  return "Receivable";
};

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const userId = session.user.id;
  const transactionRef = getRouterParam(event, "ref");

  if (!transactionRef) {
    throw createError({ statusCode: 400, message: "Transaction Reference is required" });
  }

  const invoice = await invoiceRepository.getInvoiceDetail(transactionRef, userId);

  if (!invoice) {
    throw createError({ statusCode: 404, message: "Invoice not found" });
  }

  const pdfBuffer = await invoicePdfService.generate(invoice, statusLabel(invoice.status));

  setResponseHeader(event, "Content-Type", "application/pdf");
  setResponseHeader(event, "Content-Disposition", `attachment; filename="invoice-${transactionRef}.pdf"`);

  return pdfBuffer;
});
