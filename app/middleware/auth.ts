export default defineNuxtRouteMiddleware((from, to) => {
  const { loggedIn } = useUserSession()

  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})