<template>
  <div class="min-h-screen bg-white">
    <Banner
      backgroundImage="/images/line-artwork/line-artwork-hero.png"
      title="Line Art Work"
      description="Minimalist, expressive, and precise line art for brands, products, and personal projects. Discover the beauty of simplicity."
    />
    <section class="relative max-w-6xl mx-auto px-4 py-16 overflow-hidden">
      <!-- Gradient Background Accent -->
      <div class="absolute inset-0 -z-10 bg-gradient-to-br from-yellow-50 via-white to-blue-50"></div>
      <!-- Blurred Decorative Shape -->
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-yellow-200 opacity-30 rounded-full blur-3xl -z-10"></div>
      <div class="absolute bottom-0 right-0 w-80 h-80 bg-blue-200 opacity-20 rounded-full blur-2xl -z-10"></div>
      <!-- Main Heading Centered -->
      <h2 class="text-4xl font-extrabold !text-primary mb-10 text-center leading-tight">Line Art Works: Minimalism Meets Mastery</h2>
      <div class="relative flex flex-col md:flex-row items-center gap-12 mb-16">
        <!-- Main Image -->
        <div class="md:w-1/3 w-full flex justify-center relative">
          <div class="rounded-2xl shadow-2xl overflow-hidden border-4 border-yellow-400 bg-white/60 backdrop-blur-lg">
            <img src="/images/line-artwork/Front.jpg" alt="Line Art Example" class="object-cover w-full h-96 md:h-full" />
          </div>
        </div>
        <!-- Card Content -->
        <div class="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-2xl p-10 md:w-2/3 w-full relative z-10">
          <span class="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 shadow">Premium Line Art Service</span>
          <p class="text-lg text-gray-700 mb-8">Our designers' virtuosity shines through in their ability to convey depth and emotion through minimalist line art. Each stroke is a masterpiece, a testament to the fusion of talent and skill.</p>
        </div>
      </div>
      <!-- Features as Cards with Lucide Icons -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
        <div v-for="feature in features" :key="feature.title" class="bg-white/90 border border-gray-100 shadow-lg rounded-xl p-6 flex flex-col gap-3 hover:shadow-2xl transition-shadow">
          <div class="flex items-center gap-3 mb-2">
            <component :is="feature.icon" class="text-secondary w-8 h-8" />
            <h3 class="text-xl font-bold text-primary">{{ feature.title }}</h3>
          </div>
          <p class="text-gray-700">{{ feature.description }}</p>
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
      title="Line Artwork Portfolio"
      @close="showGallery = false"
    />
  </div>
</template>

<script setup>
import Banner from '@/components/Banner.vue'
import Gallery from '@/components/Gallery.vue'
import { Pencil, PenTool, Brush, Ruler, PenLine, FileSignature } from 'lucide-vue-next'
import { ref } from 'vue'

const showGallery = ref(false)
const galleryImages = [
  '/images/line-artwork/Line-Artwork-1.jpeg',
  '/images/line-artwork/Line-Artwork-2.png',
  '/images/line-artwork/Line-Artwork-3.png',
  '/images/line-artwork/Line-Artwork-4.png',
  '/images/line-artwork/Line-Artwork-5.png',
  '/images/line-artwork/Line-Artwork-6.png',
]

const features = [
  {
    title: 'Custom Line Artwork',
    description: `Our custom line artwork is a testament to your unique vision, meticulously crafted to reflect your individuality and style. Each line is infused with meaning and purpose, creating a piece of art that is truly one-of-a-kind.`,
    icon: PenTool
  },
  {
    title: 'Digital Line Artwork',
    description: `Digital line artwork combines the precision of digital technology with the creativity of hand-drawn art. Our digital line artwork is clean and crisp, with each line carefully placed to create a stunning visual impact.`,
    icon: Pencil
  },
  {
    title: 'Technical Illustration',
    description: `Technical illustration is more than just drawings; it's a form of visual communication that requires precision and clarity. Our technical illustrations are expertly crafted to convey complex concepts in a way that is easy to understand and visually appealing.`,
    icon: Ruler
  },
  {
    title: 'Pen and Ink Drawing',
    description: `Pen and ink drawing is an art form that requires skill and patience, and our drawings are no exception. Each stroke is carefully placed to create intricate patterns and textures, resulting in drawings that are both captivating and timeless.`,
    icon: PenLine
  },
  {
    title: 'Sketch Drawing',
    description: `Sketch drawing is where ideas are born, and our sketches capture the essence of creativity in its purest form. Each sketch is a glimpse into the artist's mind, capturing fleeting moments with spontaneity and emotion.`,
    icon: FileSignature
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
