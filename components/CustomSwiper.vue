<template>
  <div class="relative w-full max-w-full pb-12 flex items-center">
    <!-- Left Arrow -->
    <button @click="prevSlide" :disabled="isPrevDisabled" type="button"
      class="swiper-button-custom swiper-button-prev-custom absolute top-1/2 -left-24 z-20 -translate-y-1/2 bg-primary text-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center hover:bg-primary-dark transition-colors duration-300 border-2 border-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
    </button>
    <!-- Right Arrow -->
    <button @click="nextSlide" :disabled="isNextDisabled" type="button"
      class="swiper-button-custom swiper-button-next-custom absolute top-1/2 -right-24 z-20 -translate-y-1/2 bg-primary text-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center hover:bg-primary-dark transition-colors duration-300 border-2 border-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
    </button>
    <!-- Slides -->
    <div class="overflow-hidden w-full">
      <div class="flex transition-transform duration-500"
        :style="{ transform: `translateX(-${currentSlide * (100 / visibleSlides)}%)` }"
      >
        <div v-for="(item, idx) in items" :key="idx"
          class="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-2 py-4"
          :style="{ maxWidth: `${100 / visibleSlides}%` }"
        >
          <slot name="card" :item="item" :index="idx" />
        </div>
      </div>
    </div>
    <!-- Pagination Dots -->
    <div class="flex justify-center mt-6 gap-2 w-full absolute left-0 right-0 -bottom-0">
      <button v-for="n in pageCount" :key="n" @click="goToSlide(n-1)"
        :class="[ 'w-3 h-3 rounded-full', currentSlide === (n-1) ? 'bg-primary' : 'bg-gray-300', 'transition-colors duration-300' ]"
        aria-label="Go to slide"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  breakpoints: {
    type: Object,
    default: () => ({
      0: 1,
      768: 2,
      1024: 3
    })
  }
});

const currentSlide = ref(0);
const visibleSlides = ref(1);

function getSlidesPerView() {
  const width = window.innerWidth;
  const sorted = Object.keys(props.breakpoints).map(Number).sort((a, b) => a - b);
  let slides = 1;
  for (const bp of sorted) {
    if (width >= bp) slides = props.breakpoints[bp];
  }
  return slides;
}

const updateVisibleSlides = () => {
  visibleSlides.value = getSlidesPerView();
};

onMounted(() => {
  updateVisibleSlides();
  window.addEventListener('resize', updateVisibleSlides);
});
onUnmounted(() => {
  window.removeEventListener('resize', updateVisibleSlides);
});

watch(() => props.items.length, () => {
  if (currentSlide.value > pageCount.value - 1) {
    currentSlide.value = pageCount.value - 1;
  }
});

const pageCount = computed(() => {
  return Math.ceil(props.items.length / visibleSlides.value);
});

const isPrevDisabled = computed(() => currentSlide.value === 0);
const isNextDisabled = computed(() => currentSlide.value >= pageCount.value - 1);

function prevSlide() {
  if (currentSlide.value > 0) currentSlide.value--;
}
function nextSlide() {
  if (currentSlide.value < pageCount.value - 1) currentSlide.value++;
}
function goToSlide(idx) {
  currentSlide.value = idx;
}
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