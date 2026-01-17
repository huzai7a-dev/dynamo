<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="h-5 w-20 bg-gray-200 rounded mb-3 animate-pulse"></div>
    <div class="space-y-3">
      <div v-for="i in 3" :key="i" class="flex items-center justify-between">
        <div class="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
        <div class="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Skeleton component for Summary section
</script>
