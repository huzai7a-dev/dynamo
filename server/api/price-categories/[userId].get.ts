import priceCategoryService from "~~/server/services/price-category.service";
import { ROLE } from "~~/shared/constants";

export default defineEventHandler(async (event) => {
  const { role } = event.context.user;
  if (role !== ROLE.Admin) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const userId = event.context.params?.userId as string;
  if (!userId) {
    return createError({
      statusCode: 400,
      message: "Missing userId parameter",
    });
  }

  try {
    const priceCategory = await priceCategoryService.getByUserId(userId);
    return {
      message: "Price category retrieved successfully",
      data: priceCategory,
    };
  } catch (error) {
    useLogger().error("Failed to fetch price category:", error);
    return createError({
      statusCode: 400,
      data: JSON.stringify(error),
    });
  }
});
