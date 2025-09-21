// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-09-20',
  hub: {
    bindings: {
      observability: {
        logs: true,
      },
    },
  },
  devtools: { enabled: true },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  },
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
    }],
    'nuxt-auth-utils',
    '@nuxthub/core',
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