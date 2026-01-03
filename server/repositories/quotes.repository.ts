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
            NULLIF(j->>'originalFilename','')::text,
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

}

export default new QuotesRepository();