import userService from "~~/server/services/user.service";
import { ROLE } from "~~/shared/constants";

export default eventHandler(async (event) => {
    try {
        const { role, } = event.context.user;
        const isAdmin = role === ROLE.Admin

        if (!isAdmin) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized',
            })
        }

        const query = getQuery(event);
        const filters = {
            id: query.id as string,
            user_name: query.user_name as string,
            email: query.email as string,
            company: query.company as string
        };

        const users = await userService.getAllUsers(filters);

        return {
            message: 'Users fetched successfully',
            data: users
        }

    } catch (error) {
        console.log(error, 'error')
        return createError({
            statusCode: 400,
            message: 'Server Error'
        })
    }
})