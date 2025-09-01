import {
  type OrderFieldsRequest,
  type OrderFilesRequest,
  type QueryParams,
} from "#shared/types";
import { OrderStatus } from "#shared/types/enums";

import uploadService, { type UploadedAsset } from "./upload.service";

class OrderService {
  db: any;
  constructor() {
    this.db = useDb();
  }

  async createOrder(
    userId: string,
    fields: OrderFieldsRequest,
    files: OrderFilesRequest
  ) {
    const attachmentsInput = (files || []).filter(
      (f: any) => f.fieldName === "attachments" || f.fieldName == null
    );

    let uploaded: UploadedAsset[] = [];
    if (attachmentsInput.length) {
      uploaded = await uploadService.uploadBuffers(attachmentsInput, {
        folder: "orders",
        tags: ["order"],
      });
    }

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
        width_in, height_in, fabric, placement,
        num_colors, blending, rush, instructions, 
        faceless, user_id
      )
      VALUES (
        ${fields.orderName},
        ${fields?.poNumber || null},
        ${fields.requiredFormat},
        ${widthNum},
        ${heightNum},
        ${fields.fabric},
        ${fields.placement},
        ${colorsInt},
        ${fields.blending},   -- enum
        ${fields.rush},       -- enum
        ${fields?.instructions || null},
        ${fields?.faceless || null},
        ${userId}

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

    const orderId = rows[0]?.order_id as number;
    return { orderId };
  }

  async getOrders(orderParams: QueryParams, isAdmin = false) {
    const {
      user_id,
      limit = 10,
      page = 1,
      order_number,
      order_name,
      customer_name,
      date_from,
      date_to,
    } = orderParams;
  
    const values: any[] = [];
    let i = 1; // next $ placeholder index
  
    // Build WHERE conditions
    const whereConditions: string[] = [];
  
    // Only non-admins are restricted to their own orders
    if (!isAdmin) {
      whereConditions.push(`o.user_id = $${i++}`);
      values.push(user_id);
    }
  
    if (order_number) {
      whereConditions.push(`o.id = $${i++}`);
      values.push(order_number);
    }

    if (customer_name) {
      whereConditions.push(`u.contact_name ILIKE $${i++}`);
      values.push(`%${customer_name}%`);
    }
  
    if (order_name) {
      whereConditions.push(`o.order_name ILIKE $${i++}`);
      values.push(`%${order_name}%`);
    }
  
    if (date_from && date_to) {
      whereConditions.push(`o.created_at >= $${i++}::date`);
      whereConditions.push(`o.created_at < ($${i++}::date + interval '1 day')`);
      values.push(date_from, date_to);
    }
  
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
  
    // Count query
    const countQuery = `SELECT COUNT(*) FROM orders o ${whereClause}`;
    const countRows = await this.db.query(countQuery, values);
    const totalRecords = Number(countRows[0].count) || 0;
    const totalPage = Math.max(1, Math.ceil(totalRecords / limit));
  
    // Data query - Include JOIN with users table when admin is true
    const selectFields = isAdmin 
      ? `o.id,
         o.order_name,
         o.price,
         o.status,
         o.payment_status,
         o.created_at,
         u.contact_name as customer_name`
      : `o.id,
         o.order_name,
         o.price,
         o.status,
         o.payment_status,
         o.created_at`;
    
    const joinClause = isAdmin ? 'LEFT JOIN users u ON o.user_id = u.id' : '';
    
    const dataQuery = [
      `SELECT ${selectFields}`,
      `FROM orders o`,
      joinClause,
      whereClause,
      `ORDER BY o.created_at DESC`,
      `LIMIT $${i++}`,
      `OFFSET $${i++}`,
    ].filter(Boolean).join(' ');
  
    const dataValues = [...values, limit, (page - 1) * limit];
    const orders = await this.db.query(dataQuery, dataValues);
  
    return {
      orders,
      pagination: {
        totalPage,
        currentPage: page,
      },
    };
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
    return order[0];
  }

  async updateOrderStatus(isAdmin: boolean, orderId: number, status: OrderStatus) {
    const AdminActions = [OrderStatus.IN_PROGRESS, OrderStatus.DELIVERED, OrderStatus.REJECTED]
    const UserActions = [OrderStatus.CANCELLED]

    if (isAdmin && !AdminActions.includes(status)) {
      throw new Error("Admin can only update status to in_progress, delivered, or rejected");
    }

    if (!isAdmin && !UserActions.includes(status)) {
      throw new Error("User can only update status to cancelled");
    }

    const order = await this.db`UPDATE orders SET status = ${status} WHERE id = ${orderId} RETURNING *`;
    return order[0];
  }

  // ... existing code ...

  async updateOrder(
    userId: string,
    orderId: number,
    fields: OrderFieldsRequest,
    files: OrderFilesRequest,
    existingAttachments: string[]
  ) {
    console.log("Updating order:", { orderId, userId, existingAttachments });
    
    // Check if user owns this order or is admin
    const order = await this.db`
      SELECT user_id FROM orders WHERE id = ${orderId}
    `;
    
    if (!order[0] || order[0].user_id !== parseInt(userId)) {
      throw new Error("Order not found or access denied");
    }

    const attachmentsInput = (files || []).filter(
      (f: any) => f.fieldName === "attachments" || f.fieldName == null
    );

    let uploaded: UploadedAsset[] = [];
    if (attachmentsInput.length) {
      uploaded = await uploadService.uploadBuffers(attachmentsInput, {
        folder: "orders",
        tags: ["order"],
      });
    }

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

    // Update order fields
    await this.db`
      UPDATE orders SET
        order_name = ${fields.orderName},
        po_number = ${fields?.poNumber || null},
        required_format = ${fields.requiredFormat},
        width_in = ${widthNum},
        height_in = ${heightNum},
        fabric = ${fields.fabric},
        placement = ${fields.placement},
        num_colors = ${colorsInt},
        blending = ${fields.blending},
        rush = ${fields.rush},
        instructions = ${fields?.instructions || null},
        faceless = ${fields?.faceless || null},
        updated_at = NOW()
      WHERE id = ${orderId}
    `;

    // Remove old attachments that are not in existingAttachments
    if (existingAttachments.length > 0) {
      // Use a more explicit approach for the NOT IN clause
      const placeholders = existingAttachments.map((_, index) => `$${index + 2}`).join(', ');
      const query = `
        DELETE FROM attachments 
        WHERE order_id = $1 
        AND field_name = 'order_attachments'
        AND url NOT IN (${placeholders})
      `;
      await this.db.query(query, [orderId, ...existingAttachments]);
    } else {
      // If no existing attachments to keep, delete all order attachments
      await this.db`
        DELETE FROM attachments 
        WHERE order_id = ${orderId} 
        AND field_name = 'order_attachments'
      `;
    }

    // Add new attachments
    if (uploaded.length > 0) {
      const rows = await this.db`
        WITH data AS (
          SELECT jsonb_array_elements(${JSON.stringify(uploaded)}::jsonb) AS j
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
            'order_attachments'
          FROM data
          RETURNING 1
        )
        SELECT 1;
      `;
    }

    return { orderId };
  }

  async deliverOrder(fields: any, files: any) {
    const { orderId, estimateAmount, notes } = fields;
  
    const attachmentsInput = (files || []).filter(
      (f: any) => f.fieldName === "attachments" || f.fieldName == null
    );
  
    let uploaded: UploadedAsset[] = [];
    if (attachmentsInput.length) {
      uploaded = await uploadService.uploadBuffers(attachmentsInput, {
        folder: "deliveries",
        tags: ["delivery"],
      });
    }
  
    const rows = await this.db`
      WITH order_update AS (
        UPDATE orders 
        SET status = ${OrderStatus.DELIVERED},
            price = ${estimateAmount}
        WHERE id = ${orderId}
        RETURNING id
      ),
      data AS (
        SELECT jsonb_array_elements(${JSON.stringify(uploaded)}::jsonb) AS j
      ),
      attachments_insert AS (
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
          'delivery_attachments'
        FROM data
        RETURNING 1
      )
      SELECT 
        (SELECT id FROM order_update) AS order_id;
    `;
  
    const result = rows[0];
    return { 
      orderId: result?.order_id 
    };
  }
  
}

export default new OrderService();
