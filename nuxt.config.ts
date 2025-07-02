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
      allowedHosts: ['555d-39-35-230-124.ngrok-free.app']
    }
  },
})