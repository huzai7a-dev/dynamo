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
        <!-- Card Content -->
        <div class="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-2xl p-10 md:w-2/3 w-full relative z-10">
          <span class="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 shadow">Premium Vector Service</span>
          <p class="text-lg text-gray-700 mb-8">Our expert artists transform your ideas into crisp, scalable vector artwork perfect for any application. From logos to detailed illustrations, we ensure your designs look flawless at any size and on any medium. Experience the power of professional vector art for your brand or project.</p>
        </div>
        <!-- Main Image -->
        <div class="md:w-1/3 w-full flex justify-center relative">
          <div class="rounded-2xl shadow-2xl overflow-hidden border-4 border-yellow-400 bg-white/60 backdrop-blur-lg">
            <img src="/images/vector/Vector-Art-front.jpg" alt="Vector Art Example" class="object-cover w-full h-96 md:h-full" />
          </div>
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
      <!-- Gallery -->
      <div>
        <h3 class="text-2xl font-semibold text-primary mb-6 text-center">Gallery</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <img src="/images/vector/Illustration.jpg" alt="Illustration" class="rounded-lg shadow-md object-cover w-full h-40" />
          <img src="/images/vector/Halftones.jpg" alt="Halftones" class="rounded-lg shadow-md object-cover w-full h-40" />
          <img src="/images/vector/Graphics.jpg" alt="Graphics" class="rounded-lg shadow-md object-cover w-full h-40" />
          <img src="/images/vector/Colorseparation.png" alt="Color Separation" class="rounded-lg shadow-md object-cover w-full h-40" />
          <img src="/images/vector/CMYK.png" alt="CMYK" class="rounded-lg shadow-md object-cover w-full h-40" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import Banner from '@/components/Banner.vue'
import { Vector, Brush, Palette, CircleDot, PenTool, Layers, PaintBucket, Image } from 'lucide-vue-next'

const features = [
  {
    title: 'Vector Art',
    description: `Our accomplished artists harness the power of vector graphics to craft designs that are not only visually appealing but also infinitely scalable. Experience the finesse of vector art with our adept professionals.`,
    icon: Vector
  },
  {
    title: 'Illustration',
    description: `Illustrations are more than just drawings; they're stories waiting to be told. Whether for advertising, editorial, or personal projects, our illustrations are crafted with precision and flair, adding a unique touch to your visuals. We make them detailed and dynamic, providing a clear blueprint for your project.`,
    icon: Brush
  },
  {
    title: 'Color-Separation',
    description: `Precision in every shade. Our color-separation techniques ensure your prints are vibrant and true to your brand's colors. We'll make your colors pop just right resulting in stunning and true-to-life prints.`,
    icon: Palette
  },
  {
    title: 'Half-Tones',
    description: `Create depth and texture with halftone effects. Our designs add visual interest, making your prints stand out from the crowd. Let us expertly incorporate them into your branding.`,
    icon: CircleDot
  },
  {
    title: 'Graphic Designing',
    description: `Transform ideas into visuals that speak louder than words, making your brand stand out in a sea of ordinary. Our graphic wizards will turn ideas into visual masterpieces. Let's paint your brand's narrative across digital and print landscapes with creativity that captivates.`,
    icon: PenTool
  },
  {
    title: 'CMYK Design',
    description: `Unlock the full spectrum of color for your print materials with our CMYK expertise. From subtle shades to bold hues, we'll make your designs pop off the page. Let's bring your designs to life with a splash of colors, ensuring your prints are not just seen but felt.`,
    icon: PaintBucket
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