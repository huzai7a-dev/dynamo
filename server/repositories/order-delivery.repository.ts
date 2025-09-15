import type { UploadedAsset } from "../services/upload.service";

export interface OrderDeliveryData {
  order_id: number;
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

class OrderDeliveryRepository {
  private db: ReturnType<typeof useDb>;
  
  constructor() {
    this.db = useDb();
  }

  async createDelivery(deliveryData: OrderDeliveryData, attachments: UploadedAsset[] = []) {
    const rows = await this.db`
      WITH new_delivery AS (
        INSERT INTO order_deliveries (
          order_id, stitches, price, discount, 
          total_price, is_free, height, width, comments, designer_level, 
          assign_percentage, price_criteria, customer_requirement
        )
        VALUES (
          ${deliveryData.order_id},
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
        INSERT INTO attachments (
          order_id, url, public_id, resource_type, format, bytes, original_filename, field_name
        )
        SELECT
          ${deliveryData.order_id},
          j->>'url',
          j->>'publicId',
          j->>'resourceType',
          NULLIF(j->>'format','')::text,
          NULLIF(j->>'bytes','')::bigint,
          NULLIF(j->>'originalFilename','')::text,
          'delivery_attachments'
        FROM data
        RETURNING 1
      )
      SELECT id AS delivery_id FROM new_delivery;
    `;

    const deliveryId = (rows as any[])[0]?.delivery_id as number;
    return { deliveryId };
  }

  async getDeliveryByOrderId(orderId: number) {
    const delivery = await this.db`
      SELECT 
        od.*,
        COALESCE(att.attachments, '[]'::jsonb) AS delivery_attachments
      FROM order_deliveries od
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
        FROM attachments AS a
        WHERE a.order_id = od.order_id AND a.field_name = 'delivery_attachments'
      ) AS att ON TRUE
      WHERE od.order_id = ${orderId}
      ORDER BY od.created_at DESC
    `;
    return (delivery as any[])[0];
  }

  async getDeliveryById(deliveryId: number) {
    const delivery = await this.db`
      SELECT 
        od.*,
        COALESCE(att.attachments, '[]'::jsonb) AS delivery_attachments
      FROM order_deliveries od
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
        FROM attachments AS a
        WHERE a.order_id = od.order_id AND a.field_name = 'delivery_attachments'
      ) AS att ON TRUE
      WHERE od.id = ${deliveryId}
    `;
    return (delivery as any[])[0];
  }

  async updateDelivery(deliveryId: number, deliveryData: Partial<OrderDeliveryData>) {
    const updateFields: string[] = [];
    const values = [];
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

export default new OrderDeliveryRepository();
