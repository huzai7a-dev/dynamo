import type { UploadedAsset } from "../services/upload.service";

export interface VectorDeliveryData {
  vector_id: number;
  stitches?: number;
  price?: number;
  discount?: number;
  total_price?: number;
  is_free: boolean;
  height?: number;
  width?: number;
  comments?: string;
  designer_level?: string;
  assign_percentage?: number;
  price_criteria?: any;
  customer_requirement?: any;
}

class VectorDeliveryRepository {
  private db: ReturnType<typeof useDb>;
  
  constructor() {
    this.db = useDb();
  }

  async createDelivery(deliveryData: VectorDeliveryData, attachments: UploadedAsset[] = []) {
    const rows = await this.db`
      WITH new_delivery AS (
        INSERT INTO vector_deliveries (
          vector_id, stitches, price, discount, 
          total_price, is_free, height, width, comments, designer_level, 
          assign_percentage, price_criteria, customer_requirement
        )
        VALUES (
          ${deliveryData.vector_id},
          ${deliveryData.stitches || null},
          ${deliveryData.price || null},
          ${deliveryData.discount || null},
          ${deliveryData.total_price || null},
          ${deliveryData.is_free},
          ${deliveryData.height || null},
          ${deliveryData.width || null},
          ${deliveryData.comments || null},
          ${deliveryData.designer_level || null},
          ${deliveryData.assign_percentage || null},
          ${deliveryData.price_criteria ? JSON.stringify(deliveryData.price_criteria) : null},
          ${deliveryData.customer_requirement ? JSON.stringify(deliveryData.customer_requirement) : null}
        )
        RETURNING id
      ),
      data AS (
        SELECT jsonb_array_elements(${JSON.stringify(attachments)}::jsonb) AS j
      ),
      ins AS (
        INSERT INTO vector_attachments (
          order_id, url, public_id, resource_type, format, bytes, original_filename, field_name
        )
        SELECT
          ${deliveryData.vector_id},
          j->>'url',
          j->>'publicId',
          j->>'resourceType',
          NULLIF(j->>'format','')::text,
          NULLIF(j->>'bytes','')::bigint,
          NULLIF(j->>'originalFilename','')::text,
          'vector_delivery_attachments'
        FROM data
        RETURNING 1
      )
      SELECT id AS delivery_id FROM new_delivery;
    `;

    const deliveryId = (rows as any[])[0]?.delivery_id as number;
    return { deliveryId };
  }

  async getDeliveryByVectorId(vectorId: number) {
    const delivery = await this.db`
      SELECT 
        vd.*,
        COALESCE(att.attachments, '[]'::jsonb) AS delivery_attachments
      FROM vector_deliveries vd
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(
                 jsonb_build_object(
                   'url', a.url,
                   'resource_type', a.resource_type,
                   'format', a.format,
                   'bytes', a.bytes,
                   'original_filename', a.original_filename
                 )
                 ORDER BY a.created_at
               ) AS attachments
        FROM vector_attachments AS a
        WHERE a.vector_id = vd.vector_id AND a.field_name = 'vector_delivery_attachments'
      ) AS att ON TRUE
      WHERE vd.vector_id = ${vectorId}
      ORDER BY vd.created_at DESC
    `;
    return (delivery as any[])[0];
  }


  async updateDelivery(deliveryId: number, deliveryData: Partial<VectorDeliveryData>) {
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // Build dynamic update query
    Object.entries(deliveryData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'price_criteria' || key === 'customer_requirement') {
          updateFields.push(`${key} = $${paramIndex}`);
          values.push(value ? JSON.stringify(value) : null);
        } else {
          updateFields.push(`${key} = $${paramIndex}`);
          values.push(value);
        }
        paramIndex++;
      }
    });

    if (updateFields.length === 0) {
      throw new Error('No fields to update');
    }

    const query = `
      UPDATE order_deliveries 
      SET ${updateFields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    values.push(deliveryId);

    const result = await this.db.query(query, values);
    return (result as any[])[0];
  }

  async deleteDelivery(deliveryId: number) {
    await this.db`
      DELETE FROM order_deliveries WHERE id = ${deliveryId}
    `;
    return { success: true };
  }
}

export default new VectorDeliveryRepository();
