import type { OrderFieldsRequest, OrderFilesRequest, OrderParams } from "#shared/types";
import uploadService, { type UploadedAsset } from "./upload.service";

class OrderService {
  db: any;
  constructor() {
    this.db = useDb();
  }

  async createOrder(userId:string, fields: OrderFieldsRequest, files: OrderFilesRequest) {
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

  async getOrders(orderParams:OrderParams) {

    console.log(orderParams, 'orderParams')
    const { user_id, limit = 10, page = 1, order_number, order_name, date_from, date_to } = orderParams

    const queryParts = [
      'SELECT * FROM orders WHERE user_id = $1', // Base query part
    ];
    
    const values = [user_id]; // Start with user_id
    
    let paramIndex = 2; // Start the parameter index for the next placeholders ($2, $3, etc.)
    
    // Dynamically add conditions to the query and values array based on provided filters
    if (order_number) {
      queryParts.push(`AND order_number = $${paramIndex}`);
      values.push(order_number);
      paramIndex++;
    }
    
    if (order_name) {
      queryParts.push(`AND order_name = $${paramIndex}`);
      values.push(order_name);
      paramIndex++;
    }
    
    if (date_from) {
      queryParts.push(`AND created_at >= $${paramIndex}`);
      values.push(date_from);
      paramIndex++;
    }
    
    if (date_to) {
      queryParts.push(`AND created_at <= $${paramIndex}`);
      values.push(date_to);
      paramIndex++;
    }
    
    // Add the ORDER BY, LIMIT, and OFFSET clauses
    queryParts.push('ORDER BY created_at DESC');
    queryParts.push(`LIMIT $${paramIndex}`);
    values.push(String(limit));
    paramIndex++;
    
    queryParts.push(`OFFSET $${paramIndex}`);
    values.push(String(limit * (page - 1)));
    
    // Join the query parts into a single query string
    const query = queryParts.join(' ');
    
    // Execute the query with the dynamically constructed parts and values
    const orders = await this.db.query(query, values);
    
    return {
      orders,
    }
  }
}

export default new OrderService();
