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
// useHead({
//   title: 'Dynamo Stitches - Premium Embroidery Services',
// })
</script>
