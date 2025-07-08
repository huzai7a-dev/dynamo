<template>
  <section class="py-20 bg-gray-50">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl font-extrabold text-primary mb-4 font-display tracking-tight drop-shadow">Our Pricing Plans</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose the perfect plan for your needs. All plans include premium quality and expert craftsmanship.
        </p>
      </div>

      <!-- Custom Pricing Carousel -->
      <CustomSwiper :items="pricingPlans">
        <template #card="{ item }">
          <div class="bg-gradient-to-br from-white via-gray-50 to-primary/5 border border-primary/10 rounded-3xl p-10 h-full flex flex-col justify-between transform hover:scale-[1.03] transition-transform duration-300 group relative overflow-hidden">
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl z-0"></div>
            <div class="text-center relative z-10">
              <h3 class="text-2xl font-extrabold text-secondary mb-4 tracking-tight group-hover:text-primary transition-colors duration-300">{{ item.title }}</h3>
              <div class="text-2xl font-bold text-primary mb-6">{{ item.price }}</div>
              <ul class="space-y-4 mb-8 text-left max-w-xs mx-auto">
                <li v-for="(feature, i) in item.features" :key="i" class="flex items-start text-gray-700">
                  <svg class="w-5 h-5 text-primary mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="leading-relaxed">{{ feature }}</span>
                </li>
              </ul>
              <button v-if="item.cta" class="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold shadow hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center">                
                {{ item.cta }}
                <Icon name="ArrowRight" class="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </template>
      </CustomSwiper>

      <!-- Additional Info -->
      <div class="text-center mt-16">
        <p class="text-gray-600">
          Need a custom plan? <NuxtLink href="/contact" class="text-primary hover:text-primary-dark font-semibold">Contact us</NuxtLink> for a tailored solution.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const CustomSwiper = defineAsyncComponent(() => import('@/components/CustomSwiper.vue'));

const pricingPlans = [
  {
    title: 'Left Chest / Cap Digitizing',
    price: 'Starting at $10 – $25',
    features: [
      'Unlimited Stitch Counts',
      'Complimentary Color Adjustments',
      'Free Edits and Revisions',
      'Premium Customer Support (24/7)'
    ],
    cta: 'Order Now'
  },
  {
    title: 'Vector Artwork',
    price: 'Starting at $12 – $65',
    features: [
      'Free Color Modifications',
      'Cost-effective Pricing',
      'Expert review by professional artists',
      'Premium Customer Support (24/7)'
    ],
    cta: 'Order Now'
  },
  {
    title: 'Line Artwork',
    price: 'Starting at $15 – $50+',
    features: [
      'Competitive Pricing',
      'Fast and Accurate Revisions',
      'Streamlined ordering process',
      'Premium Customer Support (24/7)'
    ],
    cta: 'Order Now'
  },
  {
    title: 'Logo Design',
    price: 'Starting at $65 – $1000+',
    features: [
      'Premium-quality Design',
      'Transparent and Fair Pricing',
      'Fast Turnaround Times',
      'Premium Customer Support (24/7)'
    ],
    cta: 'Order Now'
  },
  {
    title: 'Custom Patches',
    price: 'Starting at $100 – $1000+',
    features: [
      'Complimentary Quotations',
      'Free bulk shipping',
      'No charge for additional colors',
      'Premium Customer Support (24/7)'
    ],
    cta: 'Order Now'
  },
];
</script>

<style scoped>
.swiper-button-custom {
  box-shadow: 0 4px 16px 0 rgba(0,0,0,0.10);
  transition: background 0.2s, color 0.2s;
}
.swiper-button-custom:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 1440px) {
  .swiper-button-prev-custom {
    left: -32px !important;
  }
  .swiper-button-next-custom {
    right: -32px !important;
  }
}
@media (max-width: 1024px) {
  .swiper-button-prev-custom {
    left: -12px !important;
  }
  .swiper-button-next-custom {
    right: -12px !important;
  }
}
@media (max-width: 768px) {
  .swiper-button-custom {
    width: 40px;
    height: 40px;
  }
  .swiper-button-prev-custom {
    left: -8px !important;
  }
  .swiper-button-next-custom {
    right: -8px !important;
  }
}
</style> 