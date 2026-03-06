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
  nitro: {
    preset: 'vercel',
  },
  devtools: { enabled: true },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    twoCheckoutMerchantCode: process.env.TWOC_MERCHANT_CODE,
    twoCheckoutSecretWord: process.env.TWOC_SECRET_WORD,
    twoCheckoutSandbox: process.env.TWOC_SANDBOX || 'true',
    twoCheckoutPublishableKey: process.env.TWOC_PUBLISHABLE_KEY,
    emailHost: process.env.EMAIL_HOST,
    emailPort: process.env.EMAIL_PORT,
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
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
    url: 'https://dynamostitches.com',
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