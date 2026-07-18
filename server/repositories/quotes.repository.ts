import type { QuoteFieldsRequest } from "../../shared/types/";
import { QuoteStatus } from "../../shared/types/enums";
import type { UploadedAsset } from "../services/upload.service";


class QuotesRepository {
  private db: ReturnType<typeof useDb>;

  constructor() {
    this.db = useDb();
  }
  async createQuote(userId: string, fields: QuoteFieldsRequest, uploadedAssets: UploadedAsset[]) {

    const result = await this.db`
        WITH new_quote AS (
      INSERT INTO public.quotes (
        user_id, 
        q_type, 
        title, 
        po_number, 
        instructions, 
        estimated_price, 
        quote_data,
        status,
        is_converted
      ) 
      VALUES (
        ${userId}, 
        ${fields.qType}, 
        ${fields.title}, 
        ${fields.poNumber || null}, 
        ${fields.instructions || null}, 
        ${fields.estimatedPrice}, 
        ${JSON.stringify(fields.quoteData)}, 
        ${QuoteStatus.PENDING}, 
        false
      )
      RETURNING id
    ),
     data AS (
          SELECT jsonb_array_elements(${JSON.stringify(uploadedAssets)}::jsonb) AS j
        ),
        ins AS (
          INSERT INTO quote_attachments (
            quote_id, url, public_id, resource_type, format, bytes, original_filename, field_name
          )
          SELECT
            (SELECT id FROM new_quote),
            j->>'url',
            j->>'publicId',
            j->>'resourceType',
            NULLIF(j->>'format','')::text,
            NULLIF(j->>'bytes','')::bigint,
            'QR-' || (SELECT id FROM new_quote) || '-' || COALESCE(NULLIF(j->>'originalFilename',''), 'file'),
            'quote_attachments'
          FROM data
          RETURNING 1
        )
        SELECT id AS quote_id FROM new_quote;
    `;

    return (result as any)[0];
  }

  async getTotalPageCount(whereClause: string, values: any[], limit: number) {
    const countQuery = `SELECT COUNT(*) FROM quotes q ${whereClause}`;
    const countRows = await this.db.query(countQuery, values);
    const totalRecords = Number((countRows as any[])[0].count) || 0;
    const totalPage = Math.max(1, Math.ceil(totalRecords / limit));
    return totalPage;
  }

  async getQuotesWithFilters(
    whereConditions: string[],
    values: any[],
    isAdmin: boolean,
    limit: number,
    offset: number
  ) {
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Data query - Include JOIN with users table when admin is true
    const selectFields = isAdmin
      ? `q.*, u.contact_name as customer_name, u.primary_email as customer_email`
      : `q.*`;

    const joinClause = isAdmin ? 'LEFT JOIN users u ON q.user_id = u.id' : '';

    const dataQuery = [
      `SELECT ${selectFields}`,
      `FROM quotes q`,
      joinClause,
      whereClause,
      `ORDER BY q.created_at DESC`,
      `LIMIT $${values.length + 1}`,
      `OFFSET $${values.length + 2}`,
    ].filter(Boolean).join(' ');

    const dataValues = [...values, limit, offset];
    const quotes = await this.db.query(dataQuery, dataValues);
    return quotes;
  }

  async getQuoteDetails(isAdmin: boolean, quoteId: number, userId: number) {
    const quote = await this.db`
    SELECT
      q.*,
      -- We aggregate the attachments into a clean JSON array
      COALESCE(att.attachments, '[]'::jsonb) AS quote_attachments
    FROM quotes AS q
    LEFT JOIN LATERAL (
      SELECT jsonb_agg(
               jsonb_build_object(
                 'id', qa.id,
                 'url', qa.url,
                 'resource_type', qa.resource_type,
                 'format', qa.format,
                 'bytes', qa.bytes,
                 'original_filename', qa.original_filename,
                 'field_name', qa.field_name
               )
               ORDER BY qa.created_at
             ) AS attachments
      FROM quote_attachments AS qa
      WHERE qa.quote_id = q.id AND qa.field_name = 'quote_attachments'
    ) AS att ON TRUE
    WHERE q.id = ${quoteId}
    -- Security check: if not admin, ensure they can only see their own quote
    ${!isAdmin ? this.db`AND q.user_id = ${userId}` : this.db``}
  `;

    // Return the first record (the quote object) or null if not found
    return (quote as any[])[0] || null;
  }

  async moveToOrder(quoteId: number) {
    // 1. First, fetch the quote to get the data we need to map
    const quote = await this.getQuoteDetails(true, quoteId, 0);
    if (!quote || quote.q_type !== 'order') throw new Error("Invalid quote for order conversion");

    try {
      // Start Transaction
      await this.db`BEGIN`;

      // Normalize numeric-like fields: Postgres numeric/int columns can't accept empty string ("")
      const width = quote.quote_data.width;
      const height = quote.quote_data.height;
      const numColors = quote.quote_data.numColors;

      // 2. Insert into Orders (Mapping quote_data to columns)
      const newOrder = await this.db`
      INSERT INTO public.orders (
        order_name, po_number, instructions, user_id, 
        fabric, placement, width_in, height_in, required_format,
        price, rush, blending, num_colors, from_quote_id, is_from_quote, status
      ) 
      VALUES (
        ${quote.title}, 
        ${quote.po_number}, 
        ${quote.instructions}, 
        ${quote.user_id},
        ${quote.quote_data.fabric}, 
        ${quote.quote_data.placement},
        ${width === '' || width === undefined || width === null ? null : width},
        ${height === '' || height === undefined || height === null ? null : height},
        ${quote.quote_data.requiredFormat},
        ${quote.estimated_price || 0},
        ${quote.quote_data.rush},
        ${quote.quote_data.blending},
        ${numColors === '' || numColors === undefined || numColors === null ? null : numColors},
        ${quote.id}, 
        true,
        ${OrderStatus.IN_PROGRESS}
      )
      RETURNING id;
    `;

      const newOrderId = (newOrder as any)[0].id;

      // 3. Duplicate Attachments (From quote_attachments to order_attachments)
      await this.db`
      INSERT INTO public.attachments (
        order_id, url, public_id, resource_type, format, bytes, original_filename, field_name
      )
      SELECT
        ${newOrderId}, url, public_id, resource_type, format, bytes,
        'OR-' || ${newOrderId} || '-' || regexp_replace(original_filename, '^QR-[0-9]+-', '') || '-' || original_filename,
        CASE WHEN field_name = 'quotes_delivery_attachments' THEN 'delivery_attachments' ELSE 'order_attachments' END
      FROM public.quote_attachments
      WHERE quote_id = ${quoteId};
    `;

      // 4. Update the original Quote
      await this.db`
      UPDATE public.quotes 
      SET 
        status = 'converted', 
        is_converted = true, 
        target_id = ${newOrderId},
        updated_at = now()
      WHERE id = ${quoteId};
    `;

      await this.db`COMMIT`;
      return { success: true, orderId: newOrderId };

    } catch (error) {
      await this.db`ROLLBACK`;
      useLogger().error("Conversion failed:", error);
      throw error;
    }
  }

  async moveToVector(quoteId: number) {
    const quote = await this.getQuoteDetails(true, quoteId, 0);
    if (!quote || quote.q_type !== 'vector') throw new Error("Invalid quote for vector conversion");

    try {
      await this.db`BEGIN`;

      // Normalize numeric-like field for vectors as well
      const numColors = quote.quote_data.numColors;

      // 2. Insert into Vectors
      const newVector = await this.db`
      INSERT INTO public.vectors (
        vector_name, po_number, instructions, user_id, 
        vector_type, required_format, blending, rush,
        num_colors, price, from_quote_id, is_from_quote, status
      ) 
      VALUES (
        ${quote.title}, 
        ${quote.po_number}, 
        ${quote.instructions}, 
        ${quote.user_id},
        ${quote.quote_data.vectorType}, 
        ${quote.quote_data.requiredFormat},
        ${quote.quote_data.blending || 'No'},
        ${quote.quote_data.rush || 'No'},
        ${numColors === '' || numColors === undefined || numColors === null ? null : numColors},
        ${quote.estimated_price || 0}, 
        ${quote.id}, 
        true,
        ${OrderStatus.IN_PROGRESS}
      )
      RETURNING id;
    `;

      const newVectorId = (newVector as any)[0].id;

      // 3. Duplicate Attachments
      await this.db`
      INSERT INTO public.vector_attachments (
        vector_id, url, public_id, resource_type, format, bytes, original_filename, field_name
      )
      SELECT
        ${newVectorId}, url, public_id, resource_type, format, bytes,
        'VR-' || ${newVectorId} || '-' || regexp_replace(original_filename, '^QR-[0-9]+-', '') || '-' || original_filename,
        CASE WHEN field_name = 'quotes_delivery_attachments' THEN 'vector_delivery_attachments' ELSE 'vector_attachments' END
      FROM public.quote_attachments
      WHERE quote_id = ${quoteId};
    `;

      // 4. Update Quote
      await this.db`
      UPDATE public.quotes 
      SET 
        status = 'converted', 
        is_converted = true, 
        target_id = ${newVectorId},
        updated_at = now()
      WHERE id = ${quoteId};
    `;

      await this.db`COMMIT`;
      return { success: true, vectorId: newVectorId };

    } catch (error) {
      await this.db`ROLLBACK`;
      throw error;
    }
  }

  // Retained for AttachmentsService's "Download Files" zip feature — legacy
  // quotes delivered before the deliver-quote step was removed may still have
  // quotes_delivery_attachments rows worth downloading.
  async getDeliveryDetails(quoteId: number) {
    const quote = await this.db`
      SELECT
        q.id,
        COALESCE(att.attachments, '[]'::jsonb) AS delivery_attachments
      FROM quotes AS q
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(
                 jsonb_build_object(
                   'id', qa.id,
                   'url', qa.url,
                   'resource_type', qa.resource_type,
                   'format', qa.format,
                   'bytes', qa.bytes,
                   'original_filename', qa.original_filename,
                   'field_name', qa.field_name
                 )
                 ORDER BY qa.created_at
               ) AS attachments
        FROM quote_attachments AS qa
        WHERE qa.quote_id = q.id AND qa.field_name = 'quotes_delivery_attachments'
      ) AS att ON TRUE
      WHERE q.id = ${quoteId}
    `;

    return (quote as any[])[0] || null;
  }
}

export default new QuotesRepository();