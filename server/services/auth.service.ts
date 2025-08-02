import { RegisterSchema } from '#shared/validationSchema'
import type { IUser } from "~~/shared/types";
import UserService from "./user.service";

class AuthService {
    private static validateUser(requestBody: IUser) {
        const { success, error, data } = RegisterSchema.safeParse(requestBody);

        const formattedErrors = error?.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
        }));

        return {
            success,
            error: formattedErrors,
            data
        }
    }

    async register(user: IUser){
        const { data, error,success } = AuthService.validateUser(user);

        if (!success) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Validation Error',
                data: error
            });
        }
    
        const userExist = await UserService.getUserByEmailOrUserName(data!.primary_email, data!.user_name);
    
        if(userExist) {
            throw createError({
                statusCode: 500,
                statusMessage: `User with ${userExist.primary_email === data!.primary_email ? 'email' : 'username'} already exist`,
            });
        }

        const encryptedPassword = await hashPassword(data!.password);

        const createdUser = await UserService.createUser({...data, password: encryptedPassword});

        //return response with 201 status code
        return {
            statusCode: 201,
            statusMessage: 'User created successfully',
            data: createdUser
        }
    }

}

export default new AuthService();