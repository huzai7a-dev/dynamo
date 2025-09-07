class AttachmentsRepository {
    private db: any;
    constructor() {
        this.db = useDb();
    }

    async updateExistingAttachments(orderId: number, existingAttachments: string[], fieldName: 'order_attachments' | 'vector_attachments') {
        if (existingAttachments.length > 0) {
            const placeholders = existingAttachments.map((_, index) => `$${index + 2}`).join(', ');
            const query = `
      DELETE FROM attachments 
      WHERE order_id = $1 
      AND field_name = ${fieldName}
      AND url NOT IN (${placeholders})
    `;
            await this.db.query(query, [orderId, ...existingAttachments]);
        } else {
            await this.db`
      DELETE FROM attachments 
      WHERE order_id = ${orderId} 
      AND field_name = ${fieldName}
    `;
        }
    }

    async addNewAttachments(orderId: number, newAttachments: string[], fieldName: 'order_attachments' | 'vector_attachments') {
        if (!newAttachments.length) return;
        const rows = await this.db`
        WITH data AS (
          SELECT jsonb_array_elements(${JSON.stringify(newAttachments)}::jsonb) AS j
        ),
        ins AS (
          INSERT INTO attachments (
            order_id, url, public_id, resource_type, format, bytes, original_filename, field_name
          )
          SELECT
            ${orderId},
            j->>'url',
            j->>'publicId',
            j->>'resourceType',
            NULLIF(j->>'format','')::text,
            NULLIF(j->>'bytes','')::bigint,
            NULLIF(j->>'originalFilename','')::text,
            ${fieldName}
          FROM data
          RETURNING 1
        )
        SELECT 1;
      `;
        return rows;
    }
}

export default new AttachmentsRepository();