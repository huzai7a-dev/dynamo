<script setup lang="ts">
defineProps<{ label: string; value?: string | number | null }>()
</script>

<template>
  <div class="flex flex-col">
    <span class="text-xs uppercase tracking-wide text-charcoal/70">{{ label }}</span>
    <span class="mt-0.5 text-base text-secondary">{{ value ?? '—' }}</span>
  </div>
</template>
