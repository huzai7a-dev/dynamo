import { ROLE } from "~~/shared/constants";
import DashboardService from "~~/server/services/dashboard.service";

export default defineEventHandler(async (event) => {
    const { id: userId, role } = event.context.user;
    const isAdmin = role === ROLE.Admin;
  if (!userId) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const stats = await DashboardService.getStats(userId, isAdmin);
  return stats

});