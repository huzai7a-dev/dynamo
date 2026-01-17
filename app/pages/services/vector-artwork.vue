<template>
  <div class="min-h-screen bg-white">
    <Banner
      backgroundImage="/images/vector/Vector-Art-Hero.jpg"
      title="Vector Artwork"
      description="Professional vector artwork services for logos, illustrations, graphics, and more. Make your designs scalable and stunning!"
    />
    <section class="relative max-w-6xl mx-auto px-4 py-16 overflow-hidden">
      <!-- Gradient Background Accent -->
      <div class="absolute inset-0 -z-10 bg-gradient-to-br from-yellow-50 via-white to-blue-50"></div>
      <!-- Blurred Decorative Shape -->
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-yellow-200 opacity-30 rounded-full blur-3xl -z-10"></div>
      <div class="absolute bottom-0 right-0 w-80 h-80 bg-blue-200 opacity-20 rounded-full blur-2xl -z-10"></div>
      <!-- Main Heading Centered -->
      <h2 class="text-4xl font-extrabold !text-primary mb-10 text-center leading-tight">Bring Your Vision to Life with Crisp, Scalable Vector Art</h2>
      <div class="relative flex flex-col md:flex-row items-center gap-12 mb-16">
        <!-- Main Image -->
        <div class="md:w-1/3 w-full flex justify-center relative">
          <div class="rounded-2xl shadow-2xl overflow-hidden border-4 border-yellow-400 bg-white/60 backdrop-blur-lg">
            <NuxtImg format="webp" src="/images/vector/Vector-Art-front.jpg" alt="Vector Art Example" class="object-cover w-full h-96 md:h-full" />
          </div>
        </div>
        <!-- Card Content -->
        <div class="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-2xl p-10 md:w-2/3 w-full relative z-10">
          <span class="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 shadow">Premium Vector Service</span>
          <p class="text-lg text-gray-700 mb-8">Our expert artists transform your ideas into crisp, scalable vector artwork perfect for any application. From logos to detailed illustrations, we ensure your designs look flawless at any size and on any medium. Experience the power of professional vector art for your brand or project.</p>
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
      title="Vector Artwork Portfolio"
      @close="showGallery = false"
    />
  </div>
</template>

<script setup>
import Banner from '@/components/Banner.vue'
import Gallery from '@/components/Gallery.vue'
import { Pen, Brush, Palette, CircleDot, PenTool, PaintBucket } from 'lucide-vue-next'
import { ref } from 'vue'
import Icon from '~/components/Icon.vue'

useHead({
  title: 'Vector Artwork - Dynamo Stitches',
  meta: [
    { name: 'description', content: 'Professional vector artwork services for logos, illustrations, graphics, and more. Dynamo Stitches makes your designs scalable, crisp, and stunning.' },
    { name: 'keywords', content: 'vector artwork, vector art, scalable design, Dynamo Stitches, illustration, graphic design, CMYK, color separation, halftones' },
    { property: 'og:title', content: 'Vector Artwork - Dynamo Stitches' },
    { property: 'og:description', content: 'Bring your vision to life with crisp, scalable vector artwork from Dynamo Stitches. Perfect for logos, graphics, and illustrations.' },
    { property: 'og:image', content: '/images/vector/Vector-Art-Hero.jpg' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://dynamostitches.com/services/vector-artwork' }
  ]
})

const showGallery = ref(false)
const galleryImages = [
  '/images/vector/vector-art-1.jpeg',
  '/images/vector/vector-art-2.jpeg',
  '/images/vector/vector-art-3.jpeg',
  '/images/vector/vector-art-4.jpeg',
  '/images/vector/vector-art-5.jpeg',
  '/images/vector/vector-art-6.jpeg'
]

const features = [
  {
    title: 'Vector Art',
    description: `Our accomplished artists harness the power of vector graphics to craft designs that are not only visually appealing but also infinitely scalable. Experience the finesse of vector art with our adept professionals.`,
    icon: 'Pen',
    bg: '/images/vector/bgs/VectorArt.jpeg'
  },
  {
    title: 'Illustration',
    description: `Illustrations are more than just drawings; they're stories waiting to be told. Whether for advertising, editorial, or personal projects, our illustrations are crafted with precision and flair, adding a unique touch to your visuals. We make them detailed and dynamic, providing a clear blueprint for your project.`,
    icon: 'Brush',
    bg: '/images/vector/bgs/Illustration.jpg'
  },
  {
    title: 'Color-Separation',
    description: `Precision in every shade. Our color-separation techniques ensure your prints are vibrant and true to your brand's colors. We'll make your colors pop just right resulting in stunning and true-to-life prints.`,
    icon: 'Palette',
    bg: '/images/vector/bgs/Colorseparation.png'
  },
  {
    title: 'Half-Tones',
    description: `Create depth and texture with halftone effects. Our designs add visual interest, making your prints stand out from the crowd. Let us expertly incorporate them into your branding.`,
    icon: 'CircleDot',
    bg: '/images/vector/bgs/Halftones.jpg'
  },
  {
    title: 'Graphic Designing',
    description: `Transform ideas into visuals that speak louder than words, making your brand stand out in a sea of ordinary. Our graphic wizards will turn ideas into visual masterpieces. Let's paint your brand's narrative across digital and print landscapes with creativity that captivates.`,
    icon: 'PenTool',
    bg: '/images/vector/bgs/Graphics.jpg'
  },
  {
    title: 'CMYK Design',
    description: `Unlock the full spectrum of color for your print materials with our CMYK expertise. From subtle shades to bold hues, we'll make your designs pop off the page. Let's bring your designs to life with a splash of colors, ensuring your prints are not just seen but felt.`,
    icon: 'PaintBucket',
    bg: '/images/vector/bgs/CMYK.png'
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