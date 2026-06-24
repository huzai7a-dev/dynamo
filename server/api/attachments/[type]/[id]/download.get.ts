import attachmentsService from "~~/server/services/attachments.service";
import { ROLE } from "~~/shared/constants";
import { DataSource } from "~~/shared/types/enums";

const ALLOWED_TYPES: string[] = [DataSource.ORDER, DataSource.VECTOR, DataSource.QUOTE];

const filaNamePrefix = {
  [DataSource.ORDER]: "OR",
  [DataSource.VECTOR]: "VR",
  [DataSource.QUOTE]: "QR",
}
export default defineEventHandler(async (event) => {
  const type = getRouterParam(event, "type") as DataSource;
  const id = Number(getRouterParam(event, "id"));

  if (!ALLOWED_TYPES.includes(type)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid entity type" });
  }
  if (!id || Number.isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid id" });
  }

  const { role, id: userId } = event.context.user;
  const isAdmin = role === ROLE.Admin;

  const files = await attachmentsService.getDeliveryFiles(type, id, isAdmin, Number(userId));
  const archive = await attachmentsService.streamZip(files);

  setResponseHeader(event, "Content-Type", "application/zip");
  setResponseHeader(event, "Content-Disposition", `attachment; filename="${filaNamePrefix[type as keyof typeof filaNamePrefix]}-${id}-files.zip"`);

  return sendStream(event, archive);
});
