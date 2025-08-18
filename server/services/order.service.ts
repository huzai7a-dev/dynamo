import type {
  OrderFieldsRequest,
  OrderFilesRequest,
  OrderParams,
} from "#shared/types";
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
        'attachments'
      FROM data
      RETURNING 1
    )
    SELECT id AS order_id FROM new_order;
  `;

    const orderId = rows[0]?.order_id as number;
    return { orderId };
  }

  async getOrders(orderParams: OrderParams, isAdmin = false) {
    const {
      user_id,
      limit = 10,
      page = 1,
      order_number,
      order_name,
      date_from,
      date_to,
    } = orderParams;
  
    // Start with a neutral WHERE so we can append conditions uniformly
    const whereParts: string[] = ['FROM orders WHERE 1=1'];
    const values: any[] = [];
    let i = 1; // next $ placeholder index
  
    // Only non-admins are restricted to their own orders
    if (!isAdmin) {
      whereParts.push(`AND user_id = $${i++}`);
      values.push(user_id);
    }
  
    if (order_number) {
      whereParts.push(`AND id = $${i++}`);
      values.push(order_number);
    }
  
    if (order_name) {
      whereParts.push(`AND order_name ILIKE $${i++}`);
      values.push(`%${order_name}%`);
    }
  
    if (date_from) {
      whereParts.push(`AND created_at >= $${i++}`);
      values.push(date_from);
    }
  
    if (date_to) {
      whereParts.push(`AND created_at <= $${i++}`);
      values.push(date_to);
    }
  
    // Count
    const countQuery = `SELECT COUNT(*) ${whereParts.join(' ')}`;
    const countRows = await this.db.query(countQuery, values);
    const totalRecords = Number(countRows[0].count) || 0;
    const totalPage = Math.max(1, Math.ceil(totalRecords / limit));
  
    // Data
    const dataQuery = [
      `SELECT
         id,
         order_name,
         price,
         status,
         payment_status,
         created_at
       ${whereParts.join(' ')}`,
      `ORDER BY created_at DESC`,
      `LIMIT $${i++}`,
      `OFFSET $${i++}`,
    ].join(' ');
  
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
    COALESCE(att.attachments, '[]'::jsonb) AS attachments
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
    WHERE a.order_id = o.id
  ) AS att ON TRUE
  WHERE o.id = ${orderId}
  ${!isAdmin ? this.db`AND o.user_id = ${userId}` : this.db``}
`;
    return order[0];
  }
}

export default new OrderService();
