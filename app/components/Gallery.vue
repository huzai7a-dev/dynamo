<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div class="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 p-6 overflow-y-auto max-h-[90vh]">
      <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-primary text-2xl font-bold focus:outline-none">&times;</button>
      <h2 v-if="title" class="text-2xl font-bold text-primary mb-6 text-center">{{ title }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="(img, idx) in images" :key="idx" class="group relative cursor-pointer">
          <img :src="img" @click="openImage(idx)" class="rounded-lg shadow-lg object-cover w-full md:h-48 h-auto transition-transform group-hover:scale-105" loading="lazy" />
        </div>
      </div>
      <div v-if="selectedIndex !== null" class="fixed inset-0 z-60 flex items-center justify-center bg-black/80">
        <button @click="selectedIndex = null" class="absolute top-8 right-8 text-white text-3xl font-bold">&times;</button>
        <button
          @click="prevImage"
          :disabled="selectedIndex === 0"
          class="absolute left-8 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-secondary text-primary hover:text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &#8592;
        </button>
        <img :src="images[selectedIndex]" class="max-h-[80vh] max-w-full rounded-xl shadow-2xl border-4 border-white" loading="lazy" />
        <button
          @click="nextImage"
          :disabled="selectedIndex === images.length - 1"
          class="absolute right-8 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-secondary text-primary hover:text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &#8594;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  images: { type: Array, required: true },
  open: { type: Boolean, required: true },
  title: { type: String, default: '' }
})
const emit = defineEmits(['close'])
const selectedIndex = ref(null)
function openImage(idx) {
  selectedIndex.value = idx
}
function prevImage() {
  if (selectedIndex.value > 0) selectedIndex.value--
}
function nextImage() {
  if (selectedIndex.value < props.images.length - 1) selectedIndex.value++
}
watch(() => props.open, (val) => {
  if (!val) selectedIndex.value = null
})
</script>

<style scoped>
/* Modal styles for theme consistency */
</style>
