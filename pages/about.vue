<template>
  <div class="min-h-screen bg-white">
    <Banner
    backgroundImage="/images/hero-3.jpeg"
    title="About Us"
    description="Digitizing Dreams, Stitching Success"
    />
    <main>
      <section class="py-16 bg-gradient-to-b from-white to-gray-50">
    <div class="container mx-auto px-4">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Welcome to Dynamo Stitches, where art meets innovation and creativity knows no bounds. For years, we've been weaving stories into stitches, turning dreams into digitized reality.
        </p>
      </div>

      <!-- Experience Section -->
      <div class="relative mb-16">
        <NuxtImg format="webp" src="/images/hero-2.jpeg" alt="Experience" class="w-full h-[400px] object-cover rounded-2xl" />
        <div class="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90 rounded-2xl"></div>
        <div class="absolute inset-0 flex items-center justify-center p-8">
          <div class="max-w-3xl mx-auto text-center text-white">
            <h2 class="text-3xl font-bold mb-6 font-display">
              Experience the Dynamo Difference
            </h2>
            <p class="text-lg">
              What sets us apart? It's our passion for storytelling through stitches, combined with cutting-edge technology. With Dynamo Stitches, you're not just a client; you're a collaborator in the creation of something truly extraordinary.
            </p>
          </div>
        </div>
      </div>

      <!-- Story and Mission Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <div class="relative mb-6">
            <NuxtImg format="webp" src="/images/hero-3.jpeg" alt="Our Story" class="w-full h-[300px] object-cover rounded-lg" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
            <h2 class="absolute bottom-4 left-4 text-3xl font-bold text-white font-display">Our Story</h2>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <p class="text-gray-600">
              Founded on the principles of creativity, quality, and innovation, Dynamo Stitches has been a trailblazer in the art of digitizing and vectorizing. Our founder, a visionary storyteller with a passion for design, set out to create a company that would not only deliver exceptional results but also inspire others to see the world in a new light.
            </p>
          </div>
        </div>
        <div>
          <div class="relative mb-6">
            <NuxtImg format="webp" src="/images/hero-2.jpeg" alt="Our Mission" class="w-full h-[300px] object-cover rounded-lg" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
            <h2 class="absolute bottom-4 left-4 text-3xl font-bold text-white font-display">Our Mission</h2>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <p class="text-gray-600">
              At Dynamo Stitches, our mission is simple: to transform your vision into reality. Whether you're looking to digitize a logo, create embroidered art, or vectorize a design, we're here to help. Our team of experts is dedicated to delivering top-notch service and stunning results, every time. <span class="text-primary cursor-pointer" @click="showMore = !showMore">{{ showMore ? 'Show less' : 'Read more'  }}</span>
            </p>
            <p v-if="showMore" class="text-gray-600">
              We envision a world where art knows no bounds, where creativity is limitless, and where every design tells a story. Through our work, we aim to inspire others to embrace their creativity, push boundaries, and see the world from a new perspective.
            </p>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="text-center" style="animation-delay: 1000ms">
        <div class="relative mb-8">
          <NuxtImg format="webp" src="/images/contact-banner.jpeg" alt="Join Us" class="w-full h-[300px] object-cover rounded-2xl" />
          <div class="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80 rounded-2xl"></div>
          <div class="absolute inset-0 flex flex-col items-center justify-center text-white">
            <h2 class="text-3xl font-bold mb-4 font-display">Join the Dynamo Family</h2>
            <p class="max-w-2xl mx-auto text-lg">
              Join the ranks of satisfied customers who have experienced the Dynamo difference. Let us be your partner in creativity and innovation.
            </p>
          </div>
        </div>
        <p class="text-2xl font-bold text-primary font-display animate-float">
          Dynamo Stitches - Where Art Comes to Life!
        </p>
      </div>
    </div>
  </section>
  <div class="mb-12">
    <ContactBanner />
  </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showMore = ref(false)

// useHead({
//   title: 'About Us - Dynamo Stitches',
// })
</script>
