<template>
  <div class="min-h-screen bg-white">
    <Banner
      backgroundImage="/images/custom-patches/Hero.webp"
      title="Custom Patches"
      description="Elevate your brand or style with our custom patches that bear the mark of craftsmanship. From intricate designs to flawless execution, our team ensures your patches are a testament to our dedication."
    />
    <section class="relative max-w-6xl mx-auto px-4 py-16 overflow-hidden">
      <!-- Gradient Background Accent -->
      <div class="absolute inset-0 -z-10 bg-gradient-to-br from-yellow-50 via-white to-blue-50"></div>
      <!-- Blurred Decorative Shape -->
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-yellow-200 opacity-30 rounded-full blur-3xl -z-10"></div>
      <div class="absolute bottom-0 right-0 w-80 h-80 bg-blue-200 opacity-20 rounded-full blur-2xl -z-10"></div>
      <!-- Main Heading Centered -->
      <h2 class="text-4xl font-extrabold !text-primary mb-10 text-center leading-tight">Custom Patches: Crafted for Impact</h2>
      <div class="relative flex flex-col md:flex-row items-center gap-12 mb-16">
        <!-- Main Image -->
        <div class="md:w-1/3 w-full flex justify-center relative">
          <div class="rounded-2xl shadow-2xl overflow-hidden border-4 border-yellow-400 bg-white/60 backdrop-blur-lg">
            <NuxtImg format="webp" src="/images/custom-patches/Front.jpg" alt="Custom Patch Example" class="object-cover w-full h-96 md:h-full" />
          </div>
        </div>
        <!-- Card Content -->
        <div class="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-2xl p-10 md:w-2/3 w-full relative z-10">
          <span class="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 shadow">Premium Patch Service</span>
          <p class="text-lg text-gray-700 mb-8">Elevate your brand or style with our custom patches that bear the mark of craftsmanship. From intricate designs to flawless execution, our team ensures your patches are a testament to our dedication.</p>
        </div>
      </div>
      <!-- Features as Cards with Lucide Icons -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
        <div
          v-for="(feature, idx) in features"
          :key="feature.title"
          class="group bg-white/90 border-2 border-transparent hover:border-yellow-400 shadow-lg rounded-2xl flex flex-col md:flex-row overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] relative"
          style="backdrop-filter: blur(6px);"
        >
          <!-- Image Section -->
          <div class="md:w-1/3 w-full h-44 md:h-auto relative flex-shrink-0">
            <NuxtImg format="webp" :src="feature.bg" class="w-full h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none" alt="" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
          <!-- Text/Icon Section -->
          <div class="flex-1 p-6 flex flex-col justify-center relative z-10 bg-white/70 backdrop-blur-xl rounded-b-2xl md:rounded-bl-none md:rounded-r-2xl">
            <div class="flex items-center gap-3 mb-2">
              <span class="inline-block w-2 h-8 rounded bg-gradient-to-b from-yellow-400 to-yellow-600 mr-2"></span>
              <Icon :name="feature.icon" class="text-secondary w-8 h-8 drop-shadow" />
              <h3 class="text-xl font-bold text-primary">{{ feature.title }}</h3>
            </div>
            <p class="text-gray-700">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
    <div class="flex justify-center mb-16">
      <button @click="showGallery = true" class="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
        View work
      </button>
    </div>
    <Gallery
      :images="galleryImages"
      :open="showGallery"
      title="Custom Patches Portfolio"
      @close="showGallery = false"
    />
  </div>
</template>

<script setup>
import Banner from '@/components/Banner.vue'
import Gallery from '@/components/Gallery.vue'
import { Pen, Layers, BadgePercent } from 'lucide-vue-next'
import { ref } from 'vue'
import Icon from '~/components/Icon.vue'

useHead({
  title: 'Custom Patches - Dynamo Stitches',
  meta: [
    { name: 'description', content: 'Order high-quality custom patches from Dynamo Stitches. Durable, expertly crafted patches for brands, teams, and personal projects. Fast turnaround and premium service.' },
    { name: 'keywords', content: 'custom patches, embroidery patches, woven patches, leather patches, Dynamo Stitches, patch design, premium patches, custom embroidery' },
    { property: 'og:title', content: 'Custom Patches - Dynamo Stitches' },
    { property: 'og:description', content: 'Elevate your brand or style with custom patches from Dynamo Stitches. Explore our premium, durable, and expertly crafted patch services.' },
    { property: 'og:image', content: '/images/custom-patches/Hero.webp' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://dynamostitches.com/services/custom-patches' }
  ]
})

const showGallery = ref(false)
const galleryImages = [
  '/images/custom-patches/Patches-1.jpeg',
  '/images/custom-patches/Patches-2.jpg',
  '/images/custom-patches/Patches-3.webp',
  '/images/custom-patches/Patches-4.jpg',
  '/images/custom-patches/Patches-5.webp',
  '/images/custom-patches/Patches-6.jpg',
  '/images/custom-patches/Patches-7.jpg',
  '/images/custom-patches/Patches-8.jpg',
  '/images/custom-patches/Patches-9.jpg',
  '/images/custom-patches/Patches-10.jpg'
]

const features = [
  {
    title: 'Embroidery Patches',
    description: `Wear your brand with pride. Our embroidered patches are crafted with care, adding a touch of professionalism to your apparel. Add a tactile element to your brand that leaves an unforgettable impression.`,
    icon: 'Pen',
    bg: '/images/custom-patches/bgs/Embroidery-Patches.jpg'
  },
  {
    title: 'Woven Patches',
    description: `Quality that's woven into every thread. For a tactile branding experience, choose our woven patches. These durable patches offer a high-quality, textured look that adds a unique touch to your products.`,
    icon: 'Layers',
    bg: '/images/custom-patches/bgs/Woven-Patches.jpg'
  },
  {
    title: 'Leather Patches',
    description: `Add a touch of sophistication and durability to your branding with custom leather patches. Our leather patches are stylish and sophisticated, making a lasting impression on your audience.`,
    icon: 'BadgePercent',
    bg: '/images/custom-patches/bgs/Leather-Patches.jpg'
  },
  {
    title: 'Chenille Patches',
    description: "We specialize in high-quality chenille patch services, perfect for varsity jackets, uniforms, and custom apparel. Our patches are crafted with precision, durability, and vibrant colors to make your designs stand out. Whether you need classic lettering or custom shapes, we've got you covered.",
    icon: 'Spool',
    bg: '/images/custom-patches/bgs/Chenille-Patches.webp'
  }
]
</script>

<style scoped>
.text-primary {
  color: #1e293b;
}
.text-secondary {
  color: #eab308;
}
</style>
