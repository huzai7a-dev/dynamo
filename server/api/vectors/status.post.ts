import vectorService from "~~/server/services/vector.service";
import { ROLE } from "~~/shared/constants";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { role } = event.context.user;

  const { vectorId, status } = body;
  const isAdmin = role === ROLE.Admin;

  try {
    const vector = await vectorService.updateVectorStatus(isAdmin, vectorId, status);

    return {
      message: "Vector status updated successfully",
      data: vector,
    };
  } catch (error) {
    console.log(error);
    return createError({
      statusCode: 400,
      data: JSON.stringify(error),
    });
  }
});