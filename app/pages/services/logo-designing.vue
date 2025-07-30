<template>
  <div class="min-h-screen bg-white">
    <Banner
      backgroundImage="/images/logo-designing/logo-hero.jpeg"
      title="Logo Designing"
      description="Crafting memorable logos and brand identities that leave a lasting impression. Elevate your brand with our creative expertise!"
    />
    <section class="relative max-w-6xl mx-auto px-4 py-16 overflow-hidden">
      <!-- Gradient Background Accent -->
      <div class="absolute inset-0 -z-10 bg-gradient-to-br from-yellow-50 via-white to-blue-50"></div>
      <!-- Blurred Decorative Shape -->
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-yellow-200 opacity-30 rounded-full blur-3xl -z-10"></div>
      <div class="absolute bottom-0 right-0 w-80 h-80 bg-blue-200 opacity-20 rounded-full blur-2xl -z-10"></div>
      <!-- Main Heading Centered -->
      <h2 class="text-4xl font-extrabold !text-primary mb-10 text-center leading-tight">Your Brand Deserves a Logo That Stands Out</h2>
      <div class="relative flex flex-col md:flex-row items-center gap-12 mb-16">
        <!-- Main Image -->
        <div class="md:w-1/3 w-full flex justify-center relative">
          <div class="rounded-2xl shadow-2xl overflow-hidden border-4 border-yellow-400 bg-white/60 backdrop-blur-lg">
            <NuxtImg  src="/images/logo-designing/logo-front.webp" alt="Logo Design Example" class="object-cover w-full h-96 md:h-full" />
          </div>
        </div>
        <!-- Card Content -->
        <div class="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-2xl px-10 py-6 md:w-2/3 w-full relative z-10">
          <span class="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 shadow">Premium Logo Service</span>
          <p class="text-lg text-gray-700 mb-8">A logo is the face of your identity, and our designers understand its significance. With an arsenal of innovative ideas, they craft logos that encapsulate your essence, leaving a lasting impact.</p>
        </div>
      </div>
      <!-- Features as Cards with Lucide Icons and Backgrounds -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
        <div
          v-for="(feature, index) in features"
          :key="feature.title"
          class="group bg-white/90 border-2 border-transparent hover:border-yellow-400 shadow-lg rounded-2xl flex flex-col md:flex-row overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] relative"
          style="backdrop-filter: blur(6px);"
        >
          <!-- Image Section -->
          <div class="md:w-1/3 w-full h-44 md:h-auto relative flex-shrink-0">
            <NuxtImg format="webp" :src="feature.bg" class="w-full h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none" alt="" loading="lazy" />
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
      title="Logo Designing Portfolio"
      @close="showGallery = false"
    />
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'

useHead({
  title: 'Logo Designing - Dynamo Stitches',
  meta: [
    { name: 'description', content: 'Professional logo designing services by Dynamo Stitches. Unique, memorable, and creative logos tailored to your brand identity. Stand out with expert design.' },
    { name: 'keywords', content: 'logo designing, brand identity, custom logo, Dynamo Stitches, logo design service, creative logo, professional logo, brand design' },
    { property: 'og:title', content: 'Logo Designing - Dynamo Stitches' },
    { property: 'og:description', content: 'Get a unique and memorable logo for your brand. Dynamo Stitches offers professional logo designing services for businesses and individuals.' },
    { property: 'og:image', content: '/images/logo-designing/logo-hero.jpeg' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://dynamostitches.com/services/logo-designing' }
  ]
})

const Banner = defineAsyncComponent(() => import('@/components/Banner.vue'))
const Gallery = defineAsyncComponent(() => import('@/components/Gallery.vue'))

const showGallery = ref(false)
const galleryImages = [
  '/images/logo-designing/Logo-Designing-1.png',
  '/images/logo-designing/Logo-Designing-2.png',
  '/images/logo-designing/Logo-Designing-3.png',
  '/images/logo-designing/Logo-Designing-4.png',
  '/images/logo-designing/Logo-Designing-5.png',
  '/images/logo-designing/Logo-Designing-6.png',
  '/images/logo-designing/Logo-Designing-7.png',
  '/images/logo-designing/Logo-Designing-8.jpeg',
  '/images/logo-designing/Logo-Designing-9.jpeg'
]

const features = [
  {
    title: 'Brand Identity Design',
    description: `Crafting a brand identity is like composing a symphony—each element harmonizing to create a unique and memorable melody. We blend design and strategy to craft an identity that resonates with your audience, ensuring your brand sings its story loud and clear.`,
    bg: '/images/logo-designing/bgs/Brand-identity.jpg',
    icon: 'Brush'
  },
  {
    title: 'Corporate Design',
    description: `Your logo is the face of your business, the visual cue that sparks recognition and connection. Let's create your ambassador—your logo that conveys your brand's essence with elegance and impact, making a lasting impression.`,
    bg: '/images/logo-designing/bgs/Corporate.jpg',
    icon: 'Building'
  },
  {
    title: 'Illustrated Design',
    description: `Illustrations breathe life into your brand, transforming concepts into captivating visual stories. We craft illustrated logos that are not only visually striking but also deeply meaningful, telling your brand's story in a way that resonates with your audience.`,
    bg: '/images/logo-designing/bgs/illustrated.jpg',
    icon: 'Palette'
  },
  {
    title: 'Typography Design',
    description: `Typography is the voice of your brand, speaking volumes about its personality and values. Our custom typography designs are crafted with care and creativity, ensuring they not only look great but also convey your brand's message with clarity and style.`,
    bg: '/images/logo-designing/bgs/Typograpghy.jpg',
    icon: 'Type'
  },
  {
    title: 'Iconography Design',
    description: `Icons are the visual shorthand of modern communication, distilling complex ideas into simple, memorable images. Our icons are crafted with precision and creativity, ensuring they convey your brand's message with clarity and charm, leaving a lasting impression on your audience.`,
    bg: '/images/logo-designing/bgs/Iconograpgy.jpg',
    icon: 'Zap'
  },
  {
    title: 'Calligraphy Design',
    description: `Turn words into art with our calligraphy designs, where every stroke tells a story. Let us create stunning visuals that capture the essence of your message, adding a touch of elegance to your brand.`,
    bg: '/images/logo-designing/bgs/Calligrapgy.jpg',
    icon: 'Pen'
  },
  {
    title: 'Symbolic Design',
    description: `Symbols have the power to transcend language, conveying universal truths and emotions. Our symbolic logos are crafted with care and creativity, ensuring they represent your brand's values and vision with clarity and impact.`,
    bg: '/images/logo-designing/bgs/Symbolic.jpg',
    icon: 'Shield'
  },
  {
    title: 'Monogram Design',
    description: `A monogram is the ultimate personalization of your brand, a symbol of its unique identity. We create monograms that are elegant and timeless, reflecting the essence of your brand in a single, memorable mark.`,
    bg: '/images/logo-designing/bgs/Monogram.jpg',
    icon: 'Star'
  },
  {
    title: 'Fashion Design',
    description: `Express your brand through fashion. Our designs are trendy and on-brand, ensuring you stand out in the world of fashion. Through innovative and stylish apparel designs, you will leave a lasting impression.`,
    bg: '/images/logo-designing/bgs/Fashion.jpg',
    icon: 'Shirt'
  },
  {
    title: 'Trademark Design',
    description: `Crafting trademarks that are not just symbols but stories, ensuring your brand is not just noticed but remembered. We craft distinctive marks that not only secure your brand but also tell its unique story.`,
    bg: '/images/logo-designing/bgs/TradeMark.jpg',
    icon: 'Shield'
  },
  {
    title: 'Minimalist Design',
    description: `Sometimes less is more. Our minimalist logos are simple yet striking, making a bold statement with their clean design and showcasing your brand's essence with simplicity and elegance.`,
    bg: '/images/logo-designing/bgs/MInimalist.jpg',
    icon: 'Slash'
  },
  {
    title: '3D Design',
    description: `Add depth and dimension to your brand with a 3D logo. Our designs pop off the page, creating a visual experience that's hard to forget. Let's create a 3D logo that grabs attention and leaves a lasting impression.`,
    bg: '/images/logo-designing/bgs/3d.jpg',
    icon: 'Box'
  },
  {
    title: 'Mascot Design',
    description: `Give your brand a face. Our mascot designs are fun, friendly, and full of character, creating a memorable brand personality. Let us create one that embodies your brand's character.`,
    bg: '/images/logo-designing/bgs/Mascot.jpeg',
    icon: 'PawPrint'
  },
  {
    title: 'Animated Design',
    description: `Bring your brand to life with animation. Our designs are captivating and engaging, helping you connect with your audience on a deeper level. We help you map out your ideas, ensuring a smooth and efficient production process.`,
    bg: '/images/logo-designing/bgs/Animated.jpeg',
    icon: 'Film'
  },
  {
    title: 'Comic Art Design',
    description: `Bring your narratives to life with our dynamic comic art designs, where every panel is a masterpiece. Our artwork will not only captivate your audience but also leave a lasting impression, making your stories unforgettable.`,
    bg: '/images/logo-designing/bgs/Comic Art.png',
    icon: 'Palette'
  },
  {
    title: 'Tattoo Artwork Design',
    description: `Express your individuality with our custom tattoo artwork designs, crafted to reflect your unique style and personality. Let our artists create a design that is as meaningful as it is visually stunning, ensuring your tattoo is a work of art that resonates with you.`,
    bg: '/images/logo-designing/bgs/Tattoo.jpg',
    icon: 'Heart'
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