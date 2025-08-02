import AuthService from "~~/server/services/auth.service";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    
    const result = AuthService.register(body);

    return result;
});