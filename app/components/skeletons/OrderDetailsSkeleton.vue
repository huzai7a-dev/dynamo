<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
    <div class="grid grid-cols-2 gap-4">
      <div v-for="i in 6" :key="i" class="space-y-2">
        <div class="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
        <div class="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Skeleton component for OrderDetails/OrderMetaGrid
</script>
