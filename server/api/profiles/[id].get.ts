import userService from "~~/server/services/user.service";
import { ROLE } from "~~/shared/constants";

export default eventHandler(async (event) => {
	try {
		const id = event.context.params?.id as string;
		if (!id) {
			return createError({
				statusCode: 400,
				message: 'Missing id parameter'
			});
		}

		const user = await userService.getUserById(id);

		if (!user) {
			return createError({
				statusCode: 404,
				message: 'User not found'
			});
		}

		return {
			message: 'User fetched successfully',
			data: user
		};

	} catch (error) {
		console.log(error, 'error');
		return createError({
			statusCode: 400,
			message: 'Server Error'
		});
	}
});
