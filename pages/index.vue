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
import WorkingProcess from '~/components/WorkingProcess.vue'
import OurTeam from '~/components/OurTeam.vue'
import Pricing from '~/components/Pricing.vue'
import OurApproach from '~/components/OurApproach.vue'
// Page meta
definePageMeta({
  title: 'Dynamo Stitches - Premium Embroidery Services'
})
</script>
