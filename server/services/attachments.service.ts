import archiver from "archiver";
import { DataSource } from "~~/shared/types/enums";
import OrderService from "./order.service";
import VectorService from "./vector.service";
import QuoteService from "./quote.service";
import OrderDeliveryRepository from "../repositories/order-delivery.repository";
import VectorDeliveryRepository from "../repositories/vector-delivery.repository";
import QuotesRepository from "../repositories/quotes.repository";

interface DeliveryFile {
  url: string;
  original_filename?: string | null;
  format?: string | null;
}

class AttachmentsService {
  /** Ownership-checked lookup of the delivered files for an order/vector/quote. */
  async getDeliveryFiles(
    type: DataSource,
    id: number,
    isAdmin: boolean,
    userId: number
  ): Promise<DeliveryFile[]> {
    if (type === DataSource.ORDER) {
      const order = await OrderService.getOrderDetails(isAdmin, id, userId);
      if (!order) throw createError({ statusCode: 404, statusMessage: "Order not found" });
      const delivery = await OrderDeliveryRepository.getDeliveryByOrderId(id);
      return delivery?.delivery_attachments || [];
    }

    if (type === DataSource.VECTOR) {
      const vector = await VectorService.getVectorDetails(id, isAdmin, userId);
      if (!vector) throw createError({ statusCode: 404, statusMessage: "Vector not found" });
      const delivery = await VectorDeliveryRepository.getDeliveryByVectorId(id);
      return delivery?.delivery_attachments || [];
    }

    if (type === DataSource.QUOTE) {
      const quote = await QuoteService.getQuoteDetails(isAdmin, id, userId);
      if (!quote) throw createError({ statusCode: 404, statusMessage: "Quote not found" });
      const delivery = await QuotesRepository.getDeliveryDetails(id);
      return delivery?.delivery_attachments || [];
    }

    throw createError({ statusCode: 400, statusMessage: "Invalid entity type" });
  }

  /** Fetches each file from Cloudinary and streams them back as a single zip archive. */
  async streamZip(files: DeliveryFile[]) {
    if (!files.length) {
      throw createError({ statusCode: 404, statusMessage: "No delivered files available for download" });
    }

    const archive = archiver("zip", { zlib: { level: 9 } });
    const usedNames = new Set<string>();
    let appended = 0;

    for (const file of files) {
      try {
        const response = await fetch(file.url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const buffer = Buffer.from(await response.arrayBuffer());
        archive.append(buffer, { name: this.uniqueFilename(file, usedNames) });
        appended++;
      } catch (err) {
        // One broken/missing file shouldn't fail the whole zip — skip and log it.
        useLogger().error(`[AttachmentsService] Failed to fetch file for zip: ${file.url}`, err);
      }
    }

    if (appended === 0) {
      throw createError({ statusCode: 502, statusMessage: "Unable to retrieve any of the attached files" });
    }

    archive.finalize();
    return archive;
  }

  private uniqueFilename(file: DeliveryFile, usedNames: Set<string>) {
    let base = file.original_filename || file.url.split("/").pop() || "file";
    if (file.format && !base.toLowerCase().endsWith(`.${file.format.toLowerCase()}`)) {
      base += `.${file.format}`;
    }

    if (!usedNames.has(base)) {
      usedNames.add(base);
      return base;
    }

    const dotIndex = base.lastIndexOf(".");
    const stem = dotIndex > 0 ? base.slice(0, dotIndex) : base;
    const ext = dotIndex > 0 ? base.slice(dotIndex) : "";

    let i = 2;
    let candidate = `${stem}-${i}${ext}`;
    while (usedNames.has(candidate)) {
      i++;
      candidate = `${stem}-${i}${ext}`;
    }
    usedNames.add(candidate);
    return candidate;
  }
}

export default new AttachmentsService();
