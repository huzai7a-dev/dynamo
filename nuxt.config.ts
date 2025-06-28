// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-lucide-icons', 'nuxt-aos'],
  vite: {
    server: {
      allowedHosts: ['8326-39-35-210-25.ngrok-free.app']
    }
  },
})