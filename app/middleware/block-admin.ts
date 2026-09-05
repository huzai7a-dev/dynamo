import { ROLE } from "~~/shared/constants";

export default defineNuxtRouteMiddleware(() => {
  const { user } = useUserSession();

  if ((user.value as any)?.role === ROLE.Admin) {
    return navigateTo("/dashboard");
  }
});
