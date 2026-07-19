// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-09-20',
  hub: {
    kv: false,
    blob: false,
    cache: false
  },
  nitro: {
    preset: 'vercel',
    experimental: {
      asyncContext: true,
    },
  },

  devtools: { enabled: true },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    twoCheckoutMerchantCode: process.env.TWOC_MERCHANT_CODE,
    twoCheckoutSecretWord: process.env.TWOC_SECRET_WORD,
    twoCheckoutSecretKey: process.env.TWOC_SECRET_KEY,
    twoCheckoutSandbox: process.env.TWOC_SANDBOX || 'true',
    appUrl: process.env.APP_URL || 'http://localhost:3000',
    emailHost: process.env.EMAIL_HOST,
    emailPort: process.env.EMAIL_PORT,
    adminAccountUser: process.env.ADMIN_EMAIL_USER,
    adminAccountPass: process.env.ADMIN_EMAIL_PASS,
    orderAccountUser: process.env.ORDER_EMAIL_USER,
    orderAccountPass: process.env.ORDER_EMAIL_PASS,
    accountsAccountUser: process.env.ACCOUNTS_EMAIL_USER,
    accountsAccountPass: process.env.ACCOUNTS_EMAIL_PASS,
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