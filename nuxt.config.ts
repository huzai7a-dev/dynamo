// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-lucide-icons',
    'nuxt-swiper',
    '@nuxt/image',
  ],
  ssr: true,
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'lucide-icons': ['lucide-vue-next'],
          }
        }
      }
    }
  },
})