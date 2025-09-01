import type { QueryParams, VectorFieldsRequest, VectorFilesRequest } from "~~/shared/types";
import uploadService, { type UploadedAsset } from "./upload.service";
import VectorRepository from "../repositories/vector.repository";

class VectorService {
  db: any;
  constructor() {
    this.db = useDb();
  }

  async createVector(userId: string, fields: VectorFieldsRequest, files: VectorFilesRequest) {
    const attachmentsInput = (files || []).filter(
      (f: any) => f.fieldName === "attachments" || f.fieldName == null
    );

    let uploaded: UploadedAsset[] = [];
    if (attachmentsInput.length) {
      uploaded = await uploadService.uploadBuffers(attachmentsInput, {
        folder: "vectors",
        tags: ["vector"],
      });
    }

    const row = await VectorRepository.createVector(userId, fields, uploaded);

    const vectorId = row.vectorId as number;
    return { vectorId };
  }

  async getVectors(isAdmin: boolean, queryParams: QueryParams) {
    const {
      user_id,
      limit = 10,
      page = 1,
      order_number,
      order_name,
      customer_name,
      date_from,
      date_to,
    } = queryParams;

    const values: any[] = [];
    let i = 1; // next $ placeholder index

    // Build WHERE conditions
    const whereConditions: string[] = [];

    // Only non-admins are restricted to their own orders
    if (!isAdmin) {
      whereConditions.push(`v.user_id = $${i++}`);
      values.push(user_id);
    }

    if (order_number) {
      whereConditions.push(`v.id = $${i++}`);
      values.push(order_number);
    }

    if (customer_name) {
      whereConditions.push(`u.contact_name ILIKE $${i++}`);
      values.push(`%${customer_name}%`);
    }

    if (order_name) {
      whereConditions.push(`v.vector_name ILIKE $${i++}`);
      values.push(`%${order_name}%`);
    }

    if (date_from && date_to) {
      whereConditions.push(`v.created_at >= $${i++}::date`);
      whereConditions.push(`v.created_at < ($${i++}::date + interval '1 day')`);
      values.push(date_from, date_to);
    }

    const totalPage = await VectorRepository.getTotalPageCount(
      whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '',
      values,
      limit
    );

    // Data query - Include JOIN with users table when admin is true
    const selectFields = isAdmin
      ? `v.id,
       v.vector_name,
       v.price,
       v.status,
       v.payment_status,
       v.created_at,
       u.contact_name as customer_name`
      : `v.id,
       v.vector_name,
       v.price,
       v.status,
       v.payment_status,
       v.created_at`;

    const joinClause = isAdmin ? 'LEFT JOIN users u ON v.user_id = u.id' : '';
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const dataQuery = [
      `SELECT ${selectFields}`,
      `FROM vectors v`,
      joinClause,
      whereClause,
      `ORDER BY v.created_at DESC`,
      `LIMIT $${i++}`,
      `OFFSET $${i++}`,
    ].filter(Boolean).join(' ');

    const dataValues = [...values, limit, (page - 1) * limit];
    const vectors = await this.db.query(dataQuery, dataValues);

    return {
      vectors,
      pagination: {
        totalPage,
        currentPage: page,
      },
    };
  }
}

export default new VectorService();