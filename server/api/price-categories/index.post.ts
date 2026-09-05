import { PriceCategorySchema } from "~~/shared/validationSchema";
import priceCategoryService from "~~/server/services/price-category.service";
import { ROLE } from "~~/shared/constants";

export default defineEventHandler(async (event) => {
  const { role } = event.context.user;
  if (role !== ROLE.Admin) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const body = await readBody(event);
  const { userId } = body || {};

  if (!userId) {
    return createError({
      statusCode: 400,
      message: "Missing userId",
    });
  }

  const payload = PriceCategorySchema.parse(body);

  try {
    const priceCategory = await priceCategoryService.upsert(userId, payload);
    return {
      message: "Price category saved successfully",
      data: priceCategory,
    };
  } catch (error) {
    useLogger().error("Failed to save price category:", error);
    return createError({
      statusCode: 400,
      data: JSON.stringify(error),
    });
  }
});
