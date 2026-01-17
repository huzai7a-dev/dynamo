<script setup lang="ts">
const props = defineProps<{
  text: string
}>()
</script>

<template>
  <div class="relative group inline-flex items-center">
    <!-- Trigger slot -->
    <slot />

    <!-- Tooltip -->
    <span
      class="absolute bottom-full mb-1 hidden group-hover:block whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white shadow-lg"
    >
      {{ props.text }}
    </span>
  </div>
</template>

<style scoped>
.group:hover span {
  animation: fadeIn 0.15s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
