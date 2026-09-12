import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { COMPANY, BILL_FROM } from "#shared/constants";
import type { InvoiceDetail } from "../repositories/invoice.repository";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 40;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const COLOR = {
  teal: rgb(0x0d / 255, 0x6c / 255, 0x73 / 255),
  tealDark: rgb(0x00 / 255, 0x34 / 255, 0x38 / 255),
  lightBg: rgb(0xf1 / 255, 0xf3 / 255, 0xf4 / 255),
  text: rgb(0x1e / 255, 0x29 / 255, 0x3b / 255),
  gray: rgb(0x37 / 255, 0x41 / 255, 0x51 / 255),
  muted: rgb(0x66 / 255, 0x96 / 255, 0x99 / 255),
  white: rgb(1, 1, 1),
  rowBorder: rgb(0xe2 / 255, 0xe8 / 255, 0xf0 / 255),
};

const ITEM_COLUMNS = [
  { key: "sr", label: "#SR", width: 30 },
  { key: "designNo", label: "Design No", width: 65 },
  { key: "designName", label: "Design Name", width: 150 },
  { key: "poNumber", label: "PO Number", width: 80 },
  { key: "status", label: "Payment Status", width: 75 },
  { key: "date", label: "Received Date", width: 65 },
  { key: "price", label: "Price", width: CONTENT_WIDTH - (30 + 65 + 150 + 80 + 75 + 65) },
];

const ROW_HEIGHT = 26;
const HEADER_ROW_HEIGHT = 28;

interface Fonts {
  regular: PDFFont;
  bold: PDFFont;
}

class InvoicePdfService {
  async generate(invoice: InvoiceDetail, statusLabel: string): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const fonts: Fonts = {
      regular: await pdfDoc.embedFont(StandardFonts.Helvetica),
      bold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
    };

    let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT - MARGIN;

    y = await this.drawHeader(pdfDoc, page, fonts, y);
    y = this.drawInvoiceBanner(page, fonts, y, invoice.transactionRef);
    y = this.drawBillBlock(page, fonts, y, invoice);
    ({ page, y } = this.drawItemsTable(pdfDoc, page, fonts, y, invoice, statusLabel));
    ({ page, y } = this.drawNote(pdfDoc, page, fonts, y));

    const bytes = await pdfDoc.save();
    return Buffer.from(bytes);
  }

  private async drawHeader(pdfDoc: PDFDocument, page: PDFPage, fonts: Fonts, y: number): Promise<number> {
    try {
      const logoBytes = await useStorage("assets:server").getItemRaw("full-logo.png");
      if (logoBytes) {
        const logoImage = await pdfDoc.embedPng(logoBytes as Buffer);
        const targetHeight = 40;
        const scale = targetHeight / logoImage.height;
        const width = logoImage.width * scale;
        page.drawImage(logoImage, {
          x: (PAGE_WIDTH - width) / 2,
          y: y - targetHeight,
          width,
          height: targetHeight,
        });
        y -= targetHeight + 8;
      }
    } catch (err) {
      useLogger().error("[InvoicePdfService] Failed to embed logo:", err);
    }

    const tagline = COMPANY.tagline;
    const taglineSize = 9;
    const taglineWidth = fonts.bold.widthOfTextAtSize(tagline, taglineSize);
    page.drawText(tagline, {
      x: (PAGE_WIDTH - taglineWidth) / 2,
      y: y - taglineSize,
      size: taglineSize,
      font: fonts.bold,
      color: COLOR.muted,
    });
    y -= taglineSize + 16;

    return y;
  }

  private drawInvoiceBanner(page: PDFPage, fonts: Fonts, y: number, transactionRef: string): number {
    const bannerHeight = 40;
    page.drawRectangle({
      x: MARGIN,
      y: y - bannerHeight,
      width: CONTENT_WIDTH,
      height: bannerHeight,
      color: COLOR.teal,
    });

    const text = `Invoice # ${transactionRef}`;
    page.drawText(text, {
      x: MARGIN + 16,
      y: y - bannerHeight / 2 - 6,
      size: 15,
      font: fonts.bold,
      color: COLOR.white,
    });

    return y - bannerHeight - 16;
  }

  private drawBillBlock(page: PDFPage, fonts: Fonts, y: number, invoice: InvoiceDetail): number {
    const lines = [
      [`Name:`, BILL_FROM.name],
      [`E-mail:`, BILL_FROM.email],
      [`Phone no:`, BILL_FROM.phone],
      [`Address:`, BILL_FROM.address],
      [`Tax ID:`, BILL_FROM.taxId],
    ];
    const toLines = [
      [`Name:`, invoice.user.name || "-"],
      [`E-mail:`, invoice.user.email || "-"],
      [`Company:`, invoice.user.company || "-"],
      [`Date:`, this.formatDate(invoice.createdAt)],
    ];

    const rowCount = Math.max(lines.length, toLines.length);
    const lineHeight = 15;
    const blockHeight = 24 + rowCount * lineHeight + 16;

    page.drawRectangle({
      x: MARGIN,
      y: y - blockHeight,
      width: CONTENT_WIDTH,
      height: blockHeight,
      color: COLOR.lightBg,
    });

    const colWidth = CONTENT_WIDTH / 2;
    let cursorY = y - 20;

    page.drawText("Bill From:", { x: MARGIN + 16, y: cursorY, size: 11, font: fonts.bold, color: COLOR.teal });
    page.drawText("Bill To:", { x: MARGIN + colWidth + 8, y: cursorY, size: 11, font: fonts.bold, color: COLOR.teal });
    cursorY -= lineHeight;

    for (let i = 0; i < rowCount; i++) {
      if (lines[i]) {
        this.drawLabelValue(page, fonts, MARGIN + 16, cursorY, lines[i][0], lines[i][1]);
      }
      if (toLines[i]) {
        this.drawLabelValue(page, fonts, MARGIN + colWidth + 8, cursorY, toLines[i][0], toLines[i][1]);
      }
      cursorY -= lineHeight;
    }

    return y - blockHeight - 16;
  }

  private drawLabelValue(page: PDFPage, fonts: Fonts, x: number, y: number, label: string, value: string) {
    const size = 9.5;
    page.drawText(label, { x, y, size, font: fonts.bold, color: COLOR.gray });
    const labelWidth = fonts.bold.widthOfTextAtSize(label + " ", size);
    page.drawText(this.truncate(value, fonts.regular, size, 240 - labelWidth), {
      x: x + labelWidth,
      y,
      size,
      font: fonts.regular,
      color: COLOR.gray,
    });
  }

  private drawItemsTable(
    pdfDoc: PDFDocument,
    page: PDFPage,
    fonts: Fonts,
    y: number,
    invoice: InvoiceDetail,
    statusLabel: string,
  ): { page: PDFPage; y: number } {
    let currentPage = page;
    let cursorY = this.drawItemsTableHeader(currentPage, fonts, y);

    invoice.items.forEach((item, idx) => {
      if (cursorY - ROW_HEIGHT < MARGIN + 100) {
        currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        cursorY = this.drawItemsTableHeader(currentPage, fonts, PAGE_HEIGHT - MARGIN);
      }

      const rowValues = [
        String(idx + 1),
        `${item.type === "order" ? "OR" : "VR"}-${item.id}`,
        item.name,
        item.poNumber || "-",
        statusLabel,
        this.formatDate(item.date),
        `$${Number(item.price || 0).toFixed(0)}`,
      ];

      let colX = MARGIN;
      rowValues.forEach((value, colIdx) => {
        const col = ITEM_COLUMNS[colIdx];
        const text = this.truncate(value, fonts.regular, 9, col.width - 10);
        const textWidth = fonts.regular.widthOfTextAtSize(text, 9);
        currentPage.drawText(text, {
          x: colX + (col.width - textWidth) / 2,
          y: cursorY - ROW_HEIGHT / 2 - 3,
          size: 9,
          font: colIdx === ITEM_COLUMNS.length - 1 ? fonts.bold : fonts.regular,
          color: colIdx === ITEM_COLUMNS.length - 1 ? COLOR.teal : COLOR.gray,
        });
        colX += col.width;
      });

      currentPage.drawLine({
        start: { x: MARGIN, y: cursorY - ROW_HEIGHT },
        end: { x: MARGIN + CONTENT_WIDTH, y: cursorY - ROW_HEIGHT },
        thickness: 0.5,
        color: COLOR.rowBorder,
      });

      cursorY -= ROW_HEIGHT;
    });

    // Totals row
    if (cursorY - ROW_HEIGHT < MARGIN + 80) {
      currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      cursorY = PAGE_HEIGHT - MARGIN;
    }

    const totalLabel = "Total";
    const totalLabelWidth = fonts.bold.widthOfTextAtSize(totalLabel, 12);
    const totalsColX = MARGIN + ITEM_COLUMNS.slice(0, -1).reduce((sum, c) => sum + c.width, 0);
    currentPage.drawText(totalLabel, {
      x: totalsColX - totalLabelWidth - 16,
      y: cursorY - ROW_HEIGHT / 2 - 4,
      size: 12,
      font: fonts.bold,
      color: COLOR.tealDark,
    });

    const totalValue = `$${Number(invoice.amount).toFixed(0)}`;
    const totalValueWidth = fonts.bold.widthOfTextAtSize(totalValue, 12);
    const lastCol = ITEM_COLUMNS[ITEM_COLUMNS.length - 1];
    currentPage.drawText(totalValue, {
      x: totalsColX + (lastCol.width - totalValueWidth) / 2,
      y: cursorY - ROW_HEIGHT / 2 - 4,
      size: 12,
      font: fonts.bold,
      color: COLOR.teal,
    });

    cursorY -= ROW_HEIGHT + 16;

    return { page: currentPage, y: cursorY };
  }

  private drawItemsTableHeader(page: PDFPage, fonts: Fonts, y: number): number {
    page.drawRectangle({
      x: MARGIN,
      y: y - HEADER_ROW_HEIGHT,
      width: CONTENT_WIDTH,
      height: HEADER_ROW_HEIGHT,
      color: COLOR.teal,
    });

    let colX = MARGIN;
    ITEM_COLUMNS.forEach((col) => {
      const size = 8;
      const label = col.label.toUpperCase();
      const textWidth = fonts.bold.widthOfTextAtSize(label, size);
      page.drawText(label, {
        x: colX + (col.width - textWidth) / 2,
        y: y - HEADER_ROW_HEIGHT / 2 - 3,
        size,
        font: fonts.bold,
        color: COLOR.white,
      });
      colX += col.width;
    });

    return y - HEADER_ROW_HEIGHT;
  }

  private drawNote(pdfDoc: PDFDocument, page: PDFPage, fonts: Fonts, y: number): { page: PDFPage; y: number } {
    const noteText =
      "If you have an outstanding balance: please pay it as soon as possible to avoid service " +
      "interruptions. Accounts delinquent for over 7 days are subject to suspension and/or deletion.";
    const wrapped = this.wrapText(noteText, fonts.regular, 9, CONTENT_WIDTH - 48);
    const lineHeight = 13;
    const blockHeight = 40 + wrapped.length * lineHeight;

    let currentPage = page;
    let cursorY = y;
    if (cursorY - blockHeight < MARGIN) {
      currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      cursorY = PAGE_HEIGHT - MARGIN;
    }

    currentPage.drawRectangle({
      x: MARGIN,
      y: cursorY - blockHeight,
      width: CONTENT_WIDTH,
      height: blockHeight,
      color: COLOR.lightBg,
    });

    currentPage.drawText("Note:", {
      x: MARGIN + 16,
      y: cursorY - 20,
      size: 11,
      font: fonts.bold,
      color: COLOR.tealDark,
    });

    wrapped.forEach((line, idx) => {
      currentPage.drawText(line, {
        x: MARGIN + 16,
        y: cursorY - 38 - idx * lineHeight,
        size: 9,
        font: fonts.regular,
        color: COLOR.gray,
      });
    });

    return { page: currentPage, y: cursorY - blockHeight };
  }

  private formatDate(dateString: string | null): string {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  private truncate(text: string, font: PDFFont, size: number, maxWidth: number): string {
    if (maxWidth <= 0) return "";
    if (font.widthOfTextAtSize(text, size) <= maxWidth) return text;
    let result = text;
    while (result.length > 1 && font.widthOfTextAtSize(result + "…", size) > maxWidth) {
      result = result.slice(0, -1);
    }
    return result + "…";
  }

  private wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let current = "";

    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }
    if (current) lines.push(current);
    return lines;
  }
}

export default new InvoicePdfService();
