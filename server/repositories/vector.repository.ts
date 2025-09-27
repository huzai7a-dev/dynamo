import type { VectorFieldsRequest, VectorFilesRequest, QueryParams } from "~~/shared/types";

class VectorRepository{
  private db: any;

  constructor() {
    this.db = useDb();
  }

  async createVector(userId: string, vectorData: VectorFieldsRequest, attachments: VectorFilesRequest[], metadata?: Object) {
    const rows = await this.db`
      WITH new_vector AS (
        INSERT INTO vectors (
          vector_name, po_number, required_format,
          blending, rush, instructions, vector_type,
          user_id, metadata
        )
        VALUES (
          ${vectorData.vectorName},
          ${vectorData.poNumber},
          ${vectorData.requiredFormat},
          ${vectorData.blending},
          ${vectorData.rush},
          ${vectorData.instructions},
          ${vectorData.vectorType},
          ${userId},
          ${metadata}
        )
        RETURNING id
      )
      ${attachments.length > 0 ? this.db`
      , data AS (
        SELECT jsonb_array_elements(${JSON.stringify(attachments)}::jsonb) AS j
      )
      , ins AS (
        INSERT INTO vector_attachments (
          vector_id, url, public_id, resource_type, format, bytes, original_filename, field_name
        )
        SELECT
          (SELECT id FROM new_vector),
          j->>'url',
          j->>'publicId',
          j->>'resourceType',
          NULLIF(j->>'format','')::text,
          NULLIF(j->>'bytes','')::bigint,
          NULLIF(j->>'originalFilename','')::text,
          'vector_attachments'
        FROM data
        RETURNING 1
      )
      ` : this.db``}
      SELECT id AS vector_id FROM new_vector;
    `;

    const vectorId = rows[0]?.vector_id as number;
    return { vectorId };
  }

  async findById(id: number) {
    const rows = await this.db`
      SELECT * FROM vectors WHERE id = ${id}
    `;
    return rows[0] || null;
  }

  async getTotalPageCount(whereClause: string, values: any[], limit: number) {
    const countQuery = `SELECT COUNT(*) FROM vectors v ${whereClause}`;
    const countRows = await this.db.query(countQuery, values);
    const totalRecords = Number(countRows[0].count) || 0;
    const totalPage = Math.max(1, Math.ceil(totalRecords / limit));
    return totalPage;
  }

  async getVectorsWithFilters(
    whereConditions: string[],
    values: any[],
    isAdmin: boolean,
    limit: number,
    offset: number
  ) {
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Data query - Include JOIN with users table when admin is true
    const selectFields = isAdmin
      ? `v.id,
       v.vector_name,
       v.price,
       v.status,
       v.payment_status,
       v.created_at,
       v.metadata,
       u.contact_name as customer_name`
      : `v.id,
       v.vector_name,
       v.price,
       v.status,
       v.payment_status,
       v.metadata,
       v.created_at`;

    const joinClause = isAdmin ? 'LEFT JOIN users u ON v.user_id = u.id' : '';

    const dataQuery = [
      `SELECT ${selectFields}`,
      `FROM vectors v`,
      joinClause,
      whereClause,
      `ORDER BY v.created_at DESC`,
      `LIMIT $${values.length + 1}`,
      `OFFSET $${values.length + 2}`,
    ].filter(Boolean).join(' ');

    const dataValues = [...values, limit, offset];
    const vectors = await this.db.query(dataQuery, dataValues);
    return vectors;
  }

  async getVectorDetails(id: number, isAdmin: boolean, userId: number) {
    const vector = await this.db`
    SELECT 
      v.*,
      COALESCE(att.attachments, '[]'::jsonb) AS vector_attachments
    FROM vectors v
    LEFT JOIN LATERAL (
      SELECT jsonb_agg(
        jsonb_build_object(
          'url', a.url,
          'resource_type', a.resource_type,
          'format', a.format,
          'bytes', a.bytes
        )
        ORDER BY a.created_at
      ) AS attachments
    FROM vector_attachments AS a
    WHERE a.vector_id = v.id AND a.field_name = 'vector_attachments'
  ) AS att ON TRUE
   WHERE v.id = ${id}
   ${!isAdmin ? this.db`AND v.user_id = ${userId}` : this.db``}
  `;
  return vector[0];
  }

  async updateVectorStatus(vectorId: number, status: OrderStatus | QuoteStatus) {
    const vector = await this.db`UPDATE vectors SET status = ${status} WHERE id = ${Number(vectorId)} RETURNING *`;
    return vector[0];
  }

  async updateVectorFields(vectorId: number, fields: VectorFieldsRequest, files: VectorFilesRequest, existingAttachments: string[]) {
    const vector = await this.db`UPDATE vectors SET
      vector_name = ${fields.vectorName},
      po_number = ${fields?.poNumber || null},
      num_colors = ${fields.numColors != null && fields.numColors !== "" ? Number(fields.numColors) : null},
      required_format = ${fields.requiredFormat},
      blending = ${fields.blending},
      rush = ${fields.rush},
      instructions = ${fields?.instructions || null},
      updated_at = NOW()
    WHERE id = ${vectorId} RETURNING *`;    

  return vector[0];
  }

  async moveToOrder(vectorId: number, fields: { price: number, additionalNotes: string }) {
    const vector = await this.db`UPDATE vectors SET status = ${OrderStatus.IN_PROGRESS} WHERE id = ${vectorId} RETURNING *`;
    if (fields?.price) {
      await this.db`UPDATE vectors set price = ${fields.price} WHERE id = ${vectorId}`;
    }
    await this.db`UPDATE vectors SET metadata = COALESCE(metadata, '{}'::jsonb) || ${JSON.stringify({
      type: DataSource.VECTOR,
      convertFromQuote: true,
      ...(fields?.additionalNotes && { additionalNotes: fields.additionalNotes })
    })}::jsonb WHERE id = ${vectorId}`;
    return vector[0];
  }
}

export default new VectorRepository();