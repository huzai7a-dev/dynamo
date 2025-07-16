<template>
  <div class="min-h-screen bg-white">
    <main>
      <Hero />
      <OurApproach />
      <Services />
      <WorkingProcess />
      <Testimonials />
      <Pricing />
      <OurTeam />
    </main>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

// Lazy load heavy components
const WorkingProcess = defineAsyncComponent(() => import('~/components/WorkingProcess.vue'))
const OurTeam = defineAsyncComponent(() => import('~/components/OurTeam.vue'))
const Pricing = defineAsyncComponent(() => import('~/components/Pricing.vue'))
const OurApproach = defineAsyncComponent(() => import('~/components/OurApproach.vue'))

// Page meta
useHead({
  title: 'Dynamo Stitches | Digitizing & Vectorizing Company',
  meta: [
    { name: 'description', content: 'Dynamo Stitches delivers top-quality digitizing, vectorizing, and design services with fast turnaround times and responsive communication—your all-in-one solution for creative needs.' },
    { name: 'keywords', content: 'embroidery digitizing, vector artwork, logo designing, line artwork, custom patches, embroidery services, Dynamo Stitches, premium embroidery, creative design' },
    { property: 'og:title', content: 'Dynamo Stitches | Digitizing & Vectorizing Company' },
    { property: 'og:description', content: 'Discover Dynamo Stitches: your partner for embroidery digitizing, vector art, logo design, and more. Expert craftsmanship and creative solutions for every need.' },
    { property: 'og:image', content: '/images/hero-3.jpeg' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://dynamostitches.com/' }
  ]
})
</script>
