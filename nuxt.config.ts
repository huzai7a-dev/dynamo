// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-lucide-icons',
    'nuxt-aos',
    'nuxt-swiper',
  ],
  vite: {
    server: {
      allowedHosts: ['745f-39-35-193-159.ngrok-free.app']
    }
  },
})