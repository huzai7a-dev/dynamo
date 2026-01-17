<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div v-for="i in 6" :key="i" class="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Skeleton component for AttachmentsGallery
</script>
