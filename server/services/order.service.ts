import type { OrderFieldsRequest, OrderFilesRequest } from "../../shared/types";
import uploadService, { type UploadedAsset } from "./upload.service";

class OrderService {
  db: any;
  constructor() {
    this.db = useDb();
  }

  async createOrder(fields: OrderFieldsRequest, files: OrderFilesRequest) {
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
        num_colors, blending, rush, instructions
      )
      VALUES (
        ${fields.orderName},
        ${fields.poNumber ?? null},
        ${fields.requiredFormat},
        ${widthNum},
        ${heightNum},
        ${fields.fabric},
        ${fields.placement},
        ${colorsInt},
        ${fields.blending},   -- enum
        ${fields.rush},       -- enum
        ${fields.instructions ?? null}
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
}

export default new OrderService();
