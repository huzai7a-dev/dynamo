import AuthService from "~~/server/services/auth.service";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const ip = getRequestIP(event, { xForwardedFor: true }) ?? "Unknown";

    const result = await AuthService.register(body, ip);

    return result;
});