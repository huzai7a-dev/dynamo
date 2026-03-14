import type { QueryParams, VectorFieldsRequest, VectorFilesRequest } from "~~/shared/types";
import uploadService, { type UploadedAsset } from "./upload.service";
import VectorRepository from "../repositories/vector.repository";
import AttachmentsRepository from "../repositories/attachments.repository";
import VectorDeliveryRepository, { type VectorDeliveryData } from "../repositories/vector-delivery.repository";
import EmailService, { buildMailAttachments } from "./email.service";
import UserService from "./user.service";
import { generateVectorConfirmationEmail } from "../templates/vector-confirmation.email";
import { generateVectorDeliveryEmail } from "../templates/vector-delivery.email";

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

    const row = await VectorRepository.createVector(userId, fields, uploaded, { type: DataSource.VECTOR });

    const vectorId = row.vectorId as number;

    await this.sendVectorConfirmationEmail(userId, vectorId, fields, uploaded);

    return { vectorId };
  }

  private async sendVectorConfirmationEmail(
    userId: string,
    vectorId: number,
    fields: VectorFieldsRequest,
    uploaded: UploadedAsset[]
  ) {
    try {
      const user = await UserService.getUserById(userId);
      if (!user?.primary_email) return;
      const vectorName = `${fields.vectorName}-VR-${vectorId}`
      const subject = `Your Vector Has Been Created ${vectorName}`;
      const clientHTML = generateVectorConfirmationEmail({ vectorId, fields, uploaded, user, subject, isAdmin: false, vectorName });
      const adminHTML = generateVectorConfirmationEmail({ vectorId, fields, uploaded, user, subject, isAdmin: true, vectorName });
      const mailAttachments = buildMailAttachments(uploaded, "attachment", `VR-${vectorId}`);

      await Promise.all([
        EmailService.sendHtmlEmail(user.primary_email, subject, clientHTML, mailAttachments),
        EmailService.sendHtmlEmail(useRuntimeConfig().emailUser as string, vectorName, adminHTML, mailAttachments),
      ]);
    } catch (err) {
      console.error('Vector confirmation email failed:', err);
    }
  }

  async getVectors(isAdmin: boolean, queryParams: QueryParams, dataSourceType?: DataSource) {
    const {
      user_id,
      limit = 10,
      page = 1,
      order_number,
      order_name,
      customer_name,
      date_from,
      date_to,
      is_free,
      is_paid,
      status,
    } = queryParams;

    const values: any[] = [];
    let i = 1; // next $ placeholder index

    // Build WHERE conditions
    const whereConditions: string[] = [];

    // whereConditions.push(`v.metadata->>'type' = $${i++}`);
    // values.push(dataSourceType || DataSource.VECTOR);

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

    if (status) {
      whereConditions.push(`v.status = $${i++}`);
      values.push(status);
    }

    if (is_free) {
      whereConditions.push(`v.price = $${i++}`);
      values.push(0);
    }

    if (is_paid) {
      whereConditions.push(`v.price > $${i++}`);
      values.push(0);
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

    // Handle new file uploads
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

    const updatedVector = await VectorRepository.updateVectorFields(vectorId, fields, files, existingAttachments);
    await AttachmentsRepository.updateExistingVectorAttachments(vectorId, existingAttachments);
    await AttachmentsRepository.addNewVectorAttachments(vectorId, uploaded);
    return updatedVector;
  }

  async deliverVector(fields: any, files: any) {
    const {
      vectorId,
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
      comment_box_1,
      comment_box_2,
      comment_box_3,
      comment_box_4
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
    const deliveryData: VectorDeliveryData = {
      vector_id: parseInt(vectorId),
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
        comment_box_1: comment_box_1 || undefined,
        comment_box_2: comment_box_2 || undefined,
        comment_box_3: comment_box_3 || undefined,
        comment_box_4: comment_box_4 || undefined,
      }
    };

    // Create delivery record
    const { deliveryId } = await VectorDeliveryRepository.createDelivery(deliveryData, uploaded);
    await VectorRepository.updateVectorStatus(parseInt(vectorId), OrderStatus.DELIVERED);

    await this.sendVectorDeliveryEmail(parseInt(vectorId), deliveryData, uploaded);

    return {
      deliveryId,
      vectorId: parseInt(vectorId)
    };
  }

  private async sendVectorDeliveryEmail(
    vectorId: number,
    delivery: Record<string, any>,
    deliveryAttachments: UploadedAsset[]
  ) {
    try {
      const vectorRow = await VectorRepository.findById(vectorId);
      if (!vectorRow) return;
      const user = await UserService.getUserById(String(vectorRow.user_id));
      if (!user?.primary_email) return;

      const subject = `Your Vector is Ready ${vectorRow.vector_name} - #${vectorId}`;
      const html = generateVectorDeliveryEmail({
        vectorId,
        vectorName: vectorRow.vector_name,
        user,
        vector: vectorRow,
        delivery,
        deliveryAttachments,
      });

      const mailAttachments = buildMailAttachments(deliveryAttachments, "delivery-file", `VR-${vectorId}`);

      await Promise.all([
        EmailService.sendHtmlEmail(user.primary_email, subject, html, mailAttachments),
        EmailService.sendHtmlEmail(useRuntimeConfig().emailUser as string, subject, html, mailAttachments),
      ]);
    } catch (err) {
      console.error('Vector delivery email failed:', err);
    }
  }

  async getDeliveryDetails(vectorId: number) {
    const delivery = await VectorDeliveryRepository.getDeliveryByVectorId(vectorId);
    return delivery;
  }
}

export default new VectorService();