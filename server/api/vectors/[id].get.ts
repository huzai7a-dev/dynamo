import vectorService from "~~/server/services/vector.service";
import { ROLE } from "~~/shared/constants";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id") as string;
  const { role, id: userId } = event.context.user;
  const isAdmin = role === ROLE.Admin;
  const vector = await vectorService.getVectorDetails(Number(id), isAdmin, Number(userId));

  return {
    message: "Vector fetched successfully",
    data: vector,
  };
});