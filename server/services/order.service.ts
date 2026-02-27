import {
  type OrderFieldsRequest,
  type OrderFilesRequest,
  type QueryParams,
} from "#shared/types";
import { OrderStatus } from "#shared/types/enums";
import OrderRepository from "../repositories/order.respository";
import OrderDeliveryRepository, { type OrderDeliveryData } from "../repositories/order-delivery.repository";
import uploadService, { type UploadedAsset } from "./upload.service";
import EmailService from "./email.service";
import UserService from "./user.service";
import { generateOrderConfirmationEmail } from "../templates/order-confirmation.email";
import { generateOrderDeliveryEmail } from "../templates/order-delivery.email";

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

    const result = await OrderRepository.createOrder(userId, fields, uploaded, { type: DataSource.ORDER });

    // Fire order confirmation email — non-blocking
    this.sendOrderConfirmationEmail(userId, result.orderId, fields, uploaded);

    return result;
  }

  private async sendOrderConfirmationEmail(
    userId: string,
    orderId: number,
    fields: OrderFieldsRequest,
    uploaded: UploadedAsset[]
  ) {
    try {
      const user = await UserService.getUserById(userId);
      if (!user?.primary_email) return;
      const subject = `Your Order Has Been Received ${fields.orderName} - #${orderId}`;
      const html = generateOrderConfirmationEmail({ orderId, fields, uploaded, user });
      await Promise.all([
        EmailService.sendHtmlEmail(user.primary_email, subject, html),
        EmailService.sendHtmlEmail(useRuntimeConfig().emailUser as string, subject, html),
      ]);
    } catch (err) {
      console.error('Order confirmation email failed:', err);
    }
  }

  async getOrders(orderParams: QueryParams, isAdmin = false, dataSourceType?: DataSource) {
    const {
      user_id,
      limit = 10,
      page = 1,
      order_number,
      order_name,
      customer_name,
      date_from,
      date_to,
      status,
      is_free,
      is_paid,
      converted,
    } = orderParams;

    const values: any[] = [];
    let i = 1; // next $ placeholder index

    const whereConditions: string[] = [];
    // if (dataSourceType === DataSource.ALL) {
    //   whereConditions.push(`o.metadata->>'type' IN ($${i++}, $${i++})`);
    //   values.push(DataSource.ORDER, DataSource.VECTOR);
    // } else {
    //   whereConditions.push(`o.metadata->>'type' = $${i++}`);
    //   values.push(dataSourceType || DataSource.ORDER);
    // }
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

    if (status) {
      whereConditions.push(`o.status = $${i++}`);
      values.push(status);
    }

    if (is_free) {
      whereConditions.push(`o.price = $${i++}`);
      values.push(0);
    }

    if (is_paid) {
      whereConditions.push(`o.price > $${i++}`);
      values.push(0);
    }

    if (converted) {
      whereConditions.push(`o.is_from_quote = $${i++}`);
      values.push(true);
    }
    // Get total page count and quotes data from repository
    const [totalPage, orders] = await Promise.all([
      OrderRepository.getTotalPageCount(
        whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '',
        values,
        limit
      ),
      OrderRepository.getOrdersWithFilters(
        whereConditions,
        values,
        isAdmin,
        limit,
        (page - 1) * limit
      )
    ]);

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
        COALESCE(att.attachments, '[]'::jsonb) AS order_attachments
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
    const {
      orderId,
      stitches,
      price,
      discount,
      total_price,
      order_category,
      height,
      width,
      comments,
      designer_level,
      assign_percentage,
      minimum_price,
      maximum_price,
      thousand_stitches,
      normal_delivery,
      edit_or_change,
      edit_in_stitch_file,
    } = fields;

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

    // Prepare delivery data
    const deliveryData: OrderDeliveryData = {
      order_id: parseInt(orderId),
      stitches: stitches ? parseInt(stitches) : undefined,
      price: price ? parseFloat(price) : undefined,
      discount: discount ? parseFloat(discount) : undefined,
      total_price: total_price ? parseFloat(total_price) : undefined,
      is_free: order_category === 'free',
      height: height ? parseFloat(height) : undefined,
      width: width ? parseFloat(width) : undefined,
      comments: comments || undefined,
      designer_level: designer_level || undefined,
      assign_percentage: assign_percentage ? parseFloat(assign_percentage) : undefined,
      price_criteria: {
        minimum_price: minimum_price ? parseFloat(minimum_price) : undefined,
        maximum_price: maximum_price ? parseFloat(maximum_price) : undefined,
        thousand_stitches: thousand_stitches ? parseFloat(thousand_stitches) : undefined,
      },
      customer_requirement: {
        normal_delivery: normal_delivery || undefined,
        edit_or_change: edit_or_change || undefined,
        edit_in_stitch_file: edit_in_stitch_file || undefined,
      }
    };

    // Create delivery record
    const { deliveryId } = await OrderDeliveryRepository.createDelivery(deliveryData, uploaded);

    // Update order status to delivered
    await OrderRepository.updateOrderStatus(parseInt(orderId), OrderStatus.DELIVERED);

    // Fire delivery notification emails — non-blocking
    this.sendDeliveryEmail(parseInt(orderId), deliveryData, uploaded);

    return {
      deliveryId,
      orderId: parseInt(orderId)
    };
  }

  private async sendDeliveryEmail(
    orderId: number,
    delivery: Record<string, any>,
    deliveryAttachments: UploadedAsset[]
  ) {
    try {
      const order = await this.getOrderRow(orderId);
      if (!order) return;
      const user = await UserService.getUserById(String(order.user_id));
      if (!user?.primary_email) return;

      const subject = `Your Order is Ready ${order.order_name} - #${orderId}`;
      const html = generateOrderDeliveryEmail({
        orderId,
        orderName: order.order_name,
        user,
        order,
        delivery,
        deliveryAttachments,
      });

      await Promise.all([
        EmailService.sendHtmlEmail(user.primary_email, subject, html),
        EmailService.sendHtmlEmail(useRuntimeConfig().emailUser as string, subject, html),
      ]);
    } catch (err) {
      console.error('Delivery notification email failed:', err);
    }
  }

  private async getOrderRow(orderId: number) {
    const rows = await this.db`SELECT * FROM orders WHERE id = ${orderId} LIMIT 1`;
    return (rows as any[])[0] ?? null;
  }

  async getDeliveryDetails(orderId: number) {
    const delivery = await OrderDeliveryRepository.getDeliveryByOrderId(orderId);
    return delivery;
  }

}

export default new OrderService();
