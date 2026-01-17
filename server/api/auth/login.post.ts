import authService from "~~/server/services/auth.service";
import { LoginSchema } from "~~/shared/validationSchema";

export default defineEventHandler(async (event) => {
  const { emailOrUsername, password } = await readValidatedBody(event, (body) =>
    LoginSchema.parse(body)
  );

  const user = await authService.login({ emailOrUsername, password });

  await setUserSession(event, {user});

  return {}
});

