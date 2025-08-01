// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-lucide-icons',
    'nuxt-swiper',
    '@nuxt/image',
    '@nuxtjs/sitemap',
    ['@nuxtjs/robots', {
      rules: {
          UserAgent: '*',
          Allow: ['/'],
          Disallow: []
      },
      sitemap: 'https://dynamostitches.com/sitemap.xml'
    }]
  ],
  site: {
    url:'https://dynamostitches.com',
    autoLastmod: true,
    include: ['/**'],   
  }, 
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