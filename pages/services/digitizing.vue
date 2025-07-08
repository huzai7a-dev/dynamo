<template>
  <div class="min-h-screen bg-white">
    <Banner
      backgroundImage="/images/digitizing/Digitizing-hero.jpg"
      title="Embroidery Digitizing"
      description="Expert digitizing services for embroidery, hats, patches, towels, and more. Elevate your brand with our creative team!"
    />
    <section class="relative max-w-6xl mx-auto px-4 py-16 overflow-hidden">
      <!-- Gradient Background Accent -->
      <div class="absolute inset-0 -z-10 bg-gradient-to-br from-yellow-50 via-white to-blue-50"></div>
      <!-- Blurred Decorative Shape -->
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-yellow-200 opacity-30 rounded-full blur-3xl -z-10"></div>
      <div class="absolute bottom-0 right-0 w-80 h-80 bg-blue-200 opacity-20 rounded-full blur-2xl -z-10"></div>
      <!-- Main Heading Centered -->
      <h2 class="text-4xl font-extrabold !text-primary mb-10 text-center leading-tight">Feeling Invisible in a Crowded Market and Need a Design Savior?</h2>
      <div class="relative flex flex-col md:flex-row items-center gap-12 mb-16">
        <!-- Main Image -->
        <div class="md:w-1/3 w-full flex justify-center relative">
          <div class="rounded-2xl shadow-2xl overflow-hidden border-4 border-yellow-400 bg-white/60 backdrop-blur-lg">
            <NuxtImg format="webp" src="/images/digitizing/Digitizing-front.jpg" alt="Digitizing Example" class="object-cover w-full h-96 md:h-full" />
          </div>
        </div>
        <!-- Card Content -->
        <div class="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-2xl p-10 md:w-2/3 w-full relative z-10">
          <span class="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 shadow">Premium Service</span>
          <p class="text-lg text-gray-700 mb-8">With years of expertise and a powerhouse team of creative minds, we're geared up to elevate your brand like never before. Our passion? Crafting designs that not only catch eyes but also speak directly to your ideal customers. Let's team up today for a design journey that promises to go above and beyond your expectations.</p>
        </div>
      </div>
      <!-- Features as Cards with Lucide Icons -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
        <div v-for="feature in features" :key="feature.title" class="bg-white/90 border border-gray-100 shadow-lg rounded-xl p-6 flex flex-col gap-3 hover:shadow-2xl transition-shadow">
          <div class="flex items-center gap-3 mb-2">
            <Icon :name="feature.icon" class="text-secondary w-8 h-8" />
            <h3 class="text-xl font-bold text-primary">{{ feature.title }}</h3>
          </div>
          <p class="text-gray-700">{{ feature.description }}</p>
        </div>
      </div>
      
    </section>
    <div class="flex justify-center mb-16">
      <button @click="showGallery = true" class="bg-primary hover:bg-primary/60 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
        View work
      </button>
    </div>
    <Gallery
      :images="galleryImages"
      :open="showGallery"
      title="Digitizing Portfolio"
      @close="showGallery = false"
    />
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'
import img1 from '~/public/images/digitizing/Digitizing-1.jpeg'
import img2 from '~/public/images/digitizing/Digitizing-2.jpeg'
import img3 from '~/public/images/digitizing/Digitizing-3.jpeg'
import img4 from '~/public/images/digitizing/Digitizing-4.jpeg'
import img5 from '~/public/images/digitizing/Digitizing-5.jpeg'
import img6 from '~/public/images/digitizing/Digitizing-6.jpeg'
import img7 from '~/public/images/digitizing/Digitizing-7.jpeg'
import img8 from '~/public/images/digitizing/Digitizing-8.jpeg'
import img9 from '~/public/images/digitizing/Digitizing-9.jpeg'
import img10 from '~/public/images/digitizing/Digitizing-10.jpeg'
import img11 from '~/public/images/digitizing/Digitizing-11.jpeg'
import img12 from '~/public/images/digitizing/Digitizing-12.jpeg'

// useHead({
//   title: 'Digitizing - Dynamo Stitches',
// })

const Banner = defineAsyncComponent(() => import('@/components/Banner.vue'))
const Gallery = defineAsyncComponent(() => import('@/components/Gallery.vue'))

const showGallery = ref(false)
const galleryImages = [
  '/images/digitizing/Digitizing-1.jpeg',
  '/images/digitizing/Digitizing-2.jpeg',
  '/images/digitizing/Digitizing-3.jpeg',
  '/images/digitizing/Digitizing-4.jpeg',
  '/images/digitizing/Digitizing-5.jpeg',
  '/images/digitizing/Digitizing-6.jpeg',
  '/images/digitizing/Digitizing-7.jpeg',
  '/images/digitizing/Digitizing-8.jpeg',
  '/images/digitizing/Digitizing-9.jpeg',
  '/images/digitizing/Digitizing-10.jpeg',
  '/images/digitizing/Digitizing-11.jpeg',
  '/images/digitizing/Digitizing-12.jpeg'
]

const features = [
  {
    title: 'Cap Digitizing',
    description: 'Our cap digitizing service transforms your designs into embroidery-ready files that perfectly adapt to the unique contours and challenges of cap embroidery.',
    icon: 'Shirt'
  },
  {
    title: '3D Puff Digitizing',
    description: 'Elevate your designs with our 3D puff digitizing service. We create raised, textured embroidery that adds depth and dimension to your garments.',
    icon: 'Move3d'
  },
  {
    title: 'Appliqué Digitizing',
    description: 'Our appliqué digitizing combines fabric pieces with embroidery to create stunning, multi-dimensional designs that stand out.',
    icon: 'Layers'
  },
  {
    title: 'Patch Digitizing',
    description: 'Transform your artwork into embroidered patches with our specialized patch digitizing service.',
    icon: 'Badge'
  },
  {
    title: 'Logo Digitizing',
    description: 'Convert your logos into precise embroidery files that maintain clarity and detail at any size.',
    icon: 'PenTool'
  },
  {
    title: 'Sleeves Digitizing',
    description: 'The curve of a sleeve presents a unique canvas. Our designers skillfully adapt your designs to the constraints of sleeve contours, resulting in a harmonious blend of aesthetics and functionality.',
    icon: 'Image'
  },
  {
    title: 'Bag Digitizing',
    description: 'Our designers\' expertise shines through in every bag digitization, as they masterfully adapt designs to suit the unique shape and characteristics of each bag, leaving no detail overlooked.',
    icon: 'ShoppingBag'
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