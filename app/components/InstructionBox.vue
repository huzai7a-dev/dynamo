<script setup lang="ts">
defineProps<{ instructions?: string | null }>()
</script>

<template>
  <div class="rounded-2xl border border-teal-200 bg-primary-light/60 p-4">
    <div class="mb-1 text-sm font-semibold text-primary-dark">Instructions</div>
    <p class="text-secondary">
      {{ instructions || 'No special instructions provided.' }}
    </p>
  </div>
</template>
