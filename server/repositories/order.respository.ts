import type { QuoteFieldsRequest, QueryParams } from "~~/shared/types";
import type { UploadedAsset } from "../services/upload.service";

class OrderRepository {
  private db: ReturnType<typeof useDb>;
  constructor() {
    this.db = useDb();
  }


  async getTotalPageCount(whereClause: string, values: any[], limit: number) {
    const countQuery = `SELECT COUNT(*) FROM orders o ${whereClause}`;
    const countRows = await this.db.query(countQuery, values);
    const totalRecords = Number((countRows as any[])[0].count) || 0;
    const totalPage = Math.max(1, Math.ceil(totalRecords / limit));
    return totalPage;
  }

  async getOrdersWithFilters(
    whereConditions: string[],
    values: any[],
    isAdmin: boolean,
    limit: number,
    offset: number
  ) {
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Data query - Include JOIN with users table when admin is true
    const selectFields = isAdmin
      ? `o.*, u.contact_name as customer_name, u.primary_email as customer_email`
      : `o.*`;

    const joinClause = isAdmin ? 'LEFT JOIN users u ON o.user_id = u.id' : '';

    const dataQuery = [
      `SELECT ${selectFields}`,
      `FROM orders o`,
      joinClause,
      whereClause,
      `ORDER BY o.created_at DESC`,
      `LIMIT $${values.length + 1}`,
      `OFFSET $${values.length + 2}`,
    ].filter(Boolean).join(' ');

    const dataValues = [...values, limit, offset];
    const orders = await this.db.query(dataQuery, dataValues);
    return orders;
  }

  async getOrderDetails(isAdmin: boolean, orderId: number, userId: number) {
    const order = await this.db`
      SELECT
        o.*,
        COALESCE(att.attachments, '[]'::jsonb) AS order_attachments,
        COALESCE(del_att.delivery_attachments, '[]'::jsonb) AS delivery_attachments
      FROM orders AS o
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
        FROM attachments AS a
        WHERE a.order_id = o.id AND a.field_name = 'order_attachments'
      ) AS att ON TRUE
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(
                 jsonb_build_object(
                   'url', a.url,
                   'resource_type', a.resource_type,
                   'format', a.format,
                   'bytes', a.bytes
                 )
                 ORDER BY a.created_at
               ) AS delivery_attachments
        FROM attachments AS a
        WHERE a.order_id = o.id AND a.field_name = 'delivery_attachments'
      ) AS del_att ON TRUE
      WHERE o.id = ${orderId}
      ${!isAdmin ? this.db`AND o.user_id = ${userId}` : this.db``}
    `;
    return (order as any[])[0];
  }

  async createOrder(userId: string, fields: QuoteFieldsRequest, uploaded: UploadedAsset[], metadata?: Object) {
    const widthNum =
      fields.width != null && fields.width !== "" ? Number(fields.width) : null;
    const heightNum =
      fields.height != null && fields.height !== ""
        ? Number(fields.height)
        : null;
    const colorsInt =
      fields.numColors != null && fields.numColors !== ""
        ? Number(fields.numColors)
        : null;

    const rows = await this.db`
        WITH new_order AS (
          INSERT INTO orders (
            order_name, po_number, required_format,
            width_in, height_in, required_stitch, fabric, placement,
            num_colors, blending, rush, instructions, 
            faceless, user_id, metadata
          )
          VALUES (
            ${fields.orderName},
            ${fields?.poNumber || null},
            ${fields.requiredFormat},
            ${widthNum},
            ${heightNum},
            ${fields.requiredStitch},
            ${fields.fabric},
            ${fields.placement},
            ${colorsInt},
            ${fields.blending},   -- enum
            ${fields.rush},       -- enum
            ${fields?.instructions || null},
            ${fields?.faceless || null},
            ${userId},
            ${metadata}
          )
          RETURNING id
        ),
        data AS (
          SELECT jsonb_array_elements(${JSON.stringify(uploaded)}::jsonb) AS j
        ),
        ins AS (
          INSERT INTO attachments (
            order_id, url, public_id, resource_type, format, bytes, original_filename, field_name
          )
          SELECT
            (SELECT id FROM new_order),
            j->>'url',
            j->>'publicId',
            j->>'resourceType',
            NULLIF(j->>'format','')::text,
            NULLIF(j->>'bytes','')::bigint,
            NULLIF(j->>'originalFilename','')::text,
            'order_attachments'
          FROM data
          RETURNING 1
        )
        SELECT id AS order_id FROM new_order;
      `;

    const orderId = (rows as any[])[0]?.order_id as number;
    return { orderId };
  }

  async updateOrderStatus(orderId: number, status: OrderStatus | QuoteStatus) {
    await this.db`UPDATE orders SET status = ${status} WHERE id = ${orderId}`;
  }

  // async moveToOrder(quoteId: number, fields?: { price: number, additionalNotes: string }) {

  //   if (fields?.price) {
  //     await this.db`UPDATE orders set price = ${fields.price} WHERE id = ${quoteId}`;
  //   }

  //   await this.db`
  //     UPDATE orders 
  //     SET 
  //       status = ${OrderStatus.IN_PROGRESS},
  //       metadata = COALESCE(metadata, '{}'::jsonb) || ${JSON.stringify({
  //     type: DataSource.ORDER,
  //     convertFromQuote: true,
  //     ...(fields?.additionalNotes && { additionalNotes: fields.additionalNotes })
  //   })}::jsonb
  //     WHERE id = ${quoteId}
  //   `;

  //   return
  // }
}

export default new OrderRepository();