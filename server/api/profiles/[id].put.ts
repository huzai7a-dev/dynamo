import userService from "~~/server/services/user.service";
import { ROLE } from "~~/shared/constants";

export default eventHandler(async (event) => {
	try {
		const ctxUser = event.context.user || {};
		const requesterRole = ctxUser.role;
		const requesterId = ctxUser.id;

		const paramId = (event.context.params && event.context.params.id) as string;
		if (!paramId) {
			throw createError({ statusCode: 400, message: "Missing id parameter" });
		}

		// Authorization: owner or admin
		// if (requesterRole !== ROLE.Admin && String(requesterId) !== String(paramId)) {
		// 	throw createError({ statusCode: 401, message: "Unauthorized" });
		// }

		const body = await readBody(event);
		if (!body || typeof body !== "object") {
			throw createError({ statusCode: 400, message: "Invalid request body" });
		}

		// Whitelist allowed fields
		const allowed = new Set([
			"user_name",
			"company_name",
			"contact_name",
			"country",
			"phone_number",
			"primary_email",
			"address",
			"cell_number",
			"city",
			"fax_number",
			"invoice_email",
			"reference",
			"sales_man",
			"secondary_email",
			"state",
			"website",
			"zip_code",
		]);

		const payload: Record<string, any> = {};
		for (const key of Object.keys(body)) {
			if (allowed.has(key)) {
				payload[key] = body[key];
			} else {
				// ignore unknown fields, but you may also choose to return an error
			}
		}

		// Basic email validations if provided
		const emailFields = ["primary_email", "invoice_email", "secondary_email"];
		for (const f of emailFields) {
			if (payload[f] && !/^\S+@\S+\.\S+$/.test(payload[f])) {
				throw createError({ statusCode: 400, message: `Invalid ${f} format` });
			}
		}

		const updated = await userService.updateUserProfile(paramId, payload);

		if (!updated) {
			throw createError({ statusCode: 404, message: "User not found" });
		}

		return {
			message: "Profile updated successfully",
			data: updated,
		};
	} catch (err: any) {
		// log full error server-side for debugging
		console.error("profiles/:id PUT error:", err);

		// if it's a createError thrown earlier, pass through status/message
		const statusCode = err?.statusCode ?? err?.status ?? 500;
		const message = err?.message ?? "Server Error";

		return createError({
			statusCode,
			message,
		});
	}
});
