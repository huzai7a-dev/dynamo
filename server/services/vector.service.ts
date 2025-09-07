import type { QueryParams, VectorFieldsRequest, VectorFilesRequest } from "~~/shared/types";
import uploadService, { type UploadedAsset } from "./upload.service";
import VectorRepository from "../repositories/vector.repository";
import AttachmentsRepository from "../repositories/attachments.repository";

class VectorService {

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

    // Get total page count and vectors data from repository
    const [totalPage, vectors] = await Promise.all([
      VectorRepository.getTotalPageCount(
        whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '',
        values,
        limit
      ),
      VectorRepository.getVectorsWithFilters(
        whereConditions,
        values,
        isAdmin,
        limit,
        (page - 1) * limit
      )
    ]);

    return {
      vectors,
      pagination: {
        totalPage,
        currentPage: page,
      },
    };
  }

  async getVectorDetails(id: number, isAdmin: boolean, userId: number) {
    const vector = await VectorRepository.getVectorDetails(id, isAdmin, userId);
    return vector;
  }

  async updateVectorStatus(isAdmin: boolean, vectorId: number, status: OrderStatus) {
    const AdminActions = [OrderStatus.IN_PROGRESS, OrderStatus.DELIVERED, OrderStatus.REJECTED]
    const UserActions = [OrderStatus.CANCELLED]

    if (isAdmin && !AdminActions.includes(status)) {
      throw new Error("Admin can only update the status to IN_PROGRESS, DELIVERED, or REJECTED")
    }

    if (!isAdmin && !UserActions.includes(status)) {
      throw new Error("User can only update the status to CANCELLED")
    }

    const vector = await VectorRepository.updateVectorStatus(vectorId, status)
    return vector
  }

  async updateVector(userId: string, vectorId: number, fields: VectorFieldsRequest, files: VectorFilesRequest, existingAttachments: string[]) {
    const vector = await VectorRepository.findById(vectorId);
    const isUserVector = vector.user_id !== userId
    
    if (!vector || isUserVector) {
      throw new Error("Vector not found or access denied");
    }
  
    const updatedVector = await VectorRepository.updateVectorFields(vectorId, fields, files, existingAttachments);
    await AttachmentsRepository.updateExistingAttachments(vectorId, existingAttachments, 'vector_attachments');
    await AttachmentsRepository.addNewAttachments(vectorId, files, 'vector_attachments');
    return updatedVector;
  }
}

export default new VectorService();