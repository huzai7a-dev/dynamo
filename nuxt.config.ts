// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-09-20',
  app: {
    head: {
      script: [
        { src: 'https://2pay-js.2checkout.com/v1/2pay.js', defer: true }
      ]
    }
  },
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
    twoCheckoutMerchantCode: process.env.TWOC_MERCHANT_CODE,
    twoCheckoutSecretWord: process.env.TWOC_SECRET_WORD,
    twoCheckoutSandbox: process.env.TWOC_SANDBOX || 'true',
    twoCheckoutPublishableKey: process.env.TWOC_PUBLISHABLE_KEY,
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
    server: {
      allowedHosts: [
        'd1e2-39-38-119-139.ngrok-free.app'
      ]
    },
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