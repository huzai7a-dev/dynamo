import type { VectorFieldsRequest, VectorFilesRequest } from "~~/shared/types";

class VectorRepository{
  private db: any;

  constructor() {
    this.db = useDb();
  }

  async createVector(userId: string, vectorData: VectorFieldsRequest, attachments: VectorFilesRequest[]) {
    const rows = await this.db`
      WITH new_vector AS (
        INSERT INTO vectors (
          vector_name, po_number, required_format,
          blending, rush, instructions,
          user_id
        )
        VALUES (
          ${vectorData.vectorName},
          ${vectorData.poNumber},
          ${vectorData.requiredFormat},
          ${vectorData.blending},
          ${vectorData.rush},
          ${vectorData.instructions},
          ${userId}
        )
        RETURNING id
      )
      ${attachments.length > 0 ? this.db`
      , data AS (
        SELECT jsonb_array_elements(${JSON.stringify(attachments)}::jsonb) AS j
      )
      , ins AS (
        INSERT INTO attachments (
          order_id, url, public_id, resource_type, format, bytes, original_filename, field_name
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

}

export default new VectorRepository();