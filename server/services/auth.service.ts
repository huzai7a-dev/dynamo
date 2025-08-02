import { RegisterSchema } from '#shared/validationSchema'
import type { IUser } from "~~/shared/types";
import UserService from "./user.service";
import { LoginSchema } from "~~/shared/validationSchema";
import type { z } from 'zod';
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

        return {
            statusCode: 201,
            statusMessage: 'User created successfully',
            data: createdUser
        }
    }

    async login(user: z.infer<typeof LoginSchema>) {
        const userExist = await UserService.getUserByEmailOrUserName(user.emailOrUsername, user.emailOrUsername);

        if(!userExist) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Invalid credentials',
            });
        }

        const isPasswordValid = await verifyPassword(userExist.password, user.password);

        if(!isPasswordValid) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Invalid credentials',
            });
        }

        return {
            id: userExist.id,
            email: userExist.primary_email,
            userName: userExist.user_name,
            fullName: userExist.contact_name
        }
        
    }

}

export default new AuthService();